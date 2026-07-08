"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { Confetti } from "@/components/Confetti";
import { Doodle } from "@/components/Doodle";
import { ROUTES } from "@/constants/routes";
import { track } from "@/lib/analytics";
import { getBestAppLink } from "@/lib/appLinks";

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Success state as a modal overlay on the results page, not a separate route.
 * Shows confetti, confirmation, and the re-engagement hook for Picapool's core app.
 *
 * With the app now live, the primary CTA pushes the user into the app rather
 * than leaving them on the web.
 */
export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const router = useRouter();
  const bestLink = getBestAppLink();
  const hasAppLink = Boolean(bestLink);

  function handleGetApp() {
    track("download_app_click", { from: "success_modal" });

    if (bestLink) {
      window.open(bestLink, "_blank", "noopener,noreferrer");
      return;
    }

    // Fallback to the download page (which itself falls back to WhatsApp).
    router.push(ROUTES.pgDownload);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
        >
          <Confetti />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-muted hover:text-ink"
            >
              <X className="size-4" />
            </button>

            <div className="flex justify-center">
              <Doodle name="party" className="size-24" />
            </div>

            <h2 className="mt-4 text-[22px] font-semibold text-ink">Plan saved.</h2>
            <p className="mt-2 text-[14px] text-muted-foreground">
              We&apos;ll WhatsApp you the moment a PG matching your plan is live.
            </p>

            <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
              Want to browse 100+ verified PGs now? Open the Picapool app.
            </p>

            <button
              type="button"
              onClick={handleGetApp}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-[15px] font-semibold text-white transition-colors hover:bg-ink/90"
            >
              <Smartphone className="size-4" />
              {hasAppLink ? "Open Picapool App" : "Get Picapool App"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full rounded-xl bg-selected py-3 text-[15px] font-semibold text-white transition-colors hover:bg-selected/90"
            >
              Back to my plan
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
