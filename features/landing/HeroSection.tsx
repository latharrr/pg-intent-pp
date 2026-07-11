"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  BlobShocked,
  StarWorried,
  StarSad,
  StarHunter,
  CloudsDecoration,
} from "./onboardingIllustrations";

interface OnboardingCard {
  key: string;
  tag: string;
  headline: string;
  accentLabel: string;
  accentClassName: string;
  illustrationClassName: string;
  Illustration: ComponentType<{ className?: string }>;
}

const CARDS: OnboardingCard[] = [
  {
    key: "arrival",
    tag: "Arrival",
    headline: "Coming to North Campus for the first time?",
    accentLabel: "Planning your first visit?",
    accentClassName: "bg-[#F0A878]",
    illustrationClassName: "bg-[#FBF0D2]",
    Illustration: BlobShocked,
  },
  {
    key: "pressure",
    tag: "Pressure",
    headline: "Blind Searches are costly; you’ve just 1–2 days to pick.",
    accentLabel: "Rushed into choosing?",
    accentClassName: "bg-[#AED9F1]",
    illustrationClassName: "bg-[#E3DEF6]",
    Illustration: StarWorried,
  },
  {
    key: "clarity",
    tag: "Clarity",
    headline: "We can turns your panic into a plan.",
    accentLabel: "From Survival to Plan",
    accentClassName: "bg-[#F5B84E]",
    illustrationClassName: "bg-[#F9D2CE]",
    Illustration: StarSad,
  },
  {
    key: "support",
    tag: "Support",
    headline: "We can’t promise perfect, but we can help you start smarter",
    accentLabel: "Picapool PG Hunt",
    accentClassName: "bg-[#CB9CF2]",
    illustrationClassName: "bg-[#F6D9F7]",
    Illustration: StarHunter,
  },
];

const LAST_INDEX = CARDS.length - 1;

/**
 * Swipeable onboarding carousel (Figma: "Untitled" file, node 0:1). Each card
 * is a real scroll-snap flex item rather than a transform-driven track, so
 * peeking/swiping/programmatic nav (buttons, dots) all reduce to native
 * scrollIntoView calls instead of hand-rolled drag/width math.
 */
export function HeroSection() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries.reduce(
          (best, entry) => (entry.intersectionRatio > (best?.intersectionRatio ?? 0) ? entry : best),
          entries[0],
        );
        if (mostVisible?.isIntersecting) {
          const index = cardRefs.current.indexOf(mostVisible.target as HTMLDivElement);
          if (index !== -1) setActiveIndex(index);
        }
      },
      { root: container, threshold: [0.5, 0.75] },
    );

    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(LAST_INDEX, index));
    cardRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, []);

  function handleCta() {
    if (activeIndex < LAST_INDEX) {
      goTo(activeIndex + 1);
      return;
    }
    track("continue_click", { from: "hero" });
    router.push(ROUTES.plan);
  }

  return (
    <div className="relative flex min-h-[calc(100svh-64px)] flex-col overflow-hidden bg-gradient-to-b from-white via-[#FDF7F0] to-[#F6D6C4]">
      <button
        type="button"
        onClick={() => goTo(activeIndex - 1)}
        aria-label="Previous"
        className={cn(
          "absolute left-4 top-4 z-20 flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-md transition-opacity",
          activeIndex === 0 ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <ArrowLeft className="size-5" />
      </button>

      <div
        ref={scrollRef}
        className="flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 pt-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CARDS.map((card, index) => (
          <div
            key={card.key}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="flex w-[85%] shrink-0 snap-start flex-col gap-3"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col gap-4 rounded-3xl bg-black/[0.04] p-5"
            >
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-black/5 px-3 py-1.5 text-[12px] font-medium text-ink/70">
                {card.tag}
              </span>
              <h2 className="text-[26px] font-semibold leading-[1.15] text-ink">{card.headline}</h2>
              <span
                className={cn(
                  "w-fit rounded-full px-4 py-2.5 text-[14px] font-medium text-ink",
                  card.accentClassName,
                )}
              >
                {card.accentLabel}
              </span>
            </motion.div>

            <div
              className={cn(
                "relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl",
                card.illustrationClassName,
              )}
            >
              <card.Illustration className="relative z-10 h-[55%] w-[55%]" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1.5 px-6 pb-3">
        {CARDS.map((card, index) => (
          <button
            key={card.key}
            type="button"
            aria-label={`Go to ${card.tag}`}
            onClick={() => goTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === activeIndex ? "w-7 bg-selected" : "w-1.5 bg-black/15",
            )}
          />
        ))}
      </div>

      <div className="relative mt-auto">
        <CloudsDecoration className="h-28 w-full" />
        <div
          className={cn(
            "absolute inset-x-6 bottom-6 flex",
            activeIndex === LAST_INDEX ? "justify-stretch" : "justify-end",
          )}
        >
          <button
            type="button"
            onClick={handleCta}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg",
              activeIndex === LAST_INDEX && "w-full",
            )}
          >
            {activeIndex === LAST_INDEX ? "Plan My PG Hunt" : "Next"}
            {activeIndex !== LAST_INDEX && <ArrowRight className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
