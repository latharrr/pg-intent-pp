"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { ROUTES } from "@/constants/routes";
import { track } from "@/lib/analytics";

const LINES = [
  "You're coming to North Campus for the first time.",
  "You have one, maybe two days to find a PG.",
  "Hotels are expensive. You can't afford to explore.",
  "So you'll panic-pick from whatever a broker shows you.",
  "That's not a plan. That's survival.",
  "This time, Picapool is trying something - a planned PG hunt for students like you.",
  "No promises. Just an honest attempt.",
];

const PULSE_DURATION = 0.4;
const STAGGER_DELAY = 0.25;
const CTA_DELAY_AFTER_LAST_LINE = 0.5;
const CTA_DELAY = (LINES.length - 1) * STAGGER_DELAY + CTA_DELAY_AFTER_LAST_LINE;

export function HeroSection() {
  const router = useRouter();
  const [skipped, setSkipped] = useState(false);

  const start = useCallback(() => {
    track("continue_click", { from: "hero" });
    router.push(ROUTES.plan);
  }, [router]);

  const handleSkip = useCallback(() => {
    if (!skipped) {
      track("hero_animation_skipped");
      setSkipped(true);
    }
  }, [skipped]);

  return (
    <section
      className="relative flex min-h-[calc(100svh-64px)] flex-col justify-center px-6 py-8"
      onClick={handleSkip}
      aria-label="Picapool PG Hunt Planner introduction"
    >
      <div className="mx-auto w-full max-w-[480px]">
        <div className="flex flex-col gap-1">
          {LINES.map((line, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0.08 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: skipped ? 0 : PULSE_DURATION,
                delay: skipped ? 0 : index * STAGGER_DELAY,
                ease: "easeOut",
              }}
              className="text-[20px] font-medium leading-[1.6] text-ink md:text-[24px]"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: skipped ? 0 : 0.5,
          delay: skipped ? 0 : CTA_DELAY,
          ease: "easeOut",
        }}
        className="mx-auto mt-12 w-full max-w-[480px]"
        onClick={(event) => event.stopPropagation()}
      >
        <Button onClick={start} className="w-full rounded-xl">
          Plan My PG Hunt
        </Button>
        <p className="mt-3 text-center text-[13px] text-muted-foreground">
          Takes 30 seconds. No spam.
        </p>
      </motion.div>

      <p className="sr-only">
        Tap anywhere on the screen to skip the introduction animation.
      </p>
    </section>
  );
}
