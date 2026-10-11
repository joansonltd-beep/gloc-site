"use client";

import { useState } from "react";
import WhatsAppCTA from "./WhatsAppCTA";
import { ToolFrame, Field, SelectField } from "./ToolUI";

// Group benefits enquiry (spec.md §7). Headcount + current cover (y/n)
// -> WhatsApp / booking.
export default function GroupBenefitsEnquiry() {
  const [headcount, setHeadcount] = useState("");
  const [hasCover, setHasCover] = useState("no");
  const [company, setCompany] = useState("");

  const team = Number(headcount) || 0;
  const ready = team > 0;

  const coverLine =
    hasCover === "yes"
      ? "We have some cover already and want to review it"
      : "We don't have group cover yet";

  const message = `Hi, I'd like to look at group coverage (life, health and pensions) for a team of ${team}${
    company ? ` at ${company}` : ""
  }. ${coverLine}.`;

  return (
    <ToolFrame
      title="Group Coverage Enquiry"
      intro="Share a few details about your employees to discuss life, health and pension coverage."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="How many staff?"
          value={headcount}
          onChange={setHeadcount}
          placeholder="e.g. 8"
        />
        <SelectField
          label="Any cover already?"
          value={hasCover}
          onChange={setHasCover}
          options={[
            { value: "no", label: "Not yet" },
            { value: "yes", label: "Yes, reviewing" },
          ]}
        />
        <Field
          label="Company (optional)"
          value={company}
          onChange={setCompany}
          placeholder="Company name"
          type="text"
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
            label="Enquire on WhatsApp"
            lead={{
              source: "group-benefits",
              recommended: "Group Coverage",
              figures: { headcount: team, hasExistingCover: hasCover },
            }}
          />
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          Enter your team size to continue.
        </p>
      )}
    </ToolFrame>
  );
}
