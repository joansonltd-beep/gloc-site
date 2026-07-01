"use client";

import { useEffect } from "react";

// Fires a Google Ads conversion when the page loads. Placed on the pages that
// count as a conversion (booking + contact). The base gtag.js is loaded in the
// root layout, so window.gtag is available by the time this effect runs.
export default function AdsConversion({ sendTo }: { sendTo: string }) {
  useEffect(() => {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("event", "conversion", { send_to: sendTo });
    }
  }, [sendTo]);

  return null;
}
