"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { usePrefersReducedMotion } from "@/utils/reducedMotion";

const COLORS = ["var(--color-selected)", "var(--color-match)", "var(--color-budget)"];
const PARTICLE_COUNT = 26;

interface Particle {
  id: number;
  x: number;
  rotate: number;
  color: string;
  delay: number;
}

/** A subtle confetti burst for the Success screen. Respects reduced motion
 * with a static sparkle graphic instead of suppressing the moment entirely. */
export function Confetti() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 280,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.3,
      })),
    [],
  );

  if (prefersReducedMotion) {
    return (
      <div className="flex justify-center" aria-hidden="true">
        <Sparkles className="size-8 text-budget" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          initial={{ x: 0, y: -10, opacity: 1, rotate: 0 }}
          animate={{ x: particle.x, y: 220, opacity: 0, rotate: particle.rotate }}
          transition={{ duration: 1.6, delay: particle.delay, ease: "easeOut" }}
          className="absolute h-2.5 w-1.5 rounded-sm"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  );
}
