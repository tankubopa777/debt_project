// ============================
// Utility Functions
// ============================

/**
 * Format number as Thai Baht currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to short Thai format (e.g. 15 ก.พ. 2569)
 */
export function formatThaiDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format date to long Thai format (e.g. 15 กุมภาพันธ์ 2569)
 */
export function formatThaiDateLong(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(paid: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(Math.round((paid / total) * 100), 100);
}

/**
 * Combine class names (simple utility)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
