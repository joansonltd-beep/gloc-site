"use client";

import { useState } from "react";
import { formatTTD } from "@/lib/format";
import type { IllnessCost } from "@/lib/defaults";
import WhatsAppCTA from "./WhatsAppCTA";
import { ToolFrame, SelectField } from "./ToolUI";

// Critical Illness cost explorer (separate from the Protection Planner).
// Pick a covered condition and see the indicative TT$ cost of treating it.
// Figures come from Sanity (Studio → Critical illness costs).
const UNIT_LABEL: Record<IllnessCost["unit"], string> = {
  total: "",
  year: " per year",
  day: " per day",
};

export default function CriticalIllnessExplorer({
  illnessCosts,
}: {
  illnessCosts: IllnessCost[];
}) {
  const [selected, setSelected] = useState(illnessCosts[0]?.condition ?? "");
  const item = illnessCosts.find((c) => c.condition === selected) ?? illnessCosts[0];

  if (!item) return null;

  const hasFigure = item.costLow != null || item.costHigh != null;
  const low = item.costLow ?? item.costHigh ?? 0;
  const high = item.costHigh ?? item.costLow ?? 0;
  const unit = UNIT_LABEL[item.unit];

  const figureText = !hasFigure
    ? "Varies"
    : low === high
      ? `${formatTTD(low)}${unit}`
      : `${formatTTD(low)} – ${formatTTD(high)}${unit}`;

  const message = `Hi, I was looking at Critical Illness cover and the cost of treating ${item.condition}. I'd like to understand my options.`;

  return (
    <ToolFrame
      title="Critical Illness: what treatment can cost"
      intro="Critical Illness cover pays you a tax-free lump sum on diagnosis. Pick a covered condition to see the indicative cost of treating it, so you can see why the cover matters."
    >
      <div className="grid gap-4 sm:max-w-sm">
        <SelectField
          label="Choose a covered condition"
          value={selected}
          onChange={setSelected}
          options={illnessCosts.map((c) => ({
            value: c.condition,
            label: c.condition,
          }))}
        />
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl bg-brand p-5 text-white">
          <p className="text-sm text-white/70">
            Indicative cost of treating {item.condition}
          </p>
          <p className="mt-1 text-3xl font-semibold">{figureText}</p>
          {item.note ? (
            <p className="mt-1 text-xs text-white/60">{item.note}</p>
          ) : null}
        </div>

        <WhatsAppCTA
          message={message}
          label="Talk about Critical Illness cover"
          lead={{
            source: "critical-illness-explorer",
            recommended: "Critical Illness",
            figures: { condition: item.condition },
          }}
        />
      </div>

      <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-400">
        <span className="font-semibold text-slate-500">Note: </span>
        All figures are in TT$ and are indicative estimates, editable in Studio →
        Critical illness costs. Verify against local facility quotes before
        relying on them. Critical Illness insurance pays a fixed lump sum on
        diagnosis; it does not reimburse the actual bill.
      </p>
    </ToolFrame>
  );
}
