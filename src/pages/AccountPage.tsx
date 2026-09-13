import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Download, Loader2, LogOut, Package } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { formatKES } from "@/lib/library/types";
import { toast } from "sonner";

interface OrderRow {
  id: string;
  order_number: string;
  total_kes: number;
  status: string;
  fulfilment: string;
  created_at: string;
}
interface ItemRow {
  id: string;
  order_id: string;
  title: string;
  quantity: number;
  unit_price_kes: number;
}
interface EntRow {
  id: string;
  product_id: string;
  download_count: number;
  products: { title: string; format: string; slug: string } | null;
}

const AccountPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [ents, setEnts] = useState<EntRow[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      navigate("/auth?redirect=/account");
      return;
    }
    setEmail(session.user.email ?? null);

    const [o, e] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("entitlements").select("id,product_id,download_count,products(title,format,slug)"),
    ]);
    const orderRows = (o.data as OrderRow[]) ?? [];
    setOrders(orderRows);
    setEnts((e.data as unknown as EntRow[]) ?? []);

    if (orderRows.length) {
      const { data: it } = await supabase
        .from("order_items")
        .select("id,order_id,title,quantity,unit_price_kes")
        .in("order_id", orderRows.map((r) => r.id));
      setItems((it as ItemRow[]) ?? []);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const download = async (entitlementId: string) => {
    setDownloading(entitlementId);
    try {
      const { data, error } = await supabase.functions.invoke("download-file", {
        body: { entitlementId },
      });
      if (error) throw error;
      const payload = data as { url?: string; error?: string };
      if (!payload?.url) throw new Error(payload?.error ?? "Download unavailable.");
      window.open(payload.url, "_blank", "noopener");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download unavailable.");
    } finally {
      setDownloading(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Your account — The Library</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <section className="section-container pt-28 pb-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl text-foreground">Your account</h1>
              {email && <p className="mt-1 text-sm text-muted-foreground">{email}</p>}
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-secondary" />
            </div>
          ) : (
            <div className="mt-10 grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="font-serif text-2xl text-foreground">My library</h2>
                {ents.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Nothing here yet.{" "}
                    <Link to="/library" className="text-secondary hover:underline">
                      Browse the Library
                    </Link>
                    .
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-border border-y border-border">
                    {ents.map((en) => (
                      <li key={en.id} className="flex items-center justify-between gap-4 py-4">
                        <div>
                          <p className="font-serif text-lg text-foreground">{en.products?.title ?? "Title"}</p>
                          <p className="text-xs text-muted-foreground">
                            {en.products?.format} · downloaded {en.download_count}×
                          </p>
                        </div>
                        <button
                          onClick={() => download(en.id)}
                          disabled={downloading === en.id}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-foreground hover:bg-muted disabled:opacity-60"
                        >
                          {downloading === en.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                          Download
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h2 className="font-serif text-2xl text-foreground">Orders</h2>
                {orders.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p>
                ) : (
                  <ul className="mt-4 space-y-4">
                    {orders.map((o) => (
                      <li key={o.id} className="rounded-lg border border-border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-2 font-mono text-sm text-foreground">
                            <Package className="h-4 w-4" /> {o.order_number}
                          </span>
                          <span className="text-sm font-medium text-foreground">{formatKES(o.total_kes)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {format(new Date(o.created_at), "MMM d, yyyy")} · {o.status} ·{" "}
                          {o.fulfilment.replace("_", " ")}
                        </p>
                        <ul className="mt-2 space-y-0.5">
                          {items
                            .filter((i) => i.order_id === o.id)
                            .map((i) => (
                              <li key={i.id} className="flex justify-between text-xs text-muted-foreground">
                                <span>
                                  {i.quantity} × {i.title}
                                </span>
                                <span>{formatKES(i.unit_price_kes * i.quantity)}</span>
                              </li>
                            ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default AccountPage;
