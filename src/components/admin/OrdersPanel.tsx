import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Package, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { formatKES } from "@/lib/library/types";

type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";
type Fulfilment = "unfulfilled" | "processing" | "shipped" | "delivered" | "digital_delivered";

const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "failed", "refunded", "cancelled"];
const FULFILMENTS: Fulfilment[] = [
  "unfulfilled",
  "processing",
  "shipped",
  "delivered",
  "digital_delivered",
];

interface Item {
  id: string;
  order_id: string;
  title: string;
  format: string | null;
  unit_price_kes: number;
  quantity: number;
  is_digital: boolean;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  subtotal_kes: number;
  shipping_kes: number;
  total_kes: number;
  payment_method: string;
  payment_reference: string | null;
  status: OrderStatus;
  fulfilment: Fulfilment;
  shipping_address: string | null;
  created_at: string;
}

const statusVariant = (s: OrderStatus) =>
  s === "paid" ? "default" : s === "pending" ? "secondary" : "outline";

const OrdersPanel = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [oRes, iRes] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("order_items").select("*"),
    ]);
    if (oRes.error) {
      toast({ title: "Could not load orders", description: oRes.error.message, variant: "destructive" });
    }
    setOrders((oRes.data as Order[]) ?? []);
    setItems((iRes.data as Item[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const itemsByOrder = useMemo(() => {
    const map: Record<string, Item[]> = {};
    items.forEach((i) => {
      (map[i.order_id] ||= []).push(i);
    });
    return map;
  }, [items]);

  const revenue = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.total_kes, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const toShip = orders.filter((o) => o.status === "paid" && o.fulfilment === "unfulfilled").length;

  const update = async (o: Order, patch: Partial<Pick<Order, "status" | "fulfilment">>) => {
    const { error } = await supabase.from("orders").update(patch).eq("id", o.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, ...patch } : x)));
    toast({ title: "Order updated", description: o.order_number });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Paid revenue" value={formatKES(revenue)} />
        <Stat label="Awaiting payment" value={String(pending)} />
        <Stat label="Ready to ship" value={String(toShip)} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" /> Orders
              </CardTitle>
              <CardDescription>Payment and delivery status for every purchase.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={load}>
              <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-medium">{o.order_number}</span>
                        <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
                        <Badge variant="outline">{o.fulfilment.replace("_", " ")}</Badge>
                        <Badge variant="outline">{o.payment_method}</Badge>
                      </div>
                      <p className="text-sm mt-1">{o.customer_name}</p>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-3 mt-0.5">
                        <a href={`mailto:${o.customer_email}`} className="inline-flex items-center gap-1 hover:underline">
                          <Mail className="h-3 w-3" /> {o.customer_email}
                        </a>
                        {o.customer_phone && <span>{o.customer_phone}</span>}
                        <span>{format(new Date(o.created_at), "MMM d, yyyy · h:mm a")}</span>
                      </div>
                      {o.shipping_address && (
                        <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{o.shipping_address}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold tabular-nums">{formatKES(o.total_kes)}</div>
                      {o.shipping_kes > 0 && (
                        <div className="text-xs text-muted-foreground">incl. {formatKES(o.shipping_kes)} delivery</div>
                      )}
                      {o.payment_reference && (
                        <div className="text-xs text-muted-foreground font-mono">{o.payment_reference}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    {(itemsByOrder[o.id] ?? []).map((i) => (
                      <div key={i.id} className="flex justify-between text-xs text-muted-foreground">
                        <span className="truncate">
                          {i.quantity} × {i.title} {i.format ? `(${i.format})` : ""}
                        </span>
                        <span className="tabular-nums">{formatKES(i.unit_price_kes * i.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <label className="text-xs text-muted-foreground flex items-center gap-2">
                      Payment
                      <select
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        value={o.status}
                        onChange={(e) => update(o, { status: e.target.value as OrderStatus })}
                        aria-label={`Payment status for ${o.order_number}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs text-muted-foreground flex items-center gap-2">
                      Delivery
                      <select
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        value={o.fulfilment}
                        onChange={(e) => update(o, { fulfilment: e.target.value as Fulfilment })}
                        aria-label={`Delivery status for ${o.order_number}`}
                      >
                        {FULFILMENTS.map((f) => (
                          <option key={f} value={f}>
                            {f.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
    </CardContent>
  </Card>
);

export default OrdersPanel;
