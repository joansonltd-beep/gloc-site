"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ROUTER_CARDS,
  DISCOVERY_QUESTIONS,
  recommend,
  type DiscoveryAnswers,
  type Recommendation,
} from "@/lib/content";
import WhatsAppCTA from "./tools/WhatsAppCTA";

type Mode = "cards" | "discovery" | "results";

export default function NeedsRouter() {
  const [mode, setMode] = useState<Mode>("cards");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiscoveryAnswers>>({});
  const [results, setResults] = useState<Recommendation[]>([]);

  function startDiscovery() {
    setAnswers({});
    setResults([]);
    setStep(0);
    setMode("discovery");
  }

  function reset() {
    setMode("cards");
    setStep(0);
    setAnswers({});
    setResults([]);
  }

  function answer(key: keyof DiscoveryAnswers, value: string) {
    const next = { ...answers, [key]: value } as Partial<DiscoveryAnswers>;
    setAnswers(next);
    if (step < DISCOVERY_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setResults(recommend(next as DiscoveryAnswers));
      setMode("results");
    }
  }

  return (
    <section id="router" className="scroll-mt-20">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
          What brings you here today?
        </h2>
        <p className="mt-2 text-slate-600">
          Pick what fits, or answer a few questions and we&apos;ll point you the right way.
        </p>
      </div>

      {mode === "cards" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROUTER_CARDS.map((card) =>
            card.discovery ? (
              <button
                key={card.title}
                type="button"
                onClick={startDiscovery}
                className="group flex flex-col rounded-xl border-2 border-dashed border-accent/60 bg-accent/5 p-5 text-left transition hover:border-accent hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="text-base font-semibold text-brand">
                  {card.title}
                </span>
                <span className="mt-1 text-sm text-slate-600">
                  {card.subtitle}
                </span>
                <span className="mt-3 text-sm font-medium text-accent-dark">
                  Start the 4 questions →
                </span>
              </button>
            ) : (
              <Link
                key={card.title}
                href={card.href!}
                className="group flex flex-col rounded-xl border border-white/60 bg-white/70 backdrop-blur-sm p-5 transition hover:border-brand hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <span className="text-base font-semibold text-brand">
                  {card.title}
                </span>
                <span className="mt-1 text-sm text-slate-600">
                  {card.subtitle}
                </span>
                <span className="mt-3 text-sm font-medium text-brand opacity-0 transition group-hover:opacity-100">
                  Explore →
                </span>
              </Link>
            )
          )}
        </div>
      )}

      {mode === "discovery" && (
        <DiscoveryStep
          step={step}
          total={DISCOVERY_QUESTIONS.length}
          onAnswer={answer}
          onCancel={reset}
        />
      )}

      {mode === "results" && (
        <Results results={results} onReset={reset} />
      )}
    </section>
  );
}

function DiscoveryStep({
  step,
  total,
  onAnswer,
  onCancel,
}: {
  step: number;
  total: number;
  onAnswer: (key: keyof DiscoveryAnswers, value: string) => void;
  onCancel: () => void;
}) {
  const q = DISCOVERY_QUESTIONS[step];
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-white/60 bg-white/75 backdrop-blur-sm p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between text-xs text-slate-500">
        <span>
          Question {step + 1} of {total}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="font-medium text-slate-400 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      <h3 className="text-xl font-semibold text-brand">{q.question}</h3>

      <div className="mt-5 grid gap-3">
        {q.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onAnswer(q.key, opt.value)}
            className="rounded-lg border border-slate-200 px-4 py-3 text-left font-medium text-slate-700 transition hover:border-brand hover:bg-brand/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Results({
  results,
  onReset,
}: {
  results: Recommendation[];
  onReset: () => void;
}) {
  const summary = results.map((r) => r.line).join(" + ");
  const message = `Hi, the planner suggested ${summary} for me. I'd like to talk about options.`;

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-white/60 bg-white/75 backdrop-blur-sm p-6 sm:p-8">
      <p className="text-sm font-medium uppercase tracking-wide text-accent-dark">
        Based on your answers
      </p>
      <h3 className="mt-1 text-xl font-semibold text-brand">
        Here&apos;s where I&apos;d start
      </h3>

      <ul className="mt-5 space-y-3">
        {results.map((r) => (
          <li
            key={r.line}
            className="rounded-lg border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-brand">{r.line}</span>
              <Link
                href={r.href}
                className="shrink-0 text-sm font-medium text-brand-light hover:underline"
              >
                Learn more →
              </Link>
            </div>
            <p className="mt-1 text-sm text-slate-600">{r.why}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <WhatsAppCTA
            message={message}
            lead={{ source: "discovery-router", recommended: summary }}
          />
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-500"
        >
          Start over
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-slate-400">
        Sample suggestions and placeholder number for now.
      </p>
    </div>
  );
}
