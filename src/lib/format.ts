/**
 * Format a number as ZAR currency.
 */
export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000_000) {
      return `R${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (Math.abs(value) >= 1_000_000) {
      return `R${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `R${(value / 1_000).toFixed(0)}K`;
    }
  }
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as a percentage.
 * If the value is already a ratio (< 1 typically from Excel), multiply by 100.
 */
export function formatPercent(value: number, isRatio = false): string {
  const pct = isRatio ? value * 100 : value;
  return `${pct.toFixed(1)}%`;
}

/**
 * Format a number with commas.
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-ZA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a ratio as Nx (e.g., 1.25x).
 */
export function formatRatio(value: number): string {
  return `${value.toFixed(2)}x`;
}

/**
 * Format a date string.
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
