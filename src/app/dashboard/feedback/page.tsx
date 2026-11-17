import Link from "next/link";
import { redirect } from "next/navigation";
import { authenticated } from "@/lib/dashboard/auth";
import { feedbackResponses } from "@/lib/dashboard/anonymous-feedback";

export const dynamic = "force-dynamic";
export const metadata = { title: "Anonymous Feedback | Private Dashboard" };

export default async function FeedbackPage() {
  if (!await authenticated()) redirect("/dashboard/login");
  let responses;
  try {
    responses = await feedbackResponses();
  } catch {
    return <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Link href="/dashboard">Back to dashboard</Link>
      <h1>Anonymous feedback</h1>
      <p role="alert">Responses could not be loaded. Refresh this page to try again.</p>
    </main>;
  }
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Link href="/dashboard">Back to dashboard</Link>
      <h1>Anonymous feedback</h1>
      <p>{responses.length} {responses.length === 1 ? "response" : "responses"}</p>
      <p>Read each response before sharing it. Remove any personal details someone included in the message.</p>
      <p>Feedback page <a href="https://www.joansonbjames.com/AnonymousFeedback">joansonbjames.com/AnonymousFeedback</a></p>
      {!responses.length && <p>Responses will appear here when someone submits the form.</p>}
      {responses.map(response => (
        <article key={response.id} style={{ marginTop: 20, padding: 20, background: "white", overflowWrap: "anywhere" }}>
          <h2>{response.username || "Anonymous"}</h2>
          <time dateTime={response.receivedAt}>
            {new Date(response.receivedAt).toLocaleString("en-JM", { timeZone: "America/Jamaica", dateStyle: "medium", timeStyle: "short" })}
          </time>
          <p style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>{response.message}</p>
        </article>
      ))}
    </main>
  );
}
