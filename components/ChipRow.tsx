import * as React from "react";
import { cn } from "@/lib/utils";

export type ChipVariant = "default" | "selected" | "match" | "match-mid" | "match-low" | "budget";

export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  variant?: ChipVariant;
}

const variantClasses: Record<ChipVariant, string> = {
  default: "border-ink bg-transparent text-ink",
  selected: "border-selected bg-selected text-white",
  match: "border-match bg-match text-white",
  "match-mid": "border-match-mid bg-match-mid text-white",
  "match-low": "border-match-low bg-match-low text-ink",
  budget: "border-budget bg-budget text-ink",
};

const CHIP_CLASSES =
  "inline-flex min-h-9 items-center rounded-full border-[1.5px] px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors";

/** The wireframe's `.chip` pill family - chip / chip-sel / chip-match /
 * chip-budget, plus the two desaturated match tiers (81%/74% confidence).
 * Renders a real <button> when interactive (onClick provided), or a plain
 * <span> for decorative/read-only badges - a badge nested inside an
 * AreaCard/PGCard <button> must never itself be a <button> (invalid,
 * un-hydratable HTML). */
export function Chip({ variant = "default", className, onClick, ...props }: ChipProps) {
  const classes = cn(
    CHIP_CLASSES,
    variantClasses[variant],
    onClick && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selected focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    className,
  );

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick as React.MouseEventHandler<HTMLButtonElement>} {...props}>
        {props.children}
      </button>
    );
  }

  return (
    <span className={classes} {...props}>
      {props.children}
    </span>
  );
}

export interface ChipRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ChipRow({ children, className }: ChipRowProps) {
  return <div className={cn("flex flex-wrap gap-2", className)}>{children}</div>;
}
