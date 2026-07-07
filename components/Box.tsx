import * as React from "react";
import { cn } from "@/lib/utils";

type BoxTone = "dashed" | "solid" | "match" | "budget";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: BoxTone;
}

const toneClasses: Record<BoxTone, string> = {
  dashed: "border-[1.5px] border-dashed border-dashed-line",
  solid: "border-[1.5px] border-ink",
  match: "border-[1.5px] border-match bg-match/5",
  budget: "border-[1.5px] border-budget bg-budget/10",
};

/** The wireframe's `.box` - a dashed-border card/tool container, the base
 * shell for question cards, area cards, and summary panels. */
export function Box({ tone = "dashed", className, ...props }: BoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-lg bg-card p-3",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
