"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/utils/reducedMotion";

export function Spinner({ size = 90 }: { size?: number }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <div
      role="presentation"
      style={{ width: size, height: size }}
      className="relative rounded-full border-[6px] border-dashed-line"
    >
      <motion.div
        className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-selected"
        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export interface StatusLinesProps {
  lines: Array<{ text: string; tone?: "primary" | "muted" }>;
}

/** Sequential fade-in status lines - used instead of a bare spinner so
 * loading doubles as a trust beat (narrates the verification work). */
export function StatusLines({ lines }: StatusLinesProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {lines.map((line, index) => (
        <motion.p
          key={line.text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.5 }}
          className={line.tone === "muted" ? "text-[12px] text-muted-foreground" : "text-[14px] font-medium text-ink"}
        >
          {line.text}
        </motion.p>
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex animate-pulse gap-3 rounded-lg border-[1.5px] border-dashed-line p-3">
      <div className="size-20 shrink-0 rounded-lg bg-filler" />
      <div className="flex flex-1 flex-col gap-2 py-1">
        <div className="h-3 w-2/3 rounded bg-filler" />
        <div className="h-3 w-1/3 rounded bg-filler" />
        <div className="h-3 w-1/2 rounded bg-filler" />
      </div>
    </div>
  );
}
