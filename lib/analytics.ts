"use client";

/**
 * Batches track() calls client-side and ships them to /api/analytics, which
 * appends them to the Analytics tab in Google Sheets. Batched (every 5s, every
 * 10 events, or on tab hide) instead of one write per event - a raw per-click
 * fetch would blow through the Sheets API's write-rate quota under any real
 * traffic and spam the sheet unreadably.
 */

interface QueuedEvent {
  ts: string;
  event: string;
  page: string;
  payload?: Record<string, unknown>;
}

let queue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function getId(storage: Storage, key: string): string {
  let id = storage.getItem(key);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${key}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    storage.setItem(key, id);
  }
  return id;
}

/** Resets each browser tab session - used to group events into one visit. */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  return getId(sessionStorage, "pica_sid");
}

/** Persists across visits - used to distinguish new vs. returning devices. */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  return getId(localStorage, "pica_did");
}

function flush(useBeacon = false) {
  if (typeof window === "undefined" || queue.length === 0) return;
  const events = queue;
  queue = [];
  const body = JSON.stringify({ sessionId: getSessionId(), deviceId: getDeviceId(), events });

  if (useBeacon && "sendBeacon" in navigator) {
    const ok = navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    if (ok) return;
  }
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, 5000);
}

export function track(event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[track] ${event}`, payload ?? {});
  }
  if (typeof window === "undefined") return;

  queue.push({ ts: new Date().toISOString(), event, page: window.location.pathname, payload });
  if (queue.length >= 10) flush();
  else scheduleFlush();
}

if (typeof window !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(true);
  });
  window.addEventListener("pagehide", () => flush(true));
}
