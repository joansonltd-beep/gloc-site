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
  professionalDescription: "",
  footerDisclaimer:
    "This website is for general information only and is not financial advice. Contact us to discuss cover suited to your needs.",
  agentName: "Joanson Baptiste James",
  agentTagline: "Life. Family. Future.",
  heroEyebrow: "A conversation for your life in Jamaica",
  heroHeadline: "Life moves forward. Plan for it.",
  heroSubcopy:
    "For your family, your home and the years ahead. Let's make sense of your insurance and financial planning questions, one conversation at a time.",
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
    "I am Joanson Baptiste James. I help you think through the questions that connect your money, your family and your future.",
  storyParagraphs: [
    "Your plans start with the people and commitments in your life. Family expenses, education, a home and retirement all deserve a place in the conversation.",
    "My approach is to listen first. We talk about what matters to you, what you already have in place and the questions you need answered before deciding on a next step.",
    "This website is a starting point for people in Jamaica. Explore the guides, try the planning tools, or book a conversation. We can discuss availability and the appropriate next steps for your situation.",
  ],
  credentials: [],
  videoUrl: "",
  videoFileUrl: null,
  photoUrl: null,
};
