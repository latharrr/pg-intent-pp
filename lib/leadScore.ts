import type { LeadScore, MoveTimeline } from "@/types/enums";

/** Lead score based on landing timeline urgency.
 * "this_week" = highest intent, "still_deciding" = lowest. */
export function computeLeadScore(moveTimeline: MoveTimeline | null): LeadScore {
  if (moveTimeline === "this_week") return "hot";
  if (moveTimeline === "next_week") return "warm";
  return "cold";
}
