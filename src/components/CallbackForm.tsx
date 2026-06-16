"use client";

import { useState } from "react";
import { Field, SelectField } from "@/components/tools/ToolUI";
import { routineRequirements, ageFromDob } from "@/lib/underwriting";

// Request-a-callback form. Posts to /api/lead, which forwards to the Google
// Sheet. An on-site alternative to WhatsApp for visitors who prefer a call.
// The optional details (date of birth, cover amount, smoker, income) let the
// agent pre-fill underwriting requirements on the lead sheet — those computed
// requirements go to the sheet only and are never shown to the visitor.
export default function CallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bestTime, setBestTime] = useState("Anytime");
  const [topic, setTopic] = useState("");
  const [dob, setDob] = useState("");
  const [cover, setCover] = useState("");
  const [smoker, setSmoker] = useState("");
  const [income, setIncome] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const ready = name.trim().length > 0 && phone.trim().length >= 7;

  async function submit() {
    if (!ready || status === "sending") return;
    setStatus("sending");

    const age = ageFromDob(dob);
    const coverAmount = Number(cover) || undefined;
    const annualIncome = Number(income) || undefined;
    // Internal: indicated routine underwriting requirements (sheet only).
    const underwriting = routineRequirements(age, coverAmount);

    const message = `Callback request from ${name} (${phone}). Best time: ${bestTime}.${
      topic ? ` About: ${topic}` : ""
    }`;

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "callback-form",
          message,
          recommended: topic || "General enquiry",
          underwriting, // internal, for the sheet only
          figures: {
            name,
            phone,
            bestTime,
            topic,
            dateOfBirth: dob || undefined,
            age,
            coverConsidered: coverAmount,
            annualIncome,
            smoker: smoker || undefined,
            underwritingRequirements: underwriting || undefined,
          },
          page: typeof window !== "undefined" ? window.location.pathname : "",
          submittedAt: new Date().toISOString(),
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-white/60 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm sm:p-8">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-2xl text-accent-dark">
          ✓
        </div>
        <h3 className="text-lg font-semibold text-brand">Thanks, {name.split(" ")[0]}.</h3>
        <p className="mt-1 text-slate-600">
          Your request is in. I&apos;ll reach out at the number you gave, {bestTime.toLowerCase()}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-sm sm:p-8">
      <h3 className="text-xl font-semibold text-brand">Request a callback</h3>
      <p className="mt-1 text-sm text-slate-600">
        Leave your details and I&apos;ll call you back. No obligation.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Your name" value={name} onChange={setName} placeholder="Full name" type="text" />
        <Field label="Phone number" value={phone} onChange={setPhone} placeholder="e.g. 868 123 4567" type="tel" />
        <SelectField
          label="Best time to call"
          value={bestTime}
          onChange={setBestTime}
          options={[
            { value: "Anytime", label: "Anytime" },
            { value: "Morning", label: "Morning" },
            { value: "Afternoon", label: "Afternoon" },
            { value: "Evening", label: "Evening" },
          ]}
        />
        <Field
          label="What's it about? (optional)"
          value={topic}
          onChange={setTopic}
          placeholder="e.g. life insurance"
          type="text"
        />
      </div>

      <p className="mt-6 text-sm font-medium text-slate-700">
        A few optional details to speed up your quote
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <Field label="Date of birth (optional)" value={dob} onChange={setDob} type="date" />
        <Field
          label="Cover you're considering, TT$ (optional)"
          value={cover}
          onChange={setCover}
          placeholder="e.g. 1000000"
        />
        <SelectField
          label="Do you use tobacco? (optional)"
          value={smoker}
          onChange={setSmoker}
          options={[
            { value: "", label: "Prefer not to say" },
            { value: "No", label: "No" },
            { value: "Yes", label: "Yes (last 12 months)" },
          ]}
        />
        <Field
          label="Annual income, TT$ (optional)"
          value={income}
          onChange={setIncome}
          placeholder="e.g. 180000"
        />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!ready || status === "sending"}
        className="mt-5 w-full rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-light active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Request my callback"}
      </button>

      {status === "error" ? (
        <p className="mt-3 text-sm text-flame">
          Something went wrong. Please try again, or message on WhatsApp below.
        </p>
      ) : null}
    </div>
  );
}
