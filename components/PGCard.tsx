"use client";

import { Bookmark, Play, Share2, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatRupees } from "@/utils/format";
import type { PG } from "@/types";
import { ROOM_TYPE_LABELS } from "@/types/enums";

export interface PGCardProps {
  pg: PG;
  nearestCollegeName?: string;
  reasons?: string[];
  isShortlisted: boolean;
  onToggleShortlist: () => void;
  onVirtualVisit?: () => void;
  onShare?: () => void;
}

function formatAmenities(pg: PG): string {
  const labels: Record<string, string> = {
    wifi: "🛜 WiFi",
    laundry: "🧺 Laundry",
    non_veg_ok: "🍗 Non-Veg OK",
    veg_only: "🥗 Veg Only",
    housekeeping: "🧹 Housekeeping",
    attached_bathroom: "🚿 Attached Bath",
    common_bathroom_ok: "🚿 Common Bath OK",
    study_table: "📚 Study Table",
    wardrobe: "👕 Wardrobe",
    geyser: "🚿 Geyser",
    ac: "❄️ AC",
  };

  const parts: string[] = [];
  if (pg.foodPolicy === "non_veg_ok") parts.push(labels.non_veg_ok);
  if (pg.foodPolicy === "veg_only") parts.push(labels.veg_only);
  pg.amenities.slice(0, 3).forEach((amenity) => {
    if (labels[amenity]) parts.push(labels[amenity]);
  });
  return parts.join(" | ");
}

export function PGCard({
  pg,
  nearestCollegeName = "Hindu College",
  isShortlisted,
  onToggleShortlist,
  onVirtualVisit,
  onShare,
}: PGCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[18px] font-semibold text-ink">{pg.name}</h3>
          {pg.verifiedStatus && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-selected px-2 py-1 text-[11px] font-semibold text-white">
              <BadgeCheck className="size-3" aria-hidden="true" />
              Picapool Verified
            </span>
          )}
        </div>

        <p className="text-[15px] font-medium text-ink">
          {formatRupees(pg.pricePerMonth)}/mo{" "}
          <span className="text-muted-foreground">|</span>{" "}
          {pg.roomTypes.map((type) => ROOM_TYPE_LABELS[type]).join(", ")}
        </p>

        <p className="text-[14px] text-muted-foreground">
          📍 {pg.distanceToCollegeMin} min walk from {nearestCollegeName}
        </p>

        <p className="text-[13px] text-ink">{formatAmenities(pg)}</p>
      </div>

      <div className="flex items-center gap-3">
        {onVirtualVisit && (
          <button
            type="button"
            onClick={onVirtualVisit}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-[14px] font-semibold text-white transition-colors hover:bg-ink/90"
          >
            <Play className="size-4 fill-current" />
            Virtual Visit
          </button>
        )}

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onToggleShortlist}
          aria-pressed={isShortlisted}
          aria-label={isShortlisted ? `Remove ${pg.name} from shortlist` : `Shortlist ${pg.name}`}
          className={cn(
            "flex h-12 items-center justify-center gap-2 rounded-xl border px-4 transition-colors",
            isShortlisted
              ? "border-selected bg-selected text-white"
              : "border-selected text-selected hover:bg-selected/5",
          )}
        >
          <Bookmark className={cn("size-4", isShortlisted && "fill-current")} />
          <span className="text-[14px] font-medium">{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
        </motion.button>

        {onShare && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={onShare}
            aria-label={`Share ${pg.name}`}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E5E5] text-ink/60 transition-colors hover:border-ink/40 hover:text-ink"
          >
            <Share2 className="size-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
