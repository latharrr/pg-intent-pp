import type { BudgetBand, RoomType, MoveTimeline, LeadScore } from "./enums";

/**
 * The PG Hunt Planner profile - intentionally minimal per the UX blueprint.
 * Only the 3 answers (landing, budget, room) plus contact/shortlist state.
 */
export interface UserProfile {
  sessionId: string;
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
