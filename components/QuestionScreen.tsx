"use client";

import { cn } from "@/lib/utils";
import { Doodle, type DoodleName } from "@/components/Doodle";

export interface QuestionScreenProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  doodle?: DoodleName;
}

/**
 * Shared shell for the 3-question PG Hunt Planner.
 * Displays a friendly question and tappable cards; the confirmation for the
 * answer lives on its own NarrativeBridgeScreen right after this one.
 */
export function QuestionScreen({ title, children, className, doodle }: QuestionScreenProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {doodle && <Doodle name={doodle} className="self-start" />}
      <h2 className="text-[22px] font-medium leading-snug text-ink">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
