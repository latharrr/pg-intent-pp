"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { useJourneyStore } from "@/lib/store/useJourneyStore";

const TAP_SELECTOR = "button, a, [role='radio'], [role='button'], input[type='submit']";

function labelFor(el: Element): string {
  const aria = el.getAttribute("aria-label");
  if (aria) return aria.trim().slice(0, 60);
  return (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60);
}

/**
 * Mounted once at the root. Tracks page views/durations across route changes,
 * every tap on an interactive element, and a session_start/session_end pair
 * carrying the last step reached and whether a lead was submitted - the
 * drop-off signal a per-event log alone doesn't give you directly.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const enteredAtRef = useRef<number>(performance.now());
  const pathRef = useRef<string>(pathname);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("session_start", {
        referrer: document.referrer || null,
        device: window.innerWidth < 768 ? "mobile" : "desktop",
      });
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const el = target?.closest(TAP_SELECTOR);
      if (!el) return;
      track("tap", { label: labelFor(el), tag: el.tagName.toLowerCase() });
    }

    function handleHide() {
      const journey = useJourneyStore.getState().journey;
      const completed = sessionStorage.getItem("pica_completed") === "1";
      track("session_end", {
        lastStep: journey.currentStepId,
        completed,
        pageDurationMs: Math.round(performance.now() - enteredAtRef.current),
      });
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") handleHide();
    }

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("pagehide", handleHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("pagehide", handleHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const previousPath = pathRef.current;
    const previousEnteredAt = enteredAtRef.current;

    if (previousPath !== pathname) {
      track("page_duration", { page: previousPath, durationMs: Math.round(performance.now() - previousEnteredAt) });
    }

    pathRef.current = pathname;
    enteredAtRef.current = performance.now();
    track("page_view", { page: pathname });
  }, [pathname]);

  return null;
}
