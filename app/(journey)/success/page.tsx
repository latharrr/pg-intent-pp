"use client";

import { useEffect } from "react";
import { useJourneyStore } from "@/lib/store/useJourneyStore";
import { track } from "@/lib/analytics";
import { SuccessScreen } from "@/features/success/SuccessScreen";

export default function SuccessPage() {
  const goToStep = useJourneyStore((state) => state.goToStep);

  useEffect(() => {
    goToStep("success");
    track("step_viewed", { stepId: "success" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SuccessScreen />;
}
