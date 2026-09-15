import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine, Product } from "@/lib/library/types";

const STORAGE_KEY = "library-cart-v1";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const read = (): CartLine[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
    // drop legacy/demo lines that no longer exist in the catalogue
    return parsed.filter((l) => UUID.test(String(l?.productId ?? "")));
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<CartLine[]>(read);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const add = (product: Product, quantity = 1) =>
      setLines((prev) => {
        const existing = prev.find((l) => l.productId === product.id);
        if (existing) {
          // digital goods are single-quantity by nature
          if (product.is_digital) return prev;
          return prev.map((l) =>
            l.productId === product.id ? { ...l, quantity: l.quantity + quantity } : l,
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            title: product.title,
            format: product.format,
            price_kes: product.price_kes,
            is_digital: product.is_digital,
            cover_image_url: product.cover_image_url,
            quantity: product.is_digital ? 1 : quantity,
          },
        ];
      });

    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.quantity * l.price_kes, 0),
      add,
      remove: (productId) => setLines((prev) => prev.filter((l) => l.productId !== productId)),
      setQuantity: (productId, quantity) =>
        setLines((prev) =>
          quantity <= 0
            ? prev.filter((l) => l.productId !== productId)
            : prev.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
        ),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
