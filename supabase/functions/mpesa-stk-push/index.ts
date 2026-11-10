import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { admin, json } from "../_shared/db.ts";
import { sign, verify } from "../_shared/token.ts";

// Safaricom Daraja STK push. Credentials are read from secrets; until they are
// configured the function replies with a clear, non-fatal message.
const env = (k: string) => Deno.env.get(k) ?? "";

const normalisePhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const key = env("MPESA_CONSUMER_KEY");
  const secret = env("MPESA_CONSUMER_SECRET");
  const shortcode = env("MPESA_SHORTCODE");
  const passkey = env("MPESA_PASSKEY");
  const till = env("MPESA_TILL_NUMBER").trim();
  const base = env("MPESA_ENV") === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

  if (!key || !secret || !shortcode || !passkey) {
    return json(
      { error: "not_configured", message: "M-PESA is not connected yet. Add the Daraja credentials to enable payment." },
      503,
      corsHeaders,
    );
  }

  try {
    const { orderId, phone, paymentToken } = await req.json();
    if (!orderId || !phone) return json({ error: "orderId and phone are required." }, 400, corsHeaders);
    const msisdn = normalisePhone(String(phone));
    if (!/^254[17]\d{8}$/.test(msisdn)) return json({ error: "Enter a valid Kenyan M-PESA number." }, 400, corsHeaders);

    const db = admin();
    const { data: order, error } = await db
      .from("orders")
      .select("id,order_number,total_kes,status,created_at,payment_reference")
      .eq("id", orderId)
      .single();
    if (error || !order) return json({ error: "Order not found." }, 404, corsHeaders);
    if (order.status !== "pending") return json({ error: "This order is already paid." }, 400, corsHeaders);

    // Orders created by the legacy checkout carry a signed pay token. Orders
    // written straight from the browser are accepted only while fresh and
    // before any prompt has been sent for them.
    const tokenOk = paymentToken ? await verify("pay", String(orderId), paymentToken) : false;
    const fresh = Date.now() - new Date(order.created_at).getTime() < 15 * 60 * 1000;
    if (!tokenOk && !(fresh && !order.payment_reference)) {
      return json({ error: "Not authorised to pay for this order." }, 403, corsHeaders);
    }

    // Never trust browser-supplied prices: recompute from the catalogue.
    const { data: items } = await db
      .from("order_items")
      .select("id,product_id,quantity")
      .eq("order_id", order.id);
    const ids = (items ?? []).map((i) => i.product_id).filter(Boolean) as string[];
    if (!ids.length) return json({ error: "This order has no items." }, 400, corsHeaders);
    const { data: prods } = await db.from("products").select("id,price_kes,title,format,is_digital").in("id", ids);
    let total = 0;
    for (const it of items ?? []) {
      const p = prods?.find((x) => x.id === it.product_id);
      if (!p) return json({ error: "An item is no longer available." }, 400, corsHeaders);
      const qty = p.is_digital ? 1 : Math.max(1, Number(it.quantity) || 1);
      total += p.price_kes * qty;
      await db.from("order_items").update({ unit_price_kes: p.price_kes, quantity: qty, title: p.title, format: p.format, is_digital: p.is_digital }).eq("id", it.id);
    }
    if (total <= 0) return json({ error: "Nothing to pay for." }, 400, corsHeaders);
    if (total !== order.total_kes) {
      await db.from("orders").update({ subtotal_kes: total, shipping_kes: 0, total_kes: total }).eq("id", order.id);
      order.total_kes = total;
    }

    const tokenRes = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${btoa(`${key}:${secret}`)}` },
    });
    const tokenJson = await tokenRes.json();
    const token = tokenJson.access_token;
    if (!token) return json({ error: "Could not authenticate with M-PESA." }, 502, corsHeaders);

    const ts = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);
    const password = btoa(`${shortcode}${passkey}${ts}`);
    const cbToken = await sign("cb", order.id);
    const callbackUrl = `${env("SUPABASE_URL")}/functions/v1/mpesa-callback?o=${order.id}&t=${cbToken}`;

    const stkRes = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: ts,
        // Buy Goods (Till): shortcode is the Store Number, PartyB is the Till.
        TransactionType: till ? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline",
        Amount: Math.max(1, Math.round(order.total_kes)),
        PartyA: msisdn,
        PartyB: till || shortcode,
        PhoneNumber: msisdn,
        CallBackURL: callbackUrl,
        AccountReference: order.order_number,
        TransactionDesc: `Payment for ${order.order_number}`,
      }),
    });
    const stk = await stkRes.json();

    if (!stk.CheckoutRequestID) {
      console.error("STK push rejected", stk?.errorCode, stk?.errorMessage ?? stk?.ResponseDescription);
      return json({ error: stk?.errorMessage ?? "M-PESA request failed. Please try again." }, 502, corsHeaders);
    }

    await db
      .from("orders")
      .update({ payment_reference: stk.CheckoutRequestID, customer_phone: msisdn })
      .eq("id", order.id);

    const accessToken = await sign("access", order.id);
    return json(
      { ok: true, checkoutRequestId: stk.CheckoutRequestID, message: stk.CustomerMessage, accessToken },
      200,
      corsHeaders,
    );
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500, corsHeaders);
  }
});
