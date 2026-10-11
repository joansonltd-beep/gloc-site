"use client";
import { useState } from "react";
import Link from "next/link";
export default function MarketSurvey() {
  const [topic, setTopic] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!topic || !priority || !consent || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "jamaica-market-survey",
          message: `Survey: ${topic}. Priority: ${priority}. ${notes}`,
          figures: { market: "Jamaica", topic, priority, notes },
          consent: true,
          submittedAt: new Date().toISOString(),
        }),
      });
      const result = await res.json();
      setStatus(res.ok && result.forwarded ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }
  if (status === "done")
    return (
      <div
        className="mt-8 rounded-xl border border-slate-200 bg-white p-8"
        role="status"
      >
        <h2 className="text-2xl font-semibold text-brand">
          Thank you for sharing.
        </h2>
        <p className="mt-3 text-slate-600">Your response has been sent.</p>
        <Link href="/" className="button-text mt-4">
          Back to the website ↗
        </Link>
      </div>
    );
  return (
    <form
      onSubmit={submit}
      className="mt-8 space-y-7 rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
    >
      <fieldset>
        <legend className="font-semibold text-brand">
          What would you most like to understand?
        </legend>
        <div className="mt-4 grid gap-3">
          {[
            "Family and health cover",
            "Retirement and savings",
            "Home and motor cover",
            "Business and employee benefits",
            "Where to begin",
          ].map((t) => (
            <label
              key={t}
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm"
            >
              <input
                type="radio"
                name="topic"
                value={t}
                checked={topic === t}
                onChange={() => setTopic(t)}
                required
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm">
        <span className="font-semibold text-brand">
          What matters most when considering an option?
        </span>
        <select
          className="mt-3 w-full rounded-lg border border-slate-300 p-3"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <option value="">Choose one</option>
          {[
            "An affordable cost",
            "Clear information",
            "Understanding what is covered",
            "Help with questions and claims",
            "Flexibility for my circumstances",
          ].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-brand">
          Anything else you would like to share? (optional)
        </span>
        <textarea
          className="mt-3 w-full rounded-lg border border-slate-300 p-3"
          rows={4}
          maxLength={2000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <span className="mt-2 block text-xs text-slate-500">
          Please leave out personal, medical or account details.
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
        <input
          type="checkbox"
          className="mt-1"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>
          I agree that Joanson may use my response to understand planning needs.
          See the{" "}
          <Link href="/privacy" className="underline">
            privacy policy
          </Link>
          .
        </span>
      </label>
      <button
        className="button-primary disabled:opacity-50"
        disabled={!topic || !priority || !consent || status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Share my response"}{" "}
        <span aria-hidden>↗</span>
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-flame">
          Your response could not be sent. Please try again later.
        </p>
      )}
    </form>
  );
}
