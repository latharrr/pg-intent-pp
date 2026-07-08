"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Share2, Play, Loader2 } from "lucide-react";
import { Input } from "@/components/Input";
import { phoneSchema, type PhoneValues } from "@/features/contact/contactSchema";
import { openAppLink } from "@/lib/appLinks";
import { track } from "@/lib/analytics";
import type { PG } from "@/types";

export interface VirtualVisitModalProps {
  pg: PG;
  isOpen: boolean;
  hasPhone: boolean;
  onClose: () => void;
  onShare: () => void;
  onSubmitPhone: (phone: string) => Promise<void>;
}

/**
 * Gates the video behind a phone number capture: the (ambiently animated)
 * video plays blurred in the background from the moment the modal opens, so
 * there's something visibly "real" behind the form before they hand over
 * their number - then it unblurs once they submit. Skips the gate entirely
 * if we already have their number from earlier in the session.
 */
export function VirtualVisitModal({ pg, isOpen, hasPhone, onClose, onShare, onSubmitPhone }: VirtualVisitModalProps) {
  const [unlocked, setUnlocked] = useState(hasPhone);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneValues>({ resolver: zodResolver(phoneSchema) });

  useEffect(() => {
    if (isOpen) setUnlocked(hasPhone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  async function handleUnlock(values: PhoneValues) {
    setIsSubmitting(true);
    track("virtual_visit_phone_submit", { pgId: pg.id });
    try {
      await onSubmitPhone(values.phone);
      setUnlocked(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col bg-black"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-white">{pg.name}</span>
              <span className="text-[12px] text-white/70">Picapool Virtual Visit</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close virtual visit"
              className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Video area - ambient motion suggests it's live even before real footage is unlocked */}
          <div className="relative flex flex-1 items-center justify-center bg-black">
            <div
              className="flex aspect-[9/16] w-full max-w-md flex-col items-center justify-center bg-ink/80 transition-[filter] duration-500"
              style={{ filter: unlocked ? "none" : "blur(12px)" }}
            >
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="flex size-20 items-center justify-center rounded-full bg-white/10"
              >
                <Play className="size-8 fill-white text-white" />
              </motion.div>
              <p className="mt-4 text-[14px] text-white/80">2-minute walkthrough video</p>
              <p className="text-[12px] text-white/50">Video asset pending</p>
            </div>

            {!unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-6">
                <motion.form
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit(handleUnlock)}
                  className="flex w-full max-w-sm flex-col gap-3 rounded-2xl bg-white p-5 text-center shadow-xl"
                  noValidate
                >
                  <p className="text-[15px] font-semibold text-ink">Enter your number to watch</p>
                  <p className="text-[13px] text-muted-foreground">We&apos;ll unlock the video right away. No spam.</p>

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
                    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4 fill-current" />}
                    Watch Virtual Visit
                  </button>
                </motion.form>
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="flex items-center gap-3 border-t border-white/10 bg-black px-4 py-4">
            <button
              type="button"
              onClick={() => {
                track("download_app_click", { from: "virtual_visit_modal", pgId: pg.id });
                openAppLink();
              }}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              <Smartphone className="size-4" />
              <span className="text-[14px] font-medium">App</span>
            </button>

            <button
              type="button"
              onClick={onShare}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              <Share2 className="size-4" />
              <span className="text-[14px] font-medium">Share</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
