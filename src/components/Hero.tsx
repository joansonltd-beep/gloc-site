import Image from "next/image";
import type { SiteSettings } from "@/lib/siteData";

// Agent-led hero (spec.md §9). Transparent so the page's warm wash shows through.
export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative grid items-center gap-8 sm:gap-10 md:grid-cols-2">
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
          <a
            href="#router"
            className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-light active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Find what fits me
          </a>
          <a
            href="/about"
            className="rounded-lg border border-slate-300 bg-white/70 px-5 py-3 text-sm font-semibold text-brand transition hover:border-brand active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Meet your adviser
          </a>
        </div>
      </div>

      <div className="order-first md:order-last">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark ring-1 ring-white/10">
          {settings.headshotUrl ? (
            <Image
              src={settings.headshotUrl}
              alt={`${settings.agentName}, ${settings.agentTagline}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/70">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl">
                  📷
                </div>
                <p className="text-sm">{settings.agentName}</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-dark/90 to-transparent p-5">
            <p className="text-lg font-semibold text-white">{settings.agentName}</p>
            <p className="text-sm text-white/70">{settings.agentTagline}</p>
          </div>
        </div>

        {settings.glocAffiliationLine ? (
          <p className="mt-3 text-xs text-slate-500">
            {settings.glocAffiliationLine}
          </p>
        ) : null}
      </div>
    </section>
  );
}
