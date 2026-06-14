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
};

export type AboutData = {
  teaser: string;
  storyParagraphs: string[]; // fallback story when Sanity has no rich text
  credentials: string[];
  videoUrl: string;
  story?: unknown[] | null; // Sanity portable text, preferred over storyParagraphs
};

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1868XXXXXXX",
  glocAffiliationLine: "Authorized Guardian Representative",
  footerDisclaimer:
    "Disclaimer placeholder. Authorized Guardian Representative (endorsement placeholder; GLOC mark pending written sign-off).",
  agentName: "Agent Name",
  agentTagline: "Your Guardian Group Adviser",
  heroEyebrow: "Insurance for Trinidad & Tobago",
  heroHeadline: "Get the right cover before you need it.",
  heroSubcopy:
    "Protecting your family, growing your money, insuring what you own, or covering your team. Tell me what you need and I'll help you find the right fit.",
};

export const DEFAULT_ABOUT: AboutData = {
  teaser:
    "an independent Guardian Group adviser based in Trinidad & Tobago, helping young professionals and families make good decisions about their money and their cover.",
  storyParagraphs: [
    "I grew up here and I have seen how often good people get caught out by costs they never planned for. A medical bill, a car accident, a parent who outlives their savings. That is what got me into this work.",
    "I am an independent Guardian Group adviser. That means I sit on your side of the table, walk you through the options in plain language, and help you choose cover that fits your life and your budget. No pressure, no jargon.",
    "Whether you are just starting out, raising a family, or running a business, I am happy to talk it through. Reach out any time and we will figure out the right next step together.",
  ],
  credentials: [
    "Licensed life and health insurance adviser",
    "Authorized Guardian Representative",
    "Based in Trinidad & Tobago",
  ],
  videoUrl: "",
};
