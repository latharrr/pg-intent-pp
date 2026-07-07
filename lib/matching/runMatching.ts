import type { Area, College, PG, Recommendation, UserProfile } from "@/types";
import { scoreArea } from "./scoreArea";
import { scorePG } from "./scorePG";

export interface MatchingDeps {
  areas: Area[];
  pgs: PG[];
  colleges: College[];
}

/** Scores every area and PG against the profile, sorts both by score, and
 * excludes gender-gated PGs entirely. Called directly as a plain function - 
 * no API route, no query cache; it's cheap enough to recompute on demand. */
export function runMatching(profile: UserProfile, deps: MatchingDeps): Recommendation[] {
  const recommendations = deps.areas.map((area) => {
    const pgsInArea = deps.pgs.filter((pg) => pg.areaId === area.id);
    const areaResult = scoreArea(profile, area, pgsInArea, deps.colleges);

    const pgMatches = pgsInArea
      .map((pg) => ({ pg, result: scorePG(profile, pg, areaResult.score) }))
      .filter(({ result }) => !result.excluded)
      .sort((a, b) => b.result.score - a.result.score)
      .map(({ pg, result }) => ({
        pgId: pg.id,
        pgMatchPercent: result.score,
        pgMatchReasons: result.reasons,
      }));

    return {
      areaId: area.id,
      areaMatchPercent: areaResult.score,
      areaMatchReasons: areaResult.reasons,
      pgMatches,
    } satisfies Recommendation;
  });

  return recommendations.sort((a, b) => b.areaMatchPercent - a.areaMatchPercent);
}
