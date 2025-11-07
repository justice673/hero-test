import { PriceBreakdown } from "@/lib/services/heroPriceService";

export function formatCurrency(amount: number | undefined, currency: string): string {
  if (amount === undefined || Number.isNaN(Number(amount))) {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function formatRelativeDate(date: Date): string {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = Date.now();
  const updatedAt = new Date(date).getTime();
  const diffInMs = updatedAt - now;
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (Number.isNaN(updatedAt)) {
    return "recently";
  }

  if (Math.abs(diffInDays) > 7) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(updatedAt);
  }

  return formatter.format(diffInDays, "day");
}

export function getLowestOnRoadPrice(details: PriceBreakdown[]): number {
  return Math.min(...details.map((detail) => Number(detail.onRoadPrice)));
}

export function getHighestOnRoadPrice(details: PriceBreakdown[]): number {
  return Math.max(...details.map((detail) => Number(detail.onRoadPrice)));
}

export function getAverageInsurance(details: PriceBreakdown[]): number {
  const insuranceValues = details
    .map((detail) => detail.insurance)
    .filter((value): value is number => typeof value === "number" && !Number.isNaN(value));

  if (!insuranceValues.length) {
    return 0;
  }

  const total = insuranceValues.reduce((sum, value) => sum + value, 0);
  return Math.round(total / insuranceValues.length);
}
