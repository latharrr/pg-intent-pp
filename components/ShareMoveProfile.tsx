"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/Button";
import type { UserProfile } from "@/types";
import { BUDGET_BAND_LABELS, MOVE_TIMELINE_LABELS, ROOM_TYPE_LABELS } from "@/types/enums";

export interface ShareMoveProfileProps {
  profile: UserProfile;
  bestAreaName?: string | null;
}

function buildSummaryText(profile: UserProfile, bestAreaName?: string | null): string {
  const lines = ["My Picapool PG Hunt Plan"];
  if (profile.budgetBand) lines.push(`Budget: ${BUDGET_BAND_LABELS[profile.budgetBand]}`);
  if (profile.roomType) lines.push(`Room: ${ROOM_TYPE_LABELS[profile.roomType]}`);
  if (bestAreaName) lines.push(`Area: ${bestAreaName}`);
  if (profile.moveTimeline) lines.push(`Landing: ${MOVE_TIMELINE_LABELS[profile.moveTimeline]}`);
  return lines.join("\n");
}

/** One-tap share for the "parent looking over shoulder" scenario. */
export function ShareMoveProfile({ profile, bestAreaName }: ShareMoveProfileProps) {
  async function handleShare() {
    const text = buildSummaryText(profile, bestAreaName);
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
