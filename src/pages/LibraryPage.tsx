import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";
import ProductCard from "@/components/library/ProductCard";
import CartButton from "@/components/library/CartButton";
import { COLLECTIONS } from "@/lib/library/catalogue";
import { loadProducts } from "@/lib/library/products";
import { PRODUCT_FORMATS, type Product, type ProductFormat } from "@/lib/library/types";

type Sort = "featured" | "newest" | "price-asc" | "price-desc" | "title";

const LibraryPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<ProductFormat | "All">("All");
  const [sort, setSort] = useState<Sort>("featured");

  useEffect(() => {
    loadProducts().then(({ products }) => {
      setProducts(products);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.subtitle ?? "").toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesFormat = format === "All" || p.format === format;
      return matchesQuery && matchesFormat;
    });

    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price_kes - b.price_kes);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price_kes - a.price_kes);
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
        sorted.sort((a, b) => (b.published_year ?? 0) - (a.published_year ?? 0));
        break;
      default:
        sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return sorted;
  }, [products, query, format, sort]);

  const availableFormats = useMemo(
    () => PRODUCT_FORMATS.filter((f) => products.some((p) => p.format === f)),
    [products],
  );

  return (
    <PageTransition>
      <Helmet>
        <title>The Library — Books, Papers & Briefs by Ombachi Enock</title>
        <meta
          name="description"
          content="Browse and buy books, eBooks, research papers, policy briefs, essays and reports on diagnostics, health systems and climate health."
        />
        <link rel="canonical" href={`${window.location.origin}/library`} />
        <meta property="og:title" content="The Library — Ombachi Enock" />
        <meta
          property="og:description"
          content="Books, papers, briefs and essays on diagnostics, health systems and climate health."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <header className="pt-28 pb-10 section-container">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-secondary">The Library</p>
              <h1 className="mt-3 font-serif text-4xl md:text-5xl text-foreground leading-tight">
                Work you can read, keep and use
              </h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Books, research papers, policy briefs, essays and reports.
              </p>
            </div>
            <CartButton />
          </div>
        </header>

        <section className="section-container pb-8" aria-label="Curated collections">
          <h2 className="text-sm font-medium text-foreground mb-3">Curated collections</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.slug}
                to={`/library/collections/${c.slug}`}
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-secondary/40"
              >
                <p className="font-serif text-base text-foreground">{c.title}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="section-container pb-20">
          <div className="flex flex-col gap-4 border-y border-border py-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the library"
                aria-label="Search the library"
                className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs text-muted-foreground">
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="title">Title A–Z</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by format">
            {(["All", ...availableFormats] as (ProductFormat | "All")[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                aria-pressed={format === f}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  format === f
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-20 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading the library…
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-20 text-muted-foreground">Nothing matches that search yet.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default LibraryPage;
