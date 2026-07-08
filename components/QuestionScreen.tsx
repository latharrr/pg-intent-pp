"use client";

import { cn } from "@/lib/utils";

export interface QuestionScreenProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  unlockText?: string | null;
}

/**
 * Shared shell for the 3-question PG Hunt Planner.
 * Displays a friendly question, tappable cards, and an optional inline
 * confirmation line that fades in after the user makes a selection.
 */
export function QuestionScreen({ title, children, className, unlockText }: QuestionScreenProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <h2 className="text-[22px] font-medium leading-snug text-ink">{title}</h2>
      <div className="flex flex-col gap-4">
        {children}
        {unlockText && (
          <p className="min-h-[20px] animate-fade-in text-[13px] text-[#888888]">
            {unlockText}
          </p>
        )}
      </div>
    </div>
  );
}
