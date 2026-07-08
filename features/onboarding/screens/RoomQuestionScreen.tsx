"use client";

import { useJourneyStore } from "@/lib/store/useJourneyStore";
import { QuestionScreen } from "@/components/QuestionScreen";
import { OptionCard } from "@/components/OptionCard";
import { useAutoAdvance } from "@/utils/useAutoAdvance";
import { ROOM_TYPE_LABELS, ROOM_TYPE_MICROCOPY, ROOM_TYPES } from "@/types/enums";
import { getRoomConfirmation } from "../confirmationCopy";

export function RoomQuestionScreen({ onAdvance }: { onAdvance: () => void }) {
  const roomType = useJourneyStore((state) => state.profile.roomType);
  const updateProfile = useJourneyStore((state) => state.updateProfile);
  const triggerAdvance = useAutoAdvance(onAdvance);

  return (
    <QuestionScreen
      title="Solo room or okay with sharing?"
      unlockText={roomType ? getRoomConfirmation(roomType) : null}
    >
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
