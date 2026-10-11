// Bundled default content (seed source + offline fallback). Plain module so
// both the server data layer (siteData.ts) and the seed script can import it.

export type SiteSettings = {
  whatsappNumber: string;
  professionalDescription: string;
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
  whatsappNumber: "18762109898",
  professionalDescription: "Independent Insurance Agency in Jamaica",
  footerDisclaimer:
    "Information on this website is general in nature and does not constitute financial, legal or tax advice. Insurance products, eligibility, terms and pricing vary by insurer and individual circumstances.",
  agentName: "Joanson Baptiste James",
  agentTagline: "Founder and lead advisor, Bulwark Insurance Agency Ltd",
  heroEyebrow: "Independent Insurance Agency in Jamaica",
  heroHeadline: "Protect what you’ve built. Plan for what’s next.",
  heroSubcopy:
    "I help individuals, families and business owners across Jamaica understand their insurance options and choose coverage that fits their needs.",
  headshotUrl:
    "https://cdn.sanity.io/images/83r56hq8/production/70ccac5f33bb6fad5624099bce88930b1918396f-3222x4585.jpg",
  logoUrl: null,
  facebookUrl: "https://www.facebook.com/JoansonBJames",
  instagramUrl: "https://www.instagram.com/joansonbjames/",
  linkedinUrl: "https://www.linkedin.com/in/joanson-baptiste-james-146400137/",
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

// Critical-illness condition costs, J$ (spec.md §10 placeholders, verify locally).
// Conditions without a procedure price are ongoing-care / income-replacement and
// carry a note instead of a figure.
export type IllnessCost = {
  condition: string;
  costLow: number | null;
  costHigh: number | null;
  unit: "total" | "year" | "day";
  note: string;
};

export const DEFAULT_ILLNESS_COSTS: IllnessCost[] = [];

export const DEFAULT_ABOUT: AboutData = {
  teaser:
    "I am Joanson Baptiste James, founder and lead advisor of Bulwark Insurance Agency Ltd, an independent insurance agency serving clients across Jamaica.",
  storyParagraphs: [
    "Bulwark brings independent, client-first guidance to individuals, families and business owners throughout Jamaica. We help you compare options from multiple insurers and understand how each fits your priorities and budget.",
    "My experience in Caribbean financial services shapes a practical approach: listen first, explain clearly and give you room to decide. We review what you already have and discuss benefits, exclusions and costs without unnecessary jargon.",
    "Your needs lead the conversation. Whether you are protecting your family, reviewing retirement options or arranging group benefits, we help you make an informed decision without pressure. Book a consultation or message me on WhatsApp to get started.",
  ],
  credentials: [],
  videoUrl: "",
  videoFileUrl: null,
  photoUrl: null,
};
