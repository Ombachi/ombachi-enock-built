import type { Collection } from "./types";

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
  {
    slug: "writing",
    title: "Writing & Insights",
    description: "Published essays and articles, kept in the Library as readable publications.",
  },
];

export const collectionBySlug = (slug?: string) => COLLECTIONS.find((c) => c.slug === slug);
