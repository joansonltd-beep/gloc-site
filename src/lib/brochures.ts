// Official Guardian product brochures (PDFs in /public/brochures).
// `pages` lists the product detail pages ("clusterKey/slug") each brochure
// appears on; the /brochures page shows all of them grouped by category.
// Placement confirmed by the agent. Blurbs stay generic on purpose: no
// features or claims beyond what the brochure itself says.

export type Brochure = {
  slug: string;
  title: string;
  file: string;
  category: string;
  pages: string[];
};

export const BROCHURES: Brochure[] = [
  {
    slug: "flexi-term",
    title: "Flexi Term",
    file: "/brochures/flexi-term.pdf",
    category: "Life Insurance",
    pages: ["protect/life-insurance"],
  },
  {
    slug: "econolife",
    title: "Econolife",
    file: "/brochures/econolife.pdf",
    category: "Life Insurance",
    pages: ["protect/life-insurance"],
  },
  {
    slug: "xpress-life",
    title: "Xpress Life",
    file: "/brochures/xpress-life.pdf",
    category: "Life Insurance",
    pages: ["protect/life-insurance"],
  },
  {
    slug: "family-income-benefit",
    title: "Family Income Benefit",
    file: "/brochures/family-income-benefit.pdf",
    category: "Life Insurance",
    pages: ["protect/life-insurance"],
  },
  {
    slug: "reliance-plan",
    title: "The Reliance Plan",
    file: "/brochures/reliance-plan.pdf",
    category: "Life Insurance",
    pages: [
      "protect/life-insurance",
      "grow/pension-annuities",
      "grow/investments-mutual-funds",
    ],
  },
  {
    slug: "life-evolution",
    title: "Life Evolution",
    file: "/brochures/life-evolution.pdf",
    category: "Life Insurance",
    pages: [
      "protect/life-insurance",
      "protect/health",
      "grow/pension-annuities",
      "grow/investments-mutual-funds",
    ],
  },
  {
    slug: "phoenix-plan",
    title: "Phoenix Plan",
    file: "/brochures/phoenix-plan.pdf",
    category: "Health & Critical Illness",
    pages: ["protect/health", "protect/critical-illness"],
  },
  {
    slug: "praesidia",
    title: "Praesidia",
    file: "/brochures/praesidia.pdf",
    category: "Personal Accident",
    pages: ["protect/personal-accident"],
  },
  {
    slug: "lifestyle-special-edition",
    title: "Lifestyle Special Edition",
    file: "/brochures/lifestyle-special-edition.pdf",
    category: "Pension & Investments",
    pages: ["grow/pension-annuities", "grow/investments-mutual-funds"],
  },
  {
    slug: "ipi",
    title: "IPI",
    file: "/brochures/ipi.pdf",
    category: "Pension & Investments",
    pages: ["grow/pension-annuities", "grow/investments-mutual-funds"],
  },
  {
    slug: "life-secure-individual",
    title: "Life Secure Individual Plan",
    file: "/brochures/life-secure-individual.pdf",
    category: "Pension & Investments",
    pages: ["grow/pension-annuities", "grow/investments-mutual-funds"],
  },
  {
    slug: "life-secure-corporate",
    title: "Life Secure Corporate Plan",
    file: "/brochures/life-secure-corporate.pdf",
    category: "Pension & Investments",
    pages: ["grow/pension-annuities", "grow/investments-mutual-funds"],
  },
];

export function brochuresFor(pageKey: string): Brochure[] {
  return BROCHURES.filter((b) => b.pages.includes(pageKey));
}

// Category display order for the /brochures page.
export const BROCHURE_CATEGORIES = [
  "Life Insurance",
  "Health & Critical Illness",
  "Personal Accident",
  "Pension & Investments",
];
