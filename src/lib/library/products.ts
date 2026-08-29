import { supabase } from "@/integrations/supabase/client";
import { SEED_PRODUCTS } from "./catalogue";
import type { Product } from "./types";

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
};

/**
 * Loads the catalogue. Attempts the hosted database first; if the `products`
 * table is not yet provisioned (or the backend is unavailable) it falls back to
 * the seed catalogue so the storefront keeps working. No code change is needed
 * once the table exists — live data takes over automatically.
 */
export async function loadProducts(): Promise<{ products: Product[]; live: boolean }> {
  try {
    const { data, error } = await withTimeout(
      (supabase as unknown as {
        from: (t: string) => {
          select: (c: string) => {
            eq: (a: string, b: string) => Promise<{ data: unknown[] | null; error: unknown }>;
          };
        };
      })
        .from("products")
        .select("*")
        .eq("status", "published"),
      3000
    );

    if (error || !data) return { products: SEED_PRODUCTS, live: false };
    const rows = data as unknown as Product[];
    if (!rows.length) return { products: SEED_PRODUCTS, live: false };
    return {
      products: rows.map((r) => ({ ...r, collections: r.collections ?? [] })),
      live: true,
    };
  } catch {
    return { products: SEED_PRODUCTS, live: false };
  }
}
