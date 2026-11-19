import type { Product } from "./types";

/** Converts 07…, 01…, 7…, +254… into 2547XXXXXXXX. Returns null if invalid. */
export const normaliseKenyanPhone = (raw: string): string | null => {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0")) d = `254${d.slice(1)}`;
  else if (d.length === 9) d = `254${d}`;
  return /^254[17]\d{8}$/.test(d) ? d : null;
};

export const isPaidProduct = (p: Pick<Product, "price_kes" | "is_free">) => Number(p.price_kes) > 0;

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
export const getOrderStatus = async (orderId: string, token: string): Promise<string> => {
  try {
    const r = await fetch("/api/mpesa/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, token }),
    });
    const data = await r.json().catch(() => null);
    return data?.status ?? "unknown";
  } catch {
    return "unknown";
  }
};

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

  let res: { ok?: boolean; orderId?: string; error?: string; message?: string; accessToken?: string } | null = null;
  try {
    const r = await fetch("/api/mpesa/stk-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, phone: msisdn }),
    });
    res = await r.json().catch(() => null);
  } catch {
    res = null;
  }
  if (!res?.ok || !res.accessToken || !res.orderId) {
    throw new Error(res?.error || res?.message || "M-PESA could not send the prompt. Please try again.");
  }
  const orderId = res.orderId;
  saveUnlock(product.id, { orderId, token: res.accessToken });
  return { orderId, token: res.accessToken, message: res.message };
};
