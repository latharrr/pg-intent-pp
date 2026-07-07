import { cn } from "@/lib/utils";

export interface ProgressHeaderProps {
  currentIndex: number;
  total: number;
}

/** The question-flow's own 7-segment progress row - distinct from
 * JourneyFooter, which tracks overall journey position, not question position. */
export function ProgressHeader({ currentIndex, total }: ProgressHeaderProps) {
  return (
    <div className="flex gap-1.5" role="progressbar" aria-valuenow={currentIndex} aria-valuemin={1} aria-valuemax={total} aria-label={`Question ${currentIndex} of ${total}`}>
      {Array.from({ length: total }).map((_, index) => (
        <div key={index} className={cn("h-[9px] flex-1 rounded", index < currentIndex ? "bg-ink" : "bg-filler")} />
      ))}
    </div>
  );
}
