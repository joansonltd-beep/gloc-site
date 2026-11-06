"use client";
import { useRef, useState } from 'react';
import Link from 'next/link';
import { cleanAnswers, exclusive, questionsFor, type Answers } from '@/lib/market-survey';

export default function MarketSurvey() {
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState({ name: '', contactMethod: '', phone: '', email: '', bestTime: '', contactConsent: false });
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle');
  const sending = useRef(false);
  const inputClass = 'mt-2 w-full rounded-lg border border-slate-300 bg-white p-3';
  function change(id: string, value: string | string[]) {
    const next = cleanAnswers({ ...answers, [id]: value });
    if (id === 'F1' && value !== 'Yes, I would like to arrange a conversation') setContact({ name: '', contactMethod: '', phone: '', email: '', bestTime: '', contactConsent: false });
    setAnswers(next);
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'jamaica-market-survey', surveyVersion: 2, answers: cleanAnswers(answers), website, ...(answers.F1 === 'Yes, I would like to arrange a conversation' ? contact : {}) }), signal: AbortSignal.timeout(15000) });
      const result = await res.json();
      setStatus(res.ok && result.forwarded ? 'done' : 'error');
    } catch { setStatus('error'); }
    finally { sending.current = false; }
  }
  if (status === 'done') return <section role="status" className="mt-8 rounded-xl border border-slate-200 bg-white p-8"><h2 className="text-2xl font-semibold text-brand">Thank you for sharing your views</h2><p className="mt-3 text-slate-600">{answers.F1 === 'Yes, I would like to arrange a conversation' ? 'Your response and request for a conversation have been received. I will use your selected contact method to follow up.' : 'Your survey response has been received.'}</p><Link href="/" className="button-text mt-4">Back to the website</Link></section>;
  return <form onSubmit={submit} className="mt-8 space-y-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
    <p className="text-sm text-slate-600">Questions marked required need an answer. You may leave the other questions blank. Please leave out medical information, policy numbers, account details and other people’s personal information.</p>
    <div hidden aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} /></label></div>
    <fieldset disabled={status === 'sending'} className="space-y-8">
    {questionsFor(answers).map((q, index) => <fieldset key={q.id} className="space-y-3">
      <legend className="mb-3 leading-relaxed font-semibold text-brand">{index + 1}. {q.title}{['Q1','F1'].includes(q.id) ? ' (required)' : ' (optional)'}</legend>
      {q.id === 'C5' ? <textarea aria-label={q.title} className={inputClass} rows={3} maxLength={1000} value={String(answers.C5 || '')} onChange={e=>change('C5',e.target.value)} /> : <>
      {q.multi && <p className="text-sm text-slate-500">{q.max ? `Choose up to ${q.max}.` : 'Select all that apply.'}</p>}
      <div className="grid gap-2">{q.options.map(option => {
        const selected = Array.isArray(answers[q.id]) ? answers[q.id] as string[] : [];
        return <label key={option} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
          <input className="mt-1" type={q.multi ? 'checkbox' : 'radio'} name={q.id} value={option} checked={q.multi ? selected.includes(option) : answers[q.id] === option} required={!q.multi && ['Q1','F1'].includes(q.id)} disabled={q.multi && !!q.max && selected.length >= q.max && !selected.includes(option) && !exclusive(option)} onChange={()=>{
            if (!q.multi) change(q.id,option);
            else change(q.id,selected.includes(option) ? selected.filter(s=>s!==option) : exclusive(option) ? [option] : [...selected.filter(s=>!exclusive(s)),option]);
          }} />{option}
        </label>;
      })}</div>
      {Array.isArray(answers[q.id]) && answers[q.id].includes('Other') && <label className="block text-sm text-slate-600">Please tell me more (optional)<input className={inputClass} maxLength={300} value={String(answers[q.id+'Other'] || '')} onChange={e=>change(q.id+'Other',e.target.value)} /></label>}
      {!['Q1','F1'].includes(q.id) && answers[q.id] && <button type="button" className="text-sm text-brand underline" onClick={()=>change(q.id,q.multi ? [] : '')}>Clear answer</button>}
      </>}
    </fieldset>)}
    {answers.F1 === 'Yes, I would like to arrange a conversation' && <fieldset className="space-y-4 rounded-lg bg-slate-50 p-4"><legend className="font-semibold text-brand">Arrange a conversation</legend>
      <label className="block text-sm">Name (required)<input autoComplete="name" required maxLength={200} className={inputClass} value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})} /></label>
      <label className="block text-sm">Preferred contact method (required)<select required className={inputClass} value={contact.contactMethod} onChange={e=>setContact({...contact,contactMethod:e.target.value,phone:'',email:'',bestTime:'',contactConsent:false})}><option value="">Choose one</option>{['Phone call','WhatsApp','Email'].map(v=><option key={v}>{v}</option>)}</select></label>
      {contact.contactMethod && (contact.contactMethod === 'Email' ? <label className="block text-sm">Email address (required)<input type="email" autoComplete="email" required maxLength={254} className={inputClass} value={contact.email} onChange={e=>setContact({...contact,email:e.target.value})}/></label> : <label className="block text-sm">Contact number, including country code (required)<input type="tel" autoComplete="tel" required minLength={7} maxLength={30} className={inputClass} value={contact.phone} onChange={e=>setContact({...contact,phone:e.target.value})}/></label>)}
      {contact.contactMethod === 'Phone call' && <label className="block text-sm">Preferred contact time (optional)<select className={inputClass} value={contact.bestTime} onChange={e=>setContact({...contact,bestTime:e.target.value})}><option value="">Choose one</option>{['Morning','Afternoon','Evening','No preference'].map(v=><option key={v}>{v}</option>)}</select><span className="mt-1 block text-xs text-slate-500">This is a preference, not a confirmed appointment.</span></label>}
      <label className="flex items-start gap-3 text-sm text-slate-600"><input type="checkbox" className="mt-1" required checked={contact.contactConsent} onChange={e=>setContact({...contact,contactConsent:e.target.checked})}/><span>I request that Joanson “Joey” Baptiste James contact me by my selected method to discuss my survey responses and insurance needs. This does not sign me up for ongoing marketing.</span></label>
      <p className="text-xs text-slate-500">You can choose “Not at the moment” above and submit without contact details.</p>
    </fieldset>}
    </fieldset>
    <p className="text-xs leading-relaxed text-slate-500">Your responses will be used to understand insurance needs and, if you request it, prepare for a conversation with you. Read the <Link href="/privacy" className="underline">Privacy Policy</Link> for information about how your details are handled.</p>
    <button className="button-primary disabled:opacity-50" disabled={!answers.Q1 || !answers.F1 || status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Submit my responses'}</button>
    {status === 'error' && <p role="alert" className="text-sm text-flame">Your response could not be sent. Your answers are still here. Please try again.</p>}
  </form>;
}
