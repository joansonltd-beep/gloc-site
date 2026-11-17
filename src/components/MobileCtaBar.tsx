"use client";

import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { captureLead } from "@/lib/leadCapture";
import { useWhatsAppLink } from "@/components/SiteSettingsProvider";

// Sticky bottom action bar on phones: Book a consultation + WhatsApp.
// Hidden on >= sm, where the WhatsApp float button is shown instead.
export default function MobileCtaBar() {
  const whatsappLink = useWhatsAppLink();
  const message = "Hi, I'd like to ask about insurance cover.";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-slate-200 bg-white p-3 backdrop-blur sm:hidden">
      <Link
        href="/book"
        className="flex-1 rounded-lg bg-brand px-4 py-3 text-center text-sm font-semibold text-white"
      >
        Book a consultation
      </Link>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={() => captureLead({ source: "mobile-bar", message })}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#087948] text-white hover:bg-[#06633a] focus-visible:ring-2 focus-visible:ring-[#087948] focus-visible:ring-offset-2"
      >
        <WhatsAppIcon className="h-6 w-6 fill-current" />
      </a>
    </div>
  );
}
