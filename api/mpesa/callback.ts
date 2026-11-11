import { db, verify } from "../_lib/shared.js";

// Safaricom posts the payment result here. Always answers "Accepted".
export async function POST(req: Request) {
  const ok = () => Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("o") ?? "";
    if (!orderId || !verify("cb", orderId, url.searchParams.get("t"))) return ok();
    const cb = (await req.json())?.Body?.stkCallback;
    if (!cb) return ok();

    const sb = db();
    const { data: order } = await sb.from("orders").select("id,status,payment_reference").eq("id", orderId).maybeSingle();
    if (!order || order.status !== "pending" || order.payment_reference !== cb.CheckoutRequestID) return ok();

    if (Number(cb.ResultCode) !== 0) {
      await sb.from("orders").update({ status: "failed" }).eq("id", order.id);
      return ok();
    }
    const items: { Name: string; Value?: string | number }[] = cb.CallbackMetadata?.Item ?? [];
    const receipt = items.find((m) => m.Name === "MpesaReceiptNumber")?.Value;
    await sb
      .from("orders")
      .update({ status: "paid", payment_reference: receipt ? String(receipt) : order.payment_reference })
      .eq("id", order.id);
  } catch (e) {
    console.error("callback error", e);
  }
  return ok();
}
