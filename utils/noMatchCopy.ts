import type { MoveTimeline } from "@/types/enums";

/**
 * Dynamic onboarding-date promise based on the user's landing timeline.
 * Prevents the "I'm landing this week but you said July 20" mismatch.
 */
export function getNoMatchOnboardingMessage(moveTimeline: MoveTimeline | null, fallbackDate = "July 20"): string {
  switch (moveTimeline) {
    case "this_week":
      return "We're onboarding PGs that fit this exact plan in the next 2–3 days.";
    case "next_week":
      return `We're onboarding 6 PGs that fit this exact plan by ${fallbackDate}.`;
    case "still_deciding":
    default:
      return `We're onboarding 6 PGs that fit this exact plan by ${fallbackDate}. Save your plan and we'll update you.`;
  }
}
