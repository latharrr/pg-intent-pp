export interface MoveTimelineItem {
  id: string;
  label: string;
}

/** Shown on /results after PG recommendations - "people remember progress, not recommendations." */
export const MOVE_TIMELINE_ITEMS: MoveTimelineItem[] = [
  { id: "today", label: "Today: lock in your budget & area" },
  { id: "documents", label: "Collect your documents" },
  { id: "parents", label: "Talk to your parents" },
  { id: "visit", label: "Visit your shortlisted PG" },
  { id: "book", label: "Book your PG" },
  { id: "move-in", label: "Move in" },
];
