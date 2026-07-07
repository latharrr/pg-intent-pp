import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface QuestionCardProps {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  insight?: string;
  insightTone?: "budget" | "match";
  className?: string;
}

/** The shared question shell - eyebrow + title + options slot + an inline
 * insight banner that appears right after a selection. Reused across the
 * cards (1h), slider (1i), and binary-tile (1j) question templates. */
export function QuestionCard({ eyebrow, title, children, insight, insightTone = "budget", className }: QuestionCardProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {eyebrow && <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{eyebrow}</p>}
      <h2 className="text-lg font-semibold leading-snug text-ink">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
      <AnimatePresence>
        {insight && (
          <motion.p
            key={insight}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="status"
            aria-live="polite"
            className={cn(
              "rounded-lg border-[1.5px] px-3 py-2 text-[12.5px] font-medium",
              insightTone === "budget" ? "border-budget bg-budget/10 text-ink" : "border-match bg-match/10 text-match",
            )}
          >
            {insight}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
