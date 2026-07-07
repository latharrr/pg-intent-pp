export type QuestionStepId = "landing" | "budget" | "room-type";
export type BridgeStepId = "landing-bridge" | "budget-bridge" | "room-type-bridge";

export type WizardStepId = QuestionStepId | BridgeStepId;

export interface WizardStepDef {
  id: WizardStepId;
  kind: "question" | "bridge";
  progressIndex: number;
  /** Auto-advance after a brief feedback pause. */
  interaction: "single-auto";
}

/**
 * 3-question PG Hunt Planner aligned with the UX blueprint, with a
 * narrative "bridge" beat (the promoted confirmation line) after each
 * question - narrative, question, narrative, question, narrative, question.
 */
export const WIZARD_STEPS: WizardStepDef[] = [
  { id: "landing", kind: "question", progressIndex: 1, interaction: "single-auto" },
  { id: "landing-bridge", kind: "bridge", progressIndex: 1, interaction: "single-auto" },
  { id: "budget", kind: "question", progressIndex: 2, interaction: "single-auto" },
  { id: "budget-bridge", kind: "bridge", progressIndex: 2, interaction: "single-auto" },
  { id: "room-type", kind: "question", progressIndex: 3, interaction: "single-auto" },
  { id: "room-type-bridge", kind: "bridge", progressIndex: 3, interaction: "single-auto" },
];

export const QUESTION_PROGRESS_TOTAL = 3;

export function getWizardStepIndex(stepId: WizardStepId): number {
  return WIZARD_STEPS.findIndex((step) => step.id === stepId);
}
