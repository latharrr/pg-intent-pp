"use client";

import { useJourneyStore } from "@/lib/store/useJourneyStore";
import { QuestionScreen } from "@/components/QuestionScreen";
import { OptionCard } from "@/components/OptionCard";
import { useAutoAdvance } from "@/utils/useAutoAdvance";
import { MOVE_TIMELINE_LABELS, MOVE_TIMELINE_MICROCOPY, MOVE_TIMELINES } from "@/types/enums";
import { getLandingConfirmation } from "../confirmationCopy";

export function LandingQuestionScreen({ onAdvance }: { onAdvance: () => void }) {
  const moveTimeline = useJourneyStore((state) => state.profile.moveTimeline);
  const updateProfile = useJourneyStore((state) => state.updateProfile);
  const triggerAdvance = useAutoAdvance(onAdvance);

  return (
    <QuestionScreen
      title="Where are you landing this semester?"
      unlockText={moveTimeline ? getLandingConfirmation(moveTimeline) : null}
    >
      <div role="radiogroup" aria-label="Where are you landing this semester?" className="flex flex-col gap-3">
        {MOVE_TIMELINES.map((timeline) => (
          <OptionCard
            key={timeline}
            label={MOVE_TIMELINE_LABELS[timeline]}
            description={MOVE_TIMELINE_MICROCOPY[timeline]}
            selected={moveTimeline === timeline}
            onSelect={() => {
              updateProfile({ moveTimeline: timeline });
              triggerAdvance();
            }}
          />
        ))}
      </div>
    </QuestionScreen>
  );
}
