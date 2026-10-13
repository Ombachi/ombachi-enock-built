import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { loadProducts } from "@/lib/library/products";
import ProductCard from "@/components/library/ProductCard";
import type { Product } from "@/lib/library/types";

/** Homepage "Writing & Publications": latest and featured works across every format. */
const PublicationsSection = () => {
  const [items, setItems] = useState<Product[] | null>(null);
  const [readTimes, setReadTimes] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const { products } = await loadProducts();
      const sorted = [...products]
        .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
        .slice(0, 6);
      setItems(sorted);
      const postIds = sorted.map((p) => p.post_id).filter(Boolean) as string[];
      if (postIds.length) {
        const { data } = await supabase.from("posts").select("id, content").in("id", postIds);
        const map: Record<string, number> = {};
        (data ?? []).forEach((p) => {
          const words = (p.content || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
          map[p.id] = Math.max(1, Math.round(words / 225));
        });
        setReadTimes(map);
      }
    })();
  }, []);

  const badge = (p: Product) => {
    if (p.html_url || p.html_file_path) return "Interactive";
    if (p.post_id) return `Essay · ${readTimes[p.post_id] ?? 1} min read`;
    return p.format;
  };

  return (
    <section id="writing" className="section-padding bg-muted">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
          Writing & Publications
        </h2>
        <p className="text-muted-foreground mb-10 max-w-xl animate-on-scroll">
          Essays, interactive pieces, research and books on diagnostics, climate-health and leadership.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items === null
            ? [0, 1, 2].map((i) => <div key={i} className="h-72 rounded-lg bg-card animate-pulse" aria-hidden="true" />)
            : items.map((p) => <ProductCard key={p.id} product={p} badgeLabel={badge(p)} />)}
        </div>

        <Link
          to="/library"
          className="mt-10 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:border-secondary/40 hover:text-secondary transition-colors"
        >
          Explore all publications <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
};

export default PublicationsSection;
