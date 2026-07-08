"use client";

import { useEffect } from "react";

/**
 * Shows the browser's native "Are you sure?" dialog when the user tries to
 * close or reload the tab mid-questionnaire. This is the last-resort safety
 * net; the in-app back button uses a custom modal instead.
 */
export function useBeforeUnload(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      // Modern browsers show a generic message; the returnValue is ignored.
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled]);
}
