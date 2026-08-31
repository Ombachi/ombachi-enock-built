import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { categorySlug } from "@/lib/postCategories";

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string | null;
  tag: string | null;
  published_at: string | null;
}

interface Props {
  currentSlug: string;
  tag?: string | null;
}

/** Suggests further reading: same-category posts first, then the most recent. */
const RelatedPosts = ({ currentSlug, tag }: Props) => {
  const [posts, setPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("posts")
        .select("slug, title, excerpt, tag, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(20);

      const all = ((data as RelatedPost[]) || []).filter((p) => p.slug !== currentSlug);
      const sameTag = tag ? all.filter((p) => p.tag === tag) : [];
      const rest = all.filter((p) => !sameTag.includes(p));
      setPosts([...sameTag, ...rest].slice(0, 3));
    })();
  }, [currentSlug, tag]);

  if (!posts.length) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Related reading</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to={`/writing/${p.slug}`}
            className="group block rounded-xl border border-border bg-card p-4 hover:border-secondary/50 transition-colors"
          >
            {p.tag && (
              <span className="text-[11px] font-medium text-secondary">{p.tag}</span>
            )}
            <h3 className="font-serif text-base font-semibold text-foreground mt-1 mb-1.5 group-hover:text-secondary transition-colors">
              {p.title}
            </h3>
            {p.excerpt && (
              <p className="text-xs text-muted-foreground line-clamp-3">{p.excerpt}</p>
            )}
          </Link>
        ))}
      </div>
      {tag && (
        <Link
          to={`/writing/category/${categorySlug(tag)}`}
          className="inline-block mt-5 text-sm text-secondary hover:underline"
        >
          More in {tag} →
        </Link>
      )}
    </section>
  );
};

export default RelatedPosts;
