import { describe, expect, it } from "vitest";
import { getJourneyFrame } from "./journeyMap";

const TOTAL_STEPS = 7;

describe("getJourneyFrame", () => {
  it("computes dashoffset linearly from 100 (step 0) to 0 (final step)", () => {
    expect(getJourneyFrame(0, TOTAL_STEPS, null).dashoffset).toBeCloseTo(100);
    expect(getJourneyFrame(TOTAL_STEPS, TOTAL_STEPS, null).dashoffset).toBeCloseTo(0);
    expect(getJourneyFrame(TOTAL_STEPS / 2, TOTAL_STEPS, null).dashoffset).toBeCloseTo(50);
  });

  it("clamps out-of-range steps instead of producing negative dashoffset or >100", () => {
    expect(getJourneyFrame(-3, TOTAL_STEPS, null).dashoffset).toBeCloseTo(100);
    expect(getJourneyFrame(99, TOTAL_STEPS, null).dashoffset).toBeCloseTo(0);
  });

  it("dims a landmark before its threshold and fades (but does not hide) it after", () => {
    const early = getJourneyFrame(0, TOTAL_STEPS, null);
    const late = getJourneyFrame(7, TOTAL_STEPS, null);
    expect(early.landmarkOpacities.duGate).toBeLessThan(late.landmarkOpacities.duGate);
    expect(late.landmarkOpacities.delhi).toBeGreaterThan(0);
  });

  it("marks the landmark nearest the current step as pulsing", () => {
    const frame = getJourneyFrame(6, TOTAL_STEPS, null);
    expect(frame.pulsingLandmarkId).toBe("house");
  });

  it("uses the recommended area name for the destination label and caption once set", () => {
    const withoutArea = getJourneyFrame(5, TOTAL_STEPS, null);
    expect(withoutArea.destinationLabel).toBe("your best area");

    const withArea = getJourneyFrame(5, TOTAL_STEPS, "Kamla Nagar");
    expect(withArea.destinationLabel).toBe("Kamla Nagar");
    expect(withArea.caption).toContain("Kamla Nagar");
  });

  it("picks the caption matching the highest threshold not exceeding the current step", () => {
    expect(getJourneyFrame(0, TOTAL_STEPS, null).caption).toBe("Starting your move.");
    expect(getJourneyFrame(7, TOTAL_STEPS, null).caption).toBe("You've arrived.");
  });

  it("interpolates the character position smoothly between keyframes rather than jumping", () => {
    const start = getJourneyFrame(0, TOTAL_STEPS, null).characterPosition;
    const mid = getJourneyFrame(0.75, TOTAL_STEPS, null).characterPosition;
    const nextKeyframe = getJourneyFrame(1.5, TOTAL_STEPS, null).characterPosition;
    expect(mid.x).toBeGreaterThan(start.x);
    expect(mid.x).toBeLessThan(nextKeyframe.x);
  });
});
