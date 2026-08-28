import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Download, Loader2, Package, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";
import ShareButtons from "@/components/ShareButtons";
import ProductCard from "@/components/library/ProductCard";
import CartButton from "@/components/library/CartButton";
import { useCart } from "@/hooks/useCart";
import { loadProducts } from "@/lib/library/products";
import { collectionBySlug } from "@/lib/library/catalogue";
import { formatKES, type Product } from "@/lib/library/types";

const LibraryProductPage = () => {
  const { slug } = useParams();
  const { add } = useCart();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    loadProducts().then(({ products }) => setProducts(products));
  }, []);

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
            Back to the Library
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const url = `${window.location.origin}/library/${product.slug}`;
  const related = products
    .filter((p) => p.id !== product.id && p.collections.some((c) => product.collections.includes(c)))
    .slice(0, 3);
  const soldOut = !product.is_digital && typeof product.stock === "number" && product.stock <= 0;

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <PageTransition>
      <Helmet>
        <title>{`${product.title} — The Library`}</title>
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
            <ArrowLeft size={15} /> The Library
          </Link>
          <CartButton />
        </div>

        <article className="section-container pb-16 grid gap-10 lg:grid-cols-[5fr_6fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/10 via-muted to-secondary/10 flex items-center justify-center">
            {product.cover_image_url ? (
              <img
                src={product.cover_image_url}
                alt={`Cover of ${product.title}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="px-10 text-center font-serif text-3xl leading-tight text-primary/40">
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

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-serif text-3xl text-foreground">{formatKES(product.price_kes)}</span>
              {product.compare_at_kes ? (
                <span className="text-sm text-muted-foreground line-through">
                  {formatKES(product.compare_at_kes)}
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
                {product.is_digital ? <Download size={12} /> : <Package size={12} />}
                {product.is_digital ? "Instant download" : "Shipped within Kenya"}
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
              <button
                onClick={handleAdd}
                disabled={soldOut}
                aria-label={`Add ${product.title} to cart`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                {soldOut ? "Sold out" : added ? "Added to cart" : product.is_free ? "Add free copy" : "Add to cart"}
              </button>
              <Link
                to="/cart"
                className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-secondary/50 hover:text-secondary"
              >
                View cart
              </Link>
            </div>

            <div className="mt-8 border-t border-border pt-5">
              <ShareButtons url={url} title={product.title} text={product.subtitle ?? undefined} />
            </div>

            {product.collections.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.collections.map((c) => {
                  const col = collectionBySlug(c);
                  return col ? (
                    <Link
                      key={c}
                      to={`/library/collections/${c}`}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-secondary hover:border-secondary/40 transition-colors"
                    >
                      {col.title}
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </article>

        {related.length > 0 && (
          <section className="section-container pb-20">
            <h2 className="font-serif text-2xl text-foreground mb-6">Related in the Library</h2>
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
