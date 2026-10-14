import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, CheckCircle2, Clock, Download, Loader2, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { formatKES } from "@/lib/library/types";
import { toast } from "sonner";

interface Item {
  product_id: string | null;
  title: string;
  format: string | null;
  quantity: number;
  unit_price_kes: number;
  is_digital: boolean;
  can_read: boolean;
  can_download: boolean;
}
interface OrderInfo {
  id: string;
  order_number: string;
  status: string;
  total_kes: number;
  subtotal_kes: number;
  shipping_kes: number;
  customer_email: string;
}

const OrderConfirmationPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order") ?? "";
  const token = params.get("token") ?? "";
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [reader, setReader] = useState<{ title: string; html?: string; url?: string } | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke("order-access", { body: { orderId, token } });
    if (error || !data?.order) {
      setError((data as { error?: string })?.error ?? "We couldn't find this order.");
      return;
    }
    setOrder(data.order);
    setItems(data.items ?? []);
  }, [orderId, token]);

  useEffect(() => {
    if (!orderId || !token) {
      setError("This confirmation link is incomplete.");
      return;
    }
    load();
  }, [orderId, token, load]);

  // Poll while waiting for M-PESA to confirm.
  useEffect(() => {
    if (order?.status !== "pending") return;
    const t = window.setInterval(load, 2000);
    return () => window.clearInterval(t);
  }, [order?.status, load]);

  const act = async (productId: string, action: "read" | "download") => {
    setBusy(productId + action);
    try {
      const { data, error } = await supabase.functions.invoke("order-access", {
        body: { orderId, token, productId, action },
      });
      if (error || data?.error) throw new Error(data?.error ?? "Something went wrong.");
      if (action === "download") window.location.href = data.url;
      else setReader({ title: data.title, html: data.html, url: data.url });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  const paid = order?.status === "paid";

  return (
    <PageTransition>
      <Helmet>
        <title>Order confirmation — Ombachi Enock</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <section className="section-container pt-28 pb-24 max-w-3xl">
          {error ? (
            <div>
              <h1 className="font-serif text-3xl text-foreground">Order not found</h1>
              <p className="mt-3 text-muted-foreground">{error}</p>
              <Link to="/library" className="mt-6 inline-block text-secondary hover:underline">Browse Publications</Link>
            </div>
          ) : !order ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="flex items-center gap-3">
                {paid ? <CheckCircle2 className="h-8 w-8 text-secondary" /> : <Clock className="h-8 w-8 text-muted-foreground" />}
                <h1 className="font-serif text-3xl md:text-4xl text-foreground">
                  {paid ? `Payment confirmed! Order #${order.order_number}` : `Awaiting payment — Order #${order.order_number}`}
                </h1>
              </div>
              <p className="mt-3 text-muted-foreground">
                {paid
                  ? `A receipt with your permanent access link has been sent to ${order.customer_email}.`
                  : "Approve the M-PESA prompt on your phone. This page updates automatically once payment is confirmed."}
              </p>

              <div className="mt-8 rounded-lg border border-border bg-card p-6">
                <h2 className="font-serif text-xl text-foreground">Order summary</h2>
                <ul className="mt-4 divide-y divide-border">
                  {items.map((i, idx) => (
                    <li key={idx} className="flex flex-wrap items-center justify-between gap-3 py-4">
                      <div>
                        <p className="text-foreground">{i.quantity} × {i.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {i.format} · {formatKES(i.unit_price_kes * i.quantity)}
                          {!i.is_digital && " · Printed copy, we will contact you about delivery"}
                        </p>
                      </div>
                      {i.product_id && (
                        <div className="flex gap-2">
                          {i.can_read && (
                            <button
                              onClick={() => act(i.product_id!, "read")}
                              disabled={!!busy}
                              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
                            >
                              {busy === i.product_id + "read" ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
                              Read Online
                            </button>
                          )}
                          {i.can_download && (
                            <button
                              onClick={() => act(i.product_id!, "download")}
                              disabled={!!busy}
                              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-60"
                            >
                              {busy === i.product_id + "download" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                              Download
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                {order.shipping_kes > 0 && (
                  <div className="flex justify-between border-t border-border pt-3 text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground">{formatKES(order.shipping_kes)}</span>
                  </div>
                )}
                <div className="mt-3 flex justify-between border-t border-border pt-3">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-serif text-xl text-foreground">{formatKES(order.total_kes)}</span>
                </div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">Bookmark this page — it's your access link.</p>
            </>
          )}
        </section>
        <Footer />
      </div>

      {reader && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-serif text-foreground">{reader.title}</p>
            <button onClick={() => setReader(null)} aria-label="Close reader" className="text-foreground"><X size={22} /></button>
          </div>
          <iframe
            title={reader.title}
            className="flex-1 w-full"
            sandbox="allow-scripts allow-popups allow-forms"
            {...(reader.html ? { srcDoc: reader.html } : { src: reader.url })}
          />
        </div>
      )}
    </PageTransition>
  );
};

export default OrderConfirmationPage;
