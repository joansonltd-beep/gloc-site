"use client";

import { useState } from "react";
import { formatTTD } from "@/lib/format";
import WhatsAppCTA from "./WhatsAppCTA";
import { ToolFrame, Field, ResultCard, Assumptions } from "./ToolUI";

// "How much life insurance do I need?" calculator. Cover is estimated as a
// multiple of yearly income based on age, following Guardian's guidance:
// life cover runs from 30x income under 30 down to 2x by 75; critical illness
// from 10x under 55 down to 5x by 65. Above the top bands cover is set
// individually. Indicative only, not a quote.
type Freq = "annual" | "monthly";

function lifeMultiple(age: number): number | null {
  if (age <= 30) return 30;
  if (age <= 40) return 25;
  if (age <= 50) return 20;
  if (age <= 60) return 15;
  if (age <= 65) return 10;
  if (age <= 69) return 5;
  if (age <= 75) return 2;
  return null; // individual consideration
}

function criticalMultiple(age: number): number | null {
  if (age <= 55) return 10;
  if (age <= 60) return 7;
  if (age <= 65) return 5;
  return null; // not available
}

export default function LifeNeedsCalculator() {
  const [freq, setFreq] = useState<Freq>("annual");
  const [income, setIncome] = useState("");
  const [age, setAge] = useState("");

  const rawIncome = Number(income) || 0;
  const ageNum = Math.floor(Number(age) || 0);
  const ready = rawIncome > 0 && ageNum >= 18;

  const yearlyIncome = freq === "monthly" ? rawIncome * 12 : rawIncome;
  const lifeMult = lifeMultiple(ageNum);
  const ciMult = criticalMultiple(ageNum);
  const life = lifeMult !== null ? yearlyIncome * lifeMult : null;
  const ci = ciMult !== null ? yearlyIncome * ciMult : null;

  const lifeText = life !== null ? formatTTD(life) : "Individual consideration";
  const ciText = ci !== null ? formatTTD(ci) : "Not available at this age";

  const message = `Hi, the life insurance calculator suggested about ${
    life !== null ? formatTTD(life) : "an individually assessed amount"
  } in life cover${
    ci !== null ? ` and ${formatTTD(ci)} in critical illness cover` : ""
  } for me. I'd like to talk through my options.`;

  return (
    <ToolFrame
      title="Insurance coverage calculator"
      intro="Enter your income and age to see a suggested amount of life and critical illness cover. It is a starting estimate based on your yearly income, not a quote."
    >
      {/* Income frequency toggle */}
      <div
        role="group"
        aria-label="Income frequency"
        className="mb-4 inline-flex rounded-lg border border-slate-300 p-0.5 text-sm"
      >
        {(["annual", "monthly"] as Freq[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFreq(f)}
            aria-pressed={freq === f}
            className={`rounded-md px-4 py-1.5 font-medium capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              freq === f
                ? "bg-brand text-white"
                : "text-slate-600 hover:text-brand"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={freq === "annual" ? "Annual earned income (TT$)" : "Monthly earned income (TT$)"}
          value={income}
          onChange={setIncome}
          placeholder={freq === "annual" ? "e.g. 100000" : "e.g. 8333"}
        />
        <Field label="Your age" value={age} onChange={setAge} placeholder="e.g. 35" />
      </div>

      {ready ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-brand p-5 text-white">
            <p className="text-sm text-white/70">Suggested life insurance</p>
            <p className="mt-1 text-3xl font-semibold">{lifeText}</p>
            <p className="mt-1 text-xs text-white/60">
              {life !== null
                ? `${lifeMult}× your yearly income, based on age ${ageNum}`
                : `Cover over age 75 is assessed individually`}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label="Critical illness cover"
              value={ciText}
              note={
                ci !== null
                  ? `${ciMult}× your yearly income`
                  : `Critical illness cover is not offered from age ${ageNum}`
              }
            />
            <ResultCard
              label="Yearly income used"
              value={formatTTD(yearlyIncome)}
              note={freq === "monthly" ? "Your monthly income × 12" : "As entered"}
            />
          </div>

          <div className="pt-1">
            <WhatsAppCTA
              message={message}
              label="Talk through my number on WhatsApp"
              lead={{
                source: "life-needs-calculator",
                recommended: "Life Insurance, Critical Illness",
                figures: {
                  freq,
                  income: rawIncome,
                  age: ageNum,
                  yearlyIncome,
                  lifeMultiple: lifeMult ?? 0,
                  criticalMultiple: ciMult ?? 0,
                  life: life ?? 0,
                  criticalIllness: ci ?? 0,
                },
              }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          Enter your income and an age of 18 or older to see a suggested amount.
        </p>
      )}

      <Assumptions>
        Cover is estimated as a multiple of your yearly income, based on your age.
        Life cover runs from 30 times income under age 30 down to 2 times by age 75;
        critical illness cover from 10 times income under 55 down to 5 times by 65.
        Above those ages, cover is assessed individually. The payout on a life policy
        is generally tax-free in Trinidad &amp; Tobago. These figures are indicative,
        to start a conversation, and are not a quote.
      </Assumptions>
    </ToolFrame>
  );
}
