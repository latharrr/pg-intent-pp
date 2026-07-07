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
import type { Lead } from "@/types";
import { emailFallbackSchema, leadDetailsSchema, type EmailFallbackValues, type LeadDetailsValues } from "./contactSchema";
import { MessageCircle, Mail, Send, Smartphone, Bell, ShieldCheck } from "lucide-react";
import { Doodle } from "@/components/Doodle";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_PICAPOOL_WHATSAPP_NUMBER;

function buildPlanSummary(bestAreaName: string | null, budgetLabel: string | null, timelineLabel: string | null): string {
  const parts = ["Hi! Here's my PG hunt plan:"];
  if (bestAreaName) parts.push(`Area: ${bestAreaName}`);
  if (budgetLabel) parts.push(`Budget: ${budgetLabel}`);
  if (timelineLabel) parts.push(`Moving: ${timelineLabel}`);
  return parts.join("\n");
}

export function ContactCaptureScreen() {
  const router = useRouter();
  const profile = useJourneyStore((state) => state.profile);
  const updateProfile = useJourneyStore((state) => state.updateProfile);
  const bestAreaName = useRecommendedAreaName();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useFocusOnChange<HTMLDivElement>("contact");

  const {
    register: registerEmail,
    handleSubmit: handleEmailFormSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFallbackValues>({ resolver: zodResolver(emailFallbackSchema) });

  const {
    register: registerLead,
    handleSubmit: handleLeadSubmit,
    formState: { errors: leadErrors },
  } = useForm<LeadDetailsValues>({ resolver: zodResolver(leadDetailsSchema) });

  /** Validates name + phone, saves them to the profile, then runs the given
   * action with those values - gates both the WhatsApp and email paths on
   * real contact details actually being captured (previously neither ever
   * set profile.name/phone). Passes the values through directly rather than
   * reading them back off `profile` right after, since that closure won't
   * see the update until the next render. */
  function withLeadDetails(onValid: (lead: LeadDetailsValues) => void) {
    return handleLeadSubmit((lead) => {
      updateProfile({ name: lead.name, phone: lead.phone });
      onValid(lead);
    });
  }

  const budgetLabel = profile.budgetBand ? BUDGET_BAND_LABELS[profile.budgetBand] : null;
  const timelineLabel = profile.moveTimeline ? MOVE_TIMELINE_LABELS[profile.moveTimeline] : null;

  async function submitLead(payload: Pick<Lead, "name" | "phone" | "email" | "whatsappOptIn">) {
    setIsSubmitting(true);
    const leadScore = computeLeadScore(profile.moveTimeline);
    updateProfile({ leadScore, whatsappOptIn: payload.whatsappOptIn, email: payload.email });
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          whatsappOptIn: payload.whatsappOptIn,
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

  function handleWhatsApp(lead: LeadDetailsValues) {
    track("contact_click", { method: "whatsapp" });
    if (WHATSAPP_NUMBER) {
      const text = encodeURIComponent(buildPlanSummary(bestAreaName, budgetLabel, timelineLabel));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
    }
    void submitLead({ name: lead.name, phone: lead.phone, email: null, whatsappOptIn: true });
  }

  function handleEmailSubmit(values: EmailFallbackValues, lead: LeadDetailsValues) {
    track("contact_click", { method: "email" });
    void submitLead({ name: lead.name, phone: lead.phone, email: values.email, whatsappOptIn: false });
  }

  const planItems = [
    profile.moveTimeline && { icon: <Smartphone className="size-3.5" />, label: `Landing: ${MOVE_TIMELINE_LABELS[profile.moveTimeline]}` },
    profile.budgetBand && { icon: <span className="text-[11px]">₹</span>, label: `Budget: ${BUDGET_BAND_LABELS[profile.budgetBand]}` },
    profile.roomType && { icon: <span className="text-[11px]">🛏</span>, label: `Room: ${ROOM_TYPE_LABELS[profile.roomType]}` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  return (
    <div ref={containerRef} className="flex flex-1 flex-col gap-5 px-6 py-6">
      <div className="flex flex-col gap-3">
        <Doodle name="lock" className="self-start" />
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Almost done</p>
          <h2 className="text-[22px] font-semibold leading-tight text-ink">Get your plan on WhatsApp</h2>
        </div>
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
          <Bell className="mt-0.5 size-4 shrink-0 text-selected" />
          <p className="text-[13px] leading-snug text-ink">We ping you only when a matching PG goes live.</p>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-match" />
          <p className="text-[13px] leading-snug text-ink">No spam. No calls. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* Name + phone - always required, regardless of which path below is used. */}
      <div className="flex flex-col gap-2.5">
        <div>
          <Input
            type="text"
            placeholder="Your name"
            aria-label="Your name"
            error={!!leadErrors.name}
            {...registerLead("name")}
          />
          {leadErrors.name && <p className="mt-1 text-[11.5px] text-note">{leadErrors.name.message}</p>}
        </div>
        <div>
          <div className="flex items-center gap-2 rounded-lg border-[1.5px] border-ink/30 pl-4 focus-within:border-selected">
            <span className="text-[15px] text-muted-foreground">+91</span>
            <Input
              type="tel"
              placeholder="98765 43210"
              aria-label="Phone number"
              error={!!leadErrors.phone}
              className="border-none pl-0 focus-visible:ring-0"
              {...registerLead("phone")}
            />
          </div>
          {leadErrors.phone && <p className="mt-1 text-[11.5px] text-note">{leadErrors.phone.message}</p>}
        </div>
      </div>

      {!showEmailForm ? (
        <div className="mt-auto flex flex-col gap-3">
          <Button onClick={withLeadDetails(handleWhatsApp)} disabled={isSubmitting} className="w-full gap-2">
            <MessageCircle className="size-4" />
            Send my plan to WhatsApp
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowEmailForm(true)}
            disabled={isSubmitting}
            className="w-full gap-2"
          >
            <Mail className="size-4" />
            Email my plan instead
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleEmailFormSubmit((emailValues) =>
            withLeadDetails((lead) => handleEmailSubmit(emailValues, lead))(),
          )}
          className="mt-auto flex flex-col gap-3"
          noValidate
        >
          <Input
            type="email"
            placeholder="you@example.com"
            aria-label="Email address"
            error={!!emailErrors.email}
            {...registerEmail("email")}
          />
          {emailErrors.email && <p className="text-[11.5px] text-note">{emailErrors.email.message}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
            <Send className="size-4" />
            Email my plan
          </Button>
          <button
            type="button"
            onClick={() => setShowEmailForm(false)}
            className="text-center text-[11.5px] text-muted-foreground underline underline-offset-4 hover:text-ink"
          >
            Back to WhatsApp
          </button>
        </form>
      )}
    </div>
  );
}
