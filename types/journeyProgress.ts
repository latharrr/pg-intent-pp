import type { AnimationState } from "./enums";

/** Drives JourneyFooter + wizard resumability. */
export interface JourneyProgress {
  currentStepId: string;
  currentStepIndex: number;
  totalSteps: number;
  recommendedAreaId: string | null;
  animationState: AnimationState;
  completedStepIds: string[];
}

export const INITIAL_JOURNEY_PROGRESS: JourneyProgress = {
  currentStepId: "hero",
  currentStepIndex: 0,
  totalSteps: 7,
  recommendedAreaId: null,
  animationState: "idle",
  completedStepIds: [],
};
