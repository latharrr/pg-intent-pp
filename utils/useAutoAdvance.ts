"use client";

import { useCallback, useEffect, useRef } from "react";

/** Shared "select -> show insight -> auto-advance" behavior for the cards
 * and binary-tile question shells - tapping an option IS submitting; there's
 * no explicit Next button. Call trigger() right after recording the answer. */
export function useAutoAdvance(onAdvance: () => void, delayMs = 500) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const trigger = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(onAdvance, delayMs);
  }, [onAdvance, delayMs]);

  return trigger;
}
