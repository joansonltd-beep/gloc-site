// Central site config. The WhatsApp number is a PLACEHOLDER and moves to
// Sanity site settings in M4 (spec.md §8, §11). Never hardcode it in components.
// The full WhatsApp lead flow (pre-filled context, float button, lead capture)
// is wired in M3 — this helper is the seam those build on.

export const WHATSAPP_NUMBER = "1868XXXXXXX"; // <-- replace with real number in M3/M4

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const AGENT = {
  name: "Agent Name",
  tagline: "Your Guardian Group Adviser",
  endorsement: "Authorized Guardian Representative",
};
