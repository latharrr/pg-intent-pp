export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Shared threshold-based opacity curve used by every JourneyFooter landmark:
 * dim while upcoming, a brief "current" pulse window around its threshold
 * step, then a reached-but-not-gone fade afterwards (landmarks fade rather
 * than disappear, per wireframe_analysis.md).
 */
export function stepToOpacity(
  thresholdStep: number,
  currentStep: number,
  dimValue = 0.22,
  reachedValue = 0.6,
  currentValue = 1,
): number {
  const distance = currentStep - thresholdStep;
  if (distance < -0.5) return dimValue;
  if (distance <= 0.5) return currentValue;
  return reachedValue;
}

export function isCurrentLandmark(thresholdStep: number, currentStep: number): boolean {
  return Math.abs(currentStep - thresholdStep) <= 0.5;
}
