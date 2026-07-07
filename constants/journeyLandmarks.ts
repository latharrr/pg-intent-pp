/**
 * Landmark x-coordinates (on the 0-1000-wide road viewBox) and the journey
 * step at which each is "reached" - transcribed from wireframe_analysis.md's
 * FooterJourney reference states (0a-0e), adapted to this app's simplified
 * 0-7 step scale (see the approved plan's "Journey Footer" section).
 */
export interface JourneyLandmark {
  id: "delhi" | "duGate" | "library" | "metro" | "destination" | "house" | "flag";
  x: number;
  y: number;
  thresholdStep: number;
  label: string;
}

export const JOURNEY_LANDMARKS: JourneyLandmark[] = [
  { id: "delhi", x: 200, y: 22, thresholdStep: 0.7, label: "Delhi" },
  { id: "duGate", x: 340, y: 22, thresholdStep: 1.5, label: "DU Gate" },
  { id: "library", x: 460, y: 16, thresholdStep: 2.2, label: "library" },
  { id: "metro", x: 522, y: 22, thresholdStep: 2.5, label: "M" },
  { id: "destination", x: 700, y: 30, thresholdStep: 4.5, label: "Kamla Nagar" },
  { id: "house", x: 860, y: 40, thresholdStep: 6, label: "PG" },
  { id: "flag", x: 940, y: 25, thresholdStep: 7, label: "" },
];

/** Piecewise-linear keyframes the walking character interpolates between. */
export const CHARACTER_KEYFRAMES: Array<{ step: number; x: number; y: number }> = [
  { step: 0, x: 20, y: 44 },
  { step: 1.5, x: 340, y: 40 },
  { step: 3, x: 460, y: 34 },
  { step: 4.5, x: 700, y: 26 },
  { step: 6, x: 860, y: 36 },
  { step: 7, x: 960, y: 30 },
];

export const JOURNEY_CAPTIONS: Array<{ atStep: number; text: (recommendedAreaName: string | null) => string }> = [
  { atStep: 0, text: () => "Starting your move." },
  { atStep: 1, text: () => "Figuring out your budget." },
  { atStep: 2, text: () => "Exploring North Campus areas." },
  { atStep: 3, text: () => "Building your move profile." },
  { atStep: 4, text: () => "Checking verified PGs…" },
  { atStep: 5, text: (area) => `Reaching ${area ?? "your best area"}` },
  { atStep: 6, text: () => "Almost there." },
  { atStep: 7, text: () => "You've arrived." },
];

export const ROAD_START_X = 20;
export const ROAD_END_X = 980;
