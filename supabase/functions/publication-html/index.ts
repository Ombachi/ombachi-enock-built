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
      .select("id,title,status,html_url,html_file_path,is_free,price_kes")
      .eq("slug", slug)
      .maybeSingle();

    if (!product || product.status !== "published") {
      return json({ error: "Not found." }, 404, corsHeaders);
    }

    // Paid publications require a signed-in owner (or admin).
    if (!product.is_free && product.price_kes > 0) {
      const authHeader = req.headers.get("Authorization") ?? "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
      const { data: u } = token ? await db.auth.getUser(token) : { data: { user: null } };
      const user = u.user;
      if (!user) return json({ error: "Sign in to open this publication." }, 401, corsHeaders);
      const { data: role } = await db
        .from("user_roles").select("id").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!role) {
        const { data: ent } = await db
          .from("entitlements").select("id").eq("product_id", product.id).eq("user_id", user.id).limit(1).maybeSingle();
        if (!ent) return json({ error: "Purchase this publication to open it." }, 403, corsHeaders);
      }
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
