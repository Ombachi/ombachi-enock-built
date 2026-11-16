import { getUnlock } from "./mpesaCheckout";
import type { Product } from "./types";

export const isPdfPath = (path?: string | null) => /\.pdf(?:[?#]|$)/i.test(path ?? "");

export const hasPdf = (product: Pick<Product, "file_path" | "html_file_path" | "html_url">) =>
  [product.file_path, product.html_file_path, product.html_url].some(isPdfPath);

export function publicationFileUrl(product: Pick<Product, "id" | "slug">, mode: "download" | "view") {
  const params = new URLSearchParams({ slug: product.slug });
  const unlock = getUnlock(product.id);
  if (unlock) {
    params.set("orderId", unlock.orderId);
    params.set("token", unlock.token);
  }
  return `/api/library/${mode}?${params}`;
}