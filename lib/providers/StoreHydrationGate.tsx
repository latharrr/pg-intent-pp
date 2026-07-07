"use client";

import { useEffect, useState } from "react";
import { useJourneyStore } from "@/lib/store/useJourneyStore";

/**
 * Manually triggers Zustand's persist rehydration on mount (client-only) and
 * withholds step-dependent content until it completes, avoiding a step-0
 * flash before localStorage loads. See useJourneyStore's skipHydration.
 */
export function StoreHydrationGate({ children }: { children: React.ReactNode }) {
  const hasHydrated = useJourneyStore((state) => state.hasHydrated);
  const [rehydrateStarted, setRehydrateStarted] = useState(false);

  useEffect(() => {
    if (rehydrateStarted) return;
    setRehydrateStarted(true);
    void useJourneyStore.persist.rehydrate();
  }, [rehydrateStarted]);

  if (!hasHydrated) {
    return <div className="min-h-svh bg-background" aria-hidden="true" />;
  }

  return <>{children}</>;
}
