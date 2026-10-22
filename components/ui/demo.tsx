"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { DogCompanion } from "@/components/ui/dog-companion";

const COLORS = ["#090b12", "#142650", "#5c58b2", "#dc90b8", "#f2b68a", "#e9d7a5", "#a7cbbb"];
const STOPS = [28, 47, 58, 69, 80, 91, 100];
const STARS = [
  { x: 15, y: 27, delay: 0 }, { x: 83, y: 22, delay: 1.1 },
  { x: 24, y: 64, delay: 2.5 }, { x: 74, y: 62, delay: .7 },
  { x: 37, y: 19, delay: 1.6 }, { x: 66, y: 35, delay: 3 },
  { x: 10, y: 53, delay: 1.8 }, { x: 91, y: 52, delay: .3 },
];

export function DemoVariant1() {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [greeting, setGreeting] = useState(0);
  const frozen = paused || Boolean(reducedMotion);
  const sayHello = () => setGreeting((value) => value + 1);

  return (
    <div className="launch-page relative isolate min-h-svh w-full overflow-hidden" data-paused={frozen}>
      <AnimatedGradientBackground
        startingGap={100}
        topOffset={-12}
        Breathing={!frozen}
        breathingRange={5}
        animationSpeed={0.012}
        gradientColors={COLORS}
        gradientStops={STOPS}
        containerClassName="gradient-layer"
      />
      <div className="grain-layer pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="stars pointer-events-none absolute inset-0" aria-hidden="true">
        {STARS.map((star, index) => <motion.span key={index} className={index % 3 === 0 ? "star star-cross" : "star"} style={{ left: `${star.x}%`, top: `${star.y}%` }} animate={frozen ? { opacity: .4 } : { opacity: [.15, .7, .15] }} transition={{ duration: 5, delay: star.delay, repeat: frozen ? 0 : Infinity }} />)}
      </div>

      <header className="launch-header relative z-10 flex items-center justify-between">
        <a className="wordmark" href="./" aria-label="Living Bridges home">living bridges<span>.</span></a>
        <span className="launch-status">COMING SOON</span>
      </header>

      <main className="launch-main relative z-10 flex flex-col items-center text-center">
        <motion.div className="intro-tag" initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .8 }}>
          GOOD THINGS HAVE A WAY OF FINDING US
        </motion.div>
        <motion.h1 initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: 1 }}>A little instinct.<br /><em>A whole new world.</em></motion.h1>
        <motion.p className="intro-copy" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8, duration: .9 }}>Some connections don’t need an explanation.<br />This one is worth waiting for.</motion.p>

        <motion.div className="companion-stage" initial={reducedMotion ? false : { opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .6, duration: 1.3 }}>
          <div className="dog-halo" aria-hidden="true" />
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <span className="floating-spark spark-a" aria-hidden="true">✦</span>
          <span className="floating-spark spark-b" aria-hidden="true">✧</span>
          <DogCompanion paused={paused} greeting={greeting} />
          <div className="stage-ground" aria-hidden="true" />
          <AnimatePresence>
            {greeting > 0 && <motion.span key={greeting} className="hello-heart" aria-hidden="true" initial={{ opacity: 0, y: -120, scale: .5 }} animate={{ opacity: [0, 1, 1, 0], y: [-120, -160, -200, -220], scale: [0.5, 1, 1, .8] }} exit={{ opacity: 0 }} transition={{ duration: frozen ? .01 : 2 }}>♡</motion.span>}
          </AnimatePresence>
        </motion.div>

        <motion.div className="hello-area" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}>
          <button className="hello-button" onClick={sayHello} type="button"><span>Say hello</span><span aria-hidden="true">↗</span></button>
          <p className="hello-caption" aria-live="polite">{greeting ? "Someone’s already happy you’re here." : "Someone’s waiting to meet you."}</p>
        </motion.div>
      </main>

      <footer className="launch-footer relative z-10 flex items-center justify-between">
        <span>© 2026 LIVING BRIDGES</span>
        <button className="motion-toggle" type="button" aria-pressed={paused} disabled={Boolean(reducedMotion)} onClick={() => setPaused((value) => !value)}><span aria-hidden="true">{frozen ? "▷" : "Ⅱ"}</span>{reducedMotion ? "REDUCED MOTION" : paused ? "RESUME MOTION" : "PAUSE MOTION"}</button>
      </footer>
    </div>
  );
}
