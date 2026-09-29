import { admin } from "../_shared/db.ts";
import { verify } from "../_shared/token.ts";

// Safaricom posts the payment result here. It always answers 200 so Daraja does
// not retry endlessly, but it only acts when (1) the callback URL carries a valid
// server-signed token for the order and (2) Daraja itself confirms the payment
// via the STK Query API. The request body alone is never trusted.
const env = (k: string) => Deno.env.get(k) ?? "";

async function confirmWithDaraja(checkoutRequestId: string): Promise<boolean> {
  const key = env("MPESA_CONSUMER_KEY");
  const secret = env("MPESA_CONSUMER_SECRET");
  const shortcode = env("MPESA_SHORTCODE");
  const passkey = env("MPESA_PASSKEY");
  if (!key || !secret || !shortcode || !passkey) return false;
  const base = env("MPESA_ENV") === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

  const tokenRes = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${btoa(`${key}:${secret}`)}` },
  });
  const token = (await tokenRes.json()).access_token;
  if (!token) return false;

  const ts = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const res = await fetch(`${base}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: btoa(`${shortcode}${passkey}${ts}`),
      Timestamp: ts,
      CheckoutRequestID: checkoutRequestId,
    }),
  });
  const q = await res.json();
  return String(q.ResultCode) === "0";
}

Deno.serve(async (req) => {
  const ok = () =>
    new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { "Content-Type": "application/json" },
    });

  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("o") ?? "";
    if (!orderId || !(await verify("cb", orderId, url.searchParams.get("t")))) return ok();

    const payload = await req.json();
    const cb = payload?.Body?.stkCallback;
    if (!cb) return ok();

    const db = admin();
    const { data: order } = await db
      .from("orders")
      .select("id,customer_email,user_id,status,payment_reference")
      .eq("id", orderId)
      .maybeSingle();
    if (!order || order.status !== "pending") return ok();
    // The callback must match the checkout request this server initiated.
    if (!order.payment_reference || order.payment_reference !== cb.CheckoutRequestID) return ok();

    if (cb.ResultCode !== 0) {
      await db.from("orders").update({ status: "failed" }).eq("id", order.id);
      return ok();
    }

    // Independently confirm the payment with Safaricom before fulfilling.
    if (!(await confirmWithDaraja(order.payment_reference))) return ok();

    const meta: { Name: string; Value?: string | number }[] = cb.CallbackMetadata?.Item ?? [];
    const receipt = meta.find((m) => m.Name === "MpesaReceiptNumber")?.Value;

    await db
      .from("orders")
      .update({ status: "paid", payment_reference: receipt ? String(receipt) : order.payment_reference })
      .eq("id", order.id)
      .eq("status", "pending");

    const { data: items } = await db
      .from("order_items")
      .select("product_id,is_digital")
      .eq("order_id", order.id);

    const digital = (items ?? []).filter((i) => i.is_digital && i.product_id);
    if (digital.length) {
      await db.from("entitlements").insert(
        digital.map((i) => ({
          user_id: order.user_id,
          email: order.customer_email,
          product_id: i.product_id,
          order_id: order.id,
        })),
      );
      await db.from("orders").update({ fulfilment: "digital_delivered" }).eq("id", order.id);
    }

    return ok();
  } catch {
    return ok();
  }
});
