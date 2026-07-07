"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { Home, GraduationCap, TrainFront, Trees, Dumbbell, UtensilsCrossed, Download, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const LOCATIONS = [
  { icon: GraduationCap, label: "Hindu College", dist: "5 min", x: 15, y: 20 },
  { icon: TrainFront, label: "Metro", dist: "3 min", x: 85, y: 20 },
  { icon: Trees, label: "Park", dist: "4 min", x: 85, y: 80 },
  { icon: Dumbbell, label: "Gym", dist: "6 min", x: 15, y: 80 },
  { icon: UtensilsCrossed, label: "Food Street", dist: "2 min", x: 50, y: 92 },
];

export default function PGDownloadPage() {
  const [phase, setPhase] = useState(0);
  const [linesDone, setLinesDone] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 120),
      setTimeout(() => setPhase(2), 650),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setLinesDone(true), 2100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  function handleDownload() {
    const a = document.createElement("a");
    a.href = window.location.href;
    a.download = "Picapool-PG-Download.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="flex min-h-svh flex-col items-center bg-white px-6 py-6">
      <div className="w-full max-w-sm flex-1">
        <Link
          href={ROUTES.results}
          className="inline-flex items-center gap-1 text-[13px] text-ink/60 hover:text-ink"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>

        <div className="mt-6 flex flex-col gap-2">
          <h1 className="text-[26px] font-semibold leading-tight text-ink">
            Your PG. Everything near it.
          </h1>
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            See how close your PG is to college, metro, food, and gym - all before you visit.
          </p>
        </div>

        <div className="relative mt-10 h-[360px] w-full">
          {/* SVG dotted lines */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {LOCATIONS.map((loc, index) => (
              <motion.line
                key={loc.label}
                x1="50"
                y1="50"
                x2={loc.x}
                y2={loc.y}
                stroke="#B8B5AD"
                strokeWidth="0.6"
                strokeDasharray={linesDone ? "2 3" : `${getLineLength(50, 50, loc.x, loc.y)} ${getLineLength(50, 50, loc.x, loc.y)}`}
                initial={{ strokeDashoffset: getLineLength(50, 50, loc.x, loc.y) }}
                animate={{
                  strokeDashoffset: phase >= 2 ? 0 : getLineLength(50, 50, loc.x, loc.y),
                }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
              />
            ))}
          </svg>

          {/* Center PG card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border-[1.5px] border-ink/10 bg-white px-5 py-4 shadow-sm"
          >
            <Home className="size-7 text-ink" />
            <span className="whitespace-nowrap text-[14px] font-semibold text-ink">Vijay Comfort PG</span>
            <span className="text-[11px] font-medium text-match">Picapool Verified</span>
            <span className="text-[13px] font-semibold text-ink">₹11,500/mo</span>
          </motion.div>

          {/* Location cards */}
          {LOCATIONS.map((loc, index) => {
            const Icon = loc.icon;
            return (
              <motion.div
                key={loc.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.8 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: "translate(-50%, -50%)" }}
                className="absolute z-10 flex min-w-[90px] flex-col items-center gap-1 rounded-xl border-[1.5px] border-ink/10 bg-white px-3 py-2 shadow-sm"
              >
                <Icon className="size-4 text-ink" />
                <span className="text-[11px] font-semibold text-ink">{loc.label}</span>
                <span className="text-[10px] text-muted-foreground">{loc.dist}</span>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button onClick={handleDownload} className="w-full gap-2">
            <Download className="size-4" />
            Download Picapool App
          </Button>
          <p className="text-center text-[12px] text-muted-foreground">
            Free. No spam. Get alerts when PGs near your college go live.
          </p>
          <Link
            href={ROUTES.results}
            className="text-center text-[13px] text-ink/60 underline underline-offset-4 hover:text-ink"
          >
            Continue without app
          </Link>
        </div>
      </div>
    </div>
  );
}

function getLineLength(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
