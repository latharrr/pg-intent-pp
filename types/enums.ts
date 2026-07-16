/**
 * Canonical enums aligned with the Picapool PG Hunt Planner UX Blueprint.
 * The flow is intentionally minimal: 3 questions (landing, budget, room)
 * and a result. Values are stable snake_case; UI copy is kept in label maps.
 */

export const BUDGET_BANDS = ["8k_12k", "12k_18k", "18k_plus"] as const;
export type BudgetBand = (typeof BUDGET_BANDS)[number];

export const BUDGET_BAND_LABELS: Record<BudgetBand, string> = {
  "8k_12k": "₹8K - ₹12K",
  "12k_18k": "₹12K - ₹18K",
  "18k_plus": "₹18K+",
};

export const BUDGET_BAND_MICROCOPY: Record<BudgetBand, string> = {
  "8k_12k": "Tight but doable",
  "12k_18k": "Comfortable",
  "18k_plus": "No stress",
};

export const ROOM_TYPES = ["solo", "shared_2", "shared_3"] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  solo: "Solo",
  shared_2: "2 Sharing",
  shared_3: "3 Sharing",
};

export const ROOM_TYPE_MICROCOPY: Record<RoomType, string> = {
  solo: "I need my space",
  shared_2: "One roommate is fine",
  shared_3: "More the merrier, cheaper the rent",
};

export const MOVE_TIMELINES = ["this_week", "one_two_weeks", "not_sure"] as const;
export type MoveTimeline = (typeof MOVE_TIMELINES)[number];

export const MOVE_TIMELINE_LABELS: Record<MoveTimeline, string> = {
  this_week: "This week",
  one_two_weeks: "1-2 weeks",
  not_sure: "Not sure yet",
};

export const MOVE_TIMELINE_MICROCOPY: Record<MoveTimeline, string> = {
  this_week: "Packing bags already",
  one_two_weeks: "Getting things ready",
  not_sure: "No rush, just exploring",
};

export const CAMPUS_ZONES = ["north_campus", "south_campus", "off_campus"] as const;
export type CampusZone = (typeof CAMPUS_ZONES)[number];

export const CAMPUS_ZONE_LABELS: Record<CampusZone, string> = {
  north_campus: "North Campus",
  south_campus: "South Campus",
  off_campus: "Off Campus",
};

export const GENDERS = ["male", "female"] as const;
export type Gender = (typeof GENDERS)[number];

export const GENDER_LABELS: Record<Gender, string> = {
  male: "Male",
  female: "Female",
};

export const INTENTS = ["pg_hunt", "flatmate_pg", "exploring"] as const;
export type Intent = (typeof INTENTS)[number];

export const LEAD_SCORES = ["hot", "warm", "cold"] as const;
export type LeadScore = (typeof LEAD_SCORES)[number];

export const FOOD_POLICIES = ["non_veg_ok", "veg_only", "no_food"] as const;
export type FoodPolicy = (typeof FOOD_POLICIES)[number];

export const GENDER_POLICIES = ["male_only", "female_only", "any"] as const;
export type GenderPolicy = (typeof GENDER_POLICIES)[number];

export const ANIMATION_STATES = ["idle", "advancing", "arrived"] as const;
export type AnimationState = (typeof ANIMATION_STATES)[number];
