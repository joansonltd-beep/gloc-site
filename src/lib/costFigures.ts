// =====================================================================
// COST BENCHMARKS (defaults / seed) & TOOL ASSUMPTIONS
// =====================================================================
// The §10 cost figures now live in Sanity (editable by the agent). The values
// below are the seed + offline fallback: they are imported by the seed script
// and used when Sanity is not configured. Source: spec.md §10 — PLACEHOLDERS,
// verify against a live private-facility quote before launch.
//
// The calculator ASSUMPTIONS stay in code: they are math, not editable copy,
// and are clearly labelled here so they are easy to change.
// =====================================================================

export type CostFigureSeed = {
  key: string; // stable id the code looks up
  label: string;
  value: number;
  note?: string;
  order: number;
};

// §10 benchmarks, one keyed scenario+value per row (matches the Sanity model).
export const DEFAULT_COST_FIGURES: CostFigureSeed[] = [
  { key: "orthopedicSurgeryLow", label: "Major orthopedic surgery (low)", value: 25_000, order: 1 },
  { key: "orthopedicSurgeryHigh", label: "Major orthopedic surgery (high)", value: 40_000, order: 2 },
  { key: "orthopedicPostOpLow", label: "Orthopedic surgery post-op (low)", value: 10_000, order: 3 },
  { key: "orthopedicPostOpHigh", label: "Orthopedic surgery post-op (high)", value: 15_000, order: 4 },
  {
    key: "dialysisMonthly",
    label: "Dialysis, per month at 3x/week incl. meds",
    value: 15_000,
    note: "Dated figure, re-quote before launch.",
    order: 5,
  },
  { key: "healthPlanMonthlyLow", label: "Local individual health plan (low)", value: 300, order: 6 },
  { key: "healthPlanMonthlyHigh", label: "Local individual health plan (high)", value: 1_500, order: 7 },
  {
    key: "criticalIllnessCover",
    label: "Critical Illness recommended cover",
    value: 75_000,
    note: "Flat lump sum the Protection Planner recommends on diagnosis.",
    order: 8,
  },
];

// Convenience: keyed map of just the values, used as the fallback for tools.
export const DEFAULT_COST_FIGURE_VALUES: Record<string, number> =
  Object.fromEntries(DEFAULT_COST_FIGURES.map((f) => [f.key, f.value]));

// --- Protection Planner assumptions (spec.md §7) ---------------------
export const PLANNER_ASSUMPTIONS = {
  incomeReplacementYears: 10, // life cover target = annual income × this
  perDependentLumpSum: 50_000, // extra life cover per dependent
  criticalIllnessIncomeMonths: 12, // months of income a CI lump sum should bridge
} as const;

// Pension & investment projector rates now live in Sanity (Calculator
// settings); their defaults are in src/lib/defaults.ts (DEFAULT_CALCULATOR).
