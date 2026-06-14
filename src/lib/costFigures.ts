// =====================================================================
// EDITABLE COST BENCHMARKS & TOOL ASSUMPTIONS
// =====================================================================
// Source: spec.md §10. These are PLACEHOLDERS and must be VERIFIED against
// a live private-facility quote before launch. They move into Sanity in M4
// so the agent can edit them without touching code.
//
// Everything a tool computes traces back to a labelled number here. Change
// a figure in this file and every tool result updates.
// =====================================================================

// --- §10 cost benchmarks ---------------------------------------------
export const COST_FIGURES = {
  // Major orthopedic surgery (e.g. hip): TT$25,000–40,000 + TT$10,000–15,000 post-op
  orthopedicSurgery: {
    low: 25_000,
    high: 40_000,
    postOpLow: 10_000,
    postOpHigh: 15_000,
  },
  // Dialysis: ~TT$1,200/session + TT$550+ meds -> TT$15,000+/month at 3x/week
  // (dated figure, re-quote before launch)
  dialysisMonthly: 15_000,
  // Local individual health plan: ~TT$300–1,500/month by age & cover
  healthPlanMonthly: { low: 300, high: 1_500 },
} as const;

// --- Protection Planner assumptions (spec.md §7) ---------------------
export const PLANNER_ASSUMPTIONS = {
  // Life cover target = annual income × this many years of income replacement.
  incomeReplacementYears: 10,
  // Extra life cover per dependent (education, care, etc.).
  perDependentLumpSum: 50_000,
  // A critical-illness lump sum should bridge this many months of income…
  criticalIllnessIncomeMonths: 12,
  // …on top of a major treatment cost (orthopedic high + post-op high is used).
} as const;

// --- Pension-vs-Inflation projector assumptions (spec.md §7) ---------
export const PENSION_ASSUMPTIONS = {
  // Money left in a plain savings account barely grows…
  savingsAnnualReturn: 0.01, // 1%/yr
  // …vs a structured Guardian pension/annuity plan.
  structuredAnnualReturn: 0.06, // 6%/yr
  // TT-dollar erosion: assumed long-run inflation.
  inflationAnnualRate: 0.04, // 4%/yr
} as const;

// --- Investment growth projector assumptions (spec.md §7) ------------
export const INVESTMENT_ASSUMPTIONS = {
  // Projected value is shown as a range between a cautious and an optimistic return.
  lowAnnualReturn: 0.04, // 4%/yr
  highAnnualReturn: 0.08, // 8%/yr
} as const;
