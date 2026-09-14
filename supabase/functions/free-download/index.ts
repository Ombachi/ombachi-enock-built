import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { admin, json } from "../_shared/db.ts";

// Issues a short-lived signed link for a FREE, published digital publication.
// Paid titles must go through checkout and the download-file function.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return json({ error: "slug is required." }, 400, corsHeaders);
    }

    const db = admin();
    const { data: product } = await db
      .from("products")
      .select("title,file_path,is_free,price_kes,is_digital,status")
      .eq("slug", slug)
      .maybeSingle();

    if (!product || product.status !== "published") {
      return json({ error: "Not found." }, 404, corsHeaders);
    }
    if (!product.is_digital || !(product.is_free || product.price_kes === 0)) {
      return json({ error: "This title must be purchased first." }, 403, corsHeaders);
    }
    if (!product.file_path) {
      return json({ error: "The file for this title is not uploaded yet." }, 409, corsHeaders);
    }

    const { data: signed, error } = await db.storage
      .from("library-files")
      .createSignedUrl(product.file_path, 300, { download: true });
    if (error || !signed) return json({ error: "Could not create a download link." }, 500, corsHeaders);

    return json({ url: signed.signedUrl, title: product.title }, 200, corsHeaders);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500, corsHeaders);
  }
});
