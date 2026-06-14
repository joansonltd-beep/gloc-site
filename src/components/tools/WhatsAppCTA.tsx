"use client";

import { captureLead, type LeadPayload } from "@/lib/leadCapture";
import { useWhatsAppLink } from "@/components/SiteSettingsProvider";

// Shared CTA used by every tool result (spec.md §8). Opens a WhatsApp deep
// link with the pre-filled message, and records the lead on the way out.
export default function WhatsAppCTA({
  message,
  label = "Talk it through on WhatsApp",
  lead,
}: {
  message: string;
  label?: string;
  lead: Omit<LeadPayload, "message">; // source + any recommended lines / figures
}) {
  const whatsappLink = useWhatsAppLink();
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => captureLead({ ...lead, message })}
      className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-brand-dark transition hover:bg-accent-dark active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:w-auto"
    >
      {label}
    </a>
  );
}
