"use client";

import { motion } from "framer-motion";
import type { Area } from "@/types";
import { usePrefersReducedMotion } from "@/utils/reducedMotion";

export interface MapIllustrationProps {
  areas: Area[];
  /** areaId -> match percent, drives which pins glow. */
  matches?: Record<string, number>;
  recommendedAreaId?: string | null;
  selectedAreaIds?: string[];
  onSelectArea?: (areaId: string) => void;
  size?: "small" | "large";
}

/** An illustrated, SVG-based campus map (not Google Maps) - 5 area
 * hotspots that glow when they're the recommended/matched area. */
export function MapIllustration({
  areas,
  matches,
  recommendedAreaId,
  selectedAreaIds = [],
  onSelectArea,
  size = "large",
}: MapIllustrationProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isSmall = size === "small";

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Illustrated map of North Campus areas"
      className="h-full w-full"
    >
      <rect x="0" y="0" width="100" height="100" fill="var(--color-filler)" opacity="0.35" />
      <path
        d="M5,60 Q30,40 50,45 T95,35"
        fill="none"
        stroke="var(--color-dashed-line)"
        strokeWidth={isSmall ? 1.2 : 0.8}
        strokeDasharray="2 2"
      />
      <path
        d="M20,10 Q35,50 25,90"
        fill="none"
        stroke="var(--color-dashed-line)"
        strokeWidth={isSmall ? 1.2 : 0.8}
        strokeDasharray="2 2"
      />

      {areas.map((area) => {
        const matchPercent = matches?.[area.id];
        const isRecommended = recommendedAreaId === area.id;
        const isSelected = selectedAreaIds.includes(area.id);
        const dotColor = isRecommended
          ? "var(--color-match)"
          : isSelected
            ? "var(--color-selected)"
            : "var(--color-ink)";

        return (
          <g
            key={area.id}
            transform={`translate(${area.normalizedX},${area.normalizedY})`}
            className={onSelectArea ? "cursor-pointer" : undefined}
            onClick={onSelectArea ? () => onSelectArea(area.id) : undefined}
          >
            {isRecommended && (
              <motion.circle
                r={isSmall ? 4 : 7}
                fill="var(--color-match)"
                opacity={0.18}
                animate={prefersReducedMotion ? undefined : { scale: [1, 1.3, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <circle r={isSmall ? 1.6 : 2.6} fill={dotColor} stroke="#fff" strokeWidth={0.4} />
            {!isSmall && (
              <text
                x={0}
                y={-4}
                fontSize="3.4"
                textAnchor="middle"
                fill={isRecommended ? "var(--color-match)" : "var(--color-ink)"}
                fontWeight={isRecommended ? 700 : 500}
              >
                {area.name}
                {matchPercent != null ? ` · ${matchPercent}%` : ""}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
