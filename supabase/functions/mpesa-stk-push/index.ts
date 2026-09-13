import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { admin, json } from "../_shared/db.ts";

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
    const { orderId, phone } = await req.json();
    if (!orderId || !phone) return json({ error: "orderId and phone are required." }, 400, corsHeaders);

    const db = admin();
    const { data: order, error } = await db
      .from("orders")
      .select("id,order_number,total_kes,status")
      .eq("id", orderId)
      .single();
    if (error || !order) return json({ error: "Order not found." }, 404, corsHeaders);
    if (order.status === "paid") return json({ error: "This order is already paid." }, 400, corsHeaders);

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
    const callbackUrl = `${env("SUPABASE_URL")}/functions/v1/mpesa-callback`;

    const stkRes = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: ts,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.max(1, Math.round(order.total_kes)),
        PartyA: normalisePhone(String(phone)),
        PartyB: shortcode,
        PhoneNumber: normalisePhone(String(phone)),
        CallBackURL: callbackUrl,
        AccountReference: order.order_number,
        TransactionDesc: `Payment for ${order.order_number}`,
      }),
    });
    const stk = await stkRes.json();

    if (!stk.CheckoutRequestID) {
      return json({ error: stk.errorMessage ?? "M-PESA request failed.", detail: stk }, 502, corsHeaders);
    }

    await db
      .from("orders")
      .update({ payment_reference: stk.CheckoutRequestID, customer_phone: normalisePhone(String(phone)) })
      .eq("id", order.id);

    return json({ ok: true, checkoutRequestId: stk.CheckoutRequestID, message: stk.CustomerMessage }, 200, corsHeaders);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500, corsHeaders);
  }
});
