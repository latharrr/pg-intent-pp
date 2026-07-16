import type { LeadScore } from "./enums";

/** The record posted to POST /api/lead at contact capture - a snapshot of the
 * profile fields worth keeping past the browser session, plus the ask itself. */
export interface Lead {
  name: string | null;
  phone: string | null;
  email: string | null;
  whatsappOptIn: boolean;
  leadScore: LeadScore | null;
  campusZone: string | null;
  budgetBand: string | null;
  bestAreaName: string | null;
  moveTimeline: string | null;
  roomType: string | null;
  referralSource: string | null;
  createdAt: string;
}
