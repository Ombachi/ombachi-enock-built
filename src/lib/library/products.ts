import { supabase } from "@/integrations/supabase/client";
import type { Product } from "./types";

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
};

/** Shown only when the live catalogue can't be reached, so shelves are never blank. */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fallback-lab-quality-handbook",
    slug: "laboratory-quality-handbook",
    title: "The Laboratory Quality Handbook",
    subtitle: "Practical quality systems for clinical laboratories",
    description:
      "A field-tested guide to building reliable quality management in clinical laboratories — from internal controls to accreditation readiness.",
    format: "Book",
    category: "Diagnostics",
    price_kes: 3500,
    is_digital: false,
    is_free: false,
    stock: 40,
    collections: [],
    featured: true,
    status: "published",
  },
  {
    id: "fallback-climate-health-brief",
    slug: "climate-health-policy-brief",
    title: "Climate & Health: A Policy Brief for County Systems",
    description:
      "How county health systems can anticipate and respond to climate-driven disease burdens, with practical policy recommendations.",
    format: "Policy Brief",
    category: "Climate & Health",
    price_kes: 0,
    is_digital: true,
    is_free: true,
    collections: [],
    featured: true,
    status: "published",
  },
  {
    id: "fallback-decentralised-diagnostics",
    slug: "decentralised-diagnostics",
    title: "Decentralised Diagnostics",
    description:
      "The case for moving quality diagnostic services closer to underserved communities — models, costs and lessons from practice.",
    format: "eBook",
    category: "Diagnostics",
    price_kes: 1200,
    is_digital: true,
    is_free: false,
    collections: [],
    status: "published",
  },
];

/**
 * Loads the published catalogue. Falls back to a curated list when the
 * backend is unreachable or returns nothing.
 */
export async function loadProducts(): Promise<{ products: Product[]; live: boolean }> {
  try {
    const { data, error } = await withTimeout(
      (async () => await supabase.from("products").select("*").eq("status", "published"))(),
      6000,
    );

    if (error || !data || data.length === 0) return { products: FALLBACK_PRODUCTS, live: false };
    const rows = data as unknown as Product[];
    return {
      products: rows.map((r) => ({ ...r, collections: r.collections ?? [] })),
      live: true,
    };
  } catch {
    return { products: FALLBACK_PRODUCTS, live: false };
  }
}
