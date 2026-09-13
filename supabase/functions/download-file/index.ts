import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { admin, json } from "../_shared/db.ts";

// Issues a short-lived signed link for a purchased digital item, after checking
// that the signed-in customer actually owns the entitlement.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "Sign in to download." }, 401, corsHeaders);

    const db = admin();
    const { data: userData } = await db.auth.getUser(authHeader.replace("Bearer ", ""));
    const user = userData.user;
    if (!user) return json({ error: "Sign in to download." }, 401, corsHeaders);

    const { entitlementId } = await req.json();
    if (!entitlementId) return json({ error: "entitlementId is required." }, 400, corsHeaders);

    const { data: ent } = await db
      .from("entitlements")
      .select("id,user_id,email,product_id,download_count")
      .eq("id", entitlementId)
      .maybeSingle();
    if (!ent) return json({ error: "Not found." }, 404, corsHeaders);

    const ownsIt =
      ent.user_id === user.id ||
      (!!user.email && ent.email?.toLowerCase() === user.email.toLowerCase());
    if (!ownsIt) return json({ error: "This item is not in your library." }, 403, corsHeaders);

    // Link a guest purchase to the account on first download.
    if (!ent.user_id) await db.from("entitlements").update({ user_id: user.id }).eq("id", ent.id);

    const { data: product } = await db
      .from("products")
      .select("title,file_path")
      .eq("id", ent.product_id)
      .maybeSingle();
    if (!product?.file_path) {
      return json({ error: "The file for this title is not uploaded yet." }, 409, corsHeaders);
    }

    const { data: signed, error: sErr } = await db.storage
      .from("library-files")
      .createSignedUrl(product.file_path, 300, { download: true });
    if (sErr || !signed) return json({ error: "Could not create a download link." }, 500, corsHeaders);

    await db
      .from("entitlements")
      .update({ download_count: (ent.download_count ?? 0) + 1, last_downloaded_at: new Date().toISOString() })
      .eq("id", ent.id);

    await db.from("download_events").insert({
      entitlement_id: ent.id,
      user_id: user.id,
      ip: req.headers.get("x-forwarded-for"),
      user_agent: req.headers.get("user-agent"),
    });

    return json({ url: signed.signedUrl, title: product.title }, 200, corsHeaders);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500, corsHeaders);
  }
});
