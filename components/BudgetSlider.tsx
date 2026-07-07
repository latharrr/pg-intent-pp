"use client";

import { Slider } from "@/components/ui/slider";
import { formatRupees } from "@/utils/format";

export interface BudgetSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function BudgetSlider({ min, max, value, onChange, label = "budget comfort" }: BudgetSliderProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-[30px] font-semibold text-selected">{formatRupees(value)}</p>
      <Slider
        aria-label={label}
        min={min}
        max={max}
        step={500}
        value={[value]}
        onValueChange={(next) => onChange(Array.isArray(next) ? next[0] : next)}
      />
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{formatRupees(min)}</span>
        <span>{formatRupees(max)}</span>
      </div>
    </div>
  );
}
