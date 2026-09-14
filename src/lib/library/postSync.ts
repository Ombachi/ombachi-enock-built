import { supabase } from "@/integrations/supabase/client";

export interface SyncablePost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tag: string | null;
  status: "draft" | "published";
}

/**
 * Keeps every post mirrored in The Library as a free digital publication, so
 * writing can be managed from the Products/Inventory screen. Pricing, format
 * and collections chosen by the admin are never overwritten.
 */
export async function syncPostToLibrary(post: SyncablePost): Promise<void> {
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("post_id", post.id)
    .maybeSingle();

  const shared = {
    slug: post.slug,
    title: post.title,
    description: post.excerpt ?? "",
    cover_image_url: post.cover_image_url,
    status: post.status,
  };

  if (existing) {
    await supabase.from("products").update(shared).eq("id", existing.id);
    return;
  }

  await supabase.from("products").insert({
    ...shared,
    post_id: post.id,
    subtitle: null,
    format: "Publication",
    category: post.tag ?? "Writing",
    price_kes: 0,
    is_digital: true,
    is_free: true,
    published_year: new Date().getFullYear(),
    collections: ["writing"],
  });
}
