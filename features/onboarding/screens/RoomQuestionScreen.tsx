"use client";

import { useJourneyStore } from "@/lib/store/useJourneyStore";
import { QuestionScreen } from "@/components/QuestionScreen";
import { OptionCard } from "@/components/OptionCard";
import { useAutoAdvance } from "@/utils/useAutoAdvance";
import { ROOM_TYPE_LABELS, ROOM_TYPE_MICROCOPY, ROOM_TYPES } from "@/types/enums";

export function RoomQuestionScreen({ onAdvance }: { onAdvance: () => void }) {
  const roomType = useJourneyStore((state) => state.profile.roomType);
  const updateProfile = useJourneyStore((state) => state.updateProfile);
  const triggerAdvance = useAutoAdvance(onAdvance, 900);

  return (
    <QuestionScreen title="Solo room or okay with sharing?" doodle="room">
      <div role="radiogroup" aria-label="Room type" className="flex flex-col gap-3">
        {ROOM_TYPES.map((type) => (
          <OptionCard
            key={type}
            label={ROOM_TYPE_LABELS[type]}
            description={ROOM_TYPE_MICROCOPY[type]}
            selected={roomType === type}
            onSelect={() => {
              updateProfile({ roomType: type });
              triggerAdvance();
            }}
          />
        ))}
      </div>
    </QuestionScreen>
  );
}
