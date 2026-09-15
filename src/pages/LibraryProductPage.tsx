import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  Download,
  Loader2,
  MonitorPlay,
  Package,
  ShoppingBag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";
import ShareButtons from "@/components/ShareButtons";
import ProductCard from "@/components/library/ProductCard";
import CartButton from "@/components/library/CartButton";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { loadProducts } from "@/lib/library/products";
import { isBookmarked, toggleBookmark } from "@/lib/library/bookmarks";
import { formatKES, type Product } from "@/lib/library/types";

const LibraryProductPage = () => {
  const { slug } = useParams();
  const { add } = useCart();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadProducts().then(({ products }) => setProducts(products));
  }, []);

  useEffect(() => {
    if (slug) setSaved(isBookmarked(slug));
  }, [slug]);

  if (!products) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="section-container pt-32 pb-24">
          <h1 className="font-serif text-3xl text-foreground">Item not found</h1>
          <Link to="/library" className="mt-4 inline-block text-secondary hover:underline">
            Back to Publications
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const url = `${window.location.origin}/library/${product.slug}`;
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);
  const soldOut = !product.is_digital && typeof product.stock === "number" && product.stock <= 0;
  const isFree = product.is_free || product.price_kes === 0;
  const interactive = !!(product.html_url || product.html_file_path);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleFreeDownload = async () => {
    setDownloading(true);
    const { data, error } = await supabase.functions.invoke("free-download", {
      body: { slug: product.slug },
    });
    setDownloading(false);
    if (error || !data?.url) {
      toast({
        title: "Download unavailable",
        description: "No file is attached to this publication yet.",
        variant: "destructive",
      });
      return;
    }
    window.open(data.url as string, "_blank", "noopener");
  };

  const handleBookmark = () => {
    setSaved(toggleBookmark(product.slug));
  };

  return (
    <PageTransition>
      <Helmet>
        <title>{`${product.title} — Publications`}</title>
        <meta name="description" content={product.description.slice(0, 155)} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description.slice(0, 155)} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={url} />
        {product.cover_image_url && <meta property="og:image" content={product.cover_image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            category: product.category,
            brand: { "@type": "Person", name: "Ombachi Enock" },
            offers: {
              "@type": "Offer",
              price: product.price_kes,
              priceCurrency: "KES",
              availability: soldOut
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
              url,
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <div className="section-container pt-28 pb-6 flex items-center justify-between">
          <Link
            to="/library"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} /> Publications
          </Link>
          <CartButton />
        </div>

        <article className="section-container pb-16 grid gap-10 lg:grid-cols-[5fr_6fr]">
          <div className="flex items-center justify-center overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/10 via-muted to-secondary/10 p-4">
            {product.cover_image_url ? (
              <img
                src={product.cover_image_url}
                alt={`Cover of ${product.title}`}
                className="block h-auto w-auto max-w-full"
              />
            ) : (
              <span className="px-10 py-24 text-center font-serif text-3xl leading-tight text-primary/40">
                {product.title}
              </span>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">
              {product.format} · {product.category}
            </p>
            <h1 className="mt-3 font-serif text-3xl md:text-4xl leading-tight text-foreground">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="mt-3 text-lg text-muted-foreground">{product.subtitle}</p>
            )}

            {!isFree && (
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-serif text-3xl text-foreground">{formatKES(product.price_kes)}</span>
                {product.compare_at_kes ? (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatKES(product.compare_at_kes)}
                  </span>
                ) : null}
              </div>
            )}
            {isFree && <p className="mt-6 font-serif text-2xl text-foreground">Free to read</p>}

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
                {interactive ? (
                  <MonitorPlay size={12} />
                ) : product.is_digital ? (
                  <Download size={12} />
                ) : (
                  <Package size={12} />
                )}
                {interactive
                  ? "Interactive publication"
                  : product.is_digital
                    ? "Instant download"
                    : "Shipped within Kenya"}
              </span>
              {product.pages ? (
                <span className="rounded-full border border-border px-2.5 py-1">{product.pages} pages</span>
              ) : null}
              {product.published_year ? (
                <span className="rounded-full border border-border px-2.5 py-1">{product.published_year}</span>
              ) : null}
              {!product.is_digital && typeof product.stock === "number" ? (
                <span className="rounded-full border border-border px-2.5 py-1">
                  {soldOut ? "Sold out" : `${product.stock} in stock`}
                </span>
              ) : null}
            </div>

            <p className="mt-6 leading-relaxed text-muted-foreground whitespace-pre-line">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {interactive && (
                <Link
                  to={`/library/${product.slug}/view`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <MonitorPlay size={16} /> Launch experience
                </Link>
              )}

              {product.post_id && (
                <Link
                  to={`/writing/${product.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-secondary/50 hover:text-secondary"
                >
                  <BookOpen size={16} /> Read on the site
                </Link>
              )}

              {isFree ? (
                product.file_path ? (
                  <button
                    onClick={handleFreeDownload}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-secondary/50 hover:text-secondary disabled:opacity-60"
                  >
                    {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    Download
                  </button>
                ) : null
              ) : (
                <>
                  <button
                    onClick={handleAdd}
                    disabled={soldOut}
                    aria-label={`Add ${product.title} to cart`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                    {soldOut ? "Sold out" : added ? "Added to cart" : "Add to cart"}
                  </button>
                  <Link
                    to="/cart"
                    className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-secondary/50 hover:text-secondary"
                  >
                    View cart
                  </Link>
                </>
              )}

              <button
                onClick={handleBookmark}
                aria-pressed={saved}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-secondary/50 hover:text-secondary"
              >
                {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                {saved ? "Bookmarked" : "Bookmark"}
              </button>
            </div>

            <div className="mt-8 border-t border-border pt-5">
              <ShareButtons url={url} title={product.title} text={product.subtitle ?? undefined} />
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="section-container pb-20">
            <h2 className="font-serif text-2xl text-foreground mb-6">Related publications</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default LibraryProductPage;
