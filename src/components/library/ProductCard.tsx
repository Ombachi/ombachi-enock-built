import { Link } from "react-router-dom";
import { BookOpen, Download, Package } from "lucide-react";
import { formatKES, type Product } from "@/lib/library/types";

const ProductCard = ({ product }: { product: Product }) => {
  const Icon = product.is_digital ? Download : product.format === "Merchandise" ? Package : BookOpen;

  return (
    <Link
      to={`/library/${product.slug}`}
      aria-label={`View ${product.title}`}
      className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-all hover:-translate-y-1 hover:border-secondary/40 hover:shadow-[var(--card-shadow-hover)]"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 via-muted to-secondary/10 flex items-center justify-center overflow-hidden">
        {product.cover_image_url ? (
          <img
            src={product.cover_image_url}
            alt={`Cover of ${product.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="font-serif text-3xl text-primary/40 px-6 text-center leading-tight">
            {product.title.split(" ").slice(0, 3).join(" ")}
          </span>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
          <Icon size={12} /> {product.format}
        </span>
        {product.is_free && (
          <span className="absolute top-3 right-3 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
            Free
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{product.category}</p>
        <h3 className="mt-2 font-serif text-lg leading-snug text-foreground group-hover:text-secondary transition-colors">
          {product.title}
        </h3>
        {product.subtitle && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.subtitle}</p>
        )}
        <div className="mt-4 flex items-baseline gap-2 pt-2 border-t border-border/60">
          <span className="font-medium text-foreground">{formatKES(product.price_kes)}</span>
          {product.compare_at_kes ? (
            <span className="text-xs text-muted-foreground line-through">
              {formatKES(product.compare_at_kes)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
