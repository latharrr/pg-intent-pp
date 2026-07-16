export type QuestionStepId = "campus" | "landing" | "room-type" | "budget";

export type WizardStepId = QuestionStepId;

export interface WizardStepDef {
  id: WizardStepId;
  progressIndex: number;
  /** Auto-advance after a brief feedback pause. */
  interaction: "single-auto";
}

/**
 * 4-question PG Hunt Planner aligned with the UX blueprint.
 * Each question shows its own inline confirmation line and auto-advances
 * directly to the next question - no separate bridge screens.
 * Order: campus -> admission timing -> room sharing -> budget.
 */
export const WIZARD_STEPS: WizardStepDef[] = [
  { id: "campus", progressIndex: 1, interaction: "single-auto" },
  { id: "landing", progressIndex: 2, interaction: "single-auto" },
  { id: "room-type", progressIndex: 3, interaction: "single-auto" },
  { id: "budget", progressIndex: 4, interaction: "single-auto" },
];

export const QUESTION_PROGRESS_TOTAL = 4;

export function getWizardStepIndex(stepId: WizardStepId): number {
  return WIZARD_STEPS.findIndex((step) => step.id === stepId);
}
