"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWizardStep } from "@/features/onboarding/useWizardStep";
import { WIZARD_STEPS } from "@/features/onboarding/wizardSteps";
import { useFocusOnChange } from "@/utils/useFocusOnChange";
import { Roadmap } from "@/components/Roadmap";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { CampusZoneQuestionScreen } from "@/features/onboarding/screens/CampusZoneQuestionScreen";
import { LandingQuestionScreen } from "@/features/onboarding/screens/LandingQuestionScreen";
import { BudgetQuestionScreen } from "@/features/onboarding/screens/BudgetQuestionScreen";
import { RoomQuestionScreen } from "@/features/onboarding/screens/RoomQuestionScreen";

const SLIDE_DISTANCE = 320;

export default function PlanPage() {
  const { stepDef, isFirstStep, goNext, goBack, stepIndex } = useWizardStep();
  const containerRef = useFocusOnChange<HTMLDivElement>(stepDef.id);
  const [direction, setDirection] = useState(1);
  const [lastStepIndex, setLastStepIndex] = useState(stepIndex);
  const [showExitIntent, setShowExitIntent] = useState(false);

  useEffect(() => {
    setDirection(stepIndex > lastStepIndex ? 1 : -1);
    setLastStepIndex(stepIndex);
  }, [stepIndex, lastStepIndex]);

  const variants = {
    enter: { x: direction > 0 ? SLIDE_DISTANCE : -SLIDE_DISTANCE, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: direction > 0 ? -SLIDE_DISTANCE : SLIDE_DISTANCE, opacity: 0 },
  };

  const remainingQuestions = WIZARD_STEPS.length - stepIndex;

  function handleBack() {
    if (isFirstStep) {
      goBack();
      return;
    }
    setShowExitIntent(true);
  }

  function confirmLeave() {
    setShowExitIntent(false);
    goBack();
  }

  return (
    <div ref={containerRef} className="flex flex-1 flex-col px-6 py-6">
      <div className="relative flex items-center justify-center pb-6">
        <button
          type="button"
          onClick={handleBack}
          aria-label={isFirstStep ? "Back to home" : "Back to previous question"}
          className="absolute left-0 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink/60 transition-colors hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selected"
        >
          <ChevronLeft className="size-5" />
        </button>
        <Roadmap currentIndex={stepDef.progressIndex} total={WIZARD_STEPS.length} />
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden pt-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepDef.id}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-1 flex-col"
          >
            {stepDef.id === "campus" && <CampusZoneQuestionScreen onAdvance={goNext} />}
            {stepDef.id === "landing" && <LandingQuestionScreen onAdvance={goNext} />}
            {stepDef.id === "budget" && <BudgetQuestionScreen onAdvance={goNext} />}
            {stepDef.id === "room-type" && <RoomQuestionScreen onAdvance={goNext} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <ExitIntentModal
        isOpen={showExitIntent}
        remainingQuestions={remainingQuestions}
        onContinue={() => setShowExitIntent(false)}
        onLeave={confirmLeave}
      />
    </div>
  );
}
