import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/siteUrl";
import { getSiteSettings } from "@/lib/siteData";

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

// Built from Sanity so titles use the real agent name (better for branded and
// local search) and stay editable in Studio.
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const name = s.agentName || "Insurance Agent";
  const title = `${name} | Insurance Agent in Trinidad & Tobago`;
  const description =
    s.heroSubcopy ||
    "Independent insurance agent in Trinidad & Tobago for life, health, critical illness, pension, motor and home insurance. Friendly, no-pressure advice.";
  return {
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: "/" },
    title: { default: title, template: `%s | ${name}` },
    description,
    keywords: [
      "insurance agent Trinidad",
      "insurance agent Trinidad and Tobago",
      name,
      "life insurance Trinidad and Tobago",
      "health insurance Trinidad",
      "critical illness cover Trinidad",
      "pension annuity Trinidad",
      "motor home insurance Trinidad",
      "Guardian Life Trinidad",
    ],
    openGraph: {
      type: "website",
      locale: "en_TT",
      siteName: name,
      url: SITE_URL,
      title,
      description,
      images: s.headshotUrl ? [{ url: s.headshotUrl }] : undefined,
    },
    twitter: { card: "summary_large_image" },
    verification: { google: googleVerification },
  };
}

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
