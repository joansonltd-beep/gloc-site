import Link from "next/link";
import WhatsAppFloat from "@/components/WhatsAppFloat";
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

  return (
    <SiteSettingsProvider whatsappNumber={settings.whatsappNumber}>
      <div className="flex min-h-full flex-col">
        <header className="border-b border-slate-200">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-4 text-sm">
            <Link href="/" className="font-semibold tracking-tight">
              Guardian Agent
            </Link>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-slate-600">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-slate-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
          {children}
        </main>

        <footer className="border-t border-slate-200">
          <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-500">
            {settings.footerDisclaimer}
          </div>
        </footer>

        <WhatsAppFloat />
      </div>
    </SiteSettingsProvider>
  );
}
