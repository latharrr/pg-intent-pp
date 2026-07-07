import { describe, expect, it } from "vitest";
import { runMatching } from "./runMatching";
import { scoreArea } from "./scoreArea";
import { scorePG } from "./scorePG";
import { createEmptyUserProfile } from "@/types/userProfile";
import type { Area, College, PG } from "@/types";

function makeProfile(overrides: Partial<ReturnType<typeof createEmptyUserProfile>> = {}) {
  return { ...createEmptyUserProfile("test-session"), ...overrides };
}

const KAMLA: Area = {
  id: "kamla-nagar",
  name: "Kamla Nagar",
  vibeTag: "buzzing",
  avgRentPerMonth: 13000,
  walkTimeToCampusMin: 8,
  nearestCollegeId: "hindu-college",
  nearestMetroName: "GTB Nagar metro",
  normalizedX: 45,
  normalizedY: 40,
  description: "Buzzing area",
  safetyTag: "well-lit",
};

const MUKHERJEE: Area = {
  id: "mukherjee-nagar",
  name: "Mukherjee Nagar",
  vibeTag: "exam-focused",
  avgRentPerMonth: 11000,
  walkTimeToCampusMin: 18,
  nearestCollegeId: null,
  nearestMetroName: null,
  normalizedX: 75,
  normalizedY: 65,
  description: "Quiet area",
  safetyTag: null,
};

const COLLEGES: College[] = [{ id: "hindu-college", name: "Hindu College", areaId: "kamla-nagar", normalizedX: 50, normalizedY: 42 }];

function makePG(overrides: Partial<PG>): PG {
  return {
    id: "pg-1",
    name: "Test PG",
    areaId: "kamla-nagar",
    pricePerMonth: 13000,
    roomTypes: ["shared_2"],
    foodPolicy: "non_veg_ok",
    verifiedStatus: true,
    lastVerifiedDate: new Date().toISOString(),
    photoUrl: null,
    photoTakenDate: null,
    distanceToCollegeMin: 8,
    amenities: ["wifi"],
    genderPolicy: "any",
    rating: 4.5,
    ...overrides,
  };
}

describe("scorePG budget fit", () => {
  it("scores a PG priced inside the comfort range higher than one far outside it", () => {
    const profile = makeProfile({ budgetBand: "12k_18k" });
    const withinBudget = scorePG(profile, makePG({ pricePerMonth: 13000 }), 50);
    const wayOverBudget = scorePG(profile, makePG({ pricePerMonth: 30000 }), 50);
    expect(withinBudget.score).toBeGreaterThan(wayOverBudget.score);
    expect(withinBudget.reasons).toContain("within budget");
  });
});

describe("scorePG room type match", () => {
  it("scores a PG higher when it offers the requested room type", () => {
    const profile = makeProfile({ roomType: "solo" });
    const matchingRoom = scorePG(profile, makePG({ roomTypes: ["solo", "shared_2"] }), 50);
    const nonMatchingRoom = scorePG(profile, makePG({ roomTypes: ["shared_3"] }), 50);
    expect(matchingRoom.score).toBeGreaterThan(nonMatchingRoom.score);
    expect(matchingRoom.reasons).toContain("matches your room type");
  });
});

describe("scorePG verification bonus", () => {
  it("scores a freshly verified PG higher than an otherwise identical unverified one", () => {
    const profile = makeProfile();
    const verified = scorePG(profile, makePG({ verifiedStatus: true, lastVerifiedDate: new Date().toISOString() }), 50);
    const unverified = scorePG(profile, makePG({ verifiedStatus: false, lastVerifiedDate: null }), 50);
    expect(verified.score).toBeGreaterThan(unverified.score);
    expect(verified.reasons).toContain("Picapool Verified");
  });
});

describe("scoreArea", () => {
  it("rewards a nearby, budget-friendly area", () => {
    const profile = makeProfile({ budgetBand: "12k_18k" });
    const result = scoreArea(profile, KAMLA, [], COLLEGES);
    expect(result.score).toBeGreaterThan(0);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("degrades gracefully on a partial profile instead of scoring 0", () => {
    const result = scoreArea(makeProfile(), KAMLA, [], COLLEGES);
    expect(result.score).toBeGreaterThan(0);
  });
});

describe("runMatching", () => {
  const pgs: PG[] = [
    makePG({ id: "kamla-pg-any", areaId: "kamla-nagar", genderPolicy: "any" }),
    makePG({ id: "mukherjee-pg", areaId: "mukherjee-nagar", genderPolicy: "any", pricePerMonth: 11000 }),
  ];

  it("sorts areas by score descending", () => {
    const profile = makeProfile({ budgetBand: "12k_18k" });
    const recs = runMatching(profile, { areas: [MUKHERJEE, KAMLA], pgs, colleges: COLLEGES });
    expect(recs[0].areaId).toBe("kamla-nagar");
    expect(recs[0].areaMatchPercent).toBeGreaterThanOrEqual(recs[1].areaMatchPercent);
  });

  it("sorts each area's pgMatches by score descending", () => {
    const cheapPg = makePG({ id: "cheap", areaId: "kamla-nagar", pricePerMonth: 13000, rating: 5 });
    const expensivePg = makePG({ id: "pricey", areaId: "kamla-nagar", pricePerMonth: 30000, rating: 2 });
    const profile = makeProfile({ budgetBand: "12k_18k" });
    const recs = runMatching(profile, { areas: [KAMLA], pgs: [expensivePg, cheapPg], colleges: COLLEGES });
    expect(recs[0].pgMatches[0].pgId).toBe("cheap");
  });
});
