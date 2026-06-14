// Central site config.
//
// WHERE TO PASTE YOUR VALUES (M3):
//   1. Copy `.env.local.example` to `.env.local`
//   2. Set NEXT_PUBLIC_WHATSAPP_NUMBER to your WhatsApp Business number
//      in full international form, digits only, e.g. 18681234567
//   3. Set LEAD_WEBHOOK_URL to your Airtable / Google Sheet webhook URL
//   4. Restart the dev server.
//
// The number stays a config value (never hardcoded in components) and moves
// into Sanity site settings in M4 (spec.md §8, §11).

// Falls back to a clearly-fake placeholder until you set the env value.
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "1868XXXXXXX";

// True once a real (all-digit) number is set, so the UI can adapt if needed.
export const WHATSAPP_CONFIGURED = /^\d{7,15}$/.test(WHATSAPP_NUMBER);

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const AGENT = {
  name: "Agent Name",
  tagline: "Your Guardian Group Adviser",
  endorsement: "Authorized Guardian Representative",
};
