import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { POST_CATEGORIES, categoryBySlug, categoryGradient, categorySlug } from "@/lib/postCategories";

interface Row {
  slug: string;
  title: string;
  excerpt: string | null;
  tag: string | null;
  published_at: string | null;
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const meta = categoryBySlug(category);
  const [posts, setPosts] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("posts")
        .select("slug, title, excerpt, tag, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      setPosts(((data || []) as Row[]).filter((p) => categorySlug(p.tag) === category));
      setLoading(false);
    })();
  }, [category]);

  const name = meta?.name || "Writing";
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/writing/category/${category}`;
  const description = meta?.description || `Posts by Ombachi Enock filed under ${name}.`;

  return (
    <PageTransition>
      <Helmet>
        <title>{`${name} — Writing by Ombachi Enock`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${name} — Writing by Ombachi Enock`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${name} — Writing by Ombachi Enock`} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Link
              to="/#writing"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Back to Writing
            </Link>

            <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3">Category</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">{name}</h1>
            <p className="text-muted-foreground max-w-xl mb-10">{description}</p>

            <div className="flex flex-wrap gap-2 mb-10">
              {POST_CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/writing/category/${c.slug}`}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    c.slug === category
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "border-border text-muted-foreground hover:border-secondary/40 hover:text-secondary"
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground text-sm">No posts in this category yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/writing/${p.slug}`}
                    className="group block bg-card rounded-xl border border-border hover:border-secondary/40 transition-colors overflow-hidden"
                  >
                    <div className={`h-2 bg-gradient-to-r ${categoryGradient(p.tag)}`} />
                    <div className="p-6 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                            {p.tag || "General"}
                          </span>
                          {p.published_at && (
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(p.published_at), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                        <h2 className="font-serif text-lg font-semibold text-foreground group-hover:text-secondary transition-colors mb-1">
                          {p.title}
                        </h2>
                        {p.excerpt && (
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{p.excerpt}</p>
                        )}
                      </div>
                      <ArrowUpRight size={20} className="text-muted-foreground group-hover:text-secondary transition-colors mt-1 shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default CategoryPage;