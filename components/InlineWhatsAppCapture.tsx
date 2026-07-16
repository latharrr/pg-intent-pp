"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { phoneSchema, type PhoneValues } from "@/features/contact/contactSchema";
import { track } from "@/lib/analytics";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_PICAPOOL_WHATSAPP_NUMBER;

export interface InlineWhatsAppCaptureProps {
  onSubmit: (phone: string) => Promise<void>;
  context?: "match" | "no_match" | "shortlist";
}

const HEADLINES: Record<string, string> = {
  match: "Want us to hold this plan?",
  no_match: "Save your plan, we'll update you.",
  shortlist: "Want updates on your shortlisted PGs?",
};

/**
 * Inline WhatsApp capture that lives on the results page.
 * No page transition. The user sees their PG card while giving their number.
 */
export function InlineWhatsAppCapture({ onSubmit, context = "match" }: InlineWhatsAppCaptureProps) {
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PhoneValues>({ resolver: zodResolver(phoneSchema) });

  async function handleSave(values: PhoneValues) {
    track("contact_click", { method: "whatsapp", context });
    setIsSubmitting(true);

    if (WHATSAPP_NUMBER) {
      const text = encodeURIComponent("Hi! Please save my Picapool PG hunt plan.");
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
    }

    try {
      await onSubmit(values.phone);
      setSaved(true);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <AnimatePresence mode="wait">
        {saved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col items-center gap-2 py-2 text-center"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-match/15 text-match">
              <Check className="size-5" />
            </div>
            <p className="text-[15px] font-semibold text-ink">Plan saved</p>
            <p className="text-[13px] text-muted-foreground">
              We&apos;ll WhatsApp you when matching PGs go live.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(handleSave)}
            className="flex flex-col gap-3"
            noValidate
          >
            <div>
              <p className="text-[15px] font-semibold text-ink">{HEADLINES[context]}</p>
              <p className="text-[13px] text-muted-foreground">Share your WhatsApp. No spam. Just updates.</p>
            </div>

            <div className="flex flex-col gap-2">
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
              {errors.phone && <p className="text-[11.5px] text-note">{errors.phone.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
              Save My Plan
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
