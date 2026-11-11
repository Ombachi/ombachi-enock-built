import { db, json, verify } from "../_lib/shared.js";

// The browser polls this to learn whether its order has been paid.
export async function POST(req: Request) {
  try {
    const { orderId, token } = await req.json();
    if (!orderId || !verify("access", String(orderId), token)) return json({ error: "Not authorised." }, 403);
    const { data } = await db().from("orders").select("status").eq("id", orderId).maybeSingle();
    return json({ status: data?.status ?? "unknown" });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
}
