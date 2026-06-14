import type { Metadata, Viewport } from "next";
import StudioClient from "./StudioClient";

// Embedded Sanity Studio, served at /studio.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function StudioPage() {
  return <StudioClient />;
}
