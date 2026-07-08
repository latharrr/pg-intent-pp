export type QuestionStepId = "landing" | "budget" | "room-type";

export type WizardStepId = QuestionStepId;

export interface WizardStepDef {
  id: WizardStepId;
  progressIndex: number;
  /** Auto-advance after a brief feedback pause. */
  interaction: "single-auto";
}

/**
 * 3-question PG Hunt Planner aligned with the UX blueprint.
 * Each question shows its own inline confirmation line and auto-advances
 * directly to the next question - no separate bridge screens.
 */
export const WIZARD_STEPS: WizardStepDef[] = [
  { id: "landing", progressIndex: 1, interaction: "single-auto" },
  { id: "budget", progressIndex: 2, interaction: "single-auto" },
  { id: "room-type", progressIndex: 3, interaction: "single-auto" },
];

export const QUESTION_PROGRESS_TOTAL = 3;

export function getWizardStepIndex(stepId: WizardStepId): number {
  return WIZARD_STEPS.findIndex((step) => step.id === stepId);
}
