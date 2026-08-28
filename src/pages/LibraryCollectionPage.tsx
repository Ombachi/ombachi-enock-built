import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";
import ProductCard from "@/components/library/ProductCard";
import CartButton from "@/components/library/CartButton";
import { COLLECTIONS, collectionBySlug } from "@/lib/library/catalogue";
import { loadProducts } from "@/lib/library/products";
import type { Product } from "@/lib/library/types";

const LibraryCollectionPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[] | null>(null);
  const collection = collectionBySlug(slug);

  useEffect(() => {
    loadProducts().then(({ products }) => setProducts(products));
  }, []);

  const items = (products ?? []).filter((p) => p.collections.includes(slug ?? ""));

  return (
    <PageTransition>
      <Helmet>
        <title>{`${collection?.title ?? "Collection"} — The Library`}</title>
        <meta
          name="description"
          content={collection?.description ?? "A curated collection from the Library."}
        />
        <link rel="canonical" href={`${window.location.origin}/library/collections/${slug}`} />
        <meta property="og:title" content={`${collection?.title ?? "Collection"} — The Library`} />
        <meta property="og:description" content={collection?.description ?? ""} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
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

        <header className="section-container pb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Collection</p>
          <h1 className="mt-3 font-serif text-4xl text-foreground leading-tight">
            {collection?.title ?? "Collection"}
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {collection?.description ?? "This collection is still being curated."}
          </p>
        </header>

        <section className="section-container pb-20">
          {!products ? (
            <div className="flex items-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : items.length === 0 ? (
            <p className="py-10 text-muted-foreground">Nothing in this collection yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className="mt-14 border-t border-border pt-8">
            <h2 className="text-sm font-medium text-foreground mb-3">Other collections</h2>
            <div className="flex flex-wrap gap-2">
              {COLLECTIONS.filter((c) => c.slug !== slug).map((c) => (
                <Link
                  key={c.slug}
                  to={`/library/collections/${c.slug}`}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-secondary hover:border-secondary/40 transition-colors"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default LibraryCollectionPage;
