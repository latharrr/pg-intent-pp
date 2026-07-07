"use client";

import { useEffect, useRef } from "react";

/**
 * Moves focus to the first heading inside the given container whenever
 * `dependency` changes - so screen readers announce the new question/screen
 * instead of leaving focus on a now-stale (or auto-advanced-away) control.
 */
export function useFocusOnChange<T extends HTMLElement>(dependency: unknown) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const heading = containerRef.current?.querySelector<HTMLElement>("h1, h2");
    if (!heading) return;
    if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: false });
  }, [dependency]);

  return containerRef;
}
