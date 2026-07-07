import * as React from "react";
import { cn } from "@/lib/utils";

export interface BottomCTAProps {
  children: React.ReactNode;
  className?: string;
  /** Extra bottom padding to clear the persistent JourneyFooter. */
  clearFooter?: boolean;
}

/** A sticky bottom-anchored action bar - used wherever the wireframe pushes
 * a button to the bottom via `margin-top:auto` (Story, Move Profile). */
export function BottomCTA({ children, className, clearFooter = true }: BottomCTAProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 z-10 -mx-4 mt-auto border-t border-border bg-background/95 px-4 pt-3 backdrop-blur-sm",
        clearFooter ? "pb-[84px]" : "pb-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
