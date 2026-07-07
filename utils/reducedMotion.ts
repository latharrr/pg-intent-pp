"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}

/** Shared transition helper so every animated component (JourneyFooter,
 * Confetti, BudgetSlider) snaps instantly instead of animating when the
 * user has asked for reduced motion. */
export function getTransition(prefersReducedMotion: boolean, duration = 0.7) {
  return prefersReducedMotion ? { duration: 0 } : { duration, ease: "easeOut" as const };
}
