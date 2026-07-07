"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useJourneyStore, useRecommendedAreaName } from "@/lib/store/useJourneyStore";
import { runMatching } from "@/lib/matching/runMatching";
import { AREAS } from "@/lib/data/areas";
import { PGS } from "@/lib/data/pgs";
import { COLLEGES } from "@/lib/data/colleges";
import { Button } from "@/components/Button";
import { PGCard } from "@/components/PGCard";
import { MatchingOverlay } from "@/features/results/MatchingOverlay";
import { Doodle } from "@/components/Doodle";
import { ROUTES } from "@/constants/routes";
import { track } from "@/lib/analytics";
import { useFocusOnChange } from "@/utils/useFocusOnChange";
import { BUDGET_BAND_LABELS, ROOM_TYPE_LABELS, MOVE_TIMELINE_LABELS } from "@/types/enums";
import type { PG, PgMatch, UserProfile } from "@/types";
import { MessageCircle, Phone } from "lucide-react";

const ONBOARDING_DATE = "July 20";
const OVERLAY_DURATION_MS = 1400;

function formatSummary(profile: UserProfile) {
  const landing = profile.moveTimeline ? MOVE_TIMELINE_LABELS[profile.moveTimeline] : "-";
  const budget = profile.budgetBand ? BUDGET_BAND_LABELS[profile.budgetBand] : "-";
  const room = profile.roomType ? ROOM_TYPE_LABELS[profile.roomType] : "-";
  return { landing, budget, room };
}

export default function ResultsPage() {
  const router = useRouter();
  const profile = useJourneyStore((state) => state.profile);
  const goToStep = useJourneyStore((state) => state.goToStep);
  const setRecommendedArea = useJourneyStore((state) => state.setRecommendedArea);
  const toggleShortlist = useJourneyStore((state) => state.toggleShortlist);
  const recommendedAreaName = useRecommendedAreaName();
  const [isRevealed, setIsRevealed] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const containerRef = useFocusOnChange<HTMLDivElement>(isRevealed);

  const recommendations = useMemo(
    () => runMatching(profile, { areas: AREAS, pgs: PGS, colleges: COLLEGES }),
    [profile],
  );

  const topRecommendation = recommendations[0];
  const topMatch: { match: PgMatch; pg: PG } | null = (() => {
    const first = topRecommendation?.pgMatches[0];
    if (!first) return null;
    const pg = PGS.find((candidate) => candidate.id === first.pgId);
    return pg ? { match: first, pg } : null;
  })();
  const topArea = topRecommendation ? AREAS.find((a) => a.id === topRecommendation.areaId) : null;

  useEffect(() => {
    goToStep("matching");
    const timer = setTimeout(() => {
      goToStep("results");
      setRecommendedArea(topArea?.id ?? null);
      track("recommendation_generated", { topArea: topRecommendation?.areaId });
      setIsRevealed(true);
    }, OVERLAY_DURATION_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isRevealed) {
    return <MatchingOverlay areaName={recommendedAreaName} />;
  }

  const summary = formatSummary(profile);
  const hasMatch = !!topMatch && topMatch.match.pgMatchPercent > 0;

  return (
    <div ref={containerRef} className="flex flex-1 flex-col gap-5 px-6 py-6">
      <div className="flex flex-col gap-3">
        <Doodle name="map" className="self-start" />
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold leading-tight text-ink">Your PG Hunt Plan is Ready</h1>
          <p className="text-[13px] text-muted-foreground">
            Based on: Landing {summary.landing} | Budget {summary.budget} | {summary.room}
          </p>
        </div>
      </div>

      {hasMatch ? (
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-medium text-ink">Closest Match Right Now</p>
            <PGCard
              pg={topMatch.pg}
              matchPercent={topMatch.match.pgMatchPercent}
              reasons={topMatch.match.pgMatchReasons}
              isShortlisted={profile.shortlistedPgIds.includes(topMatch.pg.id)}
              onToggleShortlist={() => toggleShortlist(topMatch.pg.id)}
              onVirtualVisit={() => {
                track("virtual_visit_click", { pgId: topMatch.pg.id });
                window.open("/pg-download.html", "_blank", "noopener,noreferrer");
              }}
            />
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <div className="rounded-lg border-[1.5px] border-ink/10 bg-card p-4">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                We&apos;re onboarding 8 more PGs matching your plan by {ONBOARDING_DATE}. Want us to ping you when they&apos;re live?
              </p>
            </div>

            <Button
              onClick={() => {
                track("continue_click", { from: "results" });
                router.push(ROUTES.contact);
              }}
              className="w-full gap-2"
            >
              <MessageCircle className="size-4" />
              Yes, WhatsApp Me
            </Button>

            <button
              type="button"
              onClick={() => {
                track("continue_click", { from: "results", choice: "check_back" });
                setShowReferral(true);
              }}
              className="text-center text-[12px] text-muted-foreground underline underline-offset-4 hover:text-ink"
            >
              I&apos;ll check back later
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-5">
          <div className="rounded-lg border-[1.5px] border-ink/10 bg-card p-4">
            <p className="text-[15px] font-medium text-ink">We don&apos;t have a perfect match in our network yet.</p>
            <p className="mt-1 text-[13px] text-muted-foreground">But here&apos;s what we know you need:</p>
            <ul className="mt-2 flex flex-col gap-1 text-[13px] text-ink">
              <li>
                <span aria-hidden="true">→ </span>
                {summary.room} room near North Campus
              </li>
              <li>
                <span aria-hidden="true">→ </span>
                Budget: {summary.budget}
              </li>
              <li>
                <span aria-hidden="true">→ </span>
                Move-in: {summary.landing}
              </li>
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              We&apos;re onboarding 6 PGs that fit this exact plan by {ONBOARDING_DATE}. Save your plan and we&apos;ll WhatsApp you the moment they go live.
            </p>

            <Button
              onClick={() => {
                track("continue_click", { from: "results" });
                router.push(ROUTES.contact);
              }}
              className="w-full gap-2"
            >
              <Phone className="size-4" />
              Save My Plan, Notify Me on WhatsApp
            </Button>

            <button
              type="button"
              onClick={() => setShowReferral(true)}
              className="text-center text-[12px] text-muted-foreground underline underline-offset-4 hover:text-ink"
            >
              Know a PG owner near North Campus? Refer a PG, Earn ₹500
            </button>
          </div>
        </div>
      )}

      {showReferral && (
        <div className="rounded-lg border-[1.5px] border-budget bg-budget/10 p-4 text-[13px] text-ink">
          Thanks! Share this link with a PG owner near North Campus and we&apos;ll credit ₹500 to your Picapool wallet once they list.
        </div>
      )}
    </div>
  );
}
