"use client";
import { useState } from "react";
import Link from "next/link";
import { Field, SelectField } from "@/components/tools/ToolUI";
import { useWhatsAppLink } from "@/components/SiteSettingsProvider";
const TYPES = ["Not sure yet", "Life insurance", "Health insurance", "Critical illness", "Personal accident", "Motor insurance", "Home or property insurance", "Pensions and annuities", "Investments", "Group Coverage (Life/Health/Pensions)"];
export default function CallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [bestTime, setBestTime] = useState("Anytime");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const whatsappLink = useWhatsAppLink();
  const ready = name.trim().length > 0 && phone.replace(/\D/g, "").length >= 7;
  async function submit() {
    if (!ready || status === "sending") return;
    setStatus("sending");
    try {
      const response = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "callback-form", name: name.trim(), phone: phone.trim(), website,
          message: `Consultation request. Insurance: ${type}. Preferred contact time: ${bestTime}. ${message.trim()}`,
          recommended: type, figures: { name: name.trim(), phone: phone.trim(), bestTime, goals: [type], message: message.trim() },
          page: window.location.pathname, submittedAt: new Date().toISOString() }),
      });
      const result = await response.json();
      setStatus(response.ok && result.forwarded ? "done" : "error");
    } catch { setStatus("error"); }
  }
  if (status === "done") return <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-semibold text-brand">Thank you, {name.split(" ")[0]}.</h2><p className="mt-2 text-slate-600">Your consultation request has been received. We will contact you using the details provided to arrange the next step.</p></section>;
  return <form onSubmit={e => { e.preventDefault(); void submit(); }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <h2 className="text-xl font-semibold text-brand">Request a consultation</h2>
    <p className="mt-2 text-sm text-slate-600">Tell us what you need and when you prefer to hear from us. No pressure, no obligation.</p>
    <div className="hidden" aria-hidden="true"><label>Website<input name="website" value={website} onChange={e=>setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" /></label></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <Field label="Full name" type="text" value={name} onChange={setName} placeholder="Full name" />
      <Field label="WhatsApp number" type="tel" value={phone} onChange={setPhone} placeholder="Your number with country code" />
      <SelectField label="Type of insurance needed" value={type} onChange={setType} options={TYPES.map(value=>({value,label:value}))} />
      <SelectField label="Preferred contact time" value={bestTime} onChange={setBestTime} options={["Anytime","Morning","Afternoon","Evening"].map(value=>({value,label:value}))} />
    </div>
    <label className="mt-4 block text-sm font-medium text-slate-700">Message (optional)<textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3} maxLength={2000} className="mt-1 w-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand/30" /></label>
    <button type="submit" disabled={!ready || status === "sending"} className="button-primary mt-5 disabled:opacity-50">{status === "sending" ? "Sending..." : "Request a consultation"}</button>
    {status === "error" && <p role="alert" className="mt-3 text-sm text-flame">Your request could not be sent. Please try again or <a className="underline" href={whatsappLink("Hi, I would like to request a consultation.")} target="_blank" rel="noopener noreferrer">message on WhatsApp</a>.</p>}
    <p className="mt-4 text-xs text-slate-500">By submitting, you agree that Joanson Baptiste James may use these details to contact you about your enquiry. <Link href="/privacy" className="underline">Privacy policy</Link>.</p>
  </form>;
}
