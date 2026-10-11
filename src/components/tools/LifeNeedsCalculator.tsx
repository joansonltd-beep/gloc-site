"use client";
import { useState } from "react";
import { formatJMD } from "@/lib/format";
import WhatsAppCTA from "./WhatsAppCTA";
import { ToolFrame, Field, ResultCard, Assumptions } from "./ToolUI";
export default function LifeNeedsCalculator() {
  const [expenses, setExpenses] = useState("");
  const [years, setYears] = useState("");
  const [debts, setDebts] = useState("");
  const [other, setOther] = useState("");
  const [savings, setSavings] = useState("");
  const [cover, setCover] = useState("");
  const values = [expenses, years, debts, other, savings, cover];
  const valid = values.every(
    (v) => v === "" || (Number.isFinite(Number(v)) && Number(v) >= 0),
  );
  const ready =
    valid && Number(expenses) > 0 && Number(years) > 0 && Number(years) <= 100;
  const livingCosts = Number(expenses) * 12 * Number(years);
  const commitments = Number(debts) + Number(other);
  const resources = Number(savings) + Number(cover);
  const gap = Math.max(0, livingCosts + commitments - resources);
  return (
    <ToolFrame
      title="Family cover planning tool"
      intro="Use your own household figures to explore a possible gap. All amounts are in Jamaican dollars (JMD)."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Monthly family expenses (J$)"
          value={expenses}
          onChange={setExpenses}
        />
        <Field
          label="Years you want to provide for"
          value={years}
          onChange={setYears}
        />
        <Field label="Debts to clear (J$)" value={debts} onChange={setDebts} />
        <Field
          label="Other one-off needs (J$)"
          value={other}
          onChange={setOther}
        />
        <Field
          label="Savings available for these needs (J$)"
          value={savings}
          onChange={setSavings}
        />
        <Field
          label="Existing life cover (J$)"
          value={cover}
          onChange={setCover}
        />
      </div>
      {ready ? (
        <div className="mt-6 space-y-4" aria-live="polite">
          <div className="rounded-xl bg-brand p-5 text-white">
            <p className="text-sm text-white/80">Gap based on your figures</p>
            <p className="mt-2 text-3xl font-semibold">{formatJMD(gap)}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <ResultCard
              label="Living costs"
              value={formatJMD(livingCosts)}
              note="Monthly expenses × 12 × years entered"
            />
            <ResultCard
              label="Other commitments"
              value={formatJMD(commitments)}
              note="Debts and one-off needs you entered"
            />
            <ResultCard
              label="Available resources"
              value={formatJMD(resources)}
              note="Savings and existing life cover you entered"
            />
          </div>
          <WhatsAppCTA
            message={`Hi, the family planning tool shows a gap of ${formatJMD(gap)} using my figures. I'd like to discuss my questions.`}
            label="Talk through my figures"
            lead={{
              source: "life-needs-calculator",
              recommended: "Family protection",
              figures: {
                currency: "JMD",
                monthlyExpenses: Number(expenses),
                years: Number(years),
                debts: Number(debts),
                otherNeeds: Number(other),
                savings: Number(savings),
                existingCover: Number(cover),
                gap,
              },
            }}
          />
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-600">
          Enter your monthly family expenses and a planning period of up to 100
          years. Leave optional amounts blank if they do not apply.
        </p>
      )}
      <Assumptions>
        Living costs plus debts and other needs, less available savings and
        existing cover. Blank optional fields count as zero. This simple
        illustration excludes inflation, investment growth and policy terms. It
        is not a quote, eligibility decision or personalised recommendation.
      </Assumptions>
    </ToolFrame>
  );
}
