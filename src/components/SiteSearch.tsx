import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { loadProducts } from "@/lib/library/products";
import type { Product } from "@/lib/library/types";
import { formatKES } from "@/lib/library/types";

interface PostHit {
  slug: string;
  title: string;
  excerpt: string | null;
  tag: string | null;
}

const SiteSearch = () => {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<PostHit[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open || loaded) return;
    (async () => {
      const [postRes, productRes] = await Promise.all([
        (async () => {
          try {
            const { data } = await supabase
              .from("posts")
              .select("slug, title, excerpt, tag")
              .eq("status", "published")
              .order("published_at", { ascending: false });
            return (data ?? []) as PostHit[];
          } catch {
            return [] as PostHit[];
          }
        })(),
        (async () => {
          try {
            return (await loadProducts()).products;
          } catch {
            return [] as Product[];
          }
        })(),
      ]);
      setPosts(postRes);
      setProducts(productRes);
      setLoaded(true);
    })();
  }, [open, loaded]);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full border border-border px-3 py-1.5"
      >
        <Search size={14} />
        <span className="hidden lg:inline">Search</span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search writing and the library…" />
        <CommandList>
          <CommandEmpty>{loaded ? "No matches found." : "Loading…"}</CommandEmpty>
          {posts.length > 0 && (
            <CommandGroup heading="Writing">
              {posts.map((p) => (
                <CommandItem
                  key={p.slug}
                  value={`${p.title} ${p.excerpt ?? ""} ${p.tag ?? ""}`}
                  onSelect={() => go(`/writing/${p.slug}`)}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{p.title}</p>
                    {p.tag && <p className="text-xs text-muted-foreground">{p.tag}</p>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {products.length > 0 && (
            <CommandGroup heading="Library">
              {products.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`${p.title} ${p.subtitle ?? ""} ${p.description} ${p.category} ${p.format}`}
                  onSelect={() => go(`/library/${p.slug}`)}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.format} · {formatKES(p.price_kes)}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SiteSearch;
