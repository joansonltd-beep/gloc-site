import Link from "next/link";
import { buildWhatsAppLink } from "@/config/site";
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
    "@type": "InsuranceAgency",
    name: "Bulwark Insurance Agency Ltd",
    description: "Independent insurance guidance and comparison across multiple insurers in Jamaica.",
    areaServed: { "@type": "Country", name: "Jamaica" },
    telephone: `+${settings.whatsappNumber}`,
    founder: { "@type": "Person", name: settings.agentName },
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
                <strong>Bulwark Insurance Agency Ltd</strong>
                <small>Independent insurance agency · Jamaica</small>
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
                Bulwark Insurance Agency Ltd
              </Link>
              <p>
                Independent insurance guidance for
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
              <Link href="/book">Book a consultation</Link>
              <Link href="/contact">Get in touch</Link>
              <a href={buildWhatsAppLink(settings.whatsappNumber, "Hi, I would like to discuss my insurance options.")} target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>
              <Link href="/privacy">Privacy policy</Link>
              <SocialLinks settings={settings} />
            </div>
          </div>
          <div className="footer-bottom">
            <p>{settings.footerDisclaimer}</p>
            <span>
              © {new Date().getFullYear()} Bulwark Insurance Agency Ltd.
            </span>
          </div>
        </footer>
        <WhatsAppFloat />
        <MobileCtaBar />
      </div>
    </SiteSettingsProvider>
  );
}
