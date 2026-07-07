import { Chip, type ChipVariant } from "@/components/ChipRow";
import { CollegeCard } from "@/components/CollegeCard";
import { formatWalkTime } from "@/utils/format";
import type { Area } from "@/types";

export interface AreaCardProps {
  area: Area;
  matchPercent: number;
  reasons?: string[];
  collegeName?: string | null;
  selected?: boolean;
  onClick?: () => void;
}

function matchVariant(percent: number): ChipVariant {
  if (percent >= 85) return "match";
  if (percent >= 70) return "match-mid";
  return "match-low";
}

export function AreaCard({ area, matchPercent, reasons, collegeName, selected, onClick }: AreaCardProps) {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={
        "flex w-full flex-col gap-1.5 rounded-lg border-[1.5px] px-4 py-3 text-left transition-colors " +
        (selected ? "border-match bg-match/5" : "border-ink/15 bg-card")
      }
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[15px] font-semibold text-ink">{area.name}</span>
        <Chip variant={matchVariant(matchPercent)} className="pointer-events-none">
          {matchPercent}% match
        </Chip>
      </div>
      <p className="text-[12.5px] text-muted-foreground">{area.description}</p>
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        <span>{formatWalkTime(area.walkTimeToCampusMin)}</span>
        {collegeName && (
          <>
            <span aria-hidden="true">·</span>
            <CollegeCard name={collegeName} />
          </>
        )}
      </div>
      {reasons && reasons.length > 0 && (
        <p className="text-[11px] text-match">{reasons.map((r) => `✓ ${r}`).join("  ")}</p>
      )}
    </Component>
  );
}
