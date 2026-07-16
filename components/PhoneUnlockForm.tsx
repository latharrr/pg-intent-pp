"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/Input";
import { phoneSchema, type PhoneValues } from "@/features/contact/contactSchema";
import { cn } from "@/lib/utils";

export interface PhoneUnlockFormProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaIcon: ReactNode;
  onSubmit: (phone: string) => Promise<void>;
  className?: string;
}

/** Phone-number gate: a card with a number field that unlocks whatever it's
 * placed over (virtual visit video, PG matches, ...). Owns its own submit
 * state so callers just hand over an async onSubmit. */
export function PhoneUnlockForm({ title, subtitle, ctaLabel, ctaIcon, onSubmit, className }: PhoneUnlockFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneValues>({ resolver: zodResolver(phoneSchema) });

  async function handleUnlock(values: PhoneValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(values.phone);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleUnlock)}
      className={cn("flex w-full max-w-sm flex-col gap-3 rounded-2xl bg-white p-5 text-center shadow-xl", className)}
      noValidate
    >
      <p className="text-[15px] font-semibold text-ink">{title}</p>
      <p className="text-[13px] text-muted-foreground">{subtitle}</p>

      <div className="flex items-center gap-2 rounded-lg border-[1.5px] border-ink/30 pl-4 text-left focus-within:border-selected">
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
      {errors.phone && <p className="text-left text-[11.5px] text-note">{errors.phone.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-selected text-[14px] font-semibold text-white transition-colors hover:bg-selected/90 disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : ctaIcon}
        {ctaLabel}
      </button>
    </motion.form>
  );
}
