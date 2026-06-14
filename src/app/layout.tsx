import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guardian Group Agent in Trinidad & Tobago",
  description:
    "Independent Guardian Group insurance agent in Trinidad & Tobago. Protect your family, grow your wealth, insure your assets, cover your business.",
};

// M0 placeholder nav, replaced with real design in later milestones.
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/protect", label: "Protect" },
  { href: "/grow", label: "Grow" },
  { href: "/assets", label: "Assets" },
  { href: "/business", label: "Business" },
  { href: "/about", label: "About" },
  { href: "/results", label: "Results" },
  { href: "/book", label: "Book" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <header className="border-b border-slate-200">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-4 text-sm">
            <Link href="/" className="font-semibold tracking-tight">
              Guardian Agent
            </Link>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-slate-600">
              {navLinks.slice(1).map((link) => (
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
            {/* Disclaimer placeholder. Moves to Sanity site settings in M4. */}
            Disclaimer placeholder. Authorized Guardian Representative
            (endorsement placeholder; GLOC mark pending written sign-off).
          </div>
        </footer>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
