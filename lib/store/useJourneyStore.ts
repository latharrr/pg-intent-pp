"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createEmptyUserProfile, type UserProfile } from "@/types/userProfile";
import { INITIAL_JOURNEY_PROGRESS, type JourneyProgress } from "@/types/journeyProgress";
import { getFooterStep, getStepIndex, type StepId } from "@/lib/journey/footerSteps";
import { getAreaById } from "@/lib/data/areas";
import { JOURNEY_STORE_KEY, JOURNEY_STORE_VERSION } from "./storeKeys";

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface JourneyStoreState {
  profile: UserProfile;
  journey: JourneyProgress;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  goToStep: (stepId: StepId) => void;
  setRecommendedArea: (areaId: string | null) => void;
  toggleShortlist: (pgId: string) => void;
  setReferralSource: (source: string) => void;
}

export const useJourneyStore = create<JourneyStoreState>()(
  persist(
    (set) => ({
      profile: createEmptyUserProfile(generateSessionId()),
      journey: INITIAL_JOURNEY_PROGRESS,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      updateProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial, updatedAt: new Date().toISOString() },
        })),

      goToStep: (stepId) =>
        set((state) => {
          const previousId = state.journey.currentStepId;
          const completedStepIds = state.journey.completedStepIds.includes(previousId)
            ? state.journey.completedStepIds
            : [...state.journey.completedStepIds, previousId];
          return {
            journey: {
              ...state.journey,
              currentStepId: stepId,
              currentStepIndex: getStepIndex(stepId),
              animationState: stepId === "success" ? "arrived" : "advancing",
              completedStepIds,
            },
          };
        }),

      setRecommendedArea: (areaId) =>
        set((state) => ({ journey: { ...state.journey, recommendedAreaId: areaId } })),

      setReferralSource: (source) =>
        set((state) => ({ profile: { ...state.profile, referralSource: source } })),

      toggleShortlist: (pgId) =>
        set((state) => {
          const current = state.profile.shortlistedPgIds;
          const exists = current.includes(pgId);
          const next = exists ? current.filter((id) => id !== pgId) : [...current, pgId].slice(0, 3);
          return { profile: { ...state.profile, shortlistedPgIds: next } };
        }),
    }),
    {
      name: JOURNEY_STORE_KEY,
      version: JOURNEY_STORE_VERSION,
      // Rehydration is triggered manually (see StoreHydrationGate) so this
      // module never touches localStorage during server rendering.
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({ profile: state.profile, journey: state.journey }),
    },
  ),
);

/** Derived footer step (0-5), the number JourneyFooter actually consumes. */
export function useFooterStep(): number {
  const currentStepId = useJourneyStore((state) => state.journey.currentStepId);
  return getFooterStep(currentStepId);
}

/** Resolves the persisted recommendedAreaId into the display name JourneyFooter needs. */
export function useRecommendedAreaName(): string | null {
  const recommendedAreaId = useJourneyStore((state) => state.journey.recommendedAreaId);
  if (!recommendedAreaId) return null;
  return getAreaById(recommendedAreaId)?.name ?? null;
}
