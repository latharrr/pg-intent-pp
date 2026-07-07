import { BUDGET_BAND_LABELS, MOVE_TIMELINE_LABELS, ROOM_TYPE_LABELS, type BudgetBand, type MoveTimeline, type RoomType } from "@/types/enums";

/**
 * Single source of truth for the per-question confirmation lines - verbatim
 * from the UX blueprint's "Instant feedback after every answer" spec. Each
 * one now renders on its own NarrativeBridgeScreen between questions, so the
 * question screens and the bridge screens both read from here.
 */
export function getLandingConfirmation(timeline: MoveTimeline): string {
  return `Okay, so you're landing ${MOVE_TIMELINE_LABELS[timeline].toLowerCase()}. That gives us a timeline.`;
}

export function getBudgetConfirmation(band: BudgetBand): string {
  return `Got it. We'll look for something in the ${BUDGET_BAND_LABELS[band]} zone.`;
}

export function getRoomConfirmation(type: RoomType): string {
  return `Nice. ${ROOM_TYPE_LABELS[type]} it is. Let's see what matches.`;
}
