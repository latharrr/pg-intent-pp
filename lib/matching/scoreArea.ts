import type { Area, College, PG, UserProfile } from "@/types";
import { AREA_WEIGHTS, getBudgetRange, scoreAgainstRange } from "./weights";

export interface ScoreResult {
  score: number;
  reasons: string[];
}

export function scoreArea(
  profile: UserProfile,
  area: Area,
  pgsInArea: PG[],
  colleges: College[],
): ScoreResult {
  let earned = 0;
  let possible = 0;
  const reasons: string[] = [];

  const budgetRange = getBudgetRange(profile);
  if (budgetRange) {
    const points = scoreAgainstRange(area.avgRentPerMonth, budgetRange, AREA_WEIGHTS.budget);
    earned += points;
    possible += AREA_WEIGHTS.budget;
    if (points >= AREA_WEIGHTS.budget * 0.8) reasons.push("within budget");
  }

  const distancePoints = AREA_WEIGHTS.distance * clamp((25 - area.walkTimeToCampusMin) / 20, 0, 1);
  earned += distancePoints;
  possible += AREA_WEIGHTS.distance;
  const college = area.nearestCollegeId ? colleges.find((c) => c.id === area.nearestCollegeId) : undefined;
  if (distancePoints >= AREA_WEIGHTS.distance * 0.7) {
    reasons.push(college ? `${area.walkTimeToCampusMin} min to ${college.name}` : `${area.walkTimeToCampusMin} min walk`);
  }

  earned += area.safetyTag ? AREA_WEIGHTS.safety : AREA_WEIGHTS.safety * 0.4;
  possible += AREA_WEIGHTS.safety;

  const score = possible > 0 ? Math.round((earned / possible) * 100) : 50;
  return { score: clamp(score, 0, 100), reasons };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
