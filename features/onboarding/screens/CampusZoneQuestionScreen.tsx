"use client";

import { useJourneyStore } from "@/lib/store/useJourneyStore";
import { QuestionScreen } from "@/components/QuestionScreen";
import { OptionCard } from "@/components/OptionCard";
import { useAutoAdvance } from "@/utils/useAutoAdvance";
import { CAMPUS_ZONE_LABELS, CAMPUS_ZONES } from "@/types/enums";
import { getCampusZoneConfirmation } from "../confirmationCopy";

export function CampusZoneQuestionScreen({ onAdvance }: { onAdvance: () => void }) {
  const campusZone = useJourneyStore((state) => state.profile.campusZone);
  const updateProfile = useJourneyStore((state) => state.updateProfile);
  const triggerAdvance = useAutoAdvance(onAdvance);

  return (
    <QuestionScreen
      title="Which campus are you aiming for?"
      unlockText={campusZone ? getCampusZoneConfirmation(campusZone) : null}
    >
      <div role="radiogroup" aria-label="Which campus are you aiming for?" className="flex flex-col gap-3">
        {CAMPUS_ZONES.map((zone) => (
          <OptionCard
            key={zone}
            label={CAMPUS_ZONE_LABELS[zone]}
            selected={campusZone === zone}
            onSelect={() => {
              updateProfile({ campusZone: zone });
              triggerAdvance();
            }}
          />
        ))}
      </div>
    </QuestionScreen>
  );
}
