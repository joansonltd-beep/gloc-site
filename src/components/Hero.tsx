import type { SiteSettings } from "@/lib/siteData";

// Agent-led hero (spec.md §9). All copy comes from Sanity site settings.
// Placeholder headshot + GLOC endorsement slot until M5 / sign-off.
export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="grid items-center gap-8 sm:gap-10 md:grid-cols-2">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {settings.heroEyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-brand sm:text-5xl">
          {settings.heroHeadline}
        </h1>

        <p className="mt-4 max-w-prose text-lg text-slate-600">
          {settings.heroSubcopy}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#router"
            className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-light"
          >
            Find what fits me
          </a>
          <a
            href="/about"
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-brand transition hover:border-brand"
          >
            Meet your adviser
          </a>
        </div>
      </div>

      <div className="order-first md:order-last">
        {/* Placeholder headshot block. Real headshot / HeyGen video in M5. */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/70">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl">
                📷
              </div>
              <p className="text-sm">Agent headshot / video</p>
              <p className="text-xs text-white/50">placeholder</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-dark/90 to-transparent p-5">
            <p className="text-lg font-semibold text-white">{settings.agentName}</p>
            <p className="text-sm text-white/70">{settings.agentTagline}</p>
          </div>
        </div>

        {/* GLOC endorsement slot, smaller than the agent (spec.md §9, §12). */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span className="flex h-7 items-center rounded border border-dashed border-slate-300 px-2 text-[10px] uppercase tracking-wide text-slate-400">
            GLOC mark
          </span>
          {settings.glocAffiliationLine}{" "}
          <span className="text-slate-400">(pending sign-off)</span>
        </div>
      </div>
    </section>
  );
}
