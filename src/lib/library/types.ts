export type ProductFormat =
  | "Book"
  | "eBook"
  | "Publication"
  | "Research Paper"
  | "Policy Brief"
  | "Manuscript"
  | "Essay"
  | "Report"
  | "Digital Document"
  | "Signed Copy"
  | "Merchandise";

export const PRODUCT_FORMATS: ProductFormat[] = [
  "Book",
  "eBook",
  "Publication",
  "Research Paper",
  "Policy Brief",
  "Manuscript",
  "Essay",
  "Report",
  "Digital Document",
  "Signed Copy",
  "Merchandise",
];

export const DIGITAL_FORMATS: ProductFormat[] = [
  "eBook",
  "Research Paper",
  "Policy Brief",
  "Manuscript",
  "Essay",
  "Report",
  "Digital Document",
  "Publication",
];

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  format: ProductFormat;
  category: string;
  price_kes: number;
  compare_at_kes?: number | null;
  is_digital: boolean;
  is_free: boolean;
  stock?: number | null;
  pages?: number | null;
  published_year?: number | null;
  cover_image_url?: string | null;
  file_path?: string | null;
  html_file_path?: string | null;
  html_url?: string | null;
  post_id?: string | null;
  collections: string[];
  featured?: boolean;
  status: "draft" | "published";
}

export interface Collection {
  slug: string;
  title: string;
  description: string;
}

export interface CartLine {
  productId: string;
  slug: string;
  title: string;
  format: ProductFormat;
  price_kes: number;
  is_digital: boolean;
  cover_image_url?: string | null;
  quantity: number;
}

export const formatKES = (amount: number) =>
  amount === 0
    ? "Free"
    : new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
      }).format(amount);
