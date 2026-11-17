import { sameOrigin } from "@/lib/dashboard/auth";
import { parseFeedback, saveFeedback } from "@/lib/dashboard/anonymous-feedback";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ saved: false }, { status: 403 });
  try {
    if (Number(request.headers.get("content-length")) > 12000) {
      return Response.json({ saved: false }, { status: 413 });
    }
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 12000) {
      return Response.json({ saved: false }, { status: 413 });
    }
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ saved: false }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    if (typeof input.website === "string" && input.website.trim()) {
      return Response.json({ saved: true });
    }
    const feedback = parseFeedback(input);
    if (!feedback) return Response.json({ saved: false }, { status: 400 });
    await saveFeedback(feedback);
    return Response.json({ saved: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ saved: false }, { status: error instanceof SyntaxError ? 400 : 503 });
  }
}
