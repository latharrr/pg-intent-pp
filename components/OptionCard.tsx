import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface OptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  size?: "default" | "tile";
}

/** A single tappable choice box - the wireframe's full-bleed choice card
 * (1h) and, at size="tile", the larger side-by-side binary tile (1j). */
export function OptionCard({ label, description, selected, onSelect, size = "default" }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex flex-col gap-1 rounded-lg border-2 px-4 py-3 text-left transition-colors",
        size === "tile" && "flex-1 items-center justify-center py-6 text-center",
        selected ? "border-selected bg-selected/5" : "border-ink/15 bg-card hover:border-ink/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selected focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <span className={cn("text-[15px] font-semibold", selected ? "text-selected" : "text-ink")}>{label}</span>
      {description && <span className="text-[12px] text-muted-foreground">{description}</span>}
    </motion.button>
  );
}
