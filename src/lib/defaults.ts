// Bundled default content (seed source + offline fallback). Plain module so
// both the server data layer (siteData.ts) and the seed script can import it.

export type SiteSettings = {
  whatsappNumber: string;
  glocAffiliationLine: string;
  footerDisclaimer: string;
  agentName: string;
  agentTagline: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubcopy: string;
  headshotUrl: string | null;
  logoUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  xUrl: string | null;
};

export type AboutData = {
  teaser: string;
  storyParagraphs: string[]; // fallback story when Sanity has no rich text
  credentials: string[];
  videoUrl: string;
  videoFileUrl: string | null; // uploaded video file, preferred over videoUrl
  photoUrl: string | null; // About-page photo; falls back to the headshot
  story?: unknown[] | null; // Sanity portable text, preferred over storyParagraphs
};

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1868XXXXXXX",
  glocAffiliationLine: "Guardian Life Sales Representative",
  footerDisclaimer:
    "This website is for general information only and is not financial advice. Contact us to discuss cover suited to your needs.",
  agentName: "Joanson Baptiste James",
  agentTagline: "Insurance Agent",
  heroEyebrow: "Insurance Agent · Trinidad & Tobago",
  heroHeadline: "Protect what you've built. Plan for what's next.",
  heroSubcopy:
    "I help individuals, families and business owners across Trinidad and Tobago protect what they have worked hard for, and plan ahead for the goals still in front of them. Let's look at your options together.",
  headshotUrl: null,
  logoUrl: null,
  facebookUrl: null,
  instagramUrl: null,
  linkedinUrl: null,
  tiktokUrl: null,
  youtubeUrl: null,
  xUrl: null,
};

// Calculator rates (decimals). Editable in Sanity (entered there as percents).
export type CalculatorSettings = {
  investmentLowReturn: number; // "cautious"
  investmentHighReturn: number; // "optimistic"
  pensionSavingsReturn: number;
  pensionStructuredReturn: number;
  pensionInflation: number;
};

export const DEFAULT_CALCULATOR: CalculatorSettings = {
  investmentLowReturn: 0.025, // 2.5%/yr
  investmentHighReturn: 0.08, // 8%/yr
  pensionSavingsReturn: 0.01, // 1%/yr
  pensionStructuredReturn: 0.06, // 6%/yr
  pensionInflation: 0.04, // 4%/yr
};

// Critical-illness condition costs, TT$ (spec.md §10 placeholders, verify locally).
// Conditions without a procedure price are ongoing-care / income-replacement and
// carry a note instead of a figure.
export type IllnessCost = {
  condition: string;
  costLow: number | null;
  costHigh: number | null;
  unit: "total" | "year" | "day";
  note: string;
};

export const DEFAULT_ILLNESS_COSTS: IllnessCost[] = [
  { condition: "Cancer", costLow: 70_000, costHigh: 1_360_000, unit: "total", note: "Full chemotherapy / radiation / surgery course; varies by type and stage." },
  { condition: "Heart Attack", costLow: 475_000, costHigh: 1_360_000, unit: "total", note: "Angioplasty/stent or bypass surgery." },
  { condition: "Coronary Artery Disease Surgery", costLow: 475_000, costHigh: 1_360_000, unit: "total", note: "Coronary bypass (CABG)." },
  { condition: "Heart Valve & Structural Surgery", costLow: 540_000, costHigh: 1_360_000, unit: "total", note: "Valve repair or replacement." },
  { condition: "Aorta Surgery", costLow: 340_000, costHigh: 1_020_000, unit: "total", note: "Aneurysm / aorta repair." },
  { condition: "Benign Brain Tumor", costLow: 340_000, costHigh: 1_020_000, unit: "total", note: "Craniotomy / removal surgery." },
  { condition: "Major Organ Transplant", costLow: 100_000, costHigh: 3_000_000, unit: "total", note: "Often performed overseas; cost varies widely by organ and country." },
  { condition: "Major Burns", costLow: 340_000, costHigh: 1_360_000, unit: "total", note: "Severe burns: ICU, grafts and rehabilitation." },
  { condition: "Stroke", costLow: 200_000, costHigh: 820_000, unit: "total", note: "Acute treatment plus rehabilitation." },
  { condition: "Coma", costLow: 20_000, costHigh: 68_000, unit: "day", note: "Prolonged intensive care, charged per day." },
  { condition: "Deafness", costLow: 200_000, costHigh: 680_000, unit: "total", note: "Cochlear implant, surgery and rehabilitation." },
  { condition: "Kidney Failure", costLow: 180_000, costHigh: 180_000, unit: "year", note: "Ongoing dialysis (~TT$15,000/month)." },
  { condition: "Paralysis", costLow: 680_000, costHigh: 680_000, unit: "total", note: "First-year care; lifetime costs are higher." },
  { condition: "Loss of Limbs", costLow: 34_000, costHigh: 475_000, unit: "total", note: "Surgery plus prosthetics and rehabilitation." },
  { condition: "Blindness", costLow: null, costHigh: null, unit: "total", note: "Aids, adaptation and income replacement; varies." },
  { condition: "Loss of Speech", costLow: null, costHigh: null, unit: "total", note: "Therapy and income replacement; varies." },
  { condition: "Multiple Sclerosis", costLow: null, costHigh: null, unit: "total", note: "Ongoing medication and care over many years; varies." },
  { condition: "Motor Neuron Disease", costLow: null, costHigh: null, unit: "total", note: "Ongoing care and equipment; varies." },
  { condition: "Permanent Disablement", costLow: null, costHigh: null, unit: "total", note: "Income replacement based on your earnings." },
  { condition: "Alzheimer's Disease", costLow: null, costHigh: null, unit: "total", note: "Long-term care over years; varies." },
  { condition: "Parkinson's Disease", costLow: null, costHigh: null, unit: "total", note: "Ongoing medication and care; varies." },
];

export const DEFAULT_ABOUT: AboutData = {
  teaser:
    "an independent insurance agent based in Trinidad & Tobago, helping young professionals and families make good decisions about their money and their cover.",
  storyParagraphs: [
    "I grew up here and I have seen how often good people get caught out by costs they never planned for. A medical bill, a car accident, a parent who outlives their savings. That is what got me into this work.",
    "I am an insurance agent with Guardian Life of the Caribbean. That means I sit on your side of the table, walk you through the options in plain language, and help you choose cover that fits your life and your budget. No pressure, no jargon.",
    "Whether you are just starting out, raising a family, or running a business, I am happy to talk it through. Reach out any time and we will figure out the right next step together.",
  ],
  credentials: [
    "Licensed life and health insurance agent",
    "Authorized Guardian Representative",
    "Based in Trinidad & Tobago",
  ],
  videoUrl: "",
  videoFileUrl: null,
  photoUrl: null,
};
