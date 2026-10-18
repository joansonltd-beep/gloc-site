import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/siteUrl";
import { getSiteSettings } from "@/lib/siteData";
import { SHARE_IMAGE } from '@/lib/seo';

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
  const name = "Bulwark Insurance Agency Ltd";
  const title = `${name} | Independent Insurance Agency in Jamaica`;
  const description =
    s.heroSubcopy ||
    "Insurance and financial planning questions for your life in Jamaica. Family, retirement, home and business guides from Joanson Baptiste James.";
  return {
    metadataBase: new URL(SITE_URL),
    // No global canonical: each page sets its own so search engines index
    // every page, not just the homepage.
    title: { default: title, template: `%s | ${name}` },
    description,
    keywords: [
      "independent insurance agency Jamaica",
      "insurance agency Jamaica",
      "business insurance Jamaica",
      "group health insurance Jamaica",
      "insurance advisor Jamaica",
      name,
      "life insurance Jamaica",
      "health insurance Jamaica",
      "critical illness Jamaica",
      "retirement planning Jamaica",
      "home motor insurance Jamaica",
    ],
    openGraph: {
      type: "website",
      locale: "en_JM",
      siteName: name,
      url: SITE_URL,
      title,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE.url] },
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
      <body className="min-h-full text-slate-900">
        {/* Google tag (gtag.js) ,  Google Ads conversion tracking.
            afterInteractive keeps the tag out of the critical rendering path
            so it doesn't slow first paint. */}
        {children}
      </body>
    </html>
  );
}
