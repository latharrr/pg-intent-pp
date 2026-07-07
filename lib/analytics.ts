/**
 * One function. Console-logged for now; swap the implementation here if a
 * real analytics provider gets wired in later - no call site changes.
 */
export function track(event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[track] ${event}`, payload ?? {});
  }
}
