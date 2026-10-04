const grouper = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const grouper2 = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** ₹1,23,456 — Indian grouping, no decimals. */
export function inr(value: number): string {
  return `₹${grouper.format(Math.round(value))}`;
}

/** ₹12.35 — rupees with paise. */
export function inr2(value: number): string {
  return `₹${grouper2.format(value)}`;
}

/** ₹1.23 Cr / ₹4.50 L / ₹8,900 — for headline metrics. */
export function inrCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e7) return `₹${(value / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(value / 1e5).toFixed(2)} L`;
  return inr(value);
}

export function num(value: number): string {
  return grouper.format(Math.round(value));
}

export function compact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e7) return `${(value / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${(value / 1e5).toFixed(1)} L`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return num(value);
}

export function signed(value: number): string {
  return `${value >= 0 ? '+' : '−'}${inr(Math.abs(value))}`;
}
