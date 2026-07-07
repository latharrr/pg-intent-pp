"use client";

import { useEffect } from "react";
import { useJourneyStore } from "@/lib/store/useJourneyStore";
import { track } from "@/lib/analytics";
import { HeroSection } from "@/features/landing/HeroSection";

export default function HomePage() {
  const goToStep = useJourneyStore((state) => state.goToStep);

  useEffect(() => {
    goToStep("hero");
    track("step_viewed", { stepId: "hero" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />
    </div>
  );
}
