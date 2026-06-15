"use client";

import { useState } from "react";
import { PLANNER_ASSUMPTIONS } from "@/lib/costFigures";
import { formatTTD } from "@/lib/format";
import WhatsAppCTA from "./WhatsAppCTA";
import { ToolFrame, Field, ResultCard, Assumptions } from "./ToolUI";

// Protection Planner (spec.md §7). Inputs: monthly income, dependents,
// existing cover. Output: combined need across life cover, health gap and a
// critical-illness lump sum, using the §10 cost figures (from Sanity).
export default function ProtectionPlanner({
  costFigures,
}: {
  costFigures: Record<string, number>;
}) {
  const [income, setIncome] = useState("");
  const [dependents, setDependents] = useState("");
  const [existing, setExisting] = useState("");

  const monthlyIncome = Number(income) || 0;
  const numDependents = Number(dependents) || 0;
  const existingCover = Number(existing) || 0;
  const ready = monthlyIncome > 0;

  const { incomeReplacementYears, perDependentLumpSum } = PLANNER_ASSUMPTIONS;
  const surgeryHigh = costFigures.orthopedicSurgeryHigh ?? 0;
  const postOpHigh = costFigures.orthopedicPostOpHigh ?? 0;
  // Recommended Critical Illness cover (a flat lump sum), editable in Sanity.
  const criticalIllness = costFigures.criticalIllnessCover ?? 75_000;

  const annualIncome = monthlyIncome * 12;

  // Life cover need vs what they already hold.
  const lifeNeed =
    annualIncome * incomeReplacementYears + numDependents * perDependentLumpSum;
  const lifeGap = Math.max(0, lifeNeed - existingCover);

  // Health exposure: out-of-pocket risk a health plan removes (major surgery).
  const healthExposure = surgeryHigh + postOpHigh;

  const combined = lifeGap + criticalIllness;

  const message = `Hi, the Protection Planner suggested about ${formatTTD(
    lifeGap
  )} more life cover, a ${formatTTD(
    criticalIllness
  )} critical-illness lump sum, and health cover for ~${formatTTD(
    healthExposure
  )} of treatment exposure. I'd like to talk options.`;

  return (
    <ToolFrame
      title="Protection Planner"
      intro="A rough picture of the cover that would keep your family steady. Your real numbers come from a conversation."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Your monthly income (TT$)"
          value={income}
          onChange={setIncome}
          placeholder="e.g. 12000"
        />
        <Field
          label="People who depend on you"
          value={dependents}
          onChange={setDependents}
          placeholder="e.g. 2"
        />
        <Field
          label="Life cover you already have (TT$)"
          value={existing}
          onChange={setExisting}
          placeholder="e.g. 100000"
        />
      </div>

      {ready ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-brand p-5 text-white">
            <p className="text-sm text-white/70">Estimated combined need</p>
            <p className="mt-1 text-3xl font-semibold">{formatTTD(combined)}</p>
            <p className="mt-1 text-xs text-white/60">
              Life cover gap + critical-illness lump sum (health shown separately)
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ResultCard
              label="Life cover gap"
              value={formatTTD(lifeGap)}
              note={`${incomeReplacementYears}× annual income${
                numDependents ? ` + ${formatTTD(perDependentLumpSum)}/dependent` : ""
              }, less cover you hold`}
            />
            <ResultCard
              label="Critical-illness cover"
              value={formatTTD(criticalIllness)}
              note="Recommended tax-free lump sum on diagnosis"
            />
            <ResultCard
              label="Health exposure"
              value={formatTTD(healthExposure)}
              note="Out-of-pocket risk of one major surgery a health plan would cover"
            />
          </div>

          <div className="pt-1">
            <WhatsAppCTA
              message={message}
              lead={{
                source: "protection-planner",
                recommended: "Life, Critical Illness, Health",
                figures: {
                  lifeGap,
                  criticalIllness,
                  healthExposure,
                  combined,
                },
              }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          Enter your monthly income to see an estimate.
        </p>
      )}

      <Assumptions>
        Life cover target = {incomeReplacementYears}× annual income +{" "}
        {formatTTD(perDependentLumpSum)} per dependent. Critical-illness cover is
        a recommended flat lump sum of {formatTTD(criticalIllness)}. Health
        exposure is a major orthopedic surgery ({formatTTD(surgeryHigh)}) plus
        post-op ({formatTTD(postOpHigh)}). All figures are editable in Studio →
        Cost figures (placeholders, verify before launch).
      </Assumptions>
    </ToolFrame>
  );
}
