import { supabase } from "@/integrations/supabase/client";
import type { Product } from "./types";

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
};

/**
 * Loads the published catalogue from the database. Only real, admin-managed
 * rows are returned — nothing is shown on the storefront that cannot be
 * managed from the admin area.
 */
export async function loadProducts(): Promise<{ products: Product[]; live: boolean }> {
  try {
    const { data, error } = await withTimeout(
      supabase.from("products").select("*").eq("status", "published"),
      6000,
    );

    if (error || !data) return { products: [], live: false };
    const rows = data as unknown as Product[];
    return {
      products: rows.map((r) => ({ ...r, collections: r.collections ?? [] })),
      live: true,
    };
  } catch {
    return { products: [], live: false };
  }
}
