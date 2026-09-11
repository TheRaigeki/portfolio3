import { useEffect, useRef, useState } from "react";

import { GREETINGS, GREETING_INTERVAL } from "../constants";

const prefersReducedMotion = () =>
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Owns which greeting is on screen. It lives above the component so the copy
 * that fades out when the intro leaves can show the same word — mounted on its
 * own it would reset to the starting language and the text would visibly jump.
 */
export function useGreeting(startIndex = 0) {
  const [still] = useState(prefersReducedMotion);
  const [index, setIndex] = useState(startIndex);
  const ref = useRef(startIndex);

  useEffect(() => {
    if (still) return;
    const tick = setInterval(() => {
      ref.current = (ref.current + 1) % GREETINGS.length;
      setIndex(ref.current);
    }, GREETING_INTERVAL);
    return () => clearInterval(tick);
  }, [still]);

  return { index, still };
}
