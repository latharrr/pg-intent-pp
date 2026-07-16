import type { LeadScore, MoveTimeline } from "@/types/enums";

/** Lead score based on move-in urgency.
 * "this_week" = highest intent, "not_sure" = lowest. */
export function computeLeadScore(moveTimeline: MoveTimeline | null): LeadScore {
  if (moveTimeline === "this_week") return "hot";
  if (moveTimeline === "one_two_weeks") return "warm";
  return "cold";
}
