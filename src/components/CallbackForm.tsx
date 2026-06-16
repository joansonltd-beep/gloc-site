"use client";

import { useState } from "react";
import { Field, SelectField } from "@/components/tools/ToolUI";
import { routineRequirements, ageFromDob } from "@/lib/underwriting";

// Things a visitor might want to take care of (customer-facing wording).
const GOALS = [
  "Life insurance",
  "Mortgage protection",
  "Education funding",
  "Funeral expenses",
  "Health insurance",
  "Critical illness cover",
  "Accident cover",
  "Income protection",
  "Retirement planning",
  "Savings and investments",
  "Estate planning",
  "Tax savings",
  "Property insurance",
  "Liability insurance",
  "Travel insurance",
  "Business protection",
  "Key-person cover",
  "Employee benefits",
];

// Request-a-callback form. Posts to /api/lead, which forwards to the Google
// Sheet. An on-site alternative to WhatsApp for visitors who prefer a call.
// Optional details (date of birth, cover amount, tobacco, income) let the agent
// pre-fill underwriting requirements on the lead sheet only.
export default function CallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bestTime, setBestTime] = useState("Anytime");
  const [goals, setGoals] = useState<string[]>([]);
  const [dob, setDob] = useState("");
  const [cover, setCover] = useState("");
  const [smoker, setSmoker] = useState("");
  const [income, setIncome] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const ready = name.trim().length > 0 && phone.trim().length >= 7;

  function toggleGoal(goal: string) {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }

  async function submit() {
    if (!ready || status === "sending") return;
    setStatus("sending");

    const age = ageFromDob(dob);
    const coverAmount = Number(cover) || undefined;
    const annualIncome = Number(income) || undefined;
    const underwriting = routineRequirements(age, coverAmount);
    const goalsText = goals.join(", ");

    const message = `Callback request from ${name} (${phone}). Best time: ${bestTime}.${
      goalsText ? ` Wants to take care of: ${goalsText}.` : ""
    }`;

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "callback-form",
          name,
          phone,
          message,
          recommended: goalsText || "General enquiry",
          underwriting, // internal, for the sheet only
          figures: {
            name,
            phone,
            bestTime,
            goals,
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
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-slate-700">
          What would you like to take care of?
        </legend>
        <p className="mt-1 text-xs text-slate-500">
          Pick anything you&apos;re thinking about. It helps me prepare for our call.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((goal) => {
            const checked = goals.includes(goal);
            return (
              <label
                key={goal}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  checked
                    ? "border-brand bg-brand/5 text-brand"
                    : "border-slate-200 text-slate-700 hover:border-brand/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleGoal(goal)}
                  className="h-4 w-4 accent-[color:var(--color-brand)]"
                />
                {goal}
              </label>
            );
          })}
        </div>
      </fieldset>

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
        className="mt-6 w-full rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-light active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-auto"
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
