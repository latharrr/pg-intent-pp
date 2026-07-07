"use client";

import { useEffect } from "react";
import { useJourneyStore } from "@/lib/store/useJourneyStore";
import { track } from "@/lib/analytics";
import { ContactCaptureScreen } from "@/features/contact/ContactCaptureScreen";

export default function ContactPage() {
  const goToStep = useJourneyStore((state) => state.goToStep);

  useEffect(() => {
    goToStep("contact");
    track("step_viewed", { stepId: "contact" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ContactCaptureScreen />;
}
