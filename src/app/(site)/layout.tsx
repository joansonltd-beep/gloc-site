import Link from "next/link";
import Script from "next/script";
const GOOGLE_ADS_ID="AW-18282133568";
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
    "@type": "Person",
    "@id": `${SITE_URL}/#advisor`,
    name: "Joanson Baptiste James",
    description: "Independent insurance guidance and comparison across multiple insurers in Jamaica.",
    telephone: `+${settings.whatsappNumber}`,
    jobTitle: "Insurance agent",
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
        </Script>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            jsonLd,
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': `${SITE_URL}/#website`,
              url: SITE_URL,
              name: 'Joanson Baptiste James',
              publisher: { '@id': `${SITE_URL}/#advisor` },
              inLanguage: 'en-JM',
            },
          ]).replace(/</g, "\\u003c"),
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
                <strong>Joanson Baptiste James</strong>
                <small>Insurance guidance · Jamaica</small>
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
                Joanson Baptiste James
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
              © {new Date().getFullYear()} Joanson Baptiste James.
            </span>
          </div>
        </footer>
        <WhatsAppFloat />
        <MobileCtaBar />
      </div>
    </SiteSettingsProvider>
  );
}
