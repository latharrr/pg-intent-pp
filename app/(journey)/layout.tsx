"use client";

import { useJourneyStore, useFooterStep } from "@/lib/store/useJourneyStore";
import { JourneyFooter } from "@/components/JourneyFooter";
import { TOTAL_FOOTER_STEPS } from "@/lib/journey/footerSteps";

/**
 * Wraps every route in the app (hero through success) and mounts
 * JourneyFooter exactly once. Only its props change as the store updates - 
 * React never unmounts/remounts it across route or wizard-step changes.
 */
export default function JourneyLayout({ children }: { children: React.ReactNode }) {
  const animationState = useJourneyStore((state) => state.journey.animationState);
  const footerStep = useFooterStep();

  return (
    <div className="flex min-h-svh justify-center bg-background md:bg-muted md:py-6">
      <div className="flex w-full max-w-[430px] flex-1 flex-col overflow-hidden bg-background md:rounded-[32px] md:border-[3px] md:border-ink md:shadow-lg">
        <main className="flex flex-1 flex-col">{children}</main>
        <JourneyFooter
          currentStep={footerStep}
          totalSteps={TOTAL_FOOTER_STEPS}
          recommendedArea={null}
          animationState={animationState}
        />
      </div>
    </div>
  );
}
