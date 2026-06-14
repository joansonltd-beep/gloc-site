import { whatsappLink } from "@/config/site";

// Shared CTA used by every tool result. Uses the placeholder number for now;
// M3 wires the real WhatsApp lead flow + lead capture (spec.md §8).
export default function WhatsAppCTA({
  message,
  label = "Talk it through on WhatsApp",
}: {
  message: string;
  label?: string;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-brand-dark transition hover:bg-accent-dark sm:w-auto"
    >
      {label}
    </a>
  );
}
