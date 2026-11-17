"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import type { Answers } from "@/lib/market-survey";
import { coverageGoals, employmentTypes, coverStatuses, timeframes, contactMethods, enquiryConsent, contactDays, contactWindows, incomeTypes, incomeFrequencies, type EnquiryEntry } from "@/lib/insurance-enquiry";

const input = "mt-3 block w-full border border-slate-300 bg-white p-3 font-normal";
type Question = {
  key: string;
  title: string;
  control?: "select" | "choices" | "comments" | "consent";
  options?: readonly string[];
  optional?: boolean;
  attributes?: InputHTMLAttributes<HTMLInputElement>;
};

export default function InsuranceEnquiry({ age = "", goal = "", entry = "Coverage finder", name = "", survey }: {
  age?: string; goal?: string; entry?: EnquiryEntry; name?: string; survey?: Answers;
}) {
  const [values, setValues] = useState<Record<string, string>>({ name, goal });
  const [schedule, setSchedule] = useState<Record<string, string[]>>({ contactDays: [], contactWindows: [] });
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const requestId = useRef("");
  const inFlight = useRef(false);
  const prompt = useRef<HTMLElement>(null);
  const focusOnChange = useRef(false);

  useEffect(() => {
    if (focusOnChange.current) {
      focusOnChange.current = false;
      prompt.current?.focus();
    }
  }, [step, status]);

  const questions: Question[] = [
    { key: "name", title: "Full name", attributes: { autoComplete: "name", maxLength: 100, pattern: /.*\S.*/.source } },
    { key: "phone", title: "Phone number, including area code", attributes: { type: "tel", autoComplete: "tel", maxLength: 30, pattern: /\+?[\s\(\)\-]*\d(?:[\s\(\)\-]*\d){6,14}[\s\(\)\-]*/.source } },
    { key: "email", title: "Email address", optional: true, attributes: { type: "email", autoComplete: "email", maxLength: 254 } },
    { key: "dateOfBirth", title: "Date of birth", attributes: { type: "date", autoComplete: "bday", min: "1900-01-01" } },
    { key: "employment", title: "Employment type", control: "select", options: employmentTypes },
    { key: "incomeType", title: "Income type", control: "select", options: incomeTypes },
    ...(values.incomeType === "No income" ? [] : [
      { key: "incomeAmount", title: "Income amount (J$) per pay period", attributes: { type: "number", min: "0.01", step: "0.01", max: "9999999999999.99" } },
      { key: "incomeFrequency", title: "Income frequency", control: "select" as const, options: incomeFrequencies },
    ]),
    { key: "goal", title: "What are you looking for?", control: "select", options: coverageGoals },
    { key: "currentCover", title: entry === "Group benefits enquiry" ? "Does your company currently have group insurance?" : "Do you currently have insurance?", control: "select", options: coverStatuses },
    { key: "timeframe", title: "When would you like to explore coverage?", control: "select", options: timeframes },
    ...(entry === "Group benefits enquiry" ? [
      { key: "company", title: "Company name", optional: true, attributes: { maxLength: 100 } },
      { key: "headcount", title: "Number of employees", attributes: { type: "number", min: 1, max: 999999999, step: 1 } },
    ] : []),
    ...(entry === "Term insurance enquiry" ? [
      { key: "coverAmount", title: "Amount of cover required (J$)", attributes: { type: "number", min: 1 } },
      { key: "purpose", title: "Purpose of cover", optional: true, attributes: { maxLength: 150 } },
    ] : []),
    { key: "method", title: "Preferred contact method", control: "select", options: contactMethods.filter(method => method !== "Email" || (values.email && values.emailConsent === "on")) },
    { key: "contactDays", title: "Which days work for you?", control: "choices", options: contactDays },
    { key: "contactWindows", title: "What times work for you?", control: "choices", options: contactWindows },
    { key: "notes", title: "Comments", control: "comments", optional: true },
    { key: "contactConsent", title: "Permission to respond", control: "consent" },
  ];
  const question = questions[step];
  const { key, title, control, options, attributes, optional } = question;
  const last = step === questions.length - 1;
  const value = values[key] ?? "";
  const ready = optional || (control === "choices" ? schedule[key].length > 0 : value.trim().length > 0);

  function update(key: string, value: string) {
    setValues(previous => ({ ...previous, [key]: value,
      ...(key === "email" ? { emailConsent: "", ...(previous.method === "Email" ? { method: "" } : {}) } : {}),
      ...(key === "emailConsent" && !value && previous.method === "Email" ? { method: "" } : {}),
      ...(key === "incomeType" && value === "No income" ? { incomeAmount: "", incomeFrequency: "" } : {}),
    }));
  }

  function go(index: number) {
    focusOnChange.current = true;
    setStatus("idle");
    setStep(index);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || inFlight.current) return;
    if (!last) {
      go(step + 1);
      return;
    }
    requestId.current ||= crypto.randomUUID();
    inFlight.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ...schedule, age, entry, survey, informationConsent: Boolean(survey), source: "website-insurance-enquiry", requestId: requestId.current, emailConsent: values.emailConsent === "on", contactConsent: values.contactConsent === "on" }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (response.ok && result.saved) {
        focusOnChange.current = true;
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "sent") return (
    <section ref={prompt} tabIndex={-1} role="status" className="mt-6 border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-brand">Your enquiry was received</h2>
      <p className="mt-2 text-slate-600">Joanson can follow up using the contact method you selected.</p>
      <Link href="/" className="button-text">Return to the website</Link>
    </section>
  );

  return (
    <form onSubmit={submit} className="mt-6 max-w-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div hidden aria-hidden="true"><label>Website<input name="website" autoComplete="off" tabIndex={-1} value={values.website ?? ""} onChange={event => update("website", event.target.value)} /></label></div>
      <section ref={prompt} tabIndex={-1} aria-label={title}>
        <p className="mb-3 text-sm text-slate-600">Question {step + 1} of {questions.length}</p>
        <fieldset key={key} disabled={status === "sending"}>
          <legend className="text-xl font-semibold text-brand">{title}{optional ? " (optional)" : ""}</legend>
          {control === "choices" ? (
            <>
              <p className="mt-2 text-sm text-slate-600">Select all that apply.{key === "contactWindows" && " Times are in Jamaica."}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {options?.map(option => <label key={option} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={schedule[key].includes(option)} onChange={event => {
                    const checked = event.target.checked;
                    setSchedule(previous => ({ ...previous, [key]: checked ? [...previous[key], option] : previous[key].filter(item => item !== option) }));
                  }} /> {option}
                </label>)}
              </div>
            </>
          ) : control === "consent" ? (
            <>
              <label className="mt-4 flex items-start gap-3 text-sm text-slate-700">
                <input type="checkbox" aria-label="Agree to be contacted" required className="mt-1" checked={value === "on"} onChange={event => update(key, event.target.checked ? "on" : "")} />
                <span>{enquiryConsent}</span>
              </label>
              <Link href="/privacy" className="mt-3 inline-block text-sm underline">Privacy policy</Link>
            </>
          ) : control === "select" ? (
            <select aria-label={title} required className={input} value={value} onChange={event => update(key, event.target.value)}>
              <option value="" disabled>Choose an option</option>
              {options?.map(option => <option key={option}>{option}</option>)}
            </select>
          ) : control === "comments" ? (
            <>
              <p className="mt-2 text-sm text-slate-600">Please leave out medical information, account numbers and policy documents.</p>
              <textarea aria-label={title} maxLength={1000} rows={3} className={input} value={value} onChange={event => update(key, event.target.value)} />
            </>
          ) : (
            <>
              <input {...attributes} aria-label={title} required={!optional || (key === "email" && values.emailConsent === "on")} className={input} value={value} onChange={event => update(key, event.target.value)} />
              {key === "email" && <>
                <label className="mt-4 flex items-start gap-3 text-sm text-slate-700">
                  <input type="checkbox" className="mt-1" checked={values.emailConsent === "on"} onChange={event => update("emailConsent", event.target.checked ? "on" : "")} />
                  <span>I give Joanson Baptiste James permission to contact me by email about my insurance enquiry.</span>
                </label>
                <p className="mt-2 text-sm text-slate-600">If you leave this unticked, email contact will be recorded as permission not given.</p>
              </>}
            </>
          )}
        </fieldset>
      </section>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {step > 0 && <button type="button" className="button-text" disabled={status === "sending"} onClick={() => go(step - 1)}>Back</button>}
        {optional && <button type="button" className="button-text" onClick={() => { update(key, ""); go(step + 1); }}>Skip</button>}
        <button type="submit" disabled={!ready || status === "sending"} className="button-primary ml-auto disabled:opacity-50">
          {status === "sending" ? "Sending…" : last ? "Send enquiry" : "Continue"}
        </button>
      </div>
      {status === "error" && <p role="alert" className="mt-4 text-sm text-flame">Your enquiry could not be saved. Your answers are still here. Check your details and try again.</p>}
    </form>
  );
}
