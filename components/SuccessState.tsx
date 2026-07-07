import { Check } from "lucide-react";

export interface SuccessStateProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

/** Generic success-screen shell - badge + copy slot + action slot. */
export function SuccessState({ title, subtitle, children, icon }: SuccessStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      {icon ?? (
        <span className="flex size-16 items-center justify-center rounded-full bg-match/15 text-match">
          <Check className="size-8" strokeWidth={2.5} />
        </span>
      )}
      <h2 className="text-[20px] font-semibold text-ink">{title}</h2>
      {subtitle && <p className="max-w-[30ch] text-[13.5px] leading-relaxed text-muted-foreground">{subtitle}</p>}
      {children}
    </div>
  );
}
