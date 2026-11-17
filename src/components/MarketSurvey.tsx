"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import InsuranceEnquiry from '@/components/InsuranceEnquiry';
import { cleanAnswers, exclusive, questionsFor, namedSurveyVersion, type Answers } from '@/lib/market-survey';

const wantsConversation = 'Yes, I would like to arrange a conversation';
const needsAnswer = (id: string) => id === 'Q1' || id === 'F1';

export default function MarketSurvey({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle');
  const sending = useRef(false);
  const [step, setStep] = useState(-1);
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
  const q = questions[step];
  const addingEnquiry = step === questions.length && answers.F1 === wantsConversation;
  const finalStep = q?.id === 'F1' && answers.F1 !== wantsConversation;
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
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'jamaica-market-survey', surveyVersion: namedSurveyVersion, name: name.trim(), informationConsent: true, answers: cleanAnswers(answers), website }), signal: AbortSignal.timeout(15000) });
      const result = await res.json();
      if (res.ok && result.forwarded) moveFocus.current = true;
      setStatus(res.ok && result.forwarded ? 'done' : 'error');
    } catch { setStatus('error'); }
    finally { sending.current = false; }
  }
  if (step === -1) return (
    <section ref={prompt} tabIndex={-1} aria-label="Before you start" className="mt-6 space-y-6">
      {children}
      <form className="space-y-4 border border-slate-200 bg-white p-6 sm:p-8" onSubmit={submit}>
        <label className="block text-sm font-medium text-brand-dark">Your name (required)
          <input autoComplete="name" required pattern={/.*\S.*/.source} maxLength={200} className={inputClass}
            aria-describedby="information-consent" value={name} onChange={event => setName(event.target.value)} />
        </label>
        <p id="information-consent" className="text-sm leading-relaxed text-slate-600">By entering your name, you consent to your information being used by Joanson Baptiste James to tailor insurance agent services.</p>
        <p className="text-sm text-slate-600"><Link href="/privacy" className="underline">Privacy Policy</Link></p>
        <button type="submit" className="button-primary">Agree and continue</button>
      </form>
    </section>
  );
  if (addingEnquiry) return (
    <section ref={prompt} tabIndex={-1} className="mt-8">
      <button type="button" className="button-text" onClick={() => go(step - 1)}>Back to survey questions</button>
      <h2 className="mt-3 text-2xl font-semibold text-brand">Arrange a conversation</h2>
      <p className="mt-2 text-slate-600">Submit your survey answers along with your contact and planning details.</p>
      <InsuranceEnquiry entry="Market survey" name={name} survey={cleanAnswers(answers)} />
    </section>
  );
  if (status === 'done') return <section ref={prompt} tabIndex={-1} role="status" className="mt-8 rounded-xl border border-slate-200 bg-white p-8"><h2 className="text-2xl font-semibold text-brand">Thank you for sharing your views</h2><p className="mt-3 text-slate-600">Your survey response has been received.</p><Link href="/" className="button-text mt-4">Back to the website</Link></section>;
  return <form onSubmit={submit} className="mt-8 space-y-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
    {step === 0 && <p className="text-sm text-slate-600">Questions marked required need an answer. You may leave the other questions blank. Please leave out medical information, policy numbers, account details and other people’s personal information.</p>}
    <div hidden aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} /></label></div>
    <section ref={prompt} tabIndex={-1} aria-labelledby="survey-question">
      <p className="mb-3 text-sm text-slate-600">Question {step + 1}</p>
      <fieldset disabled={status === 'sending'}>
      {q && <fieldset key={q.id} className="space-y-3">
        <legend id="survey-question" className="mb-3 text-lg leading-relaxed font-semibold text-brand">{q.title}{needsAnswer(q.id) ? ' (required)' : ' (optional)'}</legend>
        {q.id === 'Q1' ? <select aria-label={q.title} required className={inputClass} value={String(answers.Q1 || '')} onChange={e=>change('Q1',e.target.value)}>
          <option value="" disabled>Choose an option</option>
          {q.options.map(option=><option key={option}>{option}</option>)}
        </select> : q.id === 'C5' ? <textarea aria-label={q.title} className={inputClass} rows={3} maxLength={1000} value={String(answers.C5 || '')} onChange={e=>change('C5',e.target.value)} /> : <>
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
      </fieldset>
    </section>
    <p className="text-xs leading-relaxed text-slate-500">Your responses will be used to understand insurance needs and, if you request it, prepare for a conversation with you. Read the <Link href="/privacy" className="underline">Privacy Policy</Link> for information about how your details are handled.</p>
    <div className="flex flex-wrap justify-between gap-3">
      <button type="button" className="button-text" disabled={status === 'sending'} onClick={() => go(step - 1)}>Back</button>
      <button type="submit" className="button-primary ml-auto disabled:opacity-50" disabled={!ready || status === 'sending'}>
        {status === 'sending' ? 'Sending...' : finalStep ? 'Submit my responses' : 'Continue'}
      </button>
    </div>
    {status === 'error' && <p role="alert" className="text-sm text-flame">Your response could not be sent. Your answers are still here. Please try again.</p>}
  </form>;
}
