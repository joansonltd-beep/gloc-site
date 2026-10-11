import type { Metadata } from "next";
import Link from "next/link";
import { buildWhatsAppLink } from "@/config/site";
import { getSiteSettings } from "@/lib/siteData";
import { Chat, Mobile, Facebook, Instagram } from "@/components/icons";
export const metadata: Metadata = {
  title: "Contact Bulwark | Insurance Agency Jamaica",
  description:
    "Contact Bulwark Insurance Agency Ltd for independent insurance guidance across Jamaica. Call, message on WhatsApp or book a consultation.",
  alternates: { canonical: "/contact" },
};
export default async function ContactPage() {
  const settings = await getSiteSettings();
  const number = settings.whatsappNumber.replace(/\D/g, "");
  const display =
    number.length === 11 && number.startsWith("1")
      ? `+1 ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`
      : `+${number}`;
  const methods = [
    {
      label: "WhatsApp",
      value: "Send a message",
      href: buildWhatsAppLink(
        number,
        "Hi Joanson, I'd like to discuss my planning questions.",
      ),
      icon: Chat,
      external: true,
    },
    {
      label: "Phone",
      value: display,
      href: `tel:+${number}`,
      icon: Mobile,
      external: false,
    },
  ];
  if (settings.facebookUrl)
    methods.push({
      label: "Facebook",
      value: "Connect on Facebook",
      href: settings.facebookUrl,
      icon: Facebook,
      external: true,
    });
  if (settings.instagramUrl)
    methods.push({
      label: "Instagram",
      value: "Connect on Instagram",
      href: settings.instagramUrl,
      icon: Instagram,
      external: true,
    });
  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand">
          Insurance guidance across Jamaica.
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-slate-600">
          Message or call me to start a conversation. If you prefer to choose a
          time, you can book online.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {methods.map((m) => (
          <a
            key={m.label}
            href={m.href}
            target={m.external ? "_blank" : undefined}
            rel={m.external ? "noopener noreferrer" : undefined}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 transition hover:border-brand"
          >
            <m.icon className="h-7 w-7 text-brand" />
            <span>
              <span className="block text-sm text-slate-500">{m.label}</span>
              <span className="mt-1 block font-semibold text-brand">
                {m.value}
              </span>
            </span>
          </a>
        ))}
      </div>
      <Link href="/book" className="button-primary">
        Book a consultation <span aria-hidden>↗</span>
      </Link>
    </div>
  );
}
