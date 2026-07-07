import { GraduationCap } from "lucide-react";

export interface CollegeCardProps {
  name: string;
}

/** A small inline badge for a nearby college - used inside AreaCard's detail line. */
export function CollegeCard({ name }: CollegeCardProps) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      <GraduationCap className="size-3" aria-hidden="true" />
      {name}
    </span>
  );
}
