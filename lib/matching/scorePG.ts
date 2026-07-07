import type { PG, UserProfile } from "@/types";
import { PG_WEIGHTS, getBudgetRange, scoreAgainstRange } from "./weights";
import type { ScoreResult } from "./scoreArea";

const VERIFICATION_STALE_DAYS = 60;

export interface PgScoreResult extends ScoreResult {
  /** Gender-policy mismatches are a hard gate, not a weighted factor - this
   * PG is excluded from results entirely, never merely ranked low. */
  excluded: boolean;
}

export function scorePG(profile: UserProfile, pg: PG, areaScore: number): PgScoreResult {
  let earned = 0;
  let possible = 0;
  const reasons: string[] = [];

  const budgetRange = getBudgetRange(profile);
  if (budgetRange) {
    const points = scoreAgainstRange(pg.pricePerMonth, budgetRange, PG_WEIGHTS.budget);
    earned += points;
    possible += PG_WEIGHTS.budget;
    if (points >= PG_WEIGHTS.budget * 0.8) reasons.push("within budget");
  }

  if (profile.roomType) {
    const matches = pg.roomTypes.includes(profile.roomType);
    earned += matches ? PG_WEIGHTS.roomType : 0;
    possible += PG_WEIGHTS.roomType;
    if (matches) reasons.push("matches your room type");
  }

  earned += pg.rating != null ? (pg.rating / 5) * PG_WEIGHTS.rating : PG_WEIGHTS.rating * 0.6;
  possible += PG_WEIGHTS.rating;

  const isFreshlyVerified =
    pg.verifiedStatus &&
    pg.lastVerifiedDate != null &&
    Date.now() - new Date(pg.lastVerifiedDate).getTime() < VERIFICATION_STALE_DAYS * 24 * 60 * 60 * 1000;
  earned += isFreshlyVerified ? PG_WEIGHTS.verification : 0;
  possible += PG_WEIGHTS.verification;
  if (isFreshlyVerified) reasons.push("Picapool Verified");

  const rawScore = possible > 0 ? (earned / possible) * 100 : 50;
  const blended = Math.round(rawScore * 0.8 + areaScore * 0.2);
  return { score: Math.min(100, Math.max(0, blended)), reasons, excluded: false };
}
