"use client";

import { useState } from "react";
import Link from "next/link";
import { useWhatsAppLink } from "@/components/SiteSettingsProvider";

const questions = [
  { key: "work", label: "How do you currently earn your income?", options: ["Employed", "Employed on contract", "Self employed", "Employed and self employed", "Not currently earning an income"] },
  { key: "income", label: "Average monthly personal earnings in J$", options: ["Below J$150,000", "J$150,000 to J$249,999", "J$250,000 to J$399,999", "J$400,000 or more", "Prefer not to say"] },
  { key: "purpose", label: "What would you like to look at?", options: ["Protection for myself", "Protection for my family", "Group life or health cover for employees", "Understanding where to start"] },
  { key: "readiness", label: "Where are you with this?", options: ["Ready to consider suitable cover", "Reviewing my options before deciding", "Learning for now"] },
  { key: "priority", label: "What would help you decide?", options: ["Understanding the benefits and exclusions", "Finding a premium I can maintain", "Understanding how workplace cover fits", "I need help working that out"] },
] as const;

export default function CoverageEnquiry() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [review, setReview] = useState(false);
  const whatsappLink = useWhatsAppLink();
  const ready = name.trim().length > 0 && questions.every(q => q.options.some(v => v === answers[q.key])) && consent;
  const message = `Hello Joanson, I would like to look at my coverage gaps.\n\nName: ${name.trim()}\n${questions.map(q => `${q.label}: ${answers[q.key] || ""}`).join("\n")}\n\nI agree that you may use these answers to respond to this enquiry.`;

  return <form className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8" onSubmit={e => { e.preventDefault(); if (ready) setReview(true); }}>
    <h2 className="text-2xl font-semibold text-brand">Tell me where you are starting</h2>
    <p className="mt-3 text-slate-600">A few details help me prepare a useful response. Please leave out medical information, account numbers and policy documents.</p>
    <label className="mt-6 block text-sm font-medium text-slate-700">Your name
      <input required maxLength={100} autoComplete="name" value={name} onChange={e => { setName(e.target.value); setReview(false); }} className="mt-2 w-full rounded-lg border border-slate-300 p-3" />
    </label>
    <div className="mt-5 space-y-5">{questions.map(q => <label key={q.key} className="block text-sm font-medium text-slate-700">{q.label}
      {q.key === "income" && <span className="mt-1 block text-sm font-normal text-slate-600">Before personal tax and deductions. If self employed, deduct business expenses first. If earnings vary, use your average over the past 12 months. You can choose not to share.</span>}
      <select required value={answers[q.key] || ""} onChange={e => { setAnswers(a => ({ ...a, [q.key]: e.target.value })); setReview(false); }} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3">
        <option value="" disabled>Select an answer</option>
        {q.options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>)}</div>
    <label className="mt-6 flex items-start gap-3 text-sm text-slate-600"><input type="checkbox" required checked={consent} onChange={e => { setConsent(e.target.checked); setReview(false); }} className="mt-1" /><span>I agree that Joanson Baptiste James may use these details to respond to this enquiry. This does not sign me up for ongoing marketing. <Link className="underline" href="/privacy">Privacy policy</Link>.</span></label>
    <button type="submit" disabled={!ready} className="button-primary mt-6 disabled:opacity-50">Review my enquiry</button>
    {review && ready && <section aria-live="polite" className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-lg font-semibold text-brand">Check before you send</h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{message}</p>
      <p className="mt-4 text-sm text-slate-600">Your answers have not been submitted. Continue to WhatsApp, review the message there, then send it to Joanson. WhatsApp will receive the message when you continue.</p>
      <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="button-primary mt-4">Continue to WhatsApp</a>
    </section>}
    <p className="mt-5 text-xs leading-relaxed text-slate-500">These details help prepare a response. They do not determine eligibility for insurance. No cover is issued through this form. Your answers stay in this browser until you choose to continue to WhatsApp.</p>
  </form>;
}
