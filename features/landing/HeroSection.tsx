"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";
import { ROUTES } from "@/constants/routes";
import { track } from "@/lib/analytics";
import { ChevronRight, ChevronLeft } from "lucide-react";

const LINES = [
  "You're coming to North Campus for the first time.",
  "You have one, maybe two days to find a PG.",
  "Hotels are expensive. You can't afford to explore.",
  "So you'll panic-pick from whatever a broker shows you.",
  "That's not a plan. That's survival.",
  "This time, Picapool is trying something - a planned PG hunt for students like you.",
  "No promises. Just an honest attempt.",
];

const AUTO_ROTATE_MS = 4400;
const SLIDE_DISTANCE = 60;

export function HeroSection() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isLast = step === LINES.length - 1;

  const start = useCallback(() => {
    track("continue_click", { from: "hero" });
    router.push(ROUTES.plan);
  }, [router]);

  const goTo = useCallback((nextStep: number, moveDirection: number) => {
    if (nextStep < 0 || nextStep >= LINES.length) {
      if (nextStep >= LINES.length) start();
      return;
    }
    setDirection(moveDirection);
    setStep(nextStep);
  }, [start]);

  const next = useCallback(() => {
    if (isLast) {
      start();
      return;
    }
    goTo(step + 1, 1);
  }, [isLast, start, step, goTo]);

  const prev = useCallback(() => {
    goTo(step - 1, -1);
  }, [step, goTo]);

  useEffect(() => {
    if (isPaused || isLast) return;
    const id = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [isPaused, isLast, next]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? SLIDE_DISTANCE : -SLIDE_DISTANCE,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -SLIDE_DISTANCE : SLIDE_DISTANCE,
      opacity: 0,
      scale: 0.96,
    }),
  };

  return (
    <section className="flex min-h-[calc(100svh-72px)] flex-col items-center justify-center gap-8 px-6 py-6">
      <div
        className="relative w-full max-w-sm flex-1"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="flex h-full items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.p
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -40) next();
                else if (info.offset.x > 40) prev();
              }}
              className="cursor-grab text-center text-[21px] font-semibold leading-[1.45] text-ink active:cursor-grabbing"
            >
              {LINES[step]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            disabled={step === 0}
            aria-label="Previous"
            className="flex size-11 items-center justify-center rounded-full border-[1.5px] border-ink/15 bg-card text-ink/70 shadow-sm transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-30 disabled:hover:border-ink/15 disabled:hover:text-ink/70"
          >
            <ChevronLeft className="size-5" />
          </motion.button>

          <span className="min-w-[4.5rem] text-center text-[12px] font-medium text-muted-foreground">
            {step + 1} / {LINES.length}
          </span>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={next}
            aria-label="Next"
            className="flex size-11 items-center justify-center rounded-full border-[1.5px] border-ink/15 bg-card text-ink/70 shadow-sm transition-colors hover:border-ink/30 hover:text-ink"
          >
            <ChevronRight className="size-5" />
          </motion.button>
        </div>

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
