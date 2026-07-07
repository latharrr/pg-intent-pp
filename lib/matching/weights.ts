import type { BudgetBand, UserProfile } from "@/types";

export const AREA_WEIGHTS = {
  budget: 30,
  distance: 20,
  areaPreference: 20,
  lifestyle: 15,
  food: 10,
  safety: 5,
} as const;

export const PG_WEIGHTS = {
  budget: 25,
  gender: 20,
  food: 15,
  roomType: 15,
  rating: 10,
  amenities: 10,
  verification: 5,
} as const;

const BUDGET_BAND_RANGES: Record<BudgetBand, { min: number; max: number }> = {
  "8k_12k": { min: 8000, max: 12000 },
  "12k_18k": { min: 12000, max: 18000 },
  "18k_plus": { min: 18000, max: Infinity },
};

/** The comfortable rent range implied by the profile's chosen budget band. */
export function getBudgetRange(profile: UserProfile): { min: number; max: number } | null {
  if (profile.budgetBand) {
    return BUDGET_BAND_RANGES[profile.budgetBand];
  }
  return null;
}

/** Full points inside the range, linear falloff to 0 at 20% outside it. */
export function scoreAgainstRange(amount: number, range: { min: number; max: number }, weight: number): number {
  if (amount >= range.min && amount <= range.max) return weight;
  const rangeWidth = Math.max(range.max - range.min, 1);
  const distanceOutside = amount < range.min ? range.min - amount : amount - range.max;
  const falloff = 1 - distanceOutside / (rangeWidth * 0.2);
  return Math.max(0, weight * falloff);
}
