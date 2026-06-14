// Client helper: record a lead, then let the WhatsApp link open.
// Fire-and-forget so capture never blocks or breaks the WhatsApp hand-off
// (spec.md §8). The POST goes to our own /api/lead route, which forwards to
// whatever webhook the agent configured (Airtable / Google Sheet / etc.).

export type LeadPayload = {
  source: string; // which tool or CTA produced this lead
  message: string; // the pre-filled WhatsApp message
  recommended?: string; // line(s) recommended, if any
  figures?: Record<string, string | number>; // any numbers the visitor produced
};

export function captureLead(payload: LeadPayload): void {
  try {
    const body = JSON.stringify({
      ...payload,
      page: typeof window !== "undefined" ? window.location.pathname : "",
      submittedAt: new Date().toISOString(),
    });

    // Prefer sendBeacon so the request survives the page handing off to WhatsApp.
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/lead", new Blob([body], { type: "application/json" }));
      return;
    }

    void fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Never let capture failure interrupt the visitor.
  }
}
