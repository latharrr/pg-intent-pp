"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface RoadmapProps {
  currentIndex: number;
  total?: number;
  className?: string;
}

/**
 * A simple 3-dot roadmap progress indicator.
 * Filled dots = completed, pulsing dot = current.
 */
export function Roadmap({ currentIndex, total = 3, className }: RoadmapProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <p className="text-[12px] font-medium text-ink">Plan Your PG Hunt</p>
      <div
        className="flex items-center gap-3"
        role="progressbar"
        aria-valuenow={currentIndex}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${currentIndex} of ${total}`}
      >
        {Array.from({ length: total }).map((_, index) => {
          const completed = index < currentIndex - 1;
          const active = index === currentIndex - 1;
          return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                scale: active ? 1.15 : 1,
                backgroundColor: completed || active ? "var(--color-selected)" : "var(--color-filler)",
              }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className={cn(
                "size-2.5 rounded-full",
                completed || active ? "bg-selected" : "bg-filler",
                active && "motion-safe-pulse"
              )}
            />
          );
        })}
        <span className="text-[12px] text-muted-foreground">Result</span>
      </div>
    </div>
  );
}
