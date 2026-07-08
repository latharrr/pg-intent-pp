"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/Button";
import { buildShareTextFromIds } from "@/utils/sharePlan";
import type { UserProfile } from "@/types";

export interface ShareMoveProfileProps {
  profile: UserProfile;
  bestAreaName?: string | null;
}

/**
 * One-tap share for the "parent looking over shoulder" scenario.
 * Prefers the native share sheet, falls back to clipboard, and uses the
 * WhatsApp message format from the UX spec.
 */
export function ShareMoveProfile({ profile, bestAreaName }: ShareMoveProfileProps) {
  async function handleShare() {
    const topPgId = profile.shortlistedPgIds[0];
    const text = buildShareTextFromIds(topPgId, profile.shortlistedPgIds, bestAreaName ?? "Hindu College");

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "My PG Hunt Plan", text });
      } catch {
        // user cancelled the share sheet - no error state needed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied your PG hunt plan. Paste it anywhere.");
    } catch {
      toast.error("Couldn't copy, try again.");
    }
  }

  return (
    <Button variant="ghost" onClick={handleShare} className="gap-2">
      <Share2 className="size-4" aria-hidden="true" />
      Share my plan
    </Button>
  );
}
