import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/siteData";
import { buildWhatsAppLink } from "@/config/site";

// --- inline SVG icons (no emoji; see UI guidelines) ---------------------
function ShieldCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.718-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
function BadgeCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
function ChatBubble({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9s-4.428-9-9.75-9-9.75 3.97-9.75 9c0 2.409.917 4.6 2.416 6.256-.078.803-.404 1.533-.816 2.163a.75.75 0 0 0 .621 1.171 6.674 6.674 0 0 0 1.837-.146Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Agent-led hero (spec.md §9), styled after the Innsure template: a bold deep-navy
// field, an "excellent"-style credential badge, a headline whose trailing line is
// coloured (light blue), rounded pill CTAs and a trust-badge row. The agent
// photo/video is kept as the visual (not an illustration), set over a soft blue shape.
export default function Hero({ settings }: { settings: SiteSettings }) {
  // Split the CMS headline at the first sentence break so the trailing line can
  // carry the light-blue highlight. Falls back gracefully to a single line.
  const [headStart, ...rest] = settings.heroHeadline.split(/(?<=\.)\s+/);
  const headHighlight = rest.join(" ");

  const trust = [
    { icon: <ShieldCheck className="h-4 w-4" />, label: settings.glocAffiliationLine || "Authorized Guardian Life agent" },
    { icon: <BadgeCheck className="h-4 w-4" />, label: "Licensed life & health advisor" },
    { icon: <ChatBubble className="h-4 w-4" />, label: "No-pressure, no-jargon advice" },
  ];

  return (
    <section className="bg-hero-split relative isolate overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-white/10">
      {/* decorative soft shapes */}
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-brand-light/25 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative grid items-center gap-10 px-6 py-14 sm:px-10 sm:py-16 md:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div>
          {/* "excellent"-style credential badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-inset ring-white/20 backdrop-blur">
            <BadgeCheck className="h-4 w-4 text-brand-light" />
            {settings.heroEyebrow}
          </div>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            {headStart}
            {headHighlight ? (
              <>
                {" "}
                <span className="text-brand-light">{headHighlight}</span>
              </>
            ) : null}
          </h1>

          <p className="mt-5 max-w-prose text-lg leading-relaxed text-blue-100/90">
            {settings.heroSubcopy}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/book"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow-sm transition hover:bg-blue-50 active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              Book a consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={buildWhatsAppLink(
                settings.whatsappNumber,
                "Hi, I'd like to ask about insurance cover."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              Message on WhatsApp
            </a>
            <a
              href="#router"
              className="inline-flex items-center gap-1 rounded-full px-3 py-3 text-sm font-semibold text-white/80 underline-offset-4 transition hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              Find what fits me
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          {/* trust-badge row */}
          <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            {trust.map((b) => (
              <li key={b.label} className="inline-flex items-center gap-2 text-sm font-medium text-blue-50">
                <span className="text-brand-light">{b.icon}</span>
                {b.label}
              </li>
            ))}
          </ul>
        </div>

        {/* agent photo/video, over a soft blue shape (kept per spec — not an illustration) */}
        <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[280px] md:max-w-none">
          <div aria-hidden className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[2.5rem] bg-brand-light/25" />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-brand-dark shadow-2xl ring-1 ring-white/15">
            {settings.headshotUrl ? (
              <Image
                src={settings.headshotUrl}
                alt={settings.agentName}
                fill
                priority
                sizes="(max-width: 768px) 280px, 360px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/70">
                  <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                    <UserIcon className="h-7 w-7" />
                  </div>
                  <p className="text-sm">{settings.agentName}</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-dark/95 to-transparent p-4">
              <p className="font-semibold text-white">{settings.agentName}</p>
              <p className="text-xs text-white/80">{settings.agentTagline}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
