import { Spinner, StatusLines, SkeletonCard } from "@/components/LoadingStates";

export interface MatchingOverlayProps {
  areaName: string | null;
}

/** The ~1.5-2s scripted loading beat between Move Profile and results - not
 * a route, just an in-page state. Loading doubles as a trust beat rather
 * than a generic spinner. */
export function MatchingOverlay({ areaName }: MatchingOverlayProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <Spinner />
      <StatusLines
        lines={[
          { text: `Checking verified PGs near ${areaName ?? "your best area"}…` },
          { text: "Matching your budget range next", tone: "muted" },
        ]}
      />
      <p className="max-w-[30ch] text-[11.5px] italic text-muted-foreground">
        We only show PGs our team has actually visited.
      </p>
      <div className="flex w-full max-w-[280px] flex-col gap-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
