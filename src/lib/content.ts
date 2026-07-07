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
    title: "Protect",
    href: "/protect",
    lines: "Life · Health · Critical Illness",
    intent: "Keep my family safe",
  },
  {
    key: "grow",
    title: "Grow",
    href: "/grow",
    lines: "Pension/Annuities · Investments",
    intent: "Build wealth, beat inflation",
  },
  {
    key: "assets",
    title: "Assets",
    href: "/assets",
    lines: "Motor · Home · Property",
    intent: "Insure what I own",
  },
  {
    key: "business",
    title: "Business",
    href: "/business",
    lines: "Group / employee benefits",
    intent: "Cover my team",
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
      blurb:
        "Replace your income so the people who depend on you keep their home, their plans and their lifestyle if you're not there.",
    },
    {
      title: "Health",
      icon: "health",
      blurb:
        "Private treatment in Trinidad & Tobago adds up fast. Health cover closes the gap between public waitlists and the care you'd actually want.",
    },
    {
      title: "Critical Illness",
      icon: "critical-illness",
      blurb:
        "A tax-free lump sum on diagnosis of cancer, heart attack, stroke and more, so you can focus on recovery instead of bills.",
    },
    {
      title: "Personal Accident",
      icon: "personal-accident",
      blurb:
        "A cash benefit if an accident causes injury, disability or death. It pays on top of your other cover, at work, on the road and at play.",
    },
  ],
  grow: [
    {
      title: "Pension / Annuities",
      icon: "pension-annuities",
      blurb:
        "Turn today's savings into a steady income for retirement, and keep more of it with tax-advantaged contributions.",
    },
    {
      title: "Investments / Mutual Funds",
      icon: "investments-mutual-funds",
      blurb:
        "Invest across diversified funds so your money grows ahead of inflation instead of sitting still in an account.",
    },
  ],
  assets: [
    {
      title: "Motor",
      icon: "motor",
      blurb:
        "Comprehensive and third-party cover for your vehicle, with claims handled by people who pick up the phone.",
    },
    {
      title: "Home",
      icon: "home",
      blurb:
        "Protect your house and its contents against fire, flood, storm and theft.",
    },
    {
      title: "Property",
      icon: "property",
      blurb:
        "Cover for landlords and additional properties, from rental units to commercial space.",
    },
  ],
  business: [
    {
      title: "Group / Employee Benefits",
      icon: "group-employee-benefits",
      blurb:
        "Group health, life and pension benefits that help you attract and keep good staff, for a team of any size.",
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
  { title: "Protect my family", subtitle: "Life, health & critical illness", href: "/protect" },
  { title: "Plan retirement & grow my money", subtitle: "Pension, annuities & investments", href: "/grow" },
  { title: "Insure my car, home or property", subtitle: "Motor, home & property cover", href: "/assets" },
  { title: "Cover my business & staff", subtitle: "Group & employee benefits", href: "/business" },
  { title: "Not sure? Help me figure it out", subtitle: "Answer 4 quick questions", discovery: true },
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

// Returns 2–3 recommended lines, each with a one-line reason (spec.md §6).
export function recommend(a: DiscoveryAnswers): Recommendation[] {
  const scored: (Recommendation & { weight: number })[] = [];

  if (a.dependents === "yes") {
    scored.push({
      weight: 10,
      line: "Life Insurance",
      cluster: "protect",
      href: "/protect",
      why: "Your dependents would keep their lifestyle if your income stopped.",
    });
    scored.push({
      weight: 7,
      line: "Critical Illness",
      cluster: "protect",
      href: "/protect",
      why: "A lump sum covers treatment and bills if a major illness hits.",
    });
  }

  if (a.lifeStage === "retiring") {
    scored.push({
      weight: 9,
      line: "Pension / Annuities",
      cluster: "grow",
      href: "/grow",
      why: "Turn your savings into a steady income that outlasts inflation.",
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
      line: "Group / Employee Benefits",
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

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I always thought insurance was for ‘later.’ She showed me what a plan actually costs at my age, and I signed up the same week.",
    person: "Kerry-Ann, 29 · Port of Spain",
    line: "Life + Critical Illness",
  },
  {
    quote:
      "We just bought our first home. Getting life and property cover sorted in one conversation took the stress right off.",
    person: "Marlon & Aaliyah, 33 · San Fernando",
    line: "Home + Life",
  },
  {
    quote:
      "He set up group benefits for my eight staff without the usual runaround. My team noticed straight away.",
    person: "Devon, 41 · Chaguanas",
    line: "Group Benefits",
  },
];

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
    tagline: "Replace your income so your family keeps going if you can't.",
    what: [
      "Life insurance pays a lump sum to the people you choose if you pass away. It replaces the income they relied on, so the mortgage still gets paid, the children stay in school and daily life carries on.",
      "You choose the amount of cover and how long it runs. Term plans cover a set number of years at a lower cost; whole-life plans last for life and can build cash value over time.",
    ],
    why: [
      "Your family keeps their home and lifestyle instead of facing forced changes.",
      "It clears debts like a mortgage or car loan so they aren't left behind.",
      "It costs less the younger and healthier you are when you start.",
      "The payout is generally tax-free in Trinidad & Tobago.",
    ],
    calculator: "protection",
  },
  {
    slug: "health",
    clusterKey: "protect",
    title: "Health",
    tagline: "Get the care you want without the public waitlist.",
    what: [
      "Health insurance covers the cost of private medical care: doctor visits, tests, surgery, hospital stays and more. It closes the gap between the public system and the timing and comfort of private treatment.",
      "Plans range from basic hospital cover to full plans that include specialists, prescriptions and overseas treatment.",
    ],
    why: [
      "Private treatment in Trinidad & Tobago is expensive to pay for out of pocket.",
      "You skip long waitlists for surgery and specialist care.",
      "It protects your savings from a sudden medical bill.",
      "Premiums are lower while you are young and healthy.",
    ],
    calculator: "protection",
  },
  {
    slug: "critical-illness",
    clusterKey: "protect",
    title: "Critical Illness",
    tagline: "A cash lump sum on diagnosis, so you can focus on getting better.",
    what: [
      "Critical illness cover pays a tax-free lump sum if you are diagnosed with one of the covered conditions, such as cancer, heart attack or stroke. The money is yours to use however you need: treatment, bills, time off work or care.",
      "It pays out on diagnosis and is separate from health insurance, which only covers medical costs.",
    ],
    why: [
      "Treating a major illness can cost hundreds of thousands of dollars.",
      "It replaces your income while you are unable to work.",
      "It covers costs health insurance will not, like home help or travel for treatment.",
      "Many of us will face a serious illness at some point in our lives.",
    ],
    calculator: "critical-illness",
  },
  {
    slug: "personal-accident",
    clusterKey: "protect",
    title: "Personal Accident",
    tagline: "A cash benefit if an accident injures or disables you.",
    what: [
      "Personal accident cover pays out if an accident causes injury, disability or death. It is straightforward, affordable cover that sits on top of your other policies.",
      "Benefits can include a lump sum for permanent disability, a weekly income while you recover, and cover for medical expenses.",
    ],
    why: [
      "Accidents happen at work, on the road and at home.",
      "It pays on top of any health or life cover you already have.",
      "It is affordable, with cover that starts quickly and little paperwork.",
      "It gives you an income cushion while you recover.",
    ],
    calculator: null,
  },
  {
    slug: "pension-annuities",
    clusterKey: "grow",
    title: "Pension / Annuities",
    tagline: "Turn today's savings into a steady income for retirement.",
    what: [
      "A pension or annuity plan helps you build a pot of money during your working years, then turns it into a regular income when you retire.",
      "Certain plans, registered as deferred annuities with the Board of Inland Revenue, come with real tax breaks. You can claim a yearly tax deduction on the premiums you pay, up to TT$60,000 a year. That limit covers all of your pension contributions together, including your NIS payments.",
      "When you reach your chosen retirement age, you can take up to 25% of your built-up fund as a tax-free lump sum, with the rest paid to you as a regular income. That is a welcome cash boost right when retirement begins.",
    ],
    why: [
      "The state pension alone rarely covers the lifestyle you want.",
      "Claim up to TT$60,000 a year in tax deductions on your contributions.",
      "Take up to 25% of your fund as a tax-free lump sum at retirement.",
      "Starting early lets compounding do most of the work, ahead of inflation.",
    ],
    calculator: "pension",
  },
  {
    slug: "investments-mutual-funds",
    clusterKey: "grow",
    title: "Investments / Mutual Funds",
    tagline: "Grow your money ahead of inflation.",
    what: [
      "Investing puts your money into a mix of assets through mutual funds so it can grow over time. A fund spreads your money across many investments, which lowers the risk of any single one.",
      "You can invest a lump sum, contribute monthly, or both, and choose a fund that matches how much risk you are comfortable with.",
    ],
    why: [
      "Money left in a regular account loses value to inflation.",
      "Diversified funds spread the risk for you.",
      "You can start with a small monthly amount and build over time.",
      "Your money stays accessible compared with locked-in savings.",
    ],
    calculator: "investment",
  },
  {
    slug: "motor",
    clusterKey: "assets",
    title: "Motor",
    tagline: "Cover your vehicle, with claims handled properly.",
    what: [
      "Motor insurance covers your vehicle against accidents, theft and damage, and covers your liability to others. Third-party is the legal minimum; comprehensive also covers your own vehicle.",
      "Your premium depends on the vehicle, how you use it and your driving history.",
    ],
    why: [
      "Third-party cover is required by law to drive in Trinidad & Tobago.",
      "Comprehensive protects the cost of repairing or replacing your own vehicle.",
      "It covers you if you injure someone or damage their property.",
      "A good agent makes claims faster and less stressful.",
    ],
    calculator: "quick-quote",
  },
  {
    slug: "home",
    clusterKey: "assets",
    title: "Home",
    tagline: "Protect your home and everything in it.",
    what: [
      "Home insurance covers your house and its contents against risks like fire, flood, storm and theft. You can cover the building, the contents, or both.",
      "Cover is based on the cost to rebuild and replace, not the market price of the property.",
    ],
    why: [
      "Your home is likely the biggest thing you own.",
      "Local risks like flooding and storms are real and costly.",
      "It covers your belongings, not just the structure.",
      "It is often required if you have a mortgage.",
    ],
    calculator: "quick-quote",
  },
  {
    slug: "property",
    clusterKey: "assets",
    title: "Property",
    tagline: "Cover for landlords and additional properties.",
    what: [
      "Property cover protects buildings you own beyond your main home, such as rental units or commercial space.",
      "It can include the building, loss of rental income, and your liability to tenants or visitors.",
    ],
    why: [
      "It protects an income-producing asset.",
      "It covers loss of rent if the property becomes uninhabitable.",
      "It covers your liability as a landlord.",
      "It keeps your investment safe from fire, flood and storm.",
    ],
    calculator: "quick-quote",
  },
  {
    slug: "group-employee-benefits",
    clusterKey: "business",
    title: "Group / Employee Benefits",
    tagline: "Look after your team with cover that scales.",
    what: [
      "Group benefits provide health, life and pension cover for your employees under one plan. They are usually cheaper per person than individual cover and easier to manage.",
      "You choose the mix of benefits and how much the company contributes.",
    ],
    why: [
      "Good benefits help you attract and keep strong staff.",
      "Group rates are typically lower than individual cover.",
      "It shows your team you are invested in them.",
      "It scales as your business grows.",
    ],
    calculator: "group",
  },
];
