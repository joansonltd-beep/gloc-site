import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/siteUrl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Google Search Console token (public, safe to commit). Hardcoded so the
// Vercel env var can't mangle it.
const googleVerification = "VRywR5Rn38kExZbiFZyYiKT7a1pt-DENH8-uitRodb0";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: "Your Insurance Agent in Trinidad & Tobago",
    template: "%s · Your Insurance Agent",
  },
  description:
    "Independent insurance agent in Trinidad & Tobago. Protect your family, grow your wealth, insure your assets, cover your business.",
  keywords: [
    "insurance agent Trinidad",
    "life insurance Trinidad and Tobago",
    "health insurance Trinidad",
    "critical illness cover Trinidad",
    "pension annuity Trinidad",
    "motor home insurance Trinidad",
  ],
  openGraph: {
    type: "website",
    locale: "en_TT",
    siteName: "Your Insurance Agent",
    url: SITE_URL,
    title: "Your Insurance Agent in Trinidad & Tobago",
    description:
      "Protect your family, grow your wealth, insure your assets, cover your business. One straightforward conversation away.",
  },
  twitter: { card: "summary_large_image" },
  // Google Search Console verification (public token, safe to commit).
  verification: { google: googleVerification },
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
