"use client";

import { useJourneyStore } from "@/lib/store/useJourneyStore";
import { QuestionScreen } from "@/components/QuestionScreen";
import { OptionCard } from "@/components/OptionCard";
import { useAutoAdvance } from "@/utils/useAutoAdvance";
import { BUDGET_BAND_LABELS, BUDGET_BAND_MICROCOPY, BUDGET_BANDS } from "@/types/enums";

export function BudgetQuestionScreen({ onAdvance }: { onAdvance: () => void }) {
  const budgetBand = useJourneyStore((state) => state.profile.budgetBand);
  const updateProfile = useJourneyStore((state) => state.updateProfile);
  const triggerAdvance = useAutoAdvance(onAdvance, 900);

  return (
    <QuestionScreen title="What feels comfortable per month?" doodle="wallet">
      <div role="radiogroup" aria-label="Monthly budget comfort" className="flex flex-col gap-3">
        {BUDGET_BANDS.map((band) => (
          <OptionCard
            key={band}
            label={BUDGET_BAND_LABELS[band]}
            description={BUDGET_BAND_MICROCOPY[band]}
            selected={budgetBand === band}
            onSelect={() => {
              updateProfile({ budgetBand: band });
              triggerAdvance();
            }}
          />
        ))}
      </div>
    </QuestionScreen>
  );
}
