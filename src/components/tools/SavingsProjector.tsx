"use client";
import { useState } from "react";
import {
  futureValueLumpSum,
  futureValueMonthly,
  realValue,
} from "@/lib/finance";
import { formatJMD } from "@/lib/format";
import { Field, ToolFrame, Assumptions, ResultCard } from "./ToolUI";
import WhatsAppCTA from "./WhatsAppCTA";
export default function SavingsProjector({
  retirement = false,
}: {
  retirement?: boolean;
}) {
  const [lump, setLump] = useState("");
  const [monthly, setMonthly] = useState("");
  const [years, setYears] = useState("");
  const [rate, setRate] = useState("");
  const [inflation, setInflation] = useState("");
  const valid = [lump, monthly, years, rate, inflation].every(
    (v) => v === "" || (Number.isFinite(Number(v)) && Number(v) >= 0),
  );
  const ready =
    valid &&
    (Number(lump) > 0 || Number(monthly) > 0) &&
    Number(years) > 0 &&
    Number(years) <= 100 &&
    rate !== "" &&
    Number(rate) <= 100 &&
    Number(inflation) <= 100;
  const nominal = ready
    ? futureValueLumpSum(Number(lump), Number(rate) / 100, Number(years)) +
      futureValueMonthly(Number(monthly), Number(rate) / 100, Number(years))
    : 0;
  const contributed = Number(lump) + Number(monthly) * 12 * Number(years);
  return (
    <ToolFrame
      title={
        retirement
          ? "Retirement savings illustration"
          : "Savings growth illustration"
      }
      intro="Explore a scenario using your own contribution, time period and annual return assumption. Amounts are in Jamaican dollars (JMD)."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Starting savings (J$)" value={lump} onChange={setLump} />
        <Field
          label="Monthly contribution (J$)"
          value={monthly}
          onChange={setMonthly}
        />
        <Field label="Time period (years)" value={years} onChange={setYears} />
        <Field
          label="Annual return assumption (%)"
          value={rate}
          onChange={setRate}
        />
        <Field
          label="Inflation assumption (%) (optional)"
          value={inflation}
          onChange={setInflation}
        />
      </div>
      {ready ? (
        <div className="mt-6 space-y-4" aria-live="polite">
          <div className="rounded-xl bg-brand p-5 text-white">
            <p className="text-sm text-white/80">
              Illustrated total after {years}{" "}
              {Number(years) === 1 ? "year" : "years"}
            </p>
            <p className="mt-2 text-3xl font-semibold">{formatJMD(nominal)}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label="Your contributions"
              value={formatJMD(contributed)}
              note="Starting savings plus all monthly contributions"
            />
            <ResultCard
              label="In today's purchasing power"
              value={formatJMD(
                realValue(nominal, Number(inflation) / 100, Number(years)),
              )}
              note={
                inflation === ""
                  ? "No inflation assumption entered"
                  : `Using your ${inflation}% annual inflation assumption`
              }
            />
          </div>
          <WhatsAppCTA
            message={`Hi, I tried the savings illustration with ${rate}% as my annual return assumption over ${years} years. I'd like to discuss planning questions.`}
            lead={{
              source: retirement ? "pension-projector" : "investment-projector",
              figures: {
                currency: "JMD",
                monthly: Number(monthly),
                lumpSum: Number(lump),
                years: Number(years),
                returnAssumption: Number(rate),
                inflationAssumption: Number(inflation),
                illustratedTotal: nominal,
              },
            }}
          />
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-600">
          Enter a contribution or starting amount, a time period up to 100
          years, and a return assumption from 0% to 100%. These are your
          assumptions, not offered rates.
        </p>
      )}
      <Assumptions>
        Monthly contributions at month end and monthly compounding at the annual
        rate divided by 12. Starting savings grow at that monthly rate.
        Inflation uses the annual assumption entered. Fees and taxes are
        excluded. This is a hypothetical illustration, not a product comparison
        or promised return. Investments can lose value.
      </Assumptions>
    </ToolFrame>
  );
}
