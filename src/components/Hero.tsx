import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/siteData";
import { buildWhatsAppLink } from "@/config/site";

// Agent-led hero (spec.md §9). Compact and text-led so the Needs-Router is
// reachable quickly; the photo is a supporting element, not the whole screen.
export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {settings.heroEyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-brand sm:text-5xl">
          {settings.heroHeadline}
        </h1>

        <span className="mt-4 block h-1.5 w-24 rounded-full bg-swoosh" />

        <p className="mt-4 max-w-prose text-lg text-slate-600">
          {settings.heroSubcopy}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/book"
            className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Book a consultation
          </Link>
          <a
            href={buildWhatsAppLink(
              settings.whatsappNumber,
              "Hi, I'd like to ask about insurance cover."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 bg-white/70 px-5 py-3 text-sm font-semibold text-brand transition hover:border-brand active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Message on WhatsApp
          </a>
          <a
            href="#router"
            className="px-2 py-3 text-sm font-semibold text-accent-dark hover:underline"
          >
            Or find what fits me ↓
          </a>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[200px] sm:max-w-[240px] md:max-w-none">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark ring-1 ring-white/10">
          {settings.headshotUrl ? (
            <Image
              src={settings.headshotUrl}
              alt={settings.agentName}
              fill
              priority
              sizes="(max-width: 768px) 240px, 320px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/70">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl">
                  📷
                </div>
                <p className="text-sm">{settings.agentName}</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-dark/90 to-transparent p-4">
            <p className="font-semibold text-white">{settings.agentName}</p>
            <p className="text-xs text-white/70">{settings.agentTagline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
