// Formatting helpers shared by the interactive tools.

const ttd = new Intl.NumberFormat("en-TT", {
  style: "currency",
  currency: "TTD",
  maximumFractionDigits: 0,
});

// e.g. 25000 -> "TT$25,000"
export function formatTTD(value: number): string {
  return ttd.format(Math.round(value)).replace("TTD", "TT$").replace("TT$ ", "TT$");
}

// e.g. 25000, 40000 -> "TT$25,000–40,000"
export function formatTTDRange(low: number, high: number): string {
  return `${formatTTD(low)}–${formatTTD(high).replace("TT$", "")}`;
}
