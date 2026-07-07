"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJourneyStore } from "@/lib/store/useJourneyStore";
import { track } from "@/lib/analytics";
import { ROUTES } from "@/constants/routes";
import { WIZARD_STEPS, getWizardStepIndex, type WizardStepId } from "./wizardSteps";

function isWizardStepId(id: string): id is WizardStepId {
  return WIZARD_STEPS.some((step) => step.id === id);
}

export function useWizardStep() {
  const router = useRouter();
  const currentStepId = useJourneyStore((state) => state.journey.currentStepId);
  const goToStep = useJourneyStore((state) => state.goToStep);

  const resolvedStepId: WizardStepId = isWizardStepId(currentStepId) ? currentStepId : WIZARD_STEPS[0].id;
  const stepIndex = getWizardStepIndex(resolvedStepId);
  const stepDef = WIZARD_STEPS[stepIndex];

  // On first mount, if the store isn't already parked on a wizard step
  // (e.g. arriving fresh from the hero), snap it to the first question.
  useEffect(() => {
    if (!isWizardStepId(currentStepId)) {
      goToStep(WIZARD_STEPS[0].id);
      track("step_viewed", { stepId: WIZARD_STEPS[0].id });
    } else {
      track("step_viewed", { stepId: currentStepId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goNext() {
    track("step_completed", { stepId: resolvedStepId });
    const nextIndex = stepIndex + 1;
    if (nextIndex >= WIZARD_STEPS.length) {
      // Don't touch the store here - /results calls goToStep("matching")
      // itself on mount. Updating it early, while /plan is still mounted,
      // makes currentStepId momentarily invalid for this wizard and flashes
      // the fallback (first) question before the route change lands.
      router.push(ROUTES.results);
      return;
    }
    const nextStep = WIZARD_STEPS[nextIndex];
    goToStep(nextStep.id);
    track("step_viewed", { stepId: nextStep.id });
  }

  function goBack() {
    track("back_click", { stepId: resolvedStepId });
    if (stepIndex <= 0) {
      router.push(ROUTES.home);
      return;
    }
    let previousIndex = stepIndex - 1;
    // Skip past a narrative bridge so Back always lands on a question,
    // never on the (now-stale) confirmation beat that followed it.
    if (WIZARD_STEPS[previousIndex].kind === "bridge") {
      previousIndex -= 1;
    }
    if (previousIndex < 0) {
      router.push(ROUTES.home);
      return;
    }
    goToStep(WIZARD_STEPS[previousIndex].id);
  }

  return {
    stepDef,
    stepIndex,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === WIZARD_STEPS.length - 1,
    goNext,
    goBack,
  };
}
