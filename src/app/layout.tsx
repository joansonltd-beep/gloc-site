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

export const metadata: Metadata = {
  title: "Guardian Group Agent in Trinidad & Tobago",
  description:
    "Independent Guardian Group insurance agent in Trinidad & Tobago. Protect your family, grow your wealth, insure your assets, cover your business.",
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
      <body className="min-h-full bg-white text-slate-900">{children}</body>
    </html>
  );
}
