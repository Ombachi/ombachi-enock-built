import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { admin, json } from "../_shared/db.ts";

interface LineIn {
  productId: string;
  quantity: number;
}

const SHIPPING_KES = 350;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const name = String(body.customer_name ?? "").trim();
    const email = String(body.customer_email ?? "").trim().toLowerCase();
    const phone = body.customer_phone ? String(body.customer_phone).trim() : null;
    const address = body.shipping_address ? String(body.shipping_address).trim() : null;
    const notes = body.notes ? String(body.notes).trim() : null;
    const lines: LineIn[] = Array.isArray(body.lines) ? body.lines : [];

    if (!name || name.length > 200) return json({ error: "A name is required." }, 400, corsHeaders);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "A valid email is required." }, 400, corsHeaders);
    if (!lines.length) return json({ error: "Your cart is empty." }, 400, corsHeaders);

    const db = admin();

    // Identify the buyer if a session was supplied.
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { data } = await db.auth.getUser(authHeader.replace("Bearer ", ""));
      userId = data.user?.id ?? null;
    }

    const ids = [...new Set(lines.map((l) => String(l.productId)))];
    const { data: products, error: pErr } = await db
      .from("products")
      .select("id,title,format,price_kes,is_digital,stock,status")
      .in("id", ids)
      .eq("status", "published");
    if (pErr) return json({ error: pErr.message }, 500, corsHeaders);
    if (!products?.length) return json({ error: "Those items are no longer available." }, 400, corsHeaders);

    let subtotal = 0;
    let needsShipping = false;
    const items = [];
    for (const l of lines) {
      const p = products.find((x) => x.id === l.productId);
      if (!p) continue;
      const qty = p.is_digital ? 1 : Math.max(1, Math.min(20, Number(l.quantity) || 1));
      if (!p.is_digital && typeof p.stock === "number" && p.stock < qty) {
        return json({ error: `${p.title} is out of stock.` }, 400, corsHeaders);
      }
      subtotal += p.price_kes * qty;
      if (!p.is_digital) needsShipping = true;
      items.push({
        product_id: p.id,
        title: p.title,
        format: p.format,
        unit_price_kes: p.price_kes,
        quantity: qty,
        is_digital: p.is_digital,
      });
    }
    if (!items.length) return json({ error: "Those items are no longer available." }, 400, corsHeaders);

    const shipping = needsShipping ? SHIPPING_KES : 0;
    const total = subtotal + shipping;

    const { data: order, error: oErr } = await db
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        subtotal_kes: subtotal,
        shipping_kes: shipping,
        total_kes: total,
        payment_method: total === 0 ? "free" : "mpesa",
        shipping_address: address,
        notes,
        status: total === 0 ? "paid" : "pending",
      })
      .select()
      .single();
    if (oErr) return json({ error: oErr.message }, 500, corsHeaders);

    const { error: iErr } = await db
      .from("order_items")
      .insert(items.map((i) => ({ ...i, order_id: order.id })));
    if (iErr) return json({ error: iErr.message }, 500, corsHeaders);

    // Free orders are fulfilled immediately.
    if (total === 0) {
      const digital = items.filter((i) => i.is_digital);
      if (digital.length) {
        await db.from("entitlements").insert(
          digital.map((i) => ({
            user_id: userId,
            email,
            product_id: i.product_id,
            order_id: order.id,
          })),
        );
        await db.from("orders").update({ fulfilment: "digital_delivered" }).eq("id", order.id);
      }
    }

    return json({ order }, 200, corsHeaders);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500, corsHeaders);
  }
});
