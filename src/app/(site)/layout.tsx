import Link from "next/link";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import NavLink from "@/components/NavLink";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { getSiteSettings } from "@/lib/siteData";

const navLinks = [
  { href: "/protect", label: "Protect" },
  { href: "/grow", label: "Grow" },
  { href: "/assets", label: "Assets" },
  { href: "/business", label: "Business" },
  { href: "/about", label: "About" },
  { href: "/results", label: "Results" },
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

  return (
    <SiteSettingsProvider whatsappNumber={settings.whatsappNumber}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <div className="flex min-h-full flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-4 text-sm">
            <Link
              href="/"
              className="rounded font-semibold tracking-tight text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Guardian Agent
            </Link>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
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
          <div className="mx-auto max-w-5xl space-y-2 px-4 py-8 text-xs text-slate-500">
            <p className="font-semibold text-slate-600">{settings.agentName}</p>
            <p>{settings.footerDisclaimer}</p>
            <p className="pt-2 text-slate-400">
              © {year} {settings.agentName}. {settings.glocAffiliationLine}.
            </p>
          </div>
        </footer>

        <WhatsAppFloat />
      </div>
    </SiteSettingsProvider>
  );
}
