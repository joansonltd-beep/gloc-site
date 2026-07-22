// Lead capture endpoint (spec.md §8).
// Receives a lead from the browser and forwards it to the webhook configured
// in LEAD_WEBHOOK_URL (Airtable / Google Sheet / Zapier / etc.). If no webhook
// is set, it logs and returns OK so the WhatsApp hand-off is never blocked.
//
// Basic spam protection: an oversized body, a malformed payload, or a filled
// honeypot field ("website" — hidden from humans) is dropped without
// forwarding. Bots still get an OK response so they don't retry.

const MAX_BODY_BYTES = 16_384;

function isSpam(lead: Record<string, unknown>): boolean {
  // The honeypot field is invisible to humans; anything in it is a bot.
  if (typeof lead.website === "string" && lead.website.trim() !== "") return true;

  // Every legitimate caller (forms + WhatsApp CTAs) sends a source string.
  if (typeof lead.source !== "string" || lead.source.length === 0 || lead.source.length > 100)
    return true;

  // The callback form always sends a name and a phone number.
  if (lead.source === "callback-form") {
    if (typeof lead.name !== "string" || lead.name.trim().length === 0 || lead.name.length > 200)
      return true;
    const phone = typeof lead.phone === "string" ? lead.phone.replace(/\D/g, "") : "";
    if (phone.length < 7 || phone.length > 15) return true;
  }

  return false;
}

export async function POST(request: Request): Promise<Response> {
  let lead: Record<string, unknown> | null = null;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return Response.json({ ok: true, forwarded: false });
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      lead = parsed as Record<string, unknown>;
    }
  } catch {
    lead = null;
  }

  if (!lead || isSpam(lead)) {
    return Response.json({ ok: true, forwarded: false });
  }
  delete lead.website; // strip the (empty) honeypot before forwarding

  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (!webhook) {
    // No endpoint configured yet. Log so it's visible during development.
    console.info("[lead] (no LEAD_WEBHOOK_URL set) captured:", lead);
    return Response.json({ ok: true, forwarded: false });
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    return Response.json({ ok: true, forwarded: true });
  } catch (err) {
    console.error("[lead] failed to forward to webhook:", err);
    // Still return OK: the visitor's WhatsApp hand-off must not depend on this.
    return Response.json({ ok: true, forwarded: false });
  }
}
