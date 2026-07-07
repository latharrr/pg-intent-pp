import * as React from "react";
import { Input as InputPrimitive } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

/** Wraps shadcn's Input at a thumb-friendly 48px height, per the blueprint
 * PDF's own layout rule ("thumb-friendly tap targets minimum 48px height"). */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <InputPrimitive
        ref={ref}
        aria-invalid={error || undefined}
        className={cn("h-12 rounded-lg border-[1.5px] border-ink/30 px-4 text-base focus-visible:border-selected focus-visible:ring-selected/30", className)}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
