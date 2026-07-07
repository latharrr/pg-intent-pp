const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatRupees(amount: number): string {
  return rupeeFormatter.format(amount);
}

export function formatRupeeRange(min: number, max: number): string {
  return `${formatRupees(min)} - ${formatRupees(max).replace("₹", "")}`;
}

export function formatWalkTime(minutes: number): string {
  return `${minutes} min walk`;
}
