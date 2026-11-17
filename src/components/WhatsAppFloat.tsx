"use client";

import { WhatsAppIcon } from "@/components/icons";
import { captureLead } from "@/lib/leadCapture";
import { useWhatsAppLink } from "@/components/SiteSettingsProvider";

// Persistent WhatsApp float button on every page (spec.md §8).
export default function WhatsAppFloat() {
  const whatsappLink = useWhatsAppLink();
  const message = "Hi, I have a question about insurance and would like to chat.";

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => captureLead({ source: "float-button", message })}
      className="fixed bottom-5 right-5 z-40 hidden h-11 w-11 place-items-center rounded-full bg-[#087948] text-white hover:bg-[#06633a] focus-visible:ring-2 focus-visible:ring-[#087948] focus-visible:ring-offset-2 sm:grid"
    >
      <WhatsAppIcon className="h-6 w-6 fill-current" />
    </a>
  );
}
