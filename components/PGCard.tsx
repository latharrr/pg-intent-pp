"use client";

import { Smartphone, Play, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatRupees } from "@/utils/format";
import { openAppLink } from "@/lib/appLinks";
import { track } from "@/lib/analytics";
import type { PG } from "@/types";
import { ROOM_TYPE_LABELS } from "@/types/enums";

export interface PGCardProps {
  pg: PG;
  nearestCollegeName?: string;
  onVirtualVisit?: () => void;
  onShare?: () => void;
}

export function PGCard({ pg, nearestCollegeName = "Hindu College", onVirtualVisit, onShare }: PGCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-semibold text-ink">{pg.name}</h3>

        <p className="text-[15px] font-medium text-ink">
          {formatRupees(pg.pricePerMonth)}/mo{" "}
          <span className="text-muted-foreground">|</span>{" "}
          {pg.roomTypes.map((type) => ROOM_TYPE_LABELS[type]).join(", ")}
        </p>

        <p className="text-[14px] text-muted-foreground">
          📍 {pg.distanceToCollegeMin} min walk from {nearestCollegeName}
        </p>
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
          onClick={() => {
            track("download_app_click", { from: "pg_card", pgId: pg.id });
            openAppLink();
          }}
          aria-label="Get the Picapool app"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-selected px-4 text-selected transition-colors hover:bg-selected/5"
        >
          <Smartphone className="size-4" />
          <span className="text-[14px] font-medium">App</span>
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
