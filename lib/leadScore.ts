import type { LeadScore, MoveTimeline } from "@/types/enums";

/** Lead score based on admission round urgency.
 * "round_1_confirmed" = highest intent, "still_deciding" = lowest. */
export function computeLeadScore(moveTimeline: MoveTimeline | null): LeadScore {
  if (moveTimeline === "round_1_confirmed") return "hot";
  if (moveTimeline === "waiting_round_2") return "warm";
  return "cold";
}
