"use client";

import { BadgeCheck, Bookmark, Play, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Chip, type ChipVariant } from "@/components/ChipRow";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { cn } from "@/lib/utils";
import { formatRupees } from "@/utils/format";
import type { PG } from "@/types";

export interface PGCardProps {
  pg: PG;
  matchPercent: number;
  reasons?: string[];
  isShortlisted: boolean;
  onToggleShortlist: () => void;
  onVirtualVisit?: () => void;
  onShare?: () => void;
}

function matchVariant(percent: number): ChipVariant {
  if (percent >= 85) return "match";
  if (percent >= 70) return "match-mid";
  return "match-low";
}

export function PGCard({
  pg,
  matchPercent,
  reasons,
  isShortlisted,
  onToggleShortlist,
  onVirtualVisit,
  onShare,
}: PGCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border-[1.5px] border-ink/10 bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <ImagePlaceholder alt={pg.name} caption="Virtual Visit preview" className="h-24 w-24 shrink-0" />
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[15px] font-semibold text-ink">{pg.name}</span>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={onToggleShortlist}
              aria-pressed={isShortlisted}
              aria-label={isShortlisted ? `Remove ${pg.name} from shortlist` : `Shortlist ${pg.name}`}
              className="shrink-0 rounded text-ink/50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selected"
            >
              <Bookmark className={cn("size-5", isShortlisted && "fill-selected text-selected")} />
            </motion.button>
          </div>

          {pg.verifiedStatus && (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-match/10 px-2 py-0.5 text-[10px] font-semibold text-match">
              <BadgeCheck className="size-3" aria-hidden="true" />
              Picapool Verified
            </span>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold text-ink">{formatRupees(pg.pricePerMonth)}/mo</span>
            <Chip variant={matchVariant(matchPercent)} className="pointer-events-none py-0.5 text-[10px]">
              {matchPercent}% match
            </Chip>
          </div>

          {reasons && reasons.length > 0 && (
            <p className="text-[11px] text-muted-foreground">{reasons.join(" · ")}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {onVirtualVisit && (
          <button
            type="button"
            onClick={onVirtualVisit}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-selected px-3 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-selected/90"
          >
            <Play className="size-4" />
            Picapool Virtual Visit
          </button>
        )}
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-ink/15 px-3 py-2.5 text-[13px] font-medium text-ink transition-colors hover:border-ink/40"
          >
            <Share2 className="size-4" />
            Share
          </button>
        )}
      </div>
    </div>
  );
}
