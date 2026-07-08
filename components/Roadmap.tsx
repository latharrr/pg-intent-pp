"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface RoadmapProps {
  currentIndex: number;
  total?: number;
  className?: string;
}

/**
 * 3-dot roadmap fixed at the top of the question flow.
 * Filled dots = completed, pulsing dot = current, empty dots = upcoming.
 */
export function Roadmap({ currentIndex, total = 3, className }: RoadmapProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <p className="text-[13px] font-medium uppercase tracking-[0.5px] text-[#888888]">
        Plan Your PG Hunt
      </p>
      <div
        className="flex items-center gap-2"
        role="progressbar"
        aria-valuenow={currentIndex}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${currentIndex} of ${total}`}
      >
        {Array.from({ length: total }).map((_, index) => {
          const completed = index < currentIndex - 1;
          const active = index === currentIndex - 1;
          const isLast = index === total - 1;

          return (
            <div key={index} className="flex items-center gap-2">
              <motion.span
                initial={false}
                animate={{
                  scale: active ? [1, 1.3, 1] : 1,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "text-[12px] leading-none",
                  completed || active ? "text-selected" : "text-[#cccccc]",
                )}
                aria-current={active ? "step" : undefined}
              >
                {completed || active ? "●" : "○"}
              </motion.span>
              {!isLast && (
                <span className="text-[10px] leading-none text-[#cccccc]">───</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
