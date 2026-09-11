import type { Collection, Product } from "./types";

export const COLLECTIONS: Collection[] = [
  {
    slug: "climate-and-health",
    title: "Climate & Health",
    description: "Field notes, briefs and research on planetary health, resilience and diagnostics at the frontline.",
  },
  {
    slug: "diagnostics-practice",
    title: "Diagnostics in Practice",
    description: "Laboratory quality, accreditation and the operational craft of running diagnostic services.",
  },
  {
    slug: "systems-and-governance",
    title: "Systems & Governance",
    description: "Institutions, incentives and stewardship.",
  },
  {
    slug: "essays-and-reflections",
    title: "Essays & Reflections",
    description: "Longform thinking on meaning, work, and the human condition.",
  },
];

/**
 * Seed catalogue. Used as a graceful fallback while the hosted database is
 * unavailable; once the `products` table exists these rows are replaced by
 * live data automatically (see loadProducts()).
 */
export const SEED_PRODUCTS: Product[] = [
  {
    id: "seed-lab-quality-handbook",
    slug: "laboratory-quality-handbook",
    title: "The Laboratory Quality Handbook",
    subtitle: "Building ISO 15189 capability in resource-constrained settings",
    description:
      "A practical handbook for laboratory managers moving a facility from ad-hoc practice to accreditation-ready quality systems. Covers document control, competency assessment, internal audit, non-conformance handling and the human work of changing a lab's culture.",
    format: "Book",
    category: "Diagnostics & Labs",
    price_kes: 3500,
    compare_at_kes: 4500,
    is_digital: false,
    is_free: false,
    stock: 40,
    pages: 268,
    published_year: 2025,
    cover_image_url: null,
    collections: ["diagnostics-practice"],
    featured: true,
    status: "published",
  },
  {
    id: "seed-climate-health-brief",
    slug: "climate-health-policy-brief",
    title: "Climate & Health: A Policy Brief for County Systems",
    subtitle: "Preparing devolved health systems for climate-sensitive disease",
    description:
      "A concise brief for county health leadership on surveillance, diagnostic readiness and budgeting for climate-sensitive disease burden. Includes an implementation checklist and indicator set.",
    format: "Policy Brief",
    category: "Climate & Health",
    price_kes: 0,
    is_digital: true,
    is_free: true,
    pages: 24,
    published_year: 2026,
    cover_image_url: null,
    collections: ["climate-and-health", "systems-and-governance"],
    featured: true,
    status: "published",
  },
  {
    id: "seed-decentralised-diagnostics",
    slug: "decentralised-diagnostics-report",
    title: "Decentralised Diagnostics",
    subtitle: "What it takes to move testing closer to people",
    description:
      "A field report drawn from building Litu Diagnostics: unit economics, quality assurance at the periphery, supply chains, and the trade-offs of decentralising testing.",
    format: "Report",
    category: "Diagnostics & Labs",
    price_kes: 1200,
    is_digital: true,
    is_free: false,
    pages: 62,
    published_year: 2026,
    cover_image_url: null,
    collections: ["diagnostics-practice", "systems-and-governance"],
    status: "published",
  },
  {
    id: "seed-first-principles-essays",
    slug: "first-principles-essays",
    title: "First Principles",
    subtitle: "Essays on systems, service and the long view",
    description:
      "A collected volume of essays on first-principles thinking, stewardship and building institutions that outlive their founders.",
    format: "eBook",
    category: "Philosophy",
    price_kes: 900,
    is_digital: true,
    is_free: false,
    pages: 140,
    published_year: 2026,
    cover_image_url: null,
    collections: ["essays-and-reflections"],
    featured: true,
    status: "published",
  },
  {
    id: "seed-signed-handbook",
    slug: "laboratory-quality-handbook-signed",
    title: "The Laboratory Quality Handbook — Signed Edition",
    subtitle: "Hand-signed, numbered print run",
    description: "A hand-signed and numbered copy of the handbook, shipped within Kenya. Limited print run.",
    format: "Signed Copy",
    category: "Diagnostics & Labs",
    price_kes: 5500,
    is_digital: false,
    is_free: false,
    stock: 12,
    pages: 268,
    published_year: 2025,
    cover_image_url: null,
    collections: ["diagnostics-practice"],
    status: "published",
  },
  {
    id: "seed-surveillance-paper",
    slug: "surveillance-research-paper",
    title: "Diagnostic Surveillance in Devolved Systems",
    subtitle: "Peer-reviewed research paper",
    description:
      "A research paper examining diagnostic surveillance coverage across devolved county systems, with a proposed minimum data set for national reporting.",
    format: "Research Paper",
    category: "Governance",
    price_kes: 0,
    is_digital: true,
    is_free: true,
    pages: 18,
    published_year: 2026,
    cover_image_url: null,
    collections: ["systems-and-governance", "climate-and-health"],
    status: "published",
  },
];

export const collectionBySlug = (slug?: string) => COLLECTIONS.find((c) => c.slug === slug);
