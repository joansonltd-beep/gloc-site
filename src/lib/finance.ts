// Future-value helpers for the Grow projectors (spec.md §7).
// Monthly compounding. All rates are annual decimals (e.g. 0.06 = 6%).

// FV of a lump sum left to compound.
export function futureValueLumpSum(
  principal: number,
  annualRate: number,
  years: number
): number {
  const r = annualRate / 12;
  const n = years * 12;
  return principal * Math.pow(1 + r, n);
}

// FV of a stream of equal monthly contributions.
export function futureValueMonthly(
  monthlyContribution: number,
  annualRate: number,
  years: number
): number {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return monthlyContribution * n;
  return monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
}

// Express a future nominal amount in today's TT dollars (inflation erosion).
export function realValue(
  nominal: number,
  inflationAnnualRate: number,
  years: number
): number {
  return nominal / Math.pow(1 + inflationAnnualRate, years);
}
