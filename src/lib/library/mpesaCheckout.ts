import { supabase } from "@/integrations/supabase/client";
import type { Product } from "./types";

/** Converts 07…, 01…, 7…, +254… into 2547XXXXXXXX. Returns null if invalid. */
export const normaliseKenyanPhone = (raw: string): string | null => {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0")) d = `254${d.slice(1)}`;
  else if (d.length === 9) d = `254${d}`;
  return /^254[17]\d{8}$/.test(d) ? d : null;
};

export const isPaidProduct = (p: Pick<Product, "price_kes" | "is_free">) => p.price_kes > 0 && !p.is_free;

const UNLOCK_KEY = "publication_unlocks";
type Unlock = { orderId: string; token: string };

const readUnlocks = (): Record<string, Unlock> => {
  try {
    return JSON.parse(localStorage.getItem(UNLOCK_KEY) || "{}");
  } catch {
    return {};
  }
};

export const saveUnlock = (productId: string, u: Unlock) => {
  const all = readUnlocks();
  all[productId] = u;
  localStorage.setItem(UNLOCK_KEY, JSON.stringify(all));
};

export const getUnlock = (productId: string): Unlock | null => readUnlocks()[productId] ?? null;

/** Asks the server whether an order is paid (needs the signed access token). */
export const isOrderPaid = async (orderId: string, token: string): Promise<boolean> => {
  try {
    const r = await fetch("/api/mpesa/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, token }),
    });
    const data = await r.json().catch(() => null);
    return data?.status === "paid";
  } catch {
    return false;
  }
};

/**
 * Writes the order and its single item straight into the database, then asks
 * M-PESA to send the PIN prompt. The server recomputes the price.
 */
export const startMpesaPurchase = async (product: Product, phone: string) => {
  const msisdn = normaliseKenyanPhone(phone);
  if (!msisdn) throw new Error("Enter a valid Safaricom number (07… or 254…).");

  const orderId = crypto.randomUUID();
  const { error: oErr } = await supabase.from("orders").insert({
    id: orderId,
    customer_name: "M-PESA reader",
    customer_email: `reader+${msisdn}@ombachienock.me.ke`,
    customer_phone: msisdn,
    subtotal_kes: product.price_kes,
    shipping_kes: 0,
    total_kes: product.price_kes,
    payment_method: "mpesa",
    status: "pending",
  });
  if (oErr) throw new Error("We couldn't create your order. Please try again.");

  const { error: iErr } = await supabase.from("order_items").insert({
    order_id: orderId,
    product_id: product.id,
    title: product.title,
    format: product.format,
    unit_price_kes: product.price_kes,
    quantity: 1,
    is_digital: product.is_digital,
  });
  if (iErr) throw new Error("We couldn't save your order item. Please try again.");

  let res: { ok?: boolean; error?: string; message?: string; accessToken?: string } | null = null;
  try {
    const r = await fetch("/api/mpesa/stk-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, phone: msisdn }),
    });
    res = await r.json().catch(() => null);
  } catch {
    res = null;
  }
  if (!res?.ok || !res.accessToken) {
    throw new Error(res?.error || res?.message || "M-PESA could not send the prompt. Please try again.");
  }
  saveUnlock(product.id, { orderId, token: res.accessToken });
  return { orderId, token: res.accessToken, message: res.message };
};
