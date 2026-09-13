import { admin } from "../_shared/db.ts";

// Safaricom posts the payment result here. It must stay open (no auth) and must
// always answer 200 so Daraja does not retry endlessly.
Deno.serve(async (req) => {
  const ok = () =>
    new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { "Content-Type": "application/json" },
    });

  try {
    const payload = await req.json();
    const cb = payload?.Body?.stkCallback;
    if (!cb) return ok();

    const db = admin();
    const ref = cb.CheckoutRequestID;
    const { data: order } = await db
      .from("orders")
      .select("id,customer_email,user_id,status")
      .eq("payment_reference", ref)
      .maybeSingle();
    if (!order) return ok();

    if (cb.ResultCode !== 0) {
      await db.from("orders").update({ status: "failed" }).eq("id", order.id);
      return ok();
    }

    const meta: { Name: string; Value?: string | number }[] = cb.CallbackMetadata?.Item ?? [];
    const receipt = meta.find((m) => m.Name === "MpesaReceiptNumber")?.Value;

    await db
      .from("orders")
      .update({ status: "paid", payment_reference: receipt ? String(receipt) : ref })
      .eq("id", order.id);

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
