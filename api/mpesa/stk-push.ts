import { db, env, json, sign, darajaBase, darajaToken, stkPassword } from "../_lib/shared.js";

// Sends the M-PESA PIN prompt for an order the browser just created.
export async function POST(req: Request) {
  if (!env("MPESA_CONSUMER_KEY") || !env("MPESA_CONSUMER_SECRET") || !env("MPESA_SHORTCODE") || !env("MPESA_PASSKEY")) {
    return json({ error: "M-PESA is not configured on the server." }, 503);
  }
  try {
    const { orderId, phone } = await req.json();
    let msisdn = String(phone ?? "").replace(/\D/g, "");
    if (msisdn.startsWith("0")) msisdn = `254${msisdn.slice(1)}`;
    else if (msisdn.length === 9) msisdn = `254${msisdn}`;
    if (!orderId || !/^254[17]\d{8}$/.test(msisdn)) return json({ error: "Enter a valid Safaricom number." }, 400);

    const sb = db();
    const { data: order } = await sb
      .from("orders")
      .select("id,order_number,total_kes,status,created_at,payment_reference")
      .eq("id", orderId)
      .maybeSingle();
    if (!order) return json({ error: "Order not found." }, 404);
    if (order.status !== "pending") return json({ error: "This order is already processed." }, 400);
    const fresh = Date.now() - new Date(order.created_at).getTime() < 15 * 60 * 1000;
    if (!fresh || order.payment_reference) return json({ error: "Please start a new payment." }, 403);

    // Never trust browser prices: recompute from the catalogue.
    const { data: items } = await sb.from("order_items").select("id,product_id").eq("order_id", order.id);
    const ids = (items ?? []).map((i) => i.product_id).filter(Boolean) as string[];
    if (!ids.length) return json({ error: "This order has no items." }, 400);
    const { data: prods } = await sb.from("products").select("id,price_kes").in("id", ids);
    let total = 0;
    for (const it of items ?? []) {
      const p = prods?.find((x) => x.id === it.product_id);
      if (!p) return json({ error: "An item is no longer available." }, 400);
      total += p.price_kes;
      await sb.from("order_items").update({ unit_price_kes: p.price_kes, quantity: 1 }).eq("id", it.id);
    }
    if (total <= 0) return json({ error: "Nothing to pay for." }, 400);
    if (total !== order.total_kes) {
      await sb.from("orders").update({ subtotal_kes: total, shipping_kes: 0, total_kes: total }).eq("id", order.id);
    }

    const token = await darajaToken();
    if (!token) return json({ error: "Could not connect to M-PESA. Check the Daraja keys." }, 502);

    const { ts, pw } = stkPassword();
    const till = env("MPESA_TILL_NUMBER");
    const site = env("SITE_URL") || "https://ombachienock.me.ke";
    const callbackUrl = `${site}/api/mpesa/callback?o=${order.id}&t=${sign("cb", order.id)}`;

    const r = await fetch(`${darajaBase()}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: env("MPESA_SHORTCODE"),
        Password: pw,
        Timestamp: ts,
        TransactionType: till ? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline",
        Amount: Math.max(1, Math.round(total)),
        PartyA: msisdn,
        PartyB: till || env("MPESA_SHORTCODE"),
        PhoneNumber: msisdn,
        CallBackURL: callbackUrl,
        AccountReference: String(order.order_number ?? "Publication").slice(0, 12),
        TransactionDesc: "Publication",
      }),
    });
    const stk = await r.json().catch(() => ({}));
    if (!stk.CheckoutRequestID) {
      console.error("STK rejected", stk);
      return json({ error: stk.errorMessage ?? stk.ResponseDescription ?? "M-PESA request failed." }, 502);
    }
    await sb.from("orders").update({ payment_reference: stk.CheckoutRequestID, customer_phone: msisdn }).eq("id", order.id);
    return json({ ok: true, message: stk.CustomerMessage, accessToken: sign("access", order.id) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
}
