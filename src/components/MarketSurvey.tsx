"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cleanAnswers, exclusive, questionsFor, type Answers } from '@/lib/market-survey';

const wantsConversation = 'Yes, I would like to arrange a conversation';
const emptyContact = { name: '', contactMethod: '', phone: '', email: '', bestTime: '', contactConsent: false };
const phonePattern = /[+\d\s\(\)\-]*\d(?:[+\s\(\)\-]*\d){6,14}[+\s\(\)\-]*/;
const needsAnswer = (id: string) => id === 'Q1' || id === 'F1';

export default function MarketSurvey() {
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState(emptyContact);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle');
  const sending = useRef(false);
  const [step, setStep] = useState(0);
  const prompt = useRef<HTMLElement>(null);
  const moveFocus = useRef(false);
  useEffect(() => {
    if (moveFocus.current) {
      moveFocus.current = false;
      prompt.current?.focus();
    }
  }, [step, status]);

  function go(next: number) {
    if (sending.current) return;
    moveFocus.current = true;
    setStatus('idle');
    setStep(next);
  }

  const questions = questionsFor(answers);
  const contactSteps = answers.F1 === wantsConversation
    ? ['name', 'method', ...(contact.contactMethod ? ['address'] : []),
        ...(contact.contactMethod === 'Phone call' ? ['time'] : []), 'consent']
    : [];
  const q = questions[step];
  const contactStep = contactSteps[step - questions.length];
  const finalStep = q ? q.id === 'F1' && answers.F1 !== wantsConversation : contactStep === 'consent';
  const ready = !q || !needsAnswer(q.id) || Boolean(answers[q.id]);
  const inputClass = 'mt-2 w-full rounded-lg border border-slate-300 bg-white p-3';
  function change(id: string, value: string | string[]) {
    if (id === 'C5' || id.endsWith('Other')) {
      setAnswers({ ...answers, [id]: value });
      return;
    }
    const next = cleanAnswers({ ...answers, [id]: value });
    const active = questionsFor(next);
    for (const { id } of active) {
      if (id === 'C5' && typeof answers.C5 === 'string') next.C5 = answers.C5;
      const other = id + 'Other';
      const selected = next[id];
      if (Array.isArray(selected) && selected.includes('Other') && typeof answers[other] === 'string') next[other] = answers[other];
    }
    if (id === 'F1' && value !== wantsConversation) setContact(emptyContact);
    setAnswers(next);
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current || !ready) return;
    if (!finalStep) {
      go(step + 1);
      return;
    }
    sending.current = true;
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'jamaica-market-survey', surveyVersion: 2, answers: cleanAnswers(answers), website, ...(answers.F1 === wantsConversation ? contact : {}) }), signal: AbortSignal.timeout(15000) });
      const result = await res.json();
      if (res.ok && result.forwarded) moveFocus.current = true;
      setStatus(res.ok && result.forwarded ? 'done' : 'error');
    } catch { setStatus('error'); }
    finally { sending.current = false; }
  }
  if (status === 'done') return <section ref={prompt} tabIndex={-1} role="status" className="mt-8 rounded-xl border border-slate-200 bg-white p-8"><h2 className="text-2xl font-semibold text-brand">Thank you for sharing your views</h2><p className="mt-3 text-slate-600">{answers.F1 === wantsConversation ? 'Your response and request for a conversation have been received. I will use your selected contact method to follow up.' : 'Your survey response has been received.'}</p><Link href="/" className="button-text mt-4">Back to the website</Link></section>;
  return <form onSubmit={submit} className="mt-8 space-y-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
    {step === 0 && <p className="text-sm text-slate-600">Questions marked required need an answer. You may leave the other questions blank. Please leave out medical information, policy numbers, account details and other people’s personal information.</p>}
    <div hidden aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} /></label></div>
    <section ref={prompt} tabIndex={-1} aria-labelledby="survey-question">
      <p className="mb-3 text-sm text-slate-600">Question {step + 1}</p>
      <fieldset disabled={status === 'sending'}>
      {q && <fieldset key={q.id} className="space-y-3">
        <legend id="survey-question" className="mb-3 text-lg leading-relaxed font-semibold text-brand">{q.title}{needsAnswer(q.id) ? ' (required)' : ' (optional)'}</legend>
        {q.id === 'C5' ? <textarea aria-label={q.title} className={inputClass} rows={3} maxLength={1000} value={String(answers.C5 || '')} onChange={e=>change('C5',e.target.value)} /> : <>
        {q.multi && <p className="text-sm text-slate-500">{q.max ? `Choose up to ${q.max}.` : 'Select all that apply.'}</p>}
        <div className="grid gap-2">{q.options.map(option => {
          const selected = Array.isArray(answers[q.id]) ? answers[q.id] as string[] : [];
          return <label key={option} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
            <input className="mt-1" type={q.multi ? 'checkbox' : 'radio'} name={q.id} value={option} checked={q.multi ? selected.includes(option) : answers[q.id] === option} required={!q.multi && needsAnswer(q.id)} disabled={q.multi && !!q.max && selected.length >= q.max && !selected.includes(option) && !exclusive(option)} onChange={()=>{
              if (!q.multi) change(q.id,option);
              else change(q.id,selected.includes(option) ? selected.filter(s=>s!==option) : exclusive(option) ? [option] : [...selected.filter(s=>!exclusive(s)),option]);
            }} />{option}
          </label>;
        })}</div>
        {Array.isArray(answers[q.id]) && answers[q.id].includes('Other') && <label className="block text-sm text-slate-600">Please tell me more (optional)<input className={inputClass} maxLength={300} value={String(answers[q.id+'Other'] || '')} onChange={e=>change(q.id+'Other',e.target.value)} /></label>}
        {!needsAnswer(q.id) && answers[q.id] && <button type="button" className="text-sm text-brand underline" onClick={()=>change(q.id,q.multi ? [] : '')}>Clear answer</button>}
        </>}
      </fieldset>}
      {contactStep === 'name' && <label className="block text-sm"><span id="survey-question" className="text-lg font-semibold text-brand">What is your name? (required)</span><input autoComplete="name" required pattern={/.*\S.*/.source} maxLength={200} className={inputClass} value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})} /></label>}
      {contactStep === 'method' && <label className="block text-sm"><span id="survey-question" className="text-lg font-semibold text-brand">How would you like me to contact you? (required)</span><select required className={inputClass} value={contact.contactMethod} onChange={e=>setContact({...contact,contactMethod:e.target.value,phone:'',email:'',bestTime:'',contactConsent:false})}><option value="">Choose one</option>{['Phone call','WhatsApp','Email'].map(v=><option key={v}>{v}</option>)}</select></label>}
        {contactStep === 'address' && (contact.contactMethod === 'Email' ? <label className="block text-sm"><span id="survey-question" className="text-lg font-semibold text-brand">What is your email address? (required)</span><input type="email" autoComplete="email" required maxLength={254} className={inputClass} value={contact.email} onChange={e=>setContact({...contact,email:e.target.value})}/></label> : <label className="block text-sm"><span id="survey-question" className="text-lg font-semibold text-brand">What is your contact number, including country code? (required)</span><input type="tel" autoComplete="tel" required pattern={phonePattern.source} maxLength={30} className={inputClass} value={contact.phone} onChange={e=>setContact({...contact,phone:e.target.value})}/></label>)}
        {contactStep === 'time' && <label className="block text-sm"><span id="survey-question" className="text-lg font-semibold text-brand">When would you prefer a phone call? (optional)</span><select className={inputClass} value={contact.bestTime} onChange={e=>setContact({...contact,bestTime:e.target.value})}><option value="">Choose one</option>{['Morning','Afternoon','Evening','No preference'].map(v=><option key={v}>{v}</option>)}</select><span className="mt-1 block text-xs text-slate-500">Your selection is a contact preference.</span></label>}
        {contactStep === 'consent' && <fieldset className="space-y-4"><legend id="survey-question" className="text-lg font-semibold text-brand">May I contact you about your responses? (required)</legend><label className="flex items-start gap-3 text-sm text-slate-600"><input type="checkbox" className="mt-1" required checked={contact.contactConsent} onChange={e=>setContact({...contact,contactConsent:e.target.checked})}/><span>I request that Joanson “Joey” Baptiste James contact me by my selected method to discuss my survey responses and insurance needs. This does not sign me up for ongoing marketing.</span></label>
        <p className="text-xs text-slate-500">To submit without contact details, go back to the conversation question and choose “Not at the moment”.</p>
      </fieldset>}
      </fieldset>
    </section>
    <p className="text-xs leading-relaxed text-slate-500">Your responses will be used to understand insurance needs and, if you request it, prepare for a conversation with you. Read the <Link href="/privacy" className="underline">Privacy Policy</Link> for information about how your details are handled.</p>
    <div className="flex flex-wrap justify-between gap-3">
      {step > 0 && <button type="button" className="button-text" disabled={status === 'sending'} onClick={() => go(step - 1)}>Back</button>}
      <button type="submit" className="button-primary ml-auto disabled:opacity-50" disabled={!ready || status === 'sending'}>
        {status === 'sending' ? 'Sending...' : finalStep ? 'Submit my responses' : 'Continue'}
      </button>
    </div>
    {status === 'error' && <p role="alert" className="text-sm text-flame">Your response could not be sent. Your answers are still here. Please try again.</p>}
  </form>;
}
