import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/siteData";
export default function Hero({ settings }: { settings: SiteSettings }) {
  const [headline, ...rest] = settings.heroHeadline.split(/(?<=\.)\s+/);
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot" /> {settings.heroEyebrow}
        </p>
        <h1 id="home-title">
          {headline}
          <br />
          <em>{rest.join(" ")}</em>
        </h1>
        <p className="hero-description">{settings.heroSubcopy}</p>
        <div className="hero-actions">
          <Link href="/book" className="button-primary">
            Let&apos;s talk <span aria-hidden>↗</span>
          </Link>
          <a href="#explore" className="button-text">
            Explore your options <span aria-hidden>↓</span>
          </a>
        </div>
        <div className="hero-note">
          <span aria-hidden>✓</span> Your goals. Your budget. Your pace.
        </div>
      </div>
      <div className="hero-portrait">
        <div className="portrait-arch">
          {settings.headshotUrl ? (
            <Image
              src={settings.headshotUrl}
              alt={settings.agentName}
              fill
              preload
              sizes="(max-width: 767px) 85vw, 460px"
              className="object-cover"
            />
          ) : (
            <div className="portrait-monogram" aria-hidden>
              JBJ
            </div>
          )}
        </div>
        <span className="portrait-orbit" aria-hidden />
        <div className="portrait-caption">
          <span className="portrait-caption-mark" aria-hidden>
            J.
          </span>
          <div>
            <p>{settings.agentName}</p>
            <span>A personal approach to planning</span>
          </div>
        </div>
        <p className="portrait-side-note" aria-hidden>
          People first. Plans second.
        </p>
      </div>
    </section>
  );
}
