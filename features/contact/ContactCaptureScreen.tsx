"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useJourneyStore, useRecommendedAreaName } from "@/lib/store/useJourneyStore";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Box } from "@/components/Box";
import { computeLeadScore } from "@/lib/leadScore";
import { track } from "@/lib/analytics";
import { ROUTES } from "@/constants/routes";
import { useFocusOnChange } from "@/utils/useFocusOnChange";
import { BUDGET_BAND_LABELS, MOVE_TIMELINE_LABELS, ROOM_TYPE_LABELS } from "@/types/enums";
import { MessageCircle, Smartphone, ShieldCheck, ChevronLeft } from "lucide-react";
import { Doodle } from "@/components/Doodle";
import { phoneSchema, type PhoneValues } from "./contactSchema";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_PICAPOOL_WHATSAPP_NUMBER;

export function ContactCaptureScreen() {
  const router = useRouter();
  const profile = useJourneyStore((state) => state.profile);
  const updateProfile = useJourneyStore((state) => state.updateProfile);
  const bestAreaName = useRecommendedAreaName();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useFocusOnChange<HTMLDivElement>("contact");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneValues>({ resolver: zodResolver(phoneSchema) });

  const budgetLabel = profile.budgetBand ? BUDGET_BAND_LABELS[profile.budgetBand] : null;
  const timelineLabel = profile.moveTimeline ? MOVE_TIMELINE_LABELS[profile.moveTimeline] : null;

  async function submitLead(phone: string, whatsappOptIn: boolean) {
    setIsSubmitting(true);
    const leadScore = computeLeadScore(profile.moveTimeline);
    updateProfile({ phone, leadScore, whatsappOptIn, name: null });
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: null,
          phone,
          email: null,
          whatsappOptIn,
          leadScore,
          budgetBand: profile.budgetBand,
          bestAreaName,
          moveTimeline: profile.moveTimeline,
          roomType: profile.roomType,
        }),
      });
    } finally {
      setIsSubmitting(false);
      router.push(ROUTES.success);
    }
  }

  async function onSubmit(values: PhoneValues) {
    track("contact_click", { method: "whatsapp" });
    if (WHATSAPP_NUMBER) {
      const text = encodeURIComponent(buildPlanSummary(bestAreaName, budgetLabel, timelineLabel));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
    }
    await submitLead(values.phone, true);
  }

  const planItems = [
    profile.moveTimeline && { icon: <Smartphone className="size-3.5" />, label: `Landing: ${MOVE_TIMELINE_LABELS[profile.moveTimeline]}` },
    profile.budgetBand && { icon: <span className="text-[11px]">₹</span>, label: `Budget: ${BUDGET_BAND_LABELS[profile.budgetBand]}` },
    profile.roomType && { icon: <span className="text-[11px]">🛏</span>, label: `Room: ${ROOM_TYPE_LABELS[profile.roomType]}` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  return (
    <div ref={containerRef} className="flex flex-1 flex-col gap-5 px-6 py-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push(ROUTES.results)}
          aria-label="Back to results"
          className="-ml-1.5 flex size-9 items-center justify-center rounded-lg text-ink/60 transition-colors hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selected"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex-1">
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Almost done</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Doodle name="lock" className="self-start" />
        <h2 className="text-[22px] font-semibold leading-tight text-ink">Hold your plan on WhatsApp</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Share your WhatsApp and we&apos;ll hold your plan. No spam. Just updates.
        </p>
      </div>

      {/* Plan preview */}
      <Box tone="dashed" className="gap-2">
        <p className="text-[12px] font-semibold text-ink">Your PG Hunt Plan</p>
        <div className="flex flex-wrap gap-2">
          {planItems.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-selected/30 bg-selected/5 px-2.5 py-1 text-[11px] font-medium text-ink"
            >
              {item.icon}
              {item.label}
            </span>
          ))}
        </div>
      </Box>

      {/* Value props */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Smartphone className="mt-0.5 size-4 shrink-0 text-selected" />
          <p className="text-[13px] leading-snug text-ink">Your plan sent to your phone, saved for later.</p>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-match" />
          <p className="text-[13px] leading-snug text-ink">No spam. No calls. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* Phone input */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-auto flex flex-col gap-3" noValidate>
        <div>
          <div className="flex items-center gap-2 rounded-lg border-[1.5px] border-ink/30 pl-4 focus-within:border-selected">
            <span className="text-[15px] text-muted-foreground">+91</span>
            <Input
              type="tel"
              placeholder="98765 43210"
              aria-label="WhatsApp number"
              error={!!errors.phone}
              className="border-none pl-0 focus-visible:ring-0"
              {...register("phone")}
            />
          </div>
          {errors.phone && <p className="mt-1 text-[11.5px] text-note">{errors.phone.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
          <MessageCircle className="size-4" />
          Save My Plan
        </Button>
      </form>
    </div>
  );
}

function buildPlanSummary(bestAreaName: string | null, budgetLabel: string | null, timelineLabel: string | null): string {
  const parts = ["Hi! Here's my PG hunt plan:"];
  if (bestAreaName) parts.push(`Area: ${bestAreaName}`);
  if (budgetLabel) parts.push(`Budget: ${budgetLabel}`);
  if (timelineLabel) parts.push(`Moving: ${timelineLabel}`);
  return parts.join("\n");
}
