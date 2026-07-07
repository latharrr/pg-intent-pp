"use client";

export interface JourneyFooterProps {
  currentStep: number;
  totalSteps: number;
  recommendedArea: string | null;
  animationState: string;
}

/**
 * The persistent Journey Footer - mounted once in app/(journey)/layout.tsx
 * and never remounted. Shows a simple segmented progress bar and a caption.
 */
export function JourneyFooter({ currentStep, totalSteps, recommendedArea }: JourneyFooterProps) {
  const caption = recommendedArea
    ? `Almost there - ${recommendedArea}`
    : `Step ${Math.floor(currentStep)} of ${totalSteps}`;

  return (
    <footer
      role="status"
      aria-label={`Move journey progress: ${caption}`}
      className="sticky bottom-0 left-0 right-0 z-20 flex h-[72px] flex-col justify-end border-t-[1.5px] border-dashed border-dashed-line bg-card px-3 pb-1"
    >
      <div className="flex w-full items-center gap-1.5 px-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${
              index < currentStep ? "bg-selected" : "bg-filler"
            }`}
          />
        ))}
      </div>
      <p className="h-3 truncate text-center text-[10px] leading-tight tracking-wide text-muted-foreground">
        {caption}
      </p>
    </footer>
  );
}
