import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/siteData";
import AdsConversion from "@/components/AdsConversion";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Joanson Baptiste James, insurance agent in Trinidad & Tobago. WhatsApp, mobile, office phone, Facebook and Instagram.",
};

// Confirmed with the agent.
const MOBILE_DISPLAY = "868-723-6644";
const MOBILE_INTL = "18687236644";
const OFFICE_DISPLAY = "868-226-6726";
const OFFICE_INTL = "18682266726";

type Method = {
  label: string;
  value: string;
  href: string;
  icon: string;
  external?: boolean;
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const waLink = `https://wa.me/${MOBILE_INTL}?text=${encodeURIComponent(
    "Hi, I'd like to know more about your insurance services."
  )}`;

  const methods: Method[] = [
    { label: "WhatsApp", value: MOBILE_DISPLAY, href: waLink, icon: "💬", external: true },
    { label: "Mobile", value: MOBILE_DISPLAY, href: `tel:+${MOBILE_INTL}`, icon: "📱" },
    { label: "Office (Tel)", value: OFFICE_DISPLAY, href: `tel:+${OFFICE_INTL}`, icon: "☎️" },
  ];
  if (settings.facebookUrl)
    methods.push({ label: "Facebook", value: "Message us on Facebook", href: settings.facebookUrl, icon: "f", external: true });
  if (settings.instagramUrl)
    methods.push({ label: "Instagram", value: "Follow us on Instagram", href: settings.instagramUrl, icon: "◎", external: true });

  return (
    <div className="space-y-10">
      <AdsConversion sendTo="AW-18282133568/QM1DCMyU7sccEMDwzI1E" />
      <header className="max-w-2xl">
        <span className="block h-1.5 w-24 rounded-full bg-swoosh" />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">Contact us</h1>
        <p className="mt-3 text-lg text-slate-600">
          Reach out any time, WhatsApp is usually fastest. No pressure, just a straightforward conversation about
          your cover.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {methods.map((m) => (
          <a
            key={m.label}
            href={m.href}
            target={m.external ? "_blank" : undefined}
            rel={m.external ? "noopener noreferrer" : undefined}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-xl font-semibold text-brand">
              {m.icon}
            </span>
            <span className="min-w-0">
              <span className="block text-sm text-slate-500">{m.label}</span>
              <span className="block truncate font-semibold text-slate-800">{m.value}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
