import "server-only";
import { Conflict, readDocument, writeDocument } from "@/lib/dashboard/storage";

export type AnonymousFeedback = {
  id: string;
  username: string;
  message: string;
  receivedAt: string;
};
const feedbackPath = "dashboard/anonymous-feedback-v1.json";
const emptyFeedback: { responses: AnonymousFeedback[] } = { responses: [] };

export function parseFeedback(body: Record<string, unknown>) {
  const { id, username, message } = body;
  if (typeof id !== "string" ||
      !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id) ||
      typeof username !== "string" || username.trim().length > 40 ||
      /[\r\n]/.test(username) ||
      typeof message !== "string" || !message.trim() || message.trim().length > 2000) return null;
  return { id, username: username.trim(), message: message.trim() };
}

export async function feedbackResponses() {
  return (await readDocument(feedbackPath, emptyFeedback)).value.responses;
}

export async function saveFeedback(input: NonNullable<ReturnType<typeof parseFeedback>>) {
  const entry = { ...input, receivedAt: new Date().toISOString() };
  for (let attempt = 0; attempt < 5; attempt++) {
    const { value, etag } = await readDocument(feedbackPath, emptyFeedback);
    const existing = value.responses.find(response => response.id === entry.id);
    if (existing) {
      if (existing.message !== entry.message || existing.username !== entry.username) throw new Conflict();
      return;
    }
    try {
      await writeDocument(feedbackPath, { responses: [entry, ...value.responses] }, etag);
      return;
    } catch (error) {
      if (!(error instanceof Conflict) || attempt === 4) throw error;
    }
  }
}
