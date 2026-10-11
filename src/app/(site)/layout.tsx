import Link from "next/link";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SocialLinks from "@/components/SocialLinks";
import MobileCtaBar from "@/components/MobileCtaBar";
import SiteNav from "@/components/SiteNav";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { getSiteSettings } from "@/lib/siteData";
import { SITE_URL } from "@/lib/siteUrl";
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.agentName,
    url: SITE_URL,
    image: settings.headshotUrl || undefined,
    sameAs: [
      settings.facebookUrl,
      settings.instagramUrl,
      settings.linkedinUrl,
    ].filter(Boolean),
  };
  return (
    <SiteSettingsProvider whatsappNumber={settings.whatsappNumber}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="site-shell">
        <header className="site-header">
          <div className="header-inner">
            <Link
              href="/"
              className="brand-lockup"
              aria-label={`${settings.agentName}, home`}
            >
              <span className="brand-mark" aria-hidden>
                J.
              </span>
              <span>
                <strong>{settings.agentName}</strong>
                <small>Life. Family. Future.</small>
              </span>
            </Link>
            <SiteNav />
          </div>
        </header>
        <main id="main" className="site-main">
          {children}
        </main>
        <footer className="site-footer">
          <div className="footer-top">
            <div>
              <Link href="/" className="footer-brand">
                {settings.agentName}
              </Link>
              <p>
                Thoughtful conversations for
                <br />
                your life in Jamaica.
              </p>
            </div>
            <div className="footer-links">
              <Link href="/protect">Family &amp; health</Link>
              <Link href="/grow">Retirement &amp; savings</Link>
              <Link href="/assets">Home &amp; motor</Link>
              <Link href="/business">Group Coverage</Link>
            </div>
            <div className="footer-links">
              <Link href="/about">About Joanson</Link>
              <Link href="/book">Book a conversation</Link>
              <Link href="/contact">Get in touch</Link>
              <Link href="/privacy">Privacy policy</Link>
              <SocialLinks settings={settings} />
            </div>
          </div>
          <div className="footer-bottom">
            <p>{settings.footerDisclaimer}</p>
            <span>
              © {new Date().getFullYear()} {settings.agentName}.
            </span>
          </div>
        </footer>
        <WhatsAppFloat />
        <MobileCtaBar />
      </div>
    </SiteSettingsProvider>
  );
}
