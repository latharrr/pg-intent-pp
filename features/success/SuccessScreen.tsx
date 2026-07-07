"use client";

import Link from "next/link";
import { useJourneyStore, useRecommendedAreaName } from "@/lib/store/useJourneyStore";
import { getPGById } from "@/lib/data/pgs";
import { SuccessState } from "@/components/SuccessState";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/Button";
import { ShareMoveProfile } from "@/components/ShareMoveProfile";
import { Doodle } from "@/components/Doodle";
import { ROUTES } from "@/constants/routes";
import { useFocusOnChange } from "@/utils/useFocusOnChange";
import { track } from "@/lib/analytics";

export function SuccessScreen() {
  const profile = useJourneyStore((state) => state.profile);
  const bestAreaName = useRecommendedAreaName();
  const shortlistedPgs = profile.shortlistedPgIds.map((id) => getPGById(id)).filter(Boolean);
  const containerRef = useFocusOnChange<HTMLDivElement>("success");

  return (
    <div ref={containerRef} className="relative flex flex-1 flex-col">
      <Confetti />
      <SuccessState
        title="Plan saved."
        subtitle={
          profile.whatsappOptIn
            ? "We'll WhatsApp you the moment a PG matching your plan is live."
            : "We'll email you the moment a PG matching your plan is live."
        }
        icon={<Doodle name="party" className="size-24" />}
      >
        {shortlistedPgs.length > 0 && (
          <p className="text-[12.5px] text-match">
            You shortlisted {shortlistedPgs.length} PG{shortlistedPgs.length > 1 ? "s" : ""}.
          </p>
        )}
        <p className="max-w-[32ch] text-[12.5px] leading-relaxed text-muted-foreground">
          By the way, once you&apos;re settled, Picapool helps DU students split cabs, bulk-order food, and share notes. But first, let&apos;s get you a room.
        </p>
        <div className="mt-4 flex flex-col items-center gap-3">
          <Button
            onClick={() => {
              track("download_app_click", { from: "success" });
              window.open("/pg-download.html", "_blank", "noopener,noreferrer");
            }}
          >
            Download Picapool App
          </Button>
          <Link href={ROUTES.results}>
            <Button variant="ghost">Back to my plan</Button>
          </Link>
          <ShareMoveProfile profile={profile} bestAreaName={bestAreaName} />
        </div>
      </SuccessState>
    </div>
  );
}
