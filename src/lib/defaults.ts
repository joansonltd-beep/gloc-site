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

export type AboutData = { teaser: string };

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
};
