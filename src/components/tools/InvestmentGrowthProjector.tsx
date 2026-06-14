"use client";

import { useState } from "react";
import { INVESTMENT_ASSUMPTIONS } from "@/lib/costFigures";
import { futureValueLumpSum, futureValueMonthly } from "@/lib/finance";
import { formatTTD } from "@/lib/format";
import WhatsAppCTA from "./WhatsAppCTA";
import { ToolFrame, Field, ResultCard, Assumptions } from "./ToolUI";

// Investment growth projector (spec.md §7). Inputs: lump sum and/or monthly
// contribution + horizon. Output: a projected value range.
export default function InvestmentGrowthProjector() {
  const [lump, setLump] = useState("");
  const [monthly, setMonthly] = useState("");
  const [horizon, setHorizon] = useState("");

  const lumpSum = Number(lump) || 0;
  const monthlyContribution = Number(monthly) || 0;
  const years = Number(horizon) || 0;
  const ready = (lumpSum > 0 || monthlyContribution > 0) && years > 0;

  const { lowAnnualReturn, highAnnualReturn } = INVESTMENT_ASSUMPTIONS;

  const project = (rate: number) =>
    futureValueLumpSum(lumpSum, rate, years) +
    futureValueMonthly(monthlyContribution, rate, years);

  const low = project(lowAnnualReturn);
  const high = project(highAnnualReturn);
  const invested = lumpSum + monthlyContribution * 12 * years;

  const message = `Hi, the investment projector estimates ${formatTTD(
    low
  )}–${formatTTD(high)} over ${years} years from what I put in. I'd like to talk investment options.`;

  const pct = (n: number) => `${Math.round(n * 100)}%`;

  return (
    <ToolFrame
      title="Investment Growth Projector"
      intro="Estimate where a lump sum, regular contributions, or both could land over time, shown as a cautious to optimistic range."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Lump sum to invest (TT$)"
          value={lump}
          onChange={setLump}
          placeholder="e.g. 50000"
        />
        <Field
          label="Monthly contribution (TT$)"
          value={monthly}
          onChange={setMonthly}
          placeholder="e.g. 1000"
        />
        <Field label="Time horizon (years)" value={horizon} onChange={setHorizon} placeholder="e.g. 15" />
      </div>

      {ready ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-brand p-5 text-white">
            <p className="text-sm text-white/70">
              Projected value after {years} years
            </p>
            <p className="mt-1 text-3xl font-semibold">
              {formatTTD(low)} – {formatTTD(high)}
            </p>
            <p className="mt-1 text-xs text-white/60">
              From {formatTTD(invested)} invested over the period
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ResultCard
              label="Cautious"
              value={formatTTD(low)}
              note={`At ~${pct(lowAnnualReturn)}/yr`}
            />
            <ResultCard
              label="Optimistic"
              value={formatTTD(high)}
              note={`At ~${pct(highAnnualReturn)}/yr`}
            />
            <ResultCard
              label="Total you'd put in"
              value={formatTTD(invested)}
              note="Lump sum + contributions, before growth"
            />
          </div>

          <div className="pt-1">
            <WhatsAppCTA
              message={message}
              label="Explore investing on WhatsApp"
              lead={{
                source: "investment-projector",
                recommended: "Investments / Mutual Funds",
                figures: { lumpSum, monthlyContribution, years, low, high },
              }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          Enter a lump sum and/or a monthly contribution, plus a time horizon.
        </p>
      )}

      <Assumptions>
        Monthly compounding across a {pct(lowAnnualReturn)}–{pct(highAnnualReturn)}/yr
        return range (editable in costFigures.ts). Illustration only. Returns
        are not guaranteed and funds can fall as well as rise.
      </Assumptions>
    </ToolFrame>
  );
}
