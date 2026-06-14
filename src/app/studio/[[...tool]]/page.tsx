import type { Metadata, Viewport } from "next";
import StudioClient from "./StudioClient";
import { isSanityConfigured } from "@/sanity/env";

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
  // Without a project id the Studio can't initialise, so show setup steps
  // instead of crashing.
  if (!isSanityConfigured) {
    return (
      <main
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "48px 24px",
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.6,
          color: "#0f172a",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Sanity Studio not configured yet</h1>
        <p style={{ marginTop: 12, color: "#475569" }}>
          Add your Sanity project id to <code>.env.local</code> and restart the
          dev server, then reload this page.
        </p>
        <pre
          style={{
            marginTop: 16,
            padding: 16,
            background: "#f1f5f9",
            borderRadius: 8,
            overflowX: "auto",
            fontSize: 13,
          }}
        >{`NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production`}</pre>
        <p style={{ marginTop: 16, color: "#475569" }}>
          Full steps (create the project, CORS, seed content) are in{" "}
          <code>docs/sanity-setup.md</code>.
        </p>
      </main>
    );
  }

  return <StudioClient />;
}
