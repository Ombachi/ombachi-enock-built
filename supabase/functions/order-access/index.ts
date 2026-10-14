import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { admin, json } from "../_shared/db.ts";
import { verify } from "../_shared/token.ts";

// Guest access to a purchase: the order id plus a server-signed access token
// (issued at checkout and included in the receipt email) unlocks the order
// summary, online reading and downloads — no account needed.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { orderId, token, action, productId } = await req.json();
    if (typeof orderId !== "string" || !(await verify("access", orderId, token))) {
      return json({ error: "This access link is invalid." }, 403, corsHeaders);
    }
    const db = admin();
    const { data: order } = await db
      .from("orders")
      .select("id,order_number,customer_name,customer_email,status,total_kes,subtotal_kes,shipping_kes,created_at")
      .eq("id", orderId)
      .maybeSingle();
    if (!order) return json({ error: "Order not found." }, 404, corsHeaders);

    const { data: items } = await db
      .from("order_items")
      .select("product_id,title,format,quantity,unit_price_kes,is_digital")
      .eq("order_id", orderId);
    const list = items ?? [];
    const paid = order.status === "paid";

    if (!action) {
      const ids = list.map((i) => i.product_id).filter(Boolean) as string[];
      const { data: products } = ids.length
        ? await db.from("products").select("id,slug,file_path,html_file_path,html_url").in("id", ids)
        : { data: [] };
      return json({
        order,
        items: list.map((i) => {
          const p = products?.find((x) => x.id === i.product_id);
          return {
            ...i,
            slug: p?.slug ?? null,
            can_read: paid && i.is_digital && !!(p?.html_file_path || p?.html_url),
            can_download: paid && i.is_digital && !!p?.file_path,
          };
        }),
      }, 200, corsHeaders);
    }

    if (!paid) return json({ error: "Payment has not been confirmed yet." }, 402, corsHeaders);
    const item = list.find((i) => i.product_id === productId && i.is_digital);
    if (!item) return json({ error: "This item is not part of the order." }, 403, corsHeaders);
    const { data: product } = await db
      .from("products").select("title,file_path,html_file_path,html_url").eq("id", productId).maybeSingle();
    if (!product) return json({ error: "Not found." }, 404, corsHeaders);

    if (action === "download") {
      if (!product.file_path) return json({ error: "The file for this title is not uploaded yet." }, 409, corsHeaders);
      const { data: signed } = await db.storage.from("library-files").createSignedUrl(product.file_path, 300, { download: true });
      if (!signed) return json({ error: "Could not create a download link." }, 500, corsHeaders);
      return json({ url: signed.signedUrl }, 200, corsHeaders);
    }
    if (action === "read") {
      if (product.html_file_path) {
        const { data: file } = await db.storage.from("library-files").download(product.html_file_path);
        if (!file) return json({ error: "Could not open this publication." }, 500, corsHeaders);
        return json({ html: await file.text(), title: product.title }, 200, corsHeaders);
      }
      if (product.html_url) return json({ url: product.html_url, title: product.title }, 200, corsHeaders);
      return json({ error: "No online edition available." }, 409, corsHeaders);
    }
    return json({ error: "Unknown action." }, 400, corsHeaders);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500, corsHeaders);
  }
});
