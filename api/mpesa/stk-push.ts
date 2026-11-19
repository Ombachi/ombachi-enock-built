import { db, env, json, sign, darajaBase, darajaToken, stkPassword } from "../_lib/shared.js";

// Sends the M-PESA PIN prompt for an order the browser just created.
export async function POST(req: Request) {
  if (!env("MPESA_CONSUMER_KEY") || !env("MPESA_CONSUMER_SECRET") || !env("MPESA_SHORTCODE") || !env("MPESA_PASSKEY")) {
    return json({ error: "M-PESA is not configured on the server." }, 503);
  }
  try {
    const { productId, phone } = await req.json();
    let msisdn = String(phone ?? "").replace(/\D/g, "");
    if (msisdn.startsWith("0")) msisdn = `254${msisdn.slice(1)}`;
    else if (msisdn.length === 9) msisdn = `254${msisdn}`;
    if (typeof productId !== "string" || !/^[0-9a-f-]{36}$/i.test(productId) || !/^254[17]\d{8}$/.test(msisdn)) {
      return json({ error: "Enter a valid Safaricom number." }, 400);
    }

    // The server creates the order itself, so callers can never touch someone else's order.
    const sb = db();
    const { data: product } = await sb
      .from("products")
      .select("id,title,format,price_kes,is_digital")
      .eq("id", productId)
      .maybeSingle();
    if (!product) return json({ error: "This publication is no longer available." }, 404);
    const total = Number(product.price_kes);
    if (!(total > 0)) return json({ error: "Nothing to pay for." }, 400);

    const { data: order, error: oErr } = await sb
      .from("orders")
      .insert({
        customer_name: "M-PESA reader",
        customer_email: `reader+${msisdn}@ombachienock.me.ke`,
        customer_phone: msisdn,
        subtotal_kes: total,
        shipping_kes: 0,
        total_kes: total,
        payment_method: "mpesa",
        status: "pending",
      })
      .select("id,order_number")
      .single();
    if (oErr || !order) return json({ error: "We couldn't create your order. Please try again." }, 500);
    const { error: iErr } = await sb.from("order_items").insert({
      order_id: order.id,
      product_id: product.id,
      title: product.title,
      format: product.format,
      unit_price_kes: total,
      quantity: 1,
      is_digital: product.is_digital,
    });
    if (iErr) return json({ error: "We couldn't save your order item. Please try again." }, 500);

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
    return json({ ok: true, orderId: order.id, message: stk.CustomerMessage, accessToken: sign("access", order.id) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
}
