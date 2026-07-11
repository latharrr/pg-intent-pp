"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useJourneyStore } from "@/lib/store/useJourneyStore";
import { track } from "@/lib/analytics";
import { HeroSection } from "@/features/landing/HeroSection";

/**
 * Catches any single path segment (pg.picapool.tech/{code}) so personalized
 * links - the WhatsApp template's {{1}} button param, an influencer's bio
 * link, etc. - render the normal hero flow instead of 404ing, while the
 * segment itself is captured as the referral attribution code.
 */
export default function ReferralLandingPage() {
  const goToStep = useJourneyStore((state) => state.goToStep);
  const setReferralSource = useJourneyStore((state) => state.setReferralSource);
  const params = useParams<{ ref: string }>();

  useEffect(() => {
    if (params.ref) setReferralSource(decodeURIComponent(params.ref));
    goToStep("hero");
    // track() auto-attaches referralSource from the store update above.
    track("step_viewed", { stepId: "hero" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />
    </div>
  );
}
