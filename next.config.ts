import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow optimizing images served from the Sanity asset CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return [
      { source: "/survey.html", destination: "/survey", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // "Waiting for food?" QR splash (public/wait.html). Deliberately not
      // linked from anywhere on the site — reachable only via a direct link
      // (e.g. a printed QR code), so it's also kept out of the sitemap and
      // blocked from indexing in robots.ts.
      { source: "/wait", destination: "/wait.html" },
    ];
  },
};

export default nextConfig;
