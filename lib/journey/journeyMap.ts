import {
  CHARACTER_KEYFRAMES,
  JOURNEY_CAPTIONS,
  JOURNEY_LANDMARKS,
  type JourneyLandmark,
} from "@/constants/journeyLandmarks";
import { clamp, isCurrentLandmark, lerp, stepToOpacity } from "./interpolate";

export interface JourneyFrame {
  dashoffset: number;
  landmarkOpacities: Record<JourneyLandmark["id"], number>;
  characterPosition: { x: number; y: number };
  caption: string;
  pulsingLandmarkId: JourneyLandmark["id"] | null;
  destinationLabel: string;
}

/**
 * Pure function of (currentStep, totalSteps, recommendedAreaName) -> the
 * full render frame for JourneyFooter. No side effects, no component state - 
 * this is what makes the footer safe to drive purely from Zustand props
 * without ever needing to remount.
 */
export function getJourneyFrame(
  currentStep: number,
  totalSteps: number,
  recommendedAreaName: string | null,
): JourneyFrame {
  const step = clamp(currentStep, 0, totalSteps);

  const dashoffset = 100 - (step / totalSteps) * 100;

  const landmarkOpacities = {} as Record<JourneyLandmark["id"], number>;
  let pulsingLandmarkId: JourneyLandmark["id"] | null = null;
  let closestDistance = Infinity;

  for (const landmark of JOURNEY_LANDMARKS) {
    landmarkOpacities[landmark.id] = stepToOpacity(landmark.thresholdStep, step);
    if (isCurrentLandmark(landmark.thresholdStep, step)) {
      const distance = Math.abs(step - landmark.thresholdStep);
      if (distance < closestDistance) {
        closestDistance = distance;
        pulsingLandmarkId = landmark.id;
      }
    }
  }

  const characterPosition = interpolateCharacterPosition(step);

  const activeCaption = [...JOURNEY_CAPTIONS].reverse().find((c) => step >= c.atStep) ?? JOURNEY_CAPTIONS[0];
  const caption = activeCaption.text(recommendedAreaName);

  const destinationLabel = recommendedAreaName ?? "your best area";

  return { dashoffset, landmarkOpacities, characterPosition, caption, pulsingLandmarkId, destinationLabel };
}

function interpolateCharacterPosition(step: number): { x: number; y: number } {
  const keyframes = CHARACTER_KEYFRAMES;
  if (step <= keyframes[0].step) return { x: keyframes[0].x, y: keyframes[0].y };
  const last = keyframes[keyframes.length - 1];
  if (step >= last.step) return { x: last.x, y: last.y };

  for (let i = 0; i < keyframes.length - 1; i++) {
    const current = keyframes[i];
    const next = keyframes[i + 1];
    if (step >= current.step && step <= next.step) {
      const t = (step - current.step) / (next.step - current.step);
      return { x: lerp(current.x, next.x, t), y: lerp(current.y, next.y, t) };
    }
  }
  return { x: last.x, y: last.y };
}
