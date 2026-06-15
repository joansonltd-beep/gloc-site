import Image from "next/image";
import type { SiteSettings } from "@/lib/siteData";

// Agent-led hero (spec.md §9) — bold Guardian-purple brand band with the swoosh.
export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-light via-brand to-brand-dark text-white">
      {/* Swoosh strip across the top. */}
      <span className="absolute inset-x-0 top-0 h-1.5 bg-swoosh" />
      {/* Warm decorative glows. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-sun/20 blur-3xl"
      />

      <div className="relative grid items-center gap-8 p-7 sm:gap-10 sm:p-10 md:grid-cols-2 lg:p-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-sun" />
            {settings.heroEyebrow}
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {settings.heroHeadline}
          </h1>

          <span className="mt-4 block h-1.5 w-24 rounded-full bg-swoosh" />

          <p className="mt-4 max-w-prose text-lg text-white/80">
            {settings.heroSubcopy}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#router"
              className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-brand-dark transition hover:bg-sun active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-sun focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
            >
              Find what fits me
            </a>
            <a
              href="/about"
              className="rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
            >
              Meet your adviser
            </a>
          </div>
        </div>

        <div className="order-first md:order-last">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15">
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
                  <p className="text-sm">Agent headshot</p>
                  <p className="text-xs text-white/50">
                    upload in Studio → Site settings
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-dark/90 to-transparent p-5">
              <p className="text-lg font-semibold text-white">{settings.agentName}</p>
              <p className="text-sm text-white/70">{settings.agentTagline}</p>
            </div>
          </div>

          {settings.glocAffiliationLine ? (
            <p className="mt-3 text-xs text-white/60">
              {settings.glocAffiliationLine}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
