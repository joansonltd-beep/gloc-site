"use client";

import { useState } from "react";
import { formatJMD } from "@/lib/format";
import { Field, ResultCard } from "./ToolUI";

export default function EducationSavingsCalculator() {
  const [cost, setCost] = useState("");
  const [saved, setSaved] = useState("");
  const [months, setMonths] = useState("");
  const target = Number(cost);
  const savings = Number(saved);
  const period = Number(months);
  const remaining = Math.max(0, target - savings);
  const ready = Number.isFinite(target) && target > 0 && Number.isFinite(savings) && savings >= 0 && Number.isSafeInteger(period) && period > 0;

  return (
    <div className="space-y-5 bg-white p-6 sm:p-8">
      <p className="text-slate-600">Enter your education budget and the time remaining to estimate how much to set aside each month.</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Expected education cost (J$)" value={cost} onChange={setCost} />
        <Field label="Already saved (J$)" value={saved} onChange={setSaved} />
        <Field label="Months until you need the money" value={months} onChange={setMonths} />
      </div>
      <div aria-live="polite">
        {ready && <ResultCard label="Monthly savings target" value={formatJMD(Math.ceil(remaining / period))}
          note={`${formatJMD(remaining)} left to save over ${period} month${period === 1 ? "" : "s"}`} />}
      </div>
      <p className="text-sm text-slate-600">This estimate divides the remaining cost by the number of months. It assumes no growth on savings and uses the cost you enter.</p>
    </div>
  );
}
