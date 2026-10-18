// Lead capture endpoint (spec.md §8).
// Receives a lead from the browser and forwards it to the webhook configured
// in LEAD_WEBHOOK_URL (Airtable / Google Sheet / Zapier / etc.). If no webhook
// is set, it logs and returns OK so the WhatsApp hand-off is never blocked.
//
// Basic spam protection: an oversized body, a malformed payload, or a filled
// honeypot field ("website" ,  hidden from humans) is dropped without
// forwarding. Bots still get an OK response so they don't retry.

import { readBoundedText } from '@/lib/requestBody';
import { allowedLeadOrigin, validLead } from '@/lib/leadValidation';
const MAX_BODY_CHARACTERS = 16_384;

function isSpam(lead: Record<string, unknown>): boolean {
  // The honeypot field is invisible to humans; anything in it is a bot.
  if (typeof lead.website === "string" && lead.website.trim() !== "")
    return true;

  // Every legitimate caller (forms + WhatsApp CTAs) sends a source string.
  if (
    typeof lead.source !== "string" ||
    lead.source.length === 0 ||
    lead.source.length > 100
  )
    return true;

  // The callback form always sends a name and a phone number.
  if (lead.source === "callback-form") {
    if (
      typeof lead.name !== "string" ||
      lead.name.trim().length === 0 ||
      lead.name.length > 200
    )
      return true;
    const phone =
      typeof lead.phone === "string" ? lead.phone.replace(/\D/g, "") : "";
    if (phone.length < 7 || phone.length > 15) return true;
  }

  return false;
}

export async function POST(request: Request): Promise<Response> {
  if (!allowedLeadOrigin(request)) return Response.json({ ok: false, forwarded: false }, { status: 403 });
  let lead: Record<string, unknown> | null = null;
  try {
    const raw = await readBoundedText(request, 65_536);
    if (raw.length > MAX_BODY_CHARACTERS)
      return Response.json({ ok: true, forwarded: false });
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      lead = parsed as Record<string, unknown>;
    }
  } catch {
    lead = null;
  }

  if (!lead || isSpam(lead) || !validLead(lead)) {
    return Response.json({ ok: true, forwarded: false });
  }
  delete lead.website; // strip the (empty) honeypot before forwarding

  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (!webhook) {
    console.info('[lead] not forwarded: webhook is not configured');
    return Response.json({ ok: true, forwarded: false });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    return Response.json(
      { ok: response.ok, forwarded: response.ok },
      { status: response.ok ? 200 : 502 },
    );
  } catch {
    console.error('[lead] webhook forwarding failed');
    // Still return OK: the visitor's WhatsApp hand-off must not depend on this.
    return Response.json({ ok: true, forwarded: false });
  }
}
