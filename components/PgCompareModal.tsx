"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, X as XIcon } from "lucide-react";
import { formatRupees } from "@/utils/format";
import { getPGById } from "@/lib/data/pgs";
import { ROOM_TYPE_LABELS } from "@/types/enums";
import type { PG } from "@/types";

export interface PgCompareModalProps {
  shortlistedPgIds: string[];
  nearestCollegeName?: string;
  isOpen: boolean;
  onClose: () => void;
}

function hasAmenity(pg: PG, amenity: string): boolean {
  return pg.amenities.includes(amenity);
}

function foodLabel(pg: PG): string {
  if (pg.foodPolicy === "non_veg_ok") return "Non-Veg OK";
  if (pg.foodPolicy === "veg_only") return "Veg Only";
  return "No food";
}

export function PgCompareModal({ shortlistedPgIds, nearestCollegeName = "Hindu College", isOpen, onClose }: PgCompareModalProps) {
  const pgs = shortlistedPgIds.map((id) => getPGById(id)).filter(Boolean) as PG[];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col bg-white"
        >
          <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
            <div>
              <h2 className="text-[18px] font-semibold text-ink">Compare PGs</h2>
              <p className="text-[12px] text-muted-foreground">Side by side so you can plan, not panic-pick.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close compare view"
              className="flex size-10 items-center justify-center rounded-full bg-muted text-ink transition-colors hover:bg-muted/80"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="min-w-[320px] overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white py-3 pr-4 text-left text-[12px] font-medium text-muted-foreground">Feature</th>
                    {pgs.map((pg) => (
                      <th key={pg.id} className="min-w-[120px] px-2 py-3 text-left text-[13px] font-semibold text-ink">
                        {pg.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  <tr className="border-t border-[#E5E5E5]">
                    <td className="sticky left-0 bg-white py-3 pr-4 font-medium text-muted-foreground">Price</td>
                    {pgs.map((pg) => (
                      <td key={pg.id} className="px-2 py-3 font-semibold text-ink">
                        {formatRupees(pg.pricePerMonth)}/mo
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-[#E5E5E5]">
                    <td className="sticky left-0 bg-white py-3 pr-4 font-medium text-muted-foreground">Room</td>
                    {pgs.map((pg) => (
                      <td key={pg.id} className="px-2 py-3 text-ink">
                        {pg.roomTypes.map((t) => ROOM_TYPE_LABELS[t]).join(", ")}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-[#E5E5E5]">
                    <td className="sticky left-0 bg-white py-3 pr-4 font-medium text-muted-foreground">Distance</td>
                    {pgs.map((pg) => (
                      <td key={pg.id} className="px-2 py-3 text-ink">
                        {pg.distanceToCollegeMin ?? "-"} min from {nearestCollegeName}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-[#E5E5E5]">
                    <td className="sticky left-0 bg-white py-3 pr-4 font-medium text-muted-foreground">Food</td>
                    {pgs.map((pg) => (
                      <td key={pg.id} className="px-2 py-3 text-ink">
                        {foodLabel(pg)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-[#E5E5E5]">
                    <td className="sticky left-0 bg-white py-3 pr-4 font-medium text-muted-foreground">WiFi</td>
                    {pgs.map((pg) => (
                      <td key={pg.id} className="px-2 py-3">
                        {hasAmenity(pg, "wifi") ? (
                          <Check className="size-4 text-match" />
                        ) : (
                          <XIcon className="size-4 text-muted-foreground" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-[#E5E5E5]">
                    <td className="sticky left-0 bg-white py-3 pr-4 font-medium text-muted-foreground">Laundry</td>
                    {pgs.map((pg) => (
                      <td key={pg.id} className="px-2 py-3">
                        {hasAmenity(pg, "laundry") ? (
                          <Check className="size-4 text-match" />
                        ) : (
                          <XIcon className="size-4 text-muted-foreground" />
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
