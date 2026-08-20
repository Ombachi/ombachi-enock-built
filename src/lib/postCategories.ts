export interface PostCategory {
  name: string;
  slug: string;
  description: string;
  gradient: string;
}

export const POST_CATEGORIES: PostCategory[] = [
  {
    name: "Life & Reflection",
    slug: "life-and-reflection",
    description: "Personal reflections on meaning, memory, and the human condition.",
    gradient: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
  },
  {
    name: "Politics & Systems",
    slug: "politics-and-systems",
    description: "How power, policy, and incentives shape the systems we live in.",
    gradient: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  },
  {
    name: "Climate & Health",
    slug: "climate-and-health",
    description: "Climate resilience, planetary health, and diagnostics at the frontline.",
    gradient: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  },
  {
    name: "Governance",
    slug: "governance",
    description: "Institutions, accountability, and the practice of stewardship.",
    gradient: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  },
  {
    name: "Systems Thinking",
    slug: "systems-thinking",
    description: "First principles, feedback loops, and emergent behaviour.",
    gradient: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  },
  {
    name: "Philosophy",
    slug: "philosophy",
    description: "Ideas, ethics, and the frameworks behind how I think and decide.",
    gradient: "from-slate-500/20 to-zinc-500/20 border-slate-500/30",
  },
  {
    name: "Diagnostics & Labs",
    slug: "diagnostics-and-labs",
    description: "Laboratory quality, accreditation, and the craft of diagnostics.",
    gradient: "from-cyan-500/20 to-sky-500/20 border-cyan-500/30",
  },
  {
    name: "Technology & AI",
    slug: "technology-and-ai",
    description: "LIS/EMR, dashboards, AI, and technology-enabled service delivery.",
    gradient: "from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/30",
  },
  {
    name: "Education & Mentorship",
    slug: "education-and-mentorship",
    description: "Teaching, multiplication, and building the next generation.",
    gradient: "from-lime-500/20 to-green-500/20 border-lime-500/30",
  },
];

export const CATEGORY_NAMES = POST_CATEGORIES.map((c) => c.name);

export const categoryBySlug = (slug?: string) =>
  POST_CATEGORIES.find((c) => c.slug === slug);

export const categoryByName = (name?: string | null) =>
  POST_CATEGORIES.find((c) => c.name === name);

export const categorySlug = (name?: string | null) =>
  categoryByName(name)?.slug ??
  (name || "general").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const categoryGradient = (name?: string | null) =>
  categoryByName(name)?.gradient ?? "from-secondary/20 to-secondary/10 border-secondary/30";