// Dummy content + placeholder discovery logic for M1.
// All of this moves into Sanity in M4. Keep it centralized so the swap is clean.

export type ClusterKey = "protect" | "grow" | "business";

export type Cluster = {
  key: ClusterKey;
  title: string;
  href: string;
  lines: string;
  intent: string;
};

export const CLUSTERS: Cluster[] = [
  {
    key: "protect",
    title: "Family & health",
    href: "/protect",
    lines: "Life, health and critical illness",
    intent: "Compare cover for the people who depend on you.",
  },
  {
    key: "grow",
    title: "Your future",
    href: "/grow",
    lines: "Retirement, savings and investments",
    intent: "Review retirement and savings options in Jamaica.",
  },
  {
    key: "business",
    title: "Group coverage",
    href: "/business",
    lines: "Life, health and pensions",
    intent: "Compare life, health and pension benefits for your team.",
  },
];

// Lines within each cluster, shown as sections on the hub pages (spec.md §4, §11).
// Dummy blurbs, move to Sanity in M4.
export type Line = { title: string; blurb: string; icon: string };

export const LINES: Record<ClusterKey, Line[]> = {
  protect: [
    {
      title: "Life Insurance",
      icon: "life-insurance",
      blurb: "Plan for the people who depend on your income.",
    },
    {
      title: "Health",
      icon: "health",
      blurb: "Understand what a health policy would cover.",
    },
    {
      title: "Critical Illness",
      icon: "critical-illness",
      blurb: "Prepare questions about a serious illness.",
    },
    {
      title: "Personal Accident",
      icon: "personal-accident",
      blurb: "Understand the financial impact of an accident.",
    },
  ],
  grow: [
    {
      title: "Pensions and annuities",
      icon: "pension-annuities",
      blurb: "Think about income for the years after work.",
    },
    {
      title: "Investments and mutual funds",
      icon: "investments-mutual-funds",
      blurb: "Connect your savings to your goals.",
    },
  ],
  business: [
    {
      title: "Group coverage",
      icon: "group-employee-benefits",
      blurb: "Discuss life, health and pension coverage for your employees.",
    },
  ],
};

// Step 1 of the Needs-Discovery Router (spec.md §6).
export type RouterCard = {
  title: string;
  subtitle: string;
  href?: string; // three cards link out; the fourth opens the discovery flow
  discovery?: boolean;
};

export const ROUTER_CARDS: RouterCard[] = [
  {
    title: "Protect my family",
    subtitle: "Life, health & critical illness",
    href: "/protect",
  },
  {
    title: "Plan for retirement & grow my savings",
    subtitle: "Pensions, annuities & investments",
    href: "/grow",
  },
  {
    title: "Group coverage",
    subtitle: "Life, health and pensions",
    href: "/business",
  },
  {
    title: "Not sure? Help me figure it out",
    subtitle: "Answer three short questions",
    discovery: true,
  },
];

// --- Discovery flow (3 questions) ---------------------------------------
// Placeholder logic only. Real recommendations get refined later.

export type DiscoveryAnswers = {
  lifeStage: "starting" | "building" | "family" | "retiring";
  dependents: "yes" | "no";
  business: "yes" | "no";
};

export type DiscoveryQuestion = {
  key: keyof DiscoveryAnswers;
  question: string;
  options: { value: string; label: string }[];
};

export const DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  {
    key: "lifeStage",
    question: "Where are you in life right now?",
    options: [
      { value: "starting", label: "Just starting out" },
      { value: "building", label: "Building my career" },
      { value: "family", label: "Raising a family" },
      { value: "retiring", label: "Approaching retirement" },
    ],
  },
  {
    key: "dependents",
    question: "Does anyone depend on your income?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "business",
    question: "Do you own a business?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
];

export type Recommendation = {
  line: string;
  cluster: ClusterKey;
  href: string;
  why: string;
};

// Returns 2 to 3 recommended lines, each with a one-line reason (spec.md §6).
export function recommend(a: DiscoveryAnswers): Recommendation[] {
  const scored: (Recommendation & { weight: number })[] = [];

  if (a.dependents === "yes") {
    scored.push({
      weight: 10,
      line: "Life Insurance",
      cluster: "protect",
      href: "/protect",
      why: "Think through the commitments your family would need to meet.",
    });
    scored.push({
      weight: 7,
      line: "Critical Illness",
      cluster: "protect",
      href: "/protect",
      why: "Review how a serious illness could affect your household budget.",
    });
  }

  if (a.lifeStage === "retiring") {
    scored.push({
      weight: 9,
      line: "Pensions and annuities",
      cluster: "grow",
      href: "/grow",
      why: "Explore retirement income and the assumptions behind it.",
    });
  }

  if (a.lifeStage === "starting" || a.lifeStage === "building") {
    scored.push({
      weight: 6,
      line: "Investments and mutual funds",
      cluster: "grow",
      href: "/grow",
      why: "Start early. Time is your biggest advantage.",
    });
  }

  if (a.business === "yes") {
    scored.push({
      weight: 8,
      line: "Group coverage",
      cluster: "business",
      href: "/business",
      why: "Attract and keep good staff with cover that scales with your team.",
    });
  }

  // Baseline everyone benefits from, lower priority.
  scored.push({
    weight: 4,
    line: "Health Cover",
    cluster: "protect",
    href: "/protect",
    why: "Compare health cover in Jamaica based on your needs, budget and existing benefits.",
  });

  const ranked = scored.sort((x, y) => y.weight - x.weight);

  // De-dupe by line, keep top 3, guarantee at least 2.
  const seen = new Set<string>();
  const picks: Recommendation[] = [];
  for (const r of ranked) {
    if (seen.has(r.line)) continue;
    seen.add(r.line);
    const { weight: _weight, ...rec } = r;
    void _weight;
    picks.push(rec);
    if (picks.length === 3) break;
  }
  return picks;
}

// --- Dummy testimonials (move to Sanity in M4) ---------------------------
export type Testimonial = { quote: string; person: string; line: string };

export const TESTIMONIALS: { quote: string; person: string; line: string }[] =
  [];

// --- Line detail pages (spec.md §4) ------------------------------------
// Each product line gets its own page explaining what it is and why it matters,
// with the relevant calculator. Slugs are derived from line titles.

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type CalculatorKey =
  | "protection"
  | "critical-illness"
  | "pension"
  | "investment"
  | "group"
  | null;

export type LineDetail = {
  slug: string;
  clusterKey: ClusterKey;
  title: string;
  tagline: string;
  what: string[];
  why: string[];
  calculator: CalculatorKey;
};

export const LINE_DETAILS: LineDetail[] = [
  {
    slug: "life-insurance",
    clusterKey: "protect",
    title: "Life Insurance",
    tagline: "Help your family meet everyday commitments, education costs and debts if you die. Compare life insurance options in Jamaica with independent guidance from Joanson.",
    what: ["Life cover can provide a payment to your chosen beneficiaries if the policy conditions are met. We help you compare cover amounts, policy duration, exclusions and premiums across insurer options."],
    why: [
      "Review who depends on your income.",
      "Consider the cover you already have.",
      "Ask about premiums, exclusions and how long the cover lasts.",
    ],
    calculator: "protection",
  },
  {
    slug: "health",
    clusterKey: "protect",
    title: "Health Insurance",
    tagline: "Understand your medical cover and compare health insurance options in Jamaica, including benefits, limits and your share of the costs.",
    what: ["Health insurance can help with eligible medical expenses. We help you compare hospital and outpatient benefits, prescriptions, provider arrangements and exclusions alongside any employer cover."],
    why: [
      "Read the exclusions as well as the benefits.",
      "Check deductibles and annual limits.",
      "Compare with any benefits available through your employer.",
    ],
    calculator: "protection",
  },
  {
    slug: "critical-illness",
    clusterKey: "protect",
    title: "Critical Illness Insurance",
    tagline: "Compare critical illness insurance in Jamaica to help plan for household expenses and recovery after a covered serious illness.",
    what: ["Critical illness cover may pay a benefit when an illness meets the policy definition. We help you compare covered conditions, benefit amounts, waiting periods and how it works with life and health cover."],
    why: [
      "Check the exact definitions of covered conditions.",
      "Ask about waiting and survival periods.",
      "Understand how the benefit fits with existing health cover.",
    ],
    calculator: "critical-illness",
  },
  {
    slug: "personal-accident",
    clusterKey: "protect",
    title: "Personal Accident Insurance",
    tagline: "Compare personal accident cover in Jamaica for specified injuries, disability or accidental death, with practical guidance on benefits and exclusions.",
    what: ["Personal accident insurance may provide benefits for specified accidental injuries, disability or death. We help you understand the benefit schedule, occupation requirements and how it complements your existing cover."],
    why: [
      "Ask which activities are excluded.",
      "Check how benefits are calculated.",
      "Review overlap with any existing policies.",
    ],
    calculator: null,
  },
  {
    slug: "pension-annuities",
    clusterKey: "grow",
    title: "Pensions and Annuities",
    tagline: "Review retirement planning options in Jamaica. Compare pension and annuity arrangements, contributions, fees and access to your money.",
    what: ["Retirement planning connects your future income needs with the savings and benefits already in place. We help you compare pension and annuity options, including contribution arrangements and income choices."],
    why: [
      "Include your household and care commitments.",
      "Ask about fees and access to your money.",
      "Confirm tax treatment with an appropriately qualified professional.",
    ],
    calculator: "pension",
  },
  {
    slug: "investments-mutual-funds",
    clusterKey: "grow",
    title: "Investments and Mutual Funds",
    tagline: "Compare investment and mutual fund options in Jamaica based on your goals, time horizon, fees, access needs and tolerance for risk.",
    what: ["Investment funds pool money under a defined strategy. We help you understand options, costs and risk so you can assess how they fit your goals alongside emergency savings and other commitments."],
    why: [
      "Read the fund documents and fees.",
      "Understand that investment values can fall.",
      "Keep short-term commitments in mind before investing.",
    ],
    calculator: "investment",
  },
  {
    slug: "group-employee-benefits",
    clusterKey: "business",
    title: "Group coverage",
    tagline: "Compare group life, health and pension options in Jamaica. Build employee benefits around your team’s needs and a budget your business can maintain.",
    what: ["Group coverage brings life, health and pension benefits into your employee planning. Joanson helps business owners compare insurer options, eligibility, contributions and administration requirements."],
    why: [
      "Ask who can join and when cover begins.",
      "Understand employer and employee contributions.",
      "Review what happens when someone leaves the team.",
    ],
    calculator: "group",
  },
];
