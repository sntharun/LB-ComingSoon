"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ComponentProps } from "react";

interface DogCompanionProps {
  paused?: boolean;
  greeting?: number;
}
type PlayerHandle = { play(): void; pause(): void; setFrame(frame: number): void; setSpeed(speed: number): void };
type PlayerCallback = NonNullable<ComponentProps<typeof DotLottieReact>["dotLottieRefCallback"]>;

export function DogCompanion({ paused = false, greeting = 0 }: DogCompanionProps) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const playerRef = useRef<PlayerHandle | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const frozen = paused || Boolean(reducedMotion);
  const frozenRef = useRef(frozen);
  frozenRef.current = frozen;

  const attachPlayer = useCallback<PlayerCallback>((player) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    playerRef.current = player;
    if (!player) return;
    const onLoad = () => {
      setReady(true);
      if (frozenRef.current || document.hidden) { player.pause(); player.setFrame(0); }
      else player.play();
    };
    const onError = () => setReady(false);
    player.addEventListener("load", onLoad);
    player.addEventListener("loadError", onError);
    cleanupRef.current = () => {
      player.removeEventListener("load", onLoad);
      player.removeEventListener("loadError", onError);
    };
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);
  useEffect(() => {
    const updatePlayback = () => {
      if (frozen || document.hidden) playerRef.current?.pause();
      else playerRef.current?.play();
    };
    updatePlayback();
    document.addEventListener("visibilitychange", updatePlayback);
    return () => document.removeEventListener("visibilitychange", updatePlayback);
  }, [frozen, ready]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !greeting || frozen || !ready) return;
    player.setFrame(0);
    player.setSpeed(1.6);
    player.play();
    const timeout = window.setTimeout(() => player.setSpeed(1), 1800);
    return () => { window.clearTimeout(timeout); player.setSpeed(1); };
  }, [greeting, frozen, ready]);

  return (
    <motion.div
      className="dog-companion"
      animate={frozen ? { y: 0, rotate: 0 } : { y: [0, -9, 0], rotate: [0, -1, 0] }}
      transition={{ duration: 5, repeat: frozen ? 0 : Infinity, ease: "easeInOut" }}
      role="img"
      aria-label="An animated puppy"
    >
      <img src={`${import.meta.env.BASE_URL}animations/cute-doggie-still.svg`} alt="" aria-hidden="true" className={`dog-fallback ${ready ? "is-hidden" : ""}`} />
      <DotLottieReact
        src={`${import.meta.env.BASE_URL}animations/cute-doggie.lottie`}
        loop
        autoplay={!frozen}
        dotLottieRefCallback={attachPlayer}
        className={`dog-player ${ready ? "is-ready" : ""}`}
      />
    </motion.div>
  );
}
