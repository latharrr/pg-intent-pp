"use client";

export interface JourneyFooterProps {
  currentStep: number;
  totalSteps: number;
  recommendedArea: string | null;
  animationState: string;
}

function getCaption(step: number, totalSteps: number): string {
  if (step <= 0) return "Start your move";
  if (step < 2) return "Build your plan";
  if (step < 3) return "Find your area";
  if (step < 4) return "Pick your PG";
  if (step < totalSteps) return "Almost there";
  return "You're all set";
}

/**
 * The persistent Journey Footer - mounted once in app/(journey)/layout.tsx
 * and never remounted. Shows a simple segmented progress bar and a clean
 * step caption. The recommended area is intentionally kept off the footer
 * so it does not leak before the results page.
 */
export function JourneyFooter({ currentStep, totalSteps }: JourneyFooterProps) {
  const safeStep = Math.min(Math.max(currentStep, 0), totalSteps);
  const caption = getCaption(safeStep, totalSteps);

  return (
    <footer
      role="status"
      aria-label={`Move journey progress: ${caption}`}
      className="sticky bottom-0 left-0 right-0 z-20 flex h-[64px] flex-col justify-end border-t border-ink/10 bg-card px-4 pb-3"
    >
      <div className="flex w-full items-center gap-2 px-1">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const completed = index < safeStep;
          const active = Math.floor(safeStep) === index;
          return (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                completed ? "bg-selected" : active ? "bg-selected/40" : "bg-filler"
              }`}
            />
          );
        })}
      </div>
      <p className="mt-2 text-center text-[11px] font-medium tracking-wide text-muted-foreground">
        {caption}
      </p>
    </footer>
  );
}
