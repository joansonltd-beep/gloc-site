"use client";

import Link from "next/link";
import { captureLead } from "@/lib/leadCapture";
import { useWhatsAppLink } from "@/components/SiteSettingsProvider";

// Sticky bottom action bar on phones: Book a consultation + WhatsApp.
// Hidden on >= sm, where the WhatsApp float button is shown instead.
export default function MobileCtaBar() {
  const whatsappLink = useWhatsAppLink();
  const message = "Hi, I'd like to ask about insurance cover.";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:hidden">
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
        onClick={() => captureLead({ source: "mobile-bar", message })}
        className="flex-1 rounded-lg bg-[#25D366] px-4 py-3 text-center text-sm font-semibold text-white"
      >
        WhatsApp
      </a>
    </div>
  );
}
