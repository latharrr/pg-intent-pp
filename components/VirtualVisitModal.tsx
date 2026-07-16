"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Share2, Play, Sparkles, Loader2 } from "lucide-react";
import { PhoneUnlockForm } from "@/components/PhoneUnlockForm";
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
  const [isOpeningApp, setIsOpeningApp] = useState(false);

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

  async function handleUnlock(phone: string) {
    track("virtual_visit_phone_submit", { pgId: pg.id });
    await onSubmitPhone(phone);
    setUnlocked(true);
  }

  function handleOpenApp() {
    track("download_app_click", { from: "virtual_visit_cta", pgId: pg.id });
    setIsOpeningApp(true);
    openAppLink();
    setTimeout(() => setIsOpeningApp(false), 1500);
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

          {/* App CTA - the web video is a low-fi placeholder, so we point straight at the real thing */}
          <div className="px-4 pb-3">
            <button
              type="button"
              onClick={handleOpenApp}
              disabled={isOpeningApp}
              aria-busy={isOpeningApp}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-[14px] font-semibold text-ink shadow-lg transition-transform active:scale-[0.98] disabled:opacity-80"
            >
              {isOpeningApp ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Opening app...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Enjoy high-quality visit on app
                </>
              )}
            </button>
          </div>

          {/* Video area - ambient motion suggests it's live even before real footage is unlocked */}
          <div className="relative flex flex-1 items-center justify-center bg-black">
            <div
              className="flex aspect-[9/16] w-full max-w-md flex-col items-center justify-center bg-ink/80 transition-[filter] duration-500"
              style={{ filter: unlocked ? "none" : "blur(6px)" }}
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
                <PhoneUnlockForm
                  title="Enter your number to watch"
                  subtitle="We'll unlock the video right away. No spam."
                  ctaLabel="Watch Virtual Visit"
                  ctaIcon={<Play className="size-4 fill-current" />}
                  onSubmit={handleUnlock}
                />
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
