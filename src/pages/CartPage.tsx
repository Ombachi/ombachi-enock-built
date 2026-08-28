import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useCart } from "@/hooks/useCart";
import { formatKES } from "@/lib/library/types";

const CartPage = () => {
  const { lines, subtotal, remove, setQuantity, clear } = useCart();
  const hasPhysical = lines.some((l) => !l.is_digital);

  return (
    <PageTransition>
      <Helmet>
        <title>Your cart — The Library</title>
        <meta name="description" content="Review the items in your Library cart before checkout." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <div className="section-container pt-28 pb-6">
          <Link
            to="/library"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} /> Continue browsing
          </Link>
        </div>

        <section className="section-container pb-24">
          <h1 className="font-serif text-4xl text-foreground">Your cart</h1>

          {lines.length === 0 ? (
            <p className="mt-6 text-muted-foreground">
              Your cart is empty.{" "}
              <Link to="/library" className="text-secondary hover:underline">
                Browse the Library
              </Link>
              .
            </p>
          ) : (
            <div className="mt-8 grid gap-10 lg:grid-cols-[7fr_4fr]">
              <ul className="divide-y divide-border border-y border-border">
                {lines.map((l) => (
                  <li key={l.productId} className="flex gap-4 py-5">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded border border-border bg-gradient-to-br from-primary/10 to-secondary/10">
                      {l.cover_image_url && (
                        <img src={l.cover_image_url} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Link
                        to={`/library/${l.slug}`}
                        className="font-serif text-lg text-foreground hover:text-secondary transition-colors"
                      >
                        {l.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{l.format}</p>
                      <div className="mt-3 flex items-center gap-3">
                        {l.is_digital ? (
                          <span className="text-xs text-muted-foreground">Digital · 1 licence</span>
                        ) : (
                          <div className="flex items-center rounded-full border border-border">
                            <button
                              onClick={() => setQuantity(l.productId, l.quantity - 1)}
                              aria-label={`Decrease quantity of ${l.title}`}
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="min-w-6 text-center text-sm">{l.quantity}</span>
                            <button
                              onClick={() => setQuantity(l.productId, l.quantity + 1)}
                              aria-label={`Increase quantity of ${l.title}`}
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => remove(l.productId)}
                          aria-label={`Remove ${l.title} from cart`}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {formatKES(l.price_kes * l.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <aside className="h-fit rounded-lg border border-border bg-card p-6">
                <h2 className="font-serif text-xl text-foreground">Summary</h2>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatKES(subtotal)}</span>
                </div>
                {hasPhysical && (
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                  </div>
                )}
                <div className="mt-4 border-t border-border pt-4 flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-serif text-xl text-foreground">{formatKES(subtotal)}</span>
                </div>

                <button
                  disabled
                  title="Checkout opens once payments are connected"
                  className="mt-6 w-full cursor-not-allowed rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground opacity-60"
                >
                  Checkout
                </button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Checkout with M-PESA and card opens as soon as payments are connected. Your cart is
                  saved on this device until then.
                </p>
                <button
                  onClick={clear}
                  className="mt-4 w-full text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear cart
                </button>
              </aside>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default CartPage;
