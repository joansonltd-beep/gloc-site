const wholeDollars = new Intl.NumberFormat("en-JM", {
  maximumFractionDigits: 0,
});
export function formatJMD(value: number): string {
  return `J$${wholeDollars.format(Math.round(value))}`;
}
export function formatJMDRange(low: number, high: number): string {
  return `${formatJMD(low)} to ${formatJMD(high)}`;
}
