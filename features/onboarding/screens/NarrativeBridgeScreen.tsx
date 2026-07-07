"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/Button";

const AUTO_ADVANCE_MS = 1400;

export interface NarrativeBridgeScreenProps {
  message: string;
  onAdvance: () => void;
}

/**
 * The narrative beat between two questions - promotes what used to be a
 * small inline confirmation line into its own full-screen moment (Duolingo-
 * style "nice!" pacing) before the next question begins. Auto-advances, but
 * a manual "Next" is always available for users who don't want to wait.
 */
export function NarrativeBridgeScreen({ message, onAdvance }: NarrativeBridgeScreenProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(onAdvance, AUTO_ADVANCE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  function handleManualAdvance() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onAdvance();
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center" role="status" aria-live="polite">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex size-14 items-center justify-center rounded-full bg-match/15 text-match"
      >
        <Check className="size-7" strokeWidth={2.5} />
      </motion.div>

      <motion.p
        key={message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.35 }}
        className="max-w-[28ch] rounded-2xl bg-secondary px-5 py-4 text-[17px] font-medium leading-[1.55] text-ink"
      >
        {message}
      </motion.p>

      <Button variant="ghost" onClick={handleManualAdvance} className="mt-2">
        Next
      </Button>
    </div>
  );
}
