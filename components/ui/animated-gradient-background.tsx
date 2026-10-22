"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = ["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"];
const DEFAULT_STOPS = [35, 50, 60, 70, 80, 90, 100];

export interface AnimatedGradientBackgroundProps {
  /** Initial radial gradient size, as a percentage. Default: 125. */
  startingGap?: number;
  /** Enable the breathing effect. Original component prop spelling retained. */
  Breathing?: boolean;
  gradientColors?: string[];
  gradientStops?: number[];
  /** Percentage points per frame at 60 fps. Lower values are slower. */
  animationSpeed?: number;
  breathingRange?: number;
  containerStyle?: CSSProperties;
  containerClassName?: string;
  topOffset?: number;
}

/** The supplied radial gradient, with idle-loop and reduced-motion safeguards. */
export default function AnimatedGradientBackground({
  startingGap = 125,
  Breathing = false,
  gradientColors = DEFAULT_COLORS,
  gradientStops = DEFAULT_STOPS,
  animationSpeed = 0.02,
  breathingRange = 5,
  containerStyle = {},
  containerClassName = "",
  topOffset = 0,
}: AnimatedGradientBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const colorStops = useMemo(() => {
    if (gradientColors.length === 0 || gradientColors.length !== gradientStops.length) {
      throw new Error("gradientColors and gradientStops must have the same non-zero length.");
    }
    if (gradientStops.some((stop, index) => !Number.isFinite(stop) || stop < 0 || stop > 100 || (index > 0 && stop < gradientStops[index - 1]))) {
      throw new Error("gradientStops must be ascending percentages between 0 and 100.");
    }
    return gradientStops.map((stop, index) => `${gradientColors[index]} ${stop}%`).join(", ");
  }, [gradientColors, gradientStops]);

  if (!Number.isFinite(startingGap) || !Number.isFinite(topOffset) || !Number.isFinite(breathingRange) || !Number.isFinite(animationSpeed) || breathingRange < 0 || animationSpeed < 0 || startingGap <= breathingRange || startingGap + topOffset <= breathingRange) {
    throw new Error("Gradient dimensions must remain positive throughout the breathing range; speed and range must be non-negative.");
  }

  const initialBackground = `radial-gradient(${startingGap}% ${startingGap + topOffset}% at 50% 20%, ${colorStops})`;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.style.background = initialBackground;
    if (!Breathing || reducedMotion || animationSpeed === 0 || breathingRange === 0) return;

    let frame = 0;
    let previousTime = 0;
    let phase = 0;
    let lastPaint = 0;
    const render = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) / 1000 : 0;
      previousTime = time;
      phase += elapsed * animationSpeed * 60 / breathingRange;
      // A capped paint rate avoids repainting a full-screen gradient at 120/144 Hz.
      if (time - lastPaint >= 1000 / 30) {
        const width = startingGap + Math.sin(phase) * breathingRange;
        node.style.background = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${colorStops})`;
        lastPaint = time;
      }
      frame = requestAnimationFrame(render);
    };
    const syncVisibility = () => {
      cancelAnimationFrame(frame);
      previousTime = 0;
      if (!document.hidden) frame = requestAnimationFrame(render);
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [Breathing, reducedMotion, animationSpeed, breathingRange, startingGap, topOffset, colorStops, initialBackground]);

  return (
    <motion.div
      aria-hidden="true"
      initial={reducedMotion ? false : { opacity: 0, scale: 1.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion ? 0 : 2, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", containerClassName)}
    >
      <div ref={containerRef} style={{ background: initialBackground, ...containerStyle }} className="absolute inset-0 transition-transform" />
    </motion.div>
  );
}
