// Cost benchmarks stay empty until current local figures are confirmed.
export type CostFigureSeed = {
  key: string;
  label: string;
  value: number;
  note?: string;
  order: number;
};
export const DEFAULT_COST_FIGURES: CostFigureSeed[] = [];
export const DEFAULT_COST_FIGURE_VALUES: Record<string, number> = {};
