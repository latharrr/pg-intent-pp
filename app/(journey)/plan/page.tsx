"use client";

import { ChevronLeft } from "lucide-react";
import { useWizardStep } from "@/features/onboarding/useWizardStep";
import { useFocusOnChange } from "@/utils/useFocusOnChange";
import { useJourneyStore } from "@/lib/store/useJourneyStore";
import { Roadmap } from "@/components/Roadmap";
import { LandingQuestionScreen } from "@/features/onboarding/screens/LandingQuestionScreen";
import { BudgetQuestionScreen } from "@/features/onboarding/screens/BudgetQuestionScreen";
import { RoomQuestionScreen } from "@/features/onboarding/screens/RoomQuestionScreen";
import { NarrativeBridgeScreen } from "@/features/onboarding/screens/NarrativeBridgeScreen";
import { getBudgetConfirmation, getLandingConfirmation, getRoomConfirmation } from "@/features/onboarding/confirmationCopy";

export default function PlanPage() {
  const { stepDef, isFirstStep, goNext, goBack } = useWizardStep();
  const profile = useJourneyStore((state) => state.profile);
  const containerRef = useFocusOnChange<HTMLDivElement>(stepDef.id);

  return (
    <div ref={containerRef} className="flex flex-1 flex-col gap-5 px-6 py-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          aria-label={isFirstStep ? "Back to home" : "Back to previous question"}
          className="-ml-1.5 flex size-9 items-center justify-center rounded-lg text-ink/60 transition-colors hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selected"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex-1">
          <Roadmap currentIndex={stepDef.progressIndex} />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-2">
        {stepDef.id === "landing" && <LandingQuestionScreen onAdvance={goNext} />}
        {stepDef.id === "budget" && <BudgetQuestionScreen onAdvance={goNext} />}
        {stepDef.id === "room-type" && <RoomQuestionScreen onAdvance={goNext} />}

        {stepDef.id === "landing-bridge" && profile.moveTimeline && (
          <NarrativeBridgeScreen message={getLandingConfirmation(profile.moveTimeline)} onAdvance={goNext} />
        )}
        {stepDef.id === "budget-bridge" && profile.budgetBand && (
          <NarrativeBridgeScreen message={getBudgetConfirmation(profile.budgetBand)} onAdvance={goNext} />
        )}
        {stepDef.id === "room-type-bridge" && profile.roomType && (
          <NarrativeBridgeScreen message={getRoomConfirmation(profile.roomType)} onAdvance={goNext} />
        )}
      </div>
    </div>
  );
}
