/**
 * Centralized app download / deep-link configuration.
 *
 * With the Picapool app now live (100+ PGs, 5000+ users), the web funnel's job
 * is to push users into the app. These env vars let the team configure store
 * links, universal links, and fallback behavior without touching component code.
 *
 * Env vars (all optional, all NEXT_PUBLIC so they ship to the browser):
 * - NEXT_PUBLIC_APP_STORE_URL      iOS App Store link
 * - NEXT_PUBLIC_PLAY_STORE_URL     Google Play Store link
 * - NEXT_PUBLIC_APP_UNIVERSAL_LINK Universal/deep link (e.g. https://app.picapool.in/pg-hunt)
 * - NEXT_PUBLIC_PICAPOOL_WHATSAPP_NUMBER  Fallback WhatsApp number
 */

export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL;
export const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL;
export const APP_UNIVERSAL_LINK = process.env.NEXT_PUBLIC_APP_UNIVERSAL_LINK;
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_PICAPOOL_WHATSAPP_NUMBER;

export interface AppLinkState {
  hasStoreLinks: boolean;
  hasUniversalLink: boolean;
  hasAnyLink: boolean;
}

export function getAppLinkState(): AppLinkState {
  const hasStoreLinks = Boolean(APP_STORE_URL || PLAY_STORE_URL);
  const hasUniversalLink = Boolean(APP_UNIVERSAL_LINK);
  return {
    hasStoreLinks,
    hasUniversalLink,
    hasAnyLink: hasStoreLinks || hasUniversalLink || Boolean(WHATSAPP_NUMBER),
  };
}

/**
 * Best-effort mobile detection. Used when you have separate iOS/Android store
 * links and want to send the user straight to the right store.
 */
export function getMobilePlatform(): "ios" | "android" | "unknown" {
  if (typeof navigator === "undefined") return "unknown";
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) return "ios";
  if (/android/.test(userAgent)) return "android";
  return "unknown";
}

/**
 * Returns the single best link for the current device.
 * Priority: universal link → platform-specific store → any store → WhatsApp fallback → null
 */
export function getBestAppLink(): string | null {
  if (APP_UNIVERSAL_LINK) return APP_UNIVERSAL_LINK;

  const platform = getMobilePlatform();
  if (platform === "ios" && APP_STORE_URL) return APP_STORE_URL;
  if (platform === "android" && PLAY_STORE_URL) return PLAY_STORE_URL;

  return APP_STORE_URL ?? PLAY_STORE_URL ?? null;
}

/**
 * Opens the best available app link. Falls back to WhatsApp if no store/universal
 * link is configured (pre-launch mode).
 */
export function openAppLink(message = "Hi Picapool! I want to explore PGs near North Campus."): void {
  const link = getBestAppLink();
  if (link) {
    window.open(link, "_blank", "noopener,noreferrer");
    return;
  }

  if (WHATSAPP_NUMBER) {
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
  }
}
