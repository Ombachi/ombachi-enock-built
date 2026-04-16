import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch Medium RSS feed
    const rssUrl = "https://medium.com/feed/@litusoja";
    const response = await fetch(rssUrl);
    const xmlText = await response.text();

    // Parse RSS XML manually (Deno edge functions don't have DOMParser)
    const items = parseRssItems(xmlText);

    let upserted = 0;
    for (const item of items) {
      const { error } = await supabase
        .from("cached_articles")
        .upsert(
          {
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt,
            tag: item.tag,
            published_date: item.published_date,
            medium_url: item.medium_url,
            cover_image_url: item.cover_image_url,
            author: item.author,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "slug" }
        );

      if (!error) upserted++;
    }

    return new Response(
      JSON.stringify({ success: true, articles_synced: upserted, total_found: items.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error syncing Medium articles:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

interface ParsedArticle {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  published_date: string;
  medium_url: string;
  cover_image_url: string | null;
  author: string;
}

function parseRssItems(xml: string): ParsedArticle[] {
  const articles: ParsedArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    const pubDate = extractTag(itemXml, "pubDate");
    const creator = extractTag(itemXml, "dc:creator");
    const categories = extractAllTags(itemXml, "category");

    // Extract description and get excerpt
    const description = extractCData(itemXml, "content:encoded") || extractTag(itemXml, "description");
    const excerpt = stripHtml(description).substring(0, 200).trim() + "...";

    // Extract cover image from content
    const imgMatch = description?.match(/<img[^>]+src="([^"]+)"/);
    const cover_image_url = imgMatch ? imgMatch[1] : null;

    // Generate slug from link
    const slug = link
      ? link.split("/").pop()?.replace(/[?#].*$/, "") || title.toLowerCase().replace(/\s+/g, "-")
      : title.toLowerCase().replace(/\s+/g, "-");

    const tag = categories.length > 0 ? categories[0] : "General";

    if (title && link) {
      articles.push({
        slug,
        title: decodeHtmlEntities(title),
        excerpt: decodeHtmlEntities(excerpt),
        tag,
        published_date: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        medium_url: link,
        cover_image_url,
        author: creator || "Litu Soja",
      });
    }
  }

  return articles;
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
  if (cdataMatch) return cdataMatch[1].trim();
  
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? match[1].trim() : "";
}

function extractCData(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
  return match ? match[1].trim() : "";
}

function extractAllTags(xml: string, tag: string): string[] {
  const results: string[] = [];
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "g");
  let m;
  while ((m = regex.exec(xml)) !== null) {
    results.push((m[1] || m[2]).trim());
  }
  return results;
}

function stripHtml(html: string): string {
  return html?.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ") || "";
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}
