import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Your Insurance Agent in Trinidad & Tobago",
    template: "%s · Your Insurance Agent",
  },
  description:
    "Independent insurance agent in Trinidad & Tobago. Protect your family, grow your wealth, insure your assets, cover your business.",
  openGraph: {
    type: "website",
    locale: "en_TT",
    siteName: "Your Insurance Agent",
    title: "Your Insurance Agent in Trinidad & Tobago",
    description:
      "Protect your family, grow your wealth, insure your assets, cover your business. One straightforward conversation away.",
  },
  twitter: { card: "summary_large_image" },
};

// Minimal root layout: just html/body. The site chrome lives in (site)/layout
// so the embedded Studio at /studio renders without the site header/footer.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full text-slate-900">{children}</body>
    </html>
  );
}
