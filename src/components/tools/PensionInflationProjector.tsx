"use client";

import { useState } from "react";
import { PENSION_ASSUMPTIONS } from "@/lib/costFigures";
import { futureValueMonthly, realValue } from "@/lib/finance";
import { formatTTD } from "@/lib/format";
import WhatsAppCTA from "./WhatsAppCTA";
import { ToolFrame, Field, ResultCard, Assumptions } from "./ToolUI";

// Pension-vs-Inflation projector (spec.md §7). Inputs: current age, monthly
// contribution, retirement age. Output: savings-only vs structured plan, with
// TT-dollar erosion shown.
export default function PensionInflationProjector() {
  const [age, setAge] = useState("");
  const [contribution, setContribution] = useState("");
  const [retireAge, setRetireAge] = useState("");

  const currentAge = Number(age) || 0;
  const monthly = Number(contribution) || 0;
  const retirementAge = Number(retireAge) || 0;
  const years = retirementAge - currentAge;
  const ready = monthly > 0 && years > 0;

  const { savingsAnnualReturn, structuredAnnualReturn, inflationAnnualRate } =
    PENSION_ASSUMPTIONS;

  const savingsOnly = futureValueMonthly(monthly, savingsAnnualReturn, years);
  const structured = futureValueMonthly(monthly, structuredAnnualReturn, years);
  const structuredReal = realValue(structured, inflationAnnualRate, years);

  const message = `Hi, the pension projector shows my contributions could reach about ${formatTTD(
    structured
  )} in a structured plan by age ${retirementAge}, vs ${formatTTD(
    savingsOnly
  )} just saving. I'd like to talk pension options.`;

  const pct = (n: number) => `${Math.round(n * 100)}%`;

  return (
    <ToolFrame
      title="Pension vs. Inflation Projector"
      intro="See what regular contributions could become in a structured plan, and how much value plain savings lose to inflation."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Your current age" value={age} onChange={setAge} placeholder="e.g. 30" />
        <Field
          label="Monthly contribution (TT$)"
          value={contribution}
          onChange={setContribution}
          placeholder="e.g. 1500"
        />
        <Field
          label="Retirement age"
          value={retireAge}
          onChange={setRetireAge}
          placeholder="e.g. 60"
        />
      </div>

      {ready ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-brand p-5 text-white">
            <p className="text-sm text-white/70">
              Structured plan at age {retirementAge} ({years} years)
            </p>
            <p className="mt-1 text-3xl font-semibold">{formatTTD(structured)}</p>
            <p className="mt-1 text-xs text-white/60">
              vs {formatTTD(savingsOnly)} left in plain savings, a{" "}
              {formatTTD(structured - savingsOnly)} difference
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ResultCard
              label="Structured plan"
              value={formatTTD(structured)}
              note={`Growing at ~${pct(structuredAnnualReturn)}/yr`}
            />
            <ResultCard
              label="Savings only"
              value={formatTTD(savingsOnly)}
              note={`Barely growing at ~${pct(savingsAnnualReturn)}/yr`}
            />
            <ResultCard
              label="Structured, in today's TT$"
              value={formatTTD(structuredReal)}
              note={`After ${pct(inflationAnnualRate)}/yr inflation erosion`}
            />
          </div>

          <div className="pt-1">
            <WhatsAppCTA
              message={message}
              label="Plan my pension on WhatsApp"
              lead={{
                source: "pension-projector",
                recommended: "Pension / Annuities",
                figures: {
                  monthlyContribution: monthly,
                  years,
                  structured,
                  savingsOnly,
                },
              }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          Enter a monthly contribution and a retirement age above your current age.
        </p>
      )}

      <Assumptions>
        Monthly compounding. Structured plan ~{pct(structuredAnnualReturn)}/yr,
        plain savings ~{pct(savingsAnnualReturn)}/yr, inflation ~
        {pct(inflationAnnualRate)}/yr (editable in costFigures.ts). Illustration
        only, not a guarantee of returns.
      </Assumptions>
    </ToolFrame>
  );
}
