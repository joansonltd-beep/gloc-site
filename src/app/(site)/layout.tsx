import Link from "next/link";
import Image from "next/image";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import NavLink from "@/components/NavLink";
import SocialLinks from "@/components/SocialLinks";
import MobileCtaBar from "@/components/MobileCtaBar";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { getSiteSettings } from "@/lib/siteData";
import { SITE_URL } from "@/lib/siteUrl";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/protect", label: "Protect" },
  { href: "/grow", label: "Grow" },
  { href: "/assets", label: "Assets" },
  { href: "/business", label: "Business" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book" },
];

// Site chrome: header, footer, WhatsApp float. Async so it can pull settings
// (WhatsApp number + footer disclaimer) from Sanity.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  // Structured data so Google understands the business (helps local search).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: settings.agentName,
    description:
      "Independent insurance agent in Trinidad & Tobago: life, health, critical illness, pension, annuities, investments, motor, home, property and group benefits.",
    url: SITE_URL,
    image: settings.logoUrl || settings.headshotUrl || undefined,
    telephone: settings.whatsappNumber ? `+${settings.whatsappNumber.replace(/\D/g, "")}` : undefined,
    priceRange: "$$",
    address: { "@type": "PostalAddress", addressCountry: "TT", addressRegion: "Trinidad and Tobago" },
    areaServed: { "@type": "Country", name: "Trinidad and Tobago" },
    // Social profiles help Google connect this site to the same business entity.
    sameAs: [
      settings.facebookUrl,
      settings.instagramUrl,
      settings.linkedinUrl,
      settings.tiktokUrl,
      settings.youtubeUrl,
      settings.xUrl,
    ].filter(Boolean),
    founder: settings.agentName ? { "@type": "Person", name: settings.agentName } : undefined,
    knowsAbout: [
      "Life insurance",
      "Health insurance",
      "Critical illness cover",
      "Personal accident",
      "Pension and annuities",
      "Investments and mutual funds",
      "Motor insurance",
      "Home insurance",
      "Property insurance",
      "Group and employee benefits",
    ],
  };

  return (
    <SiteSettingsProvider whatsappNumber={settings.whatsappNumber}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <div className="flex min-h-full flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3">
            {settings.logoUrl ? (
              <Link href="/" aria-label="Home" className="shrink-0">
                <Image
                  src={settings.logoUrl}
                  alt={settings.agentName}
                  width={180}
                  height={90}
                  priority
                  className="h-11 w-auto mix-blend-multiply"
                />
              </Link>
            ) : null}
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 pb-24">
          {children}
        </main>

        <footer className="border-t border-slate-200">
          <div className="mx-auto max-w-5xl space-y-2 px-4 pt-8 pb-24 text-xs text-slate-500 sm:pb-8">
            {settings.logoUrl ? (
              <Image
                src={settings.logoUrl}
                alt={settings.agentName}
                width={240}
                height={120}
                className="mb-2 h-16 w-auto mix-blend-multiply"
              />
            ) : (
              <p className="font-semibold text-slate-600">{settings.agentName}</p>
            )}
            <p>{settings.footerDisclaimer}</p>
            <p className="pt-2">
              <Link href="/contact" className="font-semibold text-brand hover:underline">
                Contact Us
              </Link>
            </p>
            <SocialLinks settings={settings} className="pt-3" />
            <p className="pt-2 text-slate-400">
              © {year} {settings.agentName}. {settings.glocAffiliationLine}.
            </p>
          </div>
        </footer>

        <WhatsAppFloat />
        <MobileCtaBar />
      </div>
    </SiteSettingsProvider>
  );
}
