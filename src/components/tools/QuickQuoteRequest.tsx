"use client";

import { useState } from "react";
import { formatTTD } from "@/lib/format";
import WhatsAppCTA from "./WhatsAppCTA";
import { ToolFrame, Field, SelectField } from "./ToolUI";

// Quick-quote request (spec.md §7). Asset type + basic details -> WhatsApp
// with the details pre-filled.
const ASSET_TYPES = [
  { value: "motor", label: "Motor / vehicle" },
  { value: "home", label: "Home" },
  { value: "property", label: "Other property" },
];

const DETAIL_LABEL: Record<string, string> = {
  motor: "Vehicle (make, model, year)",
  home: "Home location & type",
  property: "Property location & type",
};

export default function QuickQuoteRequest() {
  const [assetType, setAssetType] = useState("motor");
  const [details, setDetails] = useState("");
  const [value, setValue] = useState("");

  const estValue = Number(value) || 0;
  const ready = details.trim().length > 0;

  const typeLabel =
    ASSET_TYPES.find((a) => a.value === assetType)?.label ?? assetType;

  const message = `Hi, I'd like a quick quote for ${typeLabel.toLowerCase()}. Details: ${details}${
    estValue ? `. Estimated value: ${formatTTD(estValue)}` : ""
  }.`;

  return (
    <ToolFrame
      title="Quick-Quote Request"
      intro="Tell me what you'd like covered and I'll come back with a quote. The button below opens WhatsApp with your details ready to send."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="What are you insuring?"
          value={assetType}
          onChange={setAssetType}
          options={ASSET_TYPES}
        />
        <Field
          label={DETAIL_LABEL[assetType]}
          value={details}
          onChange={setDetails}
          placeholder="A few details"
          type="text"
        />
        <Field
          label="Estimated value (TT$)"
          value={value}
          onChange={setValue}
          placeholder="optional"
        />
      </div>

      {ready ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-medium text-brand">Ready to send:</p>
            <p className="mt-1">{message}</p>
          </div>
          <WhatsAppCTA
            message={message}
            label="Send my details on WhatsApp"
            lead={{
              source: "quick-quote",
              recommended: typeLabel,
              figures: estValue ? { estimatedValue: estValue } : undefined,
            }}
          />
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          Add a few details about what you want covered to continue.
        </p>
      )}
    </ToolFrame>
  );
}
