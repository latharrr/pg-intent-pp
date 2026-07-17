import { BUDGET_BAND_LABELS, CAMPUS_ZONE_LABELS, MOVE_TIMELINE_LABELS, ROOM_TYPE_LABELS, type BudgetBand, type CampusZone, type MoveTimeline, type RoomType } from "@/types/enums";

/**
 * Single source of truth for the per-question confirmation lines - verbatim
 * from the UX blueprint's "Instant feedback after every answer" spec. Each
 * one now renders on its own NarrativeBridgeScreen between questions, so the
 * question screens and the bridge screens both read from here.
 */
export function getCampusZoneConfirmation(zone: CampusZone): string {
  const label = CAMPUS_ZONE_LABELS[zone];
  return label ? `${label} it is.` : "Got it.";
}

export function getLandingConfirmation(timeline: MoveTimeline): string {
  const label = MOVE_TIMELINE_LABELS[timeline];
  return label ? `Got it, ${label.toLowerCase()}. That gives us a timeline.` : "Got it. That gives us a timeline.";
}

export function getBudgetConfirmation(band: BudgetBand): string {
  const label = BUDGET_BAND_LABELS[band];
  return label ? `Got it. We'll look for something in the ${label} zone.` : "Got it.";
}

export function getRoomConfirmation(type: RoomType): string {
  const label = ROOM_TYPE_LABELS[type];
  return label ? `Nice. ${label} it is. Let's see what matches.` : "Nice. Let's see what matches.";
}
