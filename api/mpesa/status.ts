import { darajaBase, darajaToken, db, env, json, stkPassword, verify } from "../_lib/shared.js";

// The browser polls this to learn whether its order has been paid.
// Fail-safe: if the order is still pending, ask Safaricom directly (STK Push Query)
// so a dropped or delayed callback never leaves a paying reader stuck.
export async function POST(req: Request) {
  try {
    const { orderId, token } = await req.json();
    if (!orderId || !verify("access", String(orderId), token)) return json({ error: "Not authorised." }, 403);
    const sb = db();
    const { data } = await sb.from("orders").select("status,payment_reference").eq("id", orderId).maybeSingle();
    if (!data) return json({ status: "unknown" });
    if (data.status !== "pending" || !data.payment_reference) return json({ status: data.status });

    try {
      const access = await darajaToken();
      if (!access) return json({ status: "pending" });
      const { ts, pw } = stkPassword();
      const r = await fetch(`${darajaBase()}/mpesa/stkpushquery/v1/query`, {
        method: "POST",
        headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          BusinessShortCode: env("MPESA_SHORTCODE"),
          Password: pw,
          Timestamp: ts,
          CheckoutRequestID: data.payment_reference,
        }),
      });
      const q = await r.json().catch(() => ({}));
      // While the reader is still entering their PIN, Safaricom returns an errorCode — stay pending.
      if (q?.ResultCode === undefined || q?.errorCode) return json({ status: "pending" });
      const code = String(q.ResultCode);
      if (code === "0") {
        await sb.from("orders").update({ status: "paid" }).eq("id", orderId).eq("status", "pending");
        return json({ status: "paid" });
      }
      if (["1032", "1037", "2001", "1", "1019"].includes(code)) {
        await sb.from("orders").update({ status: "failed" }).eq("id", orderId).eq("status", "pending");
        return json({ status: "failed" });
      }
    } catch {
      /* ignore query errors; keep polling */
    }
    return json({ status: "pending" });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
}
