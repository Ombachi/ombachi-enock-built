import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const SITE_URL = "https://ombachi-enock-built.lovable.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  const { data } = await supabase
    .from("posts")
    .select("slug, title, excerpt, content, tag, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const items = (data ?? [])
    .map((p) => {
      const desc = (p.excerpt ?? String(p.content ?? "").replace(/<[^>]+>/g, " ")).slice(0, 300).trim();
      return [
        "    <item>",
        `      <title>${escape(p.title)}</title>`,
        `      <link>${SITE_URL}/writing/${p.slug}</link>`,
        `      <guid isPermaLink="true">${SITE_URL}/writing/${p.slug}</guid>`,
        p.published_at ? `      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>` : "",
        p.tag ? `      <category>${escape(p.tag)}</category>` : "",
        `      <description>${escape(desc)}</description>`,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ombachi Enock — Writing</title>
    <link>${SITE_URL}/#writing</link>
    <description>Essays on health systems, diagnostics, climate and governance.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
});
