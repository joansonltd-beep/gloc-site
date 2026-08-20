import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow optimizing images served from the Sanity asset CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async rewrites() {
    return [
      // Serve the standalone market-survey funnel (public/survey.html) at a
      // clean URL. It has its own self-contained design, so it lives outside
      // the site layout.
      { source: "/survey", destination: "/survey.html" },
      // "Waiting for food?" QR splash (public/wait.html). Deliberately not
      // linked from anywhere on the site — reachable only via a direct link
      // (e.g. a printed QR code), so it's also kept out of the sitemap and
      // blocked from indexing in robots.ts.
      { source: "/wait", destination: "/wait.html" },
    ];
  },
};

export default nextConfig;
