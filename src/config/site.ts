// Pure WhatsApp link builder. The number is supplied by the caller (it comes
// from Sanity site settings via SiteSettingsProvider), so nothing is hardcoded
// here (spec.md §8, §11).

export function buildWhatsAppLink(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
