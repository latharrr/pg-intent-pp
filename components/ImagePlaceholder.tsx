"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ImagePlaceholderProps {
  src?: string | null;
  alt: string;
  caption?: string;
  className?: string;
  fill?: boolean;
}

/** The wireframe's flat `.imgph` placeholder - also doubles as a
 * graceful fallback if a real photo fails to load (PGs promise same-day
 * photos, never stock, so a broken image should degrade quietly). */
export function ImagePlaceholder({ src, alt, caption, className }: ImagePlaceholderProps) {
  const [failed, setFailed] = React.useState(false);
  const showImage = src && !failed;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg border-[1.5px] border-dashed border-dashed-line",
        !showImage && "bg-filler",
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        caption && <span className="px-3 text-center text-[11px] text-muted-foreground">{caption}</span>
      )}
    </div>
  );
}
