export interface AnimatedCharacterProps {
  x: number;
  y: number;
}

/** The walking-student figure inside JourneyFooter - isolated as its own
 * component for reuse/testability, per the required component list. */
export function AnimatedCharacter({ x, y }: AnimatedCharacterProps) {
  return (
    <g transform={`translate(${x},${y})`}>
      <g transform="translate(-11,0)" className="motion-safe-sway" style={{ transformOrigin: `${x - 11}px ${y}px` }}>
        <line x1="0" y1="-9" x2="0" y2="-1" stroke="var(--color-ink)" strokeWidth="1.3" />
        <rect x="-3" y="-1" width="6" height="7" rx="1" fill="none" stroke="var(--color-ink)" strokeWidth="1.3" />
      </g>
      <rect x="-9" y="-14" width="6.5" height="9" rx="2" fill="none" stroke="var(--color-ink)" strokeWidth="1.4" />
      <line x1="0" y1="-14" x2="0" y2="-2" stroke="var(--color-ink)" strokeWidth="1.8" />
      <circle cx="0" cy="-18" r="4" fill="none" stroke="var(--color-ink)" strokeWidth="1.8" />
      <line x1="0" y1="-11" x2="6" y2="-6" stroke="var(--color-ink)" strokeWidth="1.5" />
      <line x1="0" y1="-2" x2="-4" y2="6" stroke="var(--color-ink)" strokeWidth="1.8" />
      <line x1="0" y1="-2" x2="4" y2="6" stroke="var(--color-ink)" strokeWidth="1.8" />
    </g>
  );
}
