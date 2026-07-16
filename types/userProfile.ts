import type { BudgetBand, RoomType, MoveTimeline, LeadScore, CampusZone } from "./enums";

/**
 * The PG Hunt Planner profile - intentionally minimal per the UX blueprint.
 * Only the 4 answers (campus, landing, room, budget) plus contact/shortlist state.
 */
export interface UserProfile {
  sessionId: string;
  campusZone: CampusZone | null;
  budgetBand: BudgetBand | null;
  roomType: RoomType | null;
  moveTimeline: MoveTimeline | null;
  shortlistedPgIds: string[];
  name: string | null;
  phone: string | null;
  email: string | null;
  leadScore: LeadScore | null;
  whatsappOptIn: boolean;
  /** Attribution code from a personalized link, e.g. pg.picapool.tech/{code} - lets
   * a single WhatsApp template or influencer bio link be traced back to its source. */
  referralSource: string | null;
  createdAt: string;
  updatedAt: string;
}

export function createEmptyUserProfile(sessionId: string): UserProfile {
  const now = new Date().toISOString();
  return {
    sessionId,
    campusZone: null,
    budgetBand: null,
    roomType: null,
    moveTimeline: null,
    shortlistedPgIds: [],
    name: null,
    phone: null,
    email: null,
    leadScore: null,
    whatsappOptIn: false,
    referralSource: null,
    createdAt: now,
    updatedAt: now,
  };
}
