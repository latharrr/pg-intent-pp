import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface OptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  size?: "default" | "tile";
}

/** A single tappable choice box - full-width card with subtle border,
 * coral selected state, and a 0.98x tap feedback. */
export function OptionCard({ label, description, selected, onSelect, size = "default" }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
      className={cn(
        "flex min-h-16 flex-col justify-center rounded-xl border px-4 py-3 text-left transition-colors",
        size === "tile" && "flex-1 items-center justify-center py-6 text-center",
        selected
          ? "border-selected bg-[#FFF5F5]"
          : "border-[#E5E5E5] bg-white hover:border-ink/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selected focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <span className={cn("text-[16px] font-medium text-ink")}>{label}</span>
      {description && <span className="text-[13px] text-muted-foreground">{description}</span>}
    </motion.button>
  );
}
