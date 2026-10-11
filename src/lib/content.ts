// Dummy content + placeholder discovery logic for M1.
// All of this moves into Sanity in M4. Keep it centralized so the swap is clean.

export type ClusterKey = "protect" | "grow" | "assets" | "business";

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
    intent: "Look after the people who depend on you.",
  },
  {
    key: "grow",
    title: "Your future",
    href: "/grow",
    lines: "Retirement, savings and investments",
    intent: "Make room for the years ahead.",
  },
  {
    key: "assets",
    title: "Home & motor",
    href: "/assets",
    lines: "Your home, vehicle and property",
    intent: "Think through what you own and use.",
  },
  {
    key: "business",
    title: "Group Coverage",
    href: "/business",
    lines: "Life / Health / Pensions",
    intent: "Plan for the people who work with you.",
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
      title: "Pension / Annuities",
      icon: "pension-annuities",
      blurb: "Think about income for the years after work.",
    },
    {
      title: "Investments / Mutual Funds",
      icon: "investments-mutual-funds",
      blurb: "Connect your savings to your goals.",
    },
  ],
  assets: [
    {
      title: "Motor",
      icon: "motor",
      blurb: "Understand the cover for your vehicle.",
    },
    {
      title: "Home",
      icon: "home",
      blurb: "Think through your home and belongings.",
    },
    {
      title: "Property",
      icon: "property",
      blurb: "Consider the risks around rental or commercial property.",
    },
  ],
  business: [
    {
      title: "Group Coverage",
      icon: "group-employee-benefits",
      blurb: "Discuss life, health and pension coverage for your employees.",
    },
  ],
};

// Step 1 of the Needs-Discovery Router (spec.md §6).
export type RouterCard = {
  title: string;
  subtitle: string;
  href?: string; // four cards link out; the fifth opens the discovery flow
  discovery?: boolean;
};

export const ROUTER_CARDS: RouterCard[] = [
  {
    title: "Protect my family",
    subtitle: "Life, health & critical illness",
    href: "/protect",
  },
  {
    title: "Plan retirement & grow my money",
    subtitle: "Pension, annuities & investments",
    href: "/grow",
  },
  {
    title: "Insure my car, home or property",
    subtitle: "Motor, home & property cover",
    href: "/assets",
  },
  {
    title: "Group Coverage",
    subtitle: "Life / Health / Pensions",
    href: "/business",
  },
  {
    title: "Not sure? Help me figure it out",
    subtitle: "Answer 4 quick questions",
    discovery: true,
  },
];

// --- Discovery flow (4 questions) ---------------------------------------
// Placeholder logic only. Real recommendations get refined later.

export type DiscoveryAnswers = {
  lifeStage: "starting" | "building" | "family" | "retiring";
  dependents: "yes" | "no";
  home: "own" | "rent";
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
    key: "home",
    question: "Do you own or rent your home?",
    options: [
      { value: "own", label: "I own" },
      { value: "rent", label: "I rent" },
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
      line: "Pension / Annuities",
      cluster: "grow",
      href: "/grow",
      why: "Explore retirement income and the assumptions behind it.",
    });
  }

  if (a.lifeStage === "starting" || a.lifeStage === "building") {
    scored.push({
      weight: 6,
      line: "Investments / Mutual Funds",
      cluster: "grow",
      href: "/grow",
      why: "Start early. Time is your biggest advantage.",
    });
  }

  if (a.home === "own") {
    scored.push({
      weight: 8,
      line: "Home / Property Cover",
      cluster: "assets",
      href: "/assets",
      why: "Protect the biggest asset you own against fire, flood and theft.",
    });
  }

  if (a.business === "yes") {
    scored.push({
      weight: 8,
      line: "Group Coverage",
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
    why: "Private treatment in T&T adds up fast. Lock in cover while premiums are low.",
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
  | "quick-quote"
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
    tagline: "Plan for the people who depend on your income.",
    what: [
      "Life insurance can provide a benefit to your chosen beneficiaries when you die, subject to the policy terms.",
      "Start with the commitments you would want covered: household bills, debts, education and care for family members.",
    ],
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
    title: "Health",
    tagline: "Understand what a health policy would cover.",
    what: [
      "Health insurance can help with eligible medical expenses. The covered services, limits and your share of the bill depend on the policy.",
      "Ask about hospital treatment, outpatient care, prescriptions, waiting periods and any provider requirements.",
    ],
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
    title: "Critical Illness",
    tagline: "Prepare questions about a serious illness.",
    what: [
      "Critical illness cover can provide a benefit when a condition meets the policy definition. A diagnosis alone may not meet every requirement.",
      "Consider how time away from work, care and household expenses would affect your family.",
    ],
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
    title: "Personal Accident",
    tagline: "Understand the financial impact of an accident.",
    what: [
      "Personal accident policies may provide benefits for specified injuries, disability or death caused by an accident.",
      "The events covered, benefit amounts and exclusions vary by contract. Review the wording for work, travel and other activities.",
    ],
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
    title: "Pension / Annuities",
    tagline: "Think about income for the years after work.",
    what: [
      "Retirement planning starts with the income you may need and the savings and benefits already in place.",
      "Pensions and annuities have different contribution rules, access conditions and income arrangements. Confirm the terms of any option you consider.",
    ],
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
    title: "Investments / Mutual Funds",
    tagline: "Connect your savings to your goals.",
    what: [
      "An investment fund pools money to invest according to a defined strategy. Returns and the value of your investment can change.",
      "Your goals, time period, tolerance for losses and need for access to your money all matter when considering an investment.",
    ],
    why: [
      "Read the fund documents and fees.",
      "Understand that investment values can fall.",
      "Keep short-term commitments in mind before investing.",
    ],
    calculator: "investment",
  },
  {
    slug: "motor",
    clusterKey: "assets",
    title: "Motor",
    tagline: "Understand the cover for your vehicle.",
    what: [
      "Motor policies differ in the liability and vehicle damage they cover. Review the type of cover and the conditions attached to it.",
      "Ask how vehicle use, named drivers, excesses and the claims process affect your policy.",
    ],
    why: [
      "Check what happens after an accident or theft.",
      "Confirm the excess you would need to pay.",
      "Read any restrictions on drivers or vehicle use.",
    ],
    calculator: "quick-quote",
  },
  {
    slug: "home",
    clusterKey: "assets",
    title: "Home",
    tagline: "Think through your home and belongings.",
    what: [
      "Home cover can address risks to a building, its contents or both. The events insured and the exclusions depend on the policy.",
      "Ask how rebuilding costs, contents values and any limits or excesses are assessed.",
    ],
    why: [
      "Check the terms for storm and flood damage.",
      "Review how contents need to be listed or valued.",
      "Ask about any mortgage-related requirements.",
    ],
    calculator: "quick-quote",
  },
  {
    slug: "property",
    clusterKey: "assets",
    title: "Property",
    tagline: "Consider the risks around rental or commercial property.",
    what: [
      "Property cover can address a building used for rental or business purposes. Some policies may include liability or loss of rental income.",
      "Confirm how occupancy, use and maintenance affect the cover before choosing a policy.",
    ],
    why: [
      "Describe how the property is used.",
      "Ask about periods when a property is empty.",
      "Check whether liability and rental income are included.",
    ],
    calculator: "quick-quote",
  },
  {
    slug: "group-employee-benefits",
    clusterKey: "business",
    title: "Group Coverage",
    tagline: "Life / Health / Pensions for your employees.",
    what: [
      "Employee benefit arrangements may include health, life or retirement benefits. Eligibility and available terms depend on the arrangement.",
      "Start with your team, the benefits they already have and a budget your business can maintain.",
    ],
    why: [
      "Ask who can join and when cover begins.",
      "Understand employer and employee contributions.",
      "Review what happens when someone leaves the team.",
    ],
    calculator: "group",
  },
];
