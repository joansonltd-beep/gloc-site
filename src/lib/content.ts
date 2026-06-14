// Dummy content + placeholder discovery logic for M1.
// All of this moves into Sanity in M4 — keep it centralized so the swap is clean.

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
  { title: "Not sure — help me figure it out", subtitle: "Answer 4 quick questions", discovery: true },
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
    question: "Your home — do you own or rent?",
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
      why: "Start compounding early — time is your biggest advantage.",
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
    why: "Private treatment in T&T adds up fast — close the gap while premiums are low.",
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
      "I always thought insurance was for ‘later.’ She showed me what a plan actually costs at my age — I signed up the same week.",
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
