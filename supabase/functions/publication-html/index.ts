import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { admin, json } from "../_shared/db.ts";

// Returns a runnable link for a published publication's interactive HTML
// experience: either the hosted URL set by the admin, or an inline signed link
// to the uploaded HTML file.
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
      .select("title,status,html_url,html_file_path")
      .eq("slug", slug)
      .maybeSingle();

    if (!product || product.status !== "published") {
      return json({ error: "Not found." }, 404, corsHeaders);
    }

    if (product.html_url) {
      return json({ url: product.html_url, title: product.title }, 200, corsHeaders);
    }

    if (!product.html_file_path) {
      return json({ error: "No interactive content for this publication." }, 409, corsHeaders);
    }

    const { data: signed, error } = await db.storage
      .from("library-files")
      .createSignedUrl(product.html_file_path, 3600);
    if (error || !signed) return json({ error: "Could not open the experience." }, 500, corsHeaders);

    return json({ url: signed.signedUrl, title: product.title }, 200, corsHeaders);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500, corsHeaders);
  }
});
