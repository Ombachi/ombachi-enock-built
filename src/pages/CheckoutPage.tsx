import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Smartphone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useCart } from "@/hooks/useCart";
import { formatKES } from "@/lib/library/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SHIPPING_KES = 350;

const CheckoutPage = () => {
  const { lines, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const hasPhysical = lines.some((l) => !l.is_digital);
  const shipping = hasPhysical ? SHIPPING_KES : 0;
  const total = subtotal + shipping;

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lines.length) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-order", {
        body: {
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone || null,
          shipping_address: hasPhysical ? form.address : null,
          notes: form.notes || null,
          lines: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        },
      });
      if (error) throw error;
      const order = (data as { order?: { id: string; order_number: string; total_kes: number } })?.order;
      if (!order) throw new Error((data as { error?: string })?.error ?? "Could not place the order.");

      if (order.total_kes === 0) {
        clear();
        toast.success(`Order ${order.order_number} confirmed. Your downloads are ready.`);
        navigate("/account");
        return;
      }

      let payload: { ok?: boolean; error?: string; message?: string } | null = null;
      try {
        const { data: pay } = await supabase.functions.invoke("mpesa-stk-push", {
          body: { orderId: order.id, phone: form.phone },
        });
        payload = pay as typeof payload;
      } catch {
        payload = null;
      }

      clear();
      if (payload?.ok) {
        toast.success(payload.message ?? "Check your phone and enter your M-PESA PIN.");
      } else {
        toast.success(
          `Order ${order.order_number} received. Payment instructions will be sent to ${form.email}.`,
        );
      }
      navigate("/account");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <PageTransition>
      <Helmet>
        <title>Checkout — The Library</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <div className="section-container pt-28 pb-6">
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={15} /> Back to cart
          </Link>
        </div>

        <section className="section-container pb-24">
          <h1 className="font-serif text-4xl text-foreground">Checkout</h1>

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
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label htmlFor="co-name" className="text-sm text-foreground">Full name</label>
                  <input id="co-name" required value={form.name} onChange={set("name")} className={field} />
                </div>
                <div>
                  <label htmlFor="co-email" className="text-sm text-foreground">Email (where downloads are sent)</label>
                  <input id="co-email" type="email" required value={form.email} onChange={set("email")} className={field} />
                </div>
                <div>
                  <label htmlFor="co-phone" className="text-sm text-foreground">M-PESA phone number</label>
                  <input
                    id="co-phone"
                    required={total > 0}
                    placeholder="07xx xxx xxx"
                    value={form.phone}
                    onChange={set("phone")}
                    className={field}
                  />
                </div>
                {hasPhysical && (
                  <div>
                    <label htmlFor="co-address" className="text-sm text-foreground">Delivery address</label>
                    <textarea id="co-address" required rows={3} value={form.address} onChange={set("address")} className={field} />
                  </div>
                )}
                <div>
                  <label htmlFor="co-notes" className="text-sm text-foreground">Notes (optional)</label>
                  <textarea id="co-notes" rows={2} value={form.notes} onChange={set("notes")} className={field} />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
                  {total === 0 ? "Get my copy" : `Pay ${formatKES(total)} with M-PESA`}
                </button>
                <p className="text-xs text-muted-foreground">
                  You will receive a prompt on your phone to approve the payment.
                </p>
              </form>

              <aside className="h-fit rounded-lg border border-border bg-card p-6">
                <h2 className="font-serif text-xl text-foreground">Order summary</h2>
                <ul className="mt-4 space-y-2">
                  {lines.map((l) => (
                    <li key={l.productId} className="flex justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">
                        {l.quantity} × {l.title}
                      </span>
                      <span className="text-foreground">{formatKES(l.price_kes * l.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatKES(subtotal)}</span>
                </div>
                {hasPhysical && (
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground">{formatKES(shipping)}</span>
                  </div>
                )}
                <div className="mt-4 flex justify-between border-t border-border pt-4">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-serif text-xl text-foreground">{formatKES(total)}</span>
                </div>
              </aside>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default CheckoutPage;
