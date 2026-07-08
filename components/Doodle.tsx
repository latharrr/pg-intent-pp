"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type DoodleName = "calendar" | "wallet" | "room" | "map" | "party" | "lock" | "check" | "archery" | "walk";

export interface DoodleProps {
  name: DoodleName;
  className?: string;
}

/**
 * Simple, playful line-art doodles in the brand ink color.
 * Style reference: Notion empty states / Duolingo: single-weight strokes,
 * no fills, subtle bounce on mount.
 */
export function Doodle({ name, className }: DoodleProps) {
  const stroke = "var(--color-ink)";
  const strokeWidth = 2;
  const common = { stroke, strokeWidth, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

  const doodles: Record<DoodleName, React.ReactNode> = {
    calendar: (
      <svg viewBox="0 0 48 48" aria-hidden className="h-full w-full">
        <rect x="8" y="14" width="32" height="28" rx="4" {...common} />
        <path d="M8 22h32M16 10v8M32 10v8" {...common} />
        <circle cx="18" cy="30" r="1.5" fill={stroke} />
        <circle cx="30" cy="30" r="1.5" fill={stroke} />
      </svg>
    ),
    wallet: (
      <svg viewBox="0 0 48 48" aria-hidden className="h-full w-full">
        <path d="M8 12h32a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z" {...common} />
        <path d="M36 24h6v8h-6a4 4 0 1 1 0-8z" {...common} />
        <circle cx="34" cy="28" r="1.5" fill={stroke} />
      </svg>
    ),
    room: (
      <svg viewBox="0 0 48 48" aria-hidden className="h-full w-full">
        <path d="M6 42V20L24 8l18 12v22" {...common} />
        <path d="M16 42V28h16v14" {...common} />
        <circle cx="24" cy="20" r="2" fill={stroke} />
      </svg>
    ),
    map: (
      <svg viewBox="0 0 48 48" aria-hidden className="h-full w-full">
        <path d="M8 38V14l10-6 12 6 10-6v24l-10 6-12-6-10 6z" {...common} />
        <circle cx="24" cy="20" r="3" {...common} />
        <path d="M24 23v8" {...common} />
      </svg>
    ),
    party: (
      <svg viewBox="0 0 48 48" aria-hidden className="h-full w-full">
        <path d="M20 42l6-26 6 26H20z" {...common} />
        <circle cx="26" cy="12" r="3" {...common} />
        <path d="M10 20l4 4M14 20l-4 4M38 16l-4 4M34 16l4 4" {...common} />
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 48 48" aria-hidden className="h-full w-full">
        <rect x="10" y="22" width="28" height="20" rx="3" {...common} />
        <path d="M16 22v-8a8 8 0 0 1 16 0v8" {...common} />
        <circle cx="24" cy="32" r="2" fill={stroke} />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 48 48" aria-hidden className="h-full w-full">
        <circle cx="24" cy="24" r="16" {...common} />
        <path d="M16 24l6 6 10-12" {...common} />
      </svg>
    ),
    archery: (
      <svg viewBox="0 0 48 48" aria-hidden className="h-full w-full">
        <circle cx="26" cy="22" r="16" {...common} />
        <circle cx="26" cy="22" r="10" {...common} />
        <circle cx="26" cy="22" r="4" {...common} />
        <path d="M26 22L8 40" {...common} />
        <path d="M8 40l6-1.5M8 40l1.5-6" {...common} />
      </svg>
    ),
    walk: (
      <svg viewBox="0 0 48 48" aria-hidden className="h-full w-full">
        <ellipse cx="23" cy="30" rx="10" ry="14" fill={stroke} />
        <circle cx="15" cy="12" r="3.4" fill={stroke} />
        <circle cx="24" cy="8" r="3.8" fill={stroke} />
        <circle cx="33" cy="12" r="3.4" fill={stroke} />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
      className={cn("size-24 text-ink", className)}
    >
      {doodles[name]}
    </motion.div>
  );
}
