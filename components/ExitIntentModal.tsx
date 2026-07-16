"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";

export interface ExitIntentModalProps {
  isOpen: boolean;
  remainingQuestions: number;
  onContinue: () => void;
  onLeave: () => void;
}

/**
 * Gentle overlay shown when the user hits the in-app back button during the
 * questionnaire. Emphasizes how close they are to their plan rather than
 * forcing them to stay.
 */
export function ExitIntentModal({ isOpen, remainingQuestions, onContinue, onLeave }: ExitIntentModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg"
          >
            <p className="text-[18px] font-semibold text-ink">
              Wait, your plan is almost ready.
            </p>
            <p className="mt-2 text-[14px] text-muted-foreground">
              Just {remainingQuestions} more question{remainingQuestions !== 1 ? "s" : ""}.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button onClick={onContinue} className="w-full">
                Continue
              </Button>
              <Button variant="ghost" onClick={onLeave} className="w-full">
                Leave
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
