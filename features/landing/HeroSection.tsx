"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";
import { ROUTES } from "@/constants/routes";
import { track } from "@/lib/analytics";
import { ChevronRight } from "lucide-react";

const LINES = [
  "You're coming to North Campus for the first time.",
  "You have one, maybe two days to find a PG.",
  "Hotels are expensive. You can't afford to explore.",
  "So you'll panic-pick from whatever a broker shows you.",
  "That's not a plan. That's survival.",
  "This time, Picapool is trying something - a planned PG hunt for students like you.",
  "No promises. Just an honest attempt.",
];

const AUTO_ROTATE_MS = 2200;

export function HeroSection() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isLast = step === LINES.length - 1;

  const start = useCallback(() => {
    track("continue_click", { from: "hero" });
    router.push(ROUTES.plan);
  }, [router]);

  const next = useCallback(() => {
    if (isLast) {
      start();
      return;
    }
    setStep((s) => s + 1);
  }, [isLast, start]);

  useEffect(() => {
    if (isPaused || isLast) return;
    const id = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [isPaused, isLast, next]);

  return (
    <section className="flex h-[calc(100svh-72px)] flex-col items-center justify-center gap-8 px-6 py-6">
      <div
        className="relative w-full max-w-sm flex-1 cursor-pointer"
        onClick={next}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="flex h-full items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="text-center text-[21px] font-semibold leading-[1.45] text-ink"
            >
              {LINES[step]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            start();
          }}
          className="w-full gap-1"
        >
          Plan My PG Hunt
          <ChevronRight className="size-4" />
        </Button>
        <p className="text-[11px] text-muted-foreground">Takes 30 seconds. No spam.</p>
      </div>
    </section>
  );
}
