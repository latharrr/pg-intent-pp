import * as React from "react";
import { cn } from "@/lib/utils";

type PicapoolButtonVariant = "primary" | "ghost" | "link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PicapoolButtonVariant;
}

const variantClasses: Record<PicapoolButtonVariant, string> = {
  primary:
    "min-h-12 rounded-lg bg-selected px-5 text-[15px] font-semibold text-white transition-colors hover:bg-selected/90 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none",
  ghost:
    "min-h-11 rounded-lg border-[1.5px] border-dashed border-ink/70 px-4 text-[13px] font-medium text-ink/70 transition-colors hover:border-ink hover:text-ink disabled:opacity-50 disabled:pointer-events-none",
  link: "text-[13px] font-medium text-selected underline underline-offset-4 hover:text-selected/80",
};

/** Wraps the base shadcn button element with Picapool's own visual variants
 * (solid selected-coral primary, dashed ghost, plain link) rather than
 * shadcn's default palette - see wireframe_analysis.md's Button CSS. */
export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-selected focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
