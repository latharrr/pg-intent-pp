"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, GraduationCap, TrainFront, Trees, Dumbbell, UtensilsCrossed, Smartphone, Apple, ChevronLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { track } from "@/lib/analytics";
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  WHATSAPP_NUMBER,
  getMobilePlatform,
  getBestAppLink,
} from "@/lib/appLinks";

const LOCATIONS = [
  { icon: GraduationCap, label: "Hindu College", dist: "5 min walk", x: 15, y: 18 },
  { icon: TrainFront, label: "Metro", dist: "3 min walk", x: 85, y: 18 },
  { icon: Trees, label: "Park", dist: "4 min walk", x: 85, y: 82 },
  { icon: Dumbbell, label: "Gym", dist: "6 min walk", x: 15, y: 82 },
  { icon: UtensilsCrossed, label: "Food Street", dist: "2 min walk", x: 50, y: 94 },
];

export default function PGDownloadPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [showCta, setShowCta] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "unknown">("unknown");

  useEffect(() => {
    setPlatform(getMobilePlatform());
    const timers = [
      setTimeout(() => setPhase(1), 80),
      setTimeout(() => setPhase(2), 400),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setShowCta(true), 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const hasStoreLinks = Boolean(APP_STORE_URL || PLAY_STORE_URL);
  const bestLink = getBestAppLink();

  function handleMainCta() {
    track("download_app_click", { from: "pg-download", platform });
    if (bestLink) {
      window.open(bestLink, "_blank", "noopener,noreferrer");
      return;
    }
    if (WHATSAPP_NUMBER) {
      const text = encodeURIComponent("Hi Picapool! I want to explore PGs near North Campus.");
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="flex h-dvh flex-col items-center overflow-hidden bg-background px-6 py-6 [@media(max-height:420px)]:py-3">
      <div className="flex w-full max-w-sm flex-1 min-h-0 flex-col overflow-y-auto overscroll-contain">
        <button
          type="button"
          onClick={() => router.push(ROUTES.results)}
          aria-label="Back to results"
          className="inline-flex shrink-0 items-center gap-1 text-[13px] text-ink/60 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selected"
        >
          <ChevronLeft className="size-4" />
          Back
        </button>

        <div className="mt-5 flex shrink-0 flex-col gap-2 [@media(max-height:420px)]:mt-2">
          <h1 className="text-[26px] font-semibold leading-tight text-ink">
            Your PG. Everything near it.
          </h1>
          <p className="text-[14px] leading-relaxed text-muted-foreground [@media(max-height:420px)]:hidden">
            100+ verified PGs near DU North Campus. Browse photos, take virtual visits, and shortlist rooms — all inside the Picapool app.
          </p>
        </div>

        <div className="relative mt-8 min-h-[110px] w-full flex-1 shrink [@media(max-height:420px)]:mt-3 [@media(max-height:420px)]:min-h-[80px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {LOCATIONS.map((loc, index) => (
              <motion.line
                key={loc.label}
                x1="50"
                y1="50"
                x2={loc.x}
                y2={loc.y}
                stroke="#B8B5AD"
                strokeWidth="0.6"
                strokeDasharray="2 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: phase >= 2 ? 1 : 0,
                  opacity: phase >= 1 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
              />
            ))}
          </svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border-[1.5px] border-ink/10 bg-white px-5 py-4 shadow-sm"
          >
            <Home className="size-7 text-ink" />
            <span className="whitespace-nowrap text-[14px] font-semibold text-ink">Vijay Comfort PG</span>
            <span className="text-[11px] font-medium text-match">Picapool Verified</span>
            <span className="text-[13px] font-semibold text-ink">₹11,500/mo</span>
          </motion.div>

          {LOCATIONS.map((loc, index) => {
            const Icon = loc.icon;
            return (
              <motion.div
                key={loc.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: "translate(-50%, -50%)" }}
                className="absolute z-10 flex min-w-[92px] flex-col items-center gap-1 rounded-xl border-[1.5px] border-ink/10 bg-white px-3 py-2 shadow-sm"
              >
                <Icon className="size-4 text-ink" />
                <span className="text-[11px] font-semibold text-ink">{loc.label}</span>
                <span className="text-[10px] text-muted-foreground">{loc.dist}</span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: showCta ? 1 : 0, y: showCta ? 0 : 12 }}
          transition={{ duration: 0.3 }}
          className="mt-6 flex shrink-0 flex-col items-center gap-3 [@media(max-height:420px)]:mt-3 [@media(max-height:420px)]:gap-1.5"
        >
          <button
            type="button"
            onClick={handleMainCta}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 text-[15px] font-semibold text-white transition-colors hover:bg-ink/90"
          >
            {platform === "ios" && <Apple className="size-4" />}
            {platform === "android" && <Smartphone className="size-4" />}
            {platform === "unknown" && <Smartphone className="size-4" />}
            {hasStoreLinks ? "Get Picapool App" : "Get Early Access on WhatsApp"}
          </button>

          {hasStoreLinks && (
            <div className="flex w-full gap-3">
              {APP_STORE_URL && (
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("download_app_click", { from: "pg-download", platform: "ios" })}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] bg-white py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-muted"
                >
                  <Apple className="size-4" />
                  App Store
                </a>
              )}
              {PLAY_STORE_URL && (
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("download_app_click", { from: "pg-download", platform: "android" })}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] bg-white py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-muted"
                >
                  <Smartphone className="size-4" />
                  Play Store
                </a>
              )}
            </div>
          )}

          <p className="text-center text-[12px] text-muted-foreground">
            Free. No spam. Already used by 5,000+ DU students.
          </p>
          <button
            type="button"
            onClick={() => router.push(ROUTES.results)}
            className="text-center text-[13px] text-ink/60 underline underline-offset-4 hover:text-ink"
          >
            Continue without app
          </button>
        </motion.div>
      </div>
    </div>
  );
}
