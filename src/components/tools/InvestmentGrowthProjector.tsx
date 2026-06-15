"use client";

import { useState } from "react";
import { futureValueLumpSum, futureValueMonthly } from "@/lib/finance";
import { formatTTD } from "@/lib/format";
import type { CalculatorSettings } from "@/lib/defaults";
import WhatsAppCTA from "./WhatsAppCTA";
import { ToolFrame, Field, ResultCard, Assumptions } from "./ToolUI";

// Investment growth projector (spec.md §7). Inputs: lump sum and/or monthly
// contribution + horizon. Output: a projected value range, plus how much is
// paid in (premiums) vs how much is gained. Rates come from Sanity.
export default function InvestmentGrowthProjector({
  settings,
}: {
  settings: CalculatorSettings;
}) {
  const [lump, setLump] = useState("");
  const [monthly, setMonthly] = useState("");
  const [horizon, setHorizon] = useState("");

  const lumpSum = Number(lump) || 0;
  const monthlyContribution = Number(monthly) || 0;
  const years = Number(horizon) || 0;
  const ready = (lumpSum > 0 || monthlyContribution > 0) && years > 0;

  const lowAnnualReturn = settings.investmentLowReturn;
  const highAnnualReturn = settings.investmentHighReturn;

  const project = (rate: number) =>
    futureValueLumpSum(lumpSum, rate, years) +
    futureValueMonthly(monthlyContribution, rate, years);

  const low = project(lowAnnualReturn);
  const high = project(highAnnualReturn);
  const invested = lumpSum + monthlyContribution * 12 * years; // premiums paid in
  const gainLow = Math.max(0, low - invested);
  const gainHigh = Math.max(0, high - invested);

  const message = `Hi, the investment projector estimates ${formatTTD(
    low
  )}–${formatTTD(high)} over ${years} years from ${formatTTD(
    invested
  )} paid in. I'd like to talk investment options.`;

  // Whole percent, or one decimal when needed (e.g. 2.5%).
  const pct = (n: number) => {
    const v = n * 100;
    return `${Number.isInteger(v) ? v : v.toFixed(1)}%`;
  };

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
              From {formatTTD(invested)} paid in over the period
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label="What you pay in (premiums)"
              value={formatTTD(invested)}
              note="Lump sum + all contributions, before any growth"
            />
            <ResultCard
              label="What you'd gain (growth)"
              value={`${formatTTD(gainLow)} – ${formatTTD(gainHigh)}`}
              note="Projected value minus what you paid in"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label="Cautious total"
              value={formatTTD(low)}
              note={`At ~${pct(lowAnnualReturn)}/yr`}
            />
            <ResultCard
              label="Optimistic total"
              value={formatTTD(high)}
              note={`At ~${pct(highAnnualReturn)}/yr`}
            />
          </div>

          <div className="pt-1">
            <WhatsAppCTA
              message={message}
              label="Explore investing on WhatsApp"
              lead={{
                source: "investment-projector",
                recommended: "Investments / Mutual Funds",
                figures: { lumpSum, monthlyContribution, years, invested, low, high },
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
        return range. Illustration only. Returns are not guaranteed and funds can
        fall as well as rise.
      </Assumptions>
    </ToolFrame>
  );
}
