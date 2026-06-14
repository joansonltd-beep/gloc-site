// Lead capture endpoint (spec.md §8).
// Receives a lead from the browser and forwards it to the webhook configured
// in LEAD_WEBHOOK_URL (Airtable / Google Sheet / Zapier / etc.). If no webhook
// is set, it logs and returns OK so the WhatsApp hand-off is never blocked.

export async function POST(request: Request): Promise<Response> {
  let lead: unknown = null;
  try {
    lead = await request.json();
  } catch {
    lead = null;
  }

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
