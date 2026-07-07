"use client";

import { useState } from "react";
import { Field, SelectField, ToolFrame } from "./ToolUI";
import { Check } from "@/components/icons";
import { routineRequirements, ageFromDob } from "@/lib/underwriting";

// Term insurance request. Gathers the basics so the agent can prepare for a
// consultation. Posts to /api/lead -> Google Sheet.
export default function TermInsuranceForm() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [method, setMethod] = useState("Phone");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const ready =
    name.trim().length > 0 &&
    dob.length > 0 &&
    Number(amount) > 0 &&
    contact.trim().length >= 5;

  async function submit() {
    if (!ready || status === "sending") return;
    setStatus("sending");

    const age = ageFromDob(dob);
    const amountRequired = Number(amount) || undefined;
    const underwriting = routineRequirements(age, amountRequired);

    const message = `Term insurance request from ${name}. DOB ${dob}${
      age != null ? ` (age ${age})` : ""
    }. Amount: TT$${amountRequired?.toLocaleString() ?? ""}. Purpose: ${
      purpose || "not stated"
    }. Contact by ${method}: ${contact}.`;

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "term-insurance",
          name,
          phone: method === "Phone" ? contact : "",
          message,
          recommended: "Term insurance",
          underwriting, // internal, sheet only
          figures: {
            name,
            dateOfBirth: dob,
            age,
            amountRequired,
            purpose: purpose || undefined,
            contactMethod: method,
            contact,
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
      <ToolFrame title="Term Insurance request" intro="">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent-dark">
            <Check className="h-6 w-6" />
          </div>
          <p className="font-semibold text-brand">Thanks, {name.split(" ")[0]}.</p>
          <p className="mt-1 text-sm text-slate-600">
            I have your request and I&apos;ll be in touch by {method.toLowerCase()} to set up a time to talk.
          </p>
        </div>
      </ToolFrame>
    );
  }

  return (
    <ToolFrame
      title="Term Insurance request"
      intro="Term insurance is straightforward cover for a set number of years, often used to protect a mortgage or a young family. Send these details and I'll be in touch to talk it through."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" value={name} onChange={setName} placeholder="Full name" type="text" />
        <Field label="Date of birth" value={dob} onChange={setDob} type="date" />
        <Field
          label="Amount required (TT$)"
          value={amount}
          onChange={setAmount}
          placeholder="e.g. 1000000"
        />
        <Field
          label="Purpose"
          value={purpose}
          onChange={setPurpose}
          placeholder="e.g. mortgage"
          type="text"
        />
        <SelectField
          label="Best way to reach you"
          value={method}
          onChange={setMethod}
          options={[
            { value: "Phone", label: "Phone" },
            { value: "Email", label: "Email" },
          ]}
        />
        <Field
          label={method === "Email" ? "Email address" : "Phone number"}
          value={contact}
          onChange={setContact}
          placeholder={method === "Email" ? "you@example.com" : "e.g. 868 123 4567"}
          type={method === "Email" ? "email" : "tel"}
        />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!ready || status === "sending"}
        className="mt-5 w-full rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-light active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send my details"}
      </button>

      {status === "error" ? (
        <p className="mt-3 text-sm text-flame">Something went wrong. Please try again.</p>
      ) : null}
    </ToolFrame>
  );
}
