/**
 * Master step sequence for the PG Hunt Planner app.
 * 3 question sub-steps live inside /plan but still advance the footer visually.
 */
export const ORDERED_STEP_IDS = [
  "hero",
  "landing",
  "landing-bridge",
  "budget",
  "budget-bridge",
  "room-type",
  "room-type-bridge",
  "matching",
  "results",
  "contact",
  "success",
] as const;

export type StepId = (typeof ORDERED_STEP_IDS)[number];

const QUESTION_STEP_IDS: StepId[] = ["landing", "budget", "room-type"];
const BRIDGE_STEP_ID_BY_QUESTION: Record<string, StepId> = {
  landing: "landing-bridge",
  budget: "budget-bridge",
  "room-type": "room-type-bridge",
};

const FOOTER_STEP_BY_ID: Record<StepId, number> = {
  hero: 0,
  landing: 1,
  "landing-bridge": 1,
  budget: 1,
  "budget-bridge": 1,
  "room-type": 1,
  "room-type-bridge": 1,
  matching: 2,
  results: 3,
  contact: 4,
  success: 5,
};

// Each question (and its narrative bridge right after it) notches forward
// fractionally within the 1-2 range - the bridge holds the same value as the
// question it follows so the footer road doesn't jump during that beat.
QUESTION_STEP_IDS.forEach((id, index) => {
  const value = 1 + index / QUESTION_STEP_IDS.length;
  FOOTER_STEP_BY_ID[id] = value;
  FOOTER_STEP_BY_ID[BRIDGE_STEP_ID_BY_QUESTION[id]] = value;
});

export function getFooterStep(stepId: string): number {
  return FOOTER_STEP_BY_ID[stepId as StepId] ?? 0;
}

export function getStepIndex(stepId: string): number {
  const index = ORDERED_STEP_IDS.indexOf(stepId as StepId);
  return index === -1 ? 0 : index;
}

export const TOTAL_FOOTER_STEPS = 5;
