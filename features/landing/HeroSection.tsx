"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

export function HeroSection() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const isLast = step === LINES.length - 1;

  function next() {
    if (isLast) {
      track("continue_click", { from: "hero" });
      router.push(ROUTES.plan);
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <section
      className="flex h-[calc(100svh-72px)] flex-col items-center justify-center gap-8 px-6 py-6"
      onClick={next}
    >
      <div className="relative w-full max-w-sm flex-1">
        <div className="flex h-full flex-col justify-center gap-5">
          {LINES.slice(0, step + 1).map((line) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-[19px] font-medium leading-[1.5] text-ink"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col items-center gap-2.5">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="w-full gap-1"
        >
          {isLast ? "Plan My PG Hunt" : "Next"}
          {!isLast && <ChevronRight className="size-4" />}
        </Button>
        <p className="text-[11px] text-muted-foreground">Takes 30 seconds. No spam.</p>
      </div>
    </section>
  );
}
