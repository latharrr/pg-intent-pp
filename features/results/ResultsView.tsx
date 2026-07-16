"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp, Unlock } from "lucide-react";
import { useJourneyStore, useRecommendedAreaName } from "@/lib/store/useJourneyStore";
import { runMatching } from "@/lib/matching/runMatching";
import { AREAS } from "@/lib/data/areas";
import { COLLEGES, getCollegeById } from "@/lib/data/colleges";
import { PGCard } from "@/components/PGCard";
import { VirtualVisitModal } from "@/components/VirtualVisitModal";
import { InlineWhatsAppCapture } from "@/components/InlineWhatsAppCapture";
import { PhoneUnlockForm } from "@/components/PhoneUnlockForm";
import { SuccessModal } from "@/components/SuccessModal";
import { Doodle } from "@/components/Doodle";
import { useFocusOnChange } from "@/utils/useFocusOnChange";
import { BUDGET_BAND_LABELS, ROOM_TYPE_LABELS, MOVE_TIMELINE_LABELS } from "@/types/enums";
import { buildShareTextFromIds } from "@/utils/sharePlan";
import { computeLeadScore } from "@/lib/leadScore";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import type { PG, PgMatch, UserProfile } from "@/types";

const MAX_VISIBLE_MATCHES = 3;

function formatSummary(profile: UserProfile) {
  const landing = profile.moveTimeline ? MOVE_TIMELINE_LABELS[profile.moveTimeline] : "-";
  const budget = profile.budgetBand ? BUDGET_BAND_LABELS[profile.budgetBand] : "-";
  const room = profile.roomType ? ROOM_TYPE_LABELS[profile.roomType] : "-";
  return { landing, budget, room };
}

interface MatchedPg {
  pg: PG;
  match: PgMatch;
}

export interface ResultsViewProps {
  pgs: PG[];
  source?: string;
}

export function ResultsView({ pgs }: ResultsViewProps) {
  const router = useRouter();
  const profile = useJourneyStore((state) => state.profile);
  const updateProfile = useJourneyStore((state) => state.updateProfile);
  const goToStep = useJourneyStore((state) => state.goToStep);
  const setRecommendedArea = useJourneyStore((state) => state.setRecommendedArea);
  const recommendedAreaName = useRecommendedAreaName();
  const hasPhone = Boolean(profile.phone);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [visitPg, setVisitPg] = useState<PG | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dismissedMoreComing, setDismissedMoreComing] = useState(false);
  const [resultsUnlocked, setResultsUnlocked] = useState(hasPhone);
  const containerRef = useFocusOnChange<HTMLDivElement>("results");

  const recommendations = useMemo(
    () => runMatching(profile, { areas: AREAS, pgs, colleges: COLLEGES }),
    [profile, pgs],
  );

  const matchedPgs: MatchedPg[] = useMemo(() => {
    const list: MatchedPg[] = [];
    recommendations.forEach((rec) => {
      rec.pgMatches.forEach((match) => {
        const pg = pgs.find((candidate) => candidate.id === match.pgId);
        if (pg) list.push({ pg, match });
      });
    });
    return list.sort((a, b) => b.match.pgMatchPercent - a.match.pgMatchPercent);
  }, [recommendations, pgs]);

  const topArea = recommendations[0] ? AREAS.find((a) => a.id === recommendations[0].areaId) : null;
  const nearestCollegeName =
    (topArea?.nearestCollegeId ? getCollegeById(topArea.nearestCollegeId)?.name : null) ?? "Hindu College";
  const topMatch = matchedPgs[0] ?? null;
  const visibleMatches = showAllMatches ? matchedPgs : matchedPgs.slice(0, MAX_VISIBLE_MATCHES);
  const hasMoreMatches = matchedPgs.length > MAX_VISIBLE_MATCHES;

  // Results render immediately - no loading spinner, no submit.
  useEffect(() => {
    goToStep("results");
    setRecommendedArea(topArea?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock the page's scroll container while the phone gate is up, so the
  // blurred matches can't be scrolled into view behind the fixed overlay.
  useEffect(() => {
    if (resultsUnlocked) return;
    const scrollAncestor = containerRef.current?.closest<HTMLElement>('[class*="overflow-y-auto"]');
    if (!scrollAncestor) return;
    const previousOverflow = scrollAncestor.style.overflow;
    scrollAncestor.style.overflow = "hidden";
    return () => {
      scrollAncestor.style.overflow = previousOverflow;
    };
  }, [resultsUnlocked, containerRef]);

  const summary = formatSummary(profile);
  const hasMatch = matchedPgs.length > 0;

  function handleShare(pgId?: string) {
    track("share_click", { from: "results", pgId });
    const text = buildShareTextFromIds(pgId ?? topMatch?.pg.id, profile.shortlistedPgIds, recommendedAreaName ?? "Hindu College");

    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: "My PG Hunt Plan", text });
      return;
    }
    void navigator.clipboard.writeText(text);
  }

  async function submitLead(phone: string) {
    const leadScore = computeLeadScore(profile.moveTimeline);
    updateProfile({ phone, leadScore, whatsappOptIn: true, name: null });

    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: null,
        phone,
        email: null,
        whatsappOptIn: true,
        leadScore,
        campusZone: profile.campusZone,
        budgetBand: profile.budgetBand,
        bestAreaName: recommendedAreaName,
        moveTimeline: profile.moveTimeline,
        roomType: profile.roomType,
        referralSource: profile.referralSource ?? null,
      }),
    });

    sessionStorage.setItem("pica_completed", "1");
    return leadScore;
  }

  async function handleWhatsAppSubmit(phone: string) {
    const leadScore = await submitLead(phone);
    track("lead_submitted", { leadScore, budgetBand: profile.budgetBand, roomType: profile.roomType, source: "results" });
    setShowSuccess(true);
  }

  async function handleVirtualVisitPhone(phone: string) {
    const leadScore = await submitLead(phone);
    track("lead_submitted", { leadScore, budgetBand: profile.budgetBand, roomType: profile.roomType, source: "virtual_visit" });
    router.push(ROUTES.pgDownload);
  }

  async function handleUnlockResults(phone: string) {
    const leadScore = await submitLead(phone);
    track("lead_submitted", { leadScore, budgetBand: profile.budgetBand, roomType: profile.roomType, source: "results_gate" });
    setResultsUnlocked(true);
  }

  const captureContext = hasMatch ? "match" : "no_match";
  const showMoreComingBox = hasMatch && matchedPgs.length <= 2 && !dismissedMoreComing;

  return (
    <div ref={containerRef} className="flex flex-1 flex-col gap-5 px-6 py-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push(ROUTES.plan)}
          aria-label="Back to plan"
          className="-ml-1.5 flex size-9 items-center justify-center rounded-lg text-ink/60 transition-colors hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selected"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex-1">
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Your plan</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <Doodle name="archery" className="size-16" />
        <h1 className="text-[24px] font-semibold leading-tight text-ink">Your PG Hunt Plan is Ready</h1>
      </div>

      <div className="relative flex flex-1 flex-col">
        <div
          aria-hidden={!resultsUnlocked}
          className={cn(
            "flex flex-1 flex-col transition-[filter] duration-500",
            !resultsUnlocked && "pointer-events-none select-none blur-sm",
          )}
        >
          {hasMatch ? (
            <div className="flex flex-1 flex-col gap-5">
              <div className="flex flex-col gap-4">
                {visibleMatches.map(({ pg }, index) => (
                  <div key={pg.id} className="relative">
                    {index === 0 && (
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-selected">
                        Best match for you
                      </span>
                    )}
                    <PGCard
                      pg={pg}
                      nearestCollegeName={nearestCollegeName}
                      onVirtualVisit={() => {
                        track("virtual_visit_click", { pgId: pg.id });
                        if (hasPhone) {
                          router.push(ROUTES.pgDownload);
                          return;
                        }
                        setVisitPg(pg);
                      }}
                      onShare={() => handleShare(pg.id)}
                    />
                  </div>
                ))}
              </div>

              {hasMoreMatches && (
                <button
                  type="button"
                  onClick={() => setShowAllMatches((prev) => !prev)}
                  className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-selected"
                >
                  {showAllMatches ? (
                    <>
                      Show fewer matches <ChevronUp className="size-4" />
                    </>
                  ) : (
                    <>
                      Show all {matchedPgs.length} matches <ChevronDown className="size-4" />
                    </>
                  )}
                </button>
              )}

              {showMoreComingBox && (
                <div className="rounded-xl bg-[#FAFAFA] p-4">
                  <p className="text-[14px] leading-relaxed text-[#555555]">
                    We&apos;re onboarding more PGs matching your plan soon. Want us to ping you when they&apos;re live?
                  </p>
                  <button
                    type="button"
                    onClick={() => setDismissedMoreComing(true)}
                    className="mt-2 text-[12px] text-muted-foreground underline underline-offset-4 hover:text-ink"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {hasPhone ? (
                <p className="text-center text-[13px] text-muted-foreground">
                  ✓ We&apos;ve got your number, we&apos;ll WhatsApp you.
                </p>
              ) : (
                <InlineWhatsAppCapture onSubmit={handleWhatsAppSubmit} context={captureContext} />
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-5">
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <p className="text-[15px] font-medium text-ink">We don&apos;t have a web match that fits every filter.</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  The Picapool app has 112+ verified PGs near North Campus. Open it to see everything.
                </p>
                <ul className="mt-3 flex flex-col gap-2 text-[16px] font-medium text-ink">
                  <li>
                    <span className="text-selected" aria-hidden="true">→ </span>
                    {summary.room} room near North Campus
                  </li>
                  <li>
                    <span className="text-selected" aria-hidden="true">→ </span>
                    Budget: {summary.budget}
                  </li>
                  <li>
                    <span className="text-selected" aria-hidden="true">→ </span>
                    Move-in: {summary.landing}
                  </li>
                </ul>
              </div>

              {hasPhone ? (
                <p className="text-center text-[13px] text-muted-foreground">
                  ✓ We&apos;ve got your number, we&apos;ll WhatsApp you.
                </p>
              ) : (
                <InlineWhatsAppCapture onSubmit={handleWhatsAppSubmit} context="no_match" />
              )}

              <p className="text-center text-[12px] text-muted-foreground">
                Know a PG owner near North Campus?{" "}
                <button
                  type="button"
                  onClick={() => {
                    track("referral_click", { from: "results" });
                    const text = encodeURIComponent("Hi, I know a PG owner near North Campus. How do I refer them to Picapool?");
                    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
                  }}
                  className="font-medium text-ink underline underline-offset-4 hover:text-selected"
                >
                  Refer a PG, Earn ₹500
                </button>
              </p>
            </div>
          )}
        </div>

        {!resultsUnlocked && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 px-6 backdrop-blur-[2px]"
            style={{ touchAction: "none" }}
            onWheel={(e) => e.preventDefault()}
          >
            <PhoneUnlockForm
              title="Enter your number to see your matches"
              subtitle="We'll unlock your PG matches right away. No spam."
              ctaLabel="Unlock My Matches"
              ctaIcon={<Unlock className="size-4" />}
              onSubmit={handleUnlockResults}
            />
          </div>
        )}
      </div>

      {visitPg && (
        <VirtualVisitModal
          pg={visitPg}
          isOpen={!!visitPg}
          hasPhone={Boolean(profile.phone)}
          onClose={() => setVisitPg(null)}
          onSubmitPhone={handleVirtualVisitPhone}
          onShare={() => handleShare(visitPg.id)}
        />
      )}

      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
