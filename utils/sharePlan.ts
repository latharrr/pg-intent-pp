import { formatRupees } from "@/utils/format";
import { getPGById } from "@/lib/data/pgs";
import type { PG } from "@/types";

export interface SharePlanInput {
  topPg: PG | null;
  nearestCollegeName?: string;
  shortlistedCount: number;
}

/**
 * Builds the WhatsApp share message for the "parent looking over shoulder" scenario.
 * Matches the UX spec: one PG highlighted, virtual visit link placeholder, shortlist count, and a short URL.
 */
export function buildShareText({ topPg, nearestCollegeName = "Hindu College", shortlistedCount }: SharePlanInput): string {
  const parts = ["Hey, I found a PG plan on Picapool:"];

  if (topPg) {
    parts.push(`→ ${topPg.name}, ${formatRupees(topPg.pricePerMonth)}/mo`);
    if (topPg.distanceToCollegeMin != null) {
      parts.push(`→ ${topPg.distanceToCollegeMin} min from ${nearestCollegeName}`);
    }
    parts.push("→ Virtual Visit: [link]");
  }

  const countLine = shortlistedCount > 0
    ? `→ Shortlisted: ${shortlistedCount} more PG${shortlistedCount !== 1 ? "s" : ""}`
    : "→ Still exploring more options";
  parts.push(countLine);

  parts.push("\nCheck it out: picapool.in/pg-hunt");
  return parts.join("\n");
}

/** Convenience helper when only PG ids are available. */
export function buildShareTextFromIds(topPgId: string | null | undefined, shortlistedPgIds: string[], nearestCollegeName?: string): string {
  const topPg = topPgId ? getPGById(topPgId) : undefined;
  const count = topPgId ? shortlistedPgIds.filter((id) => id !== topPgId).length : shortlistedPgIds.length;
  return buildShareText({ topPg: topPg ?? null, nearestCollegeName, shortlistedCount: count });
}
