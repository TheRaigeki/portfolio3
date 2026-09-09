import { useEffect, useRef, useState } from "react";

const MOBILE_BREAKPOINT = 760;

/**
 * Viewport width and the "< 760px" flag. Both drive layout decisions that the
 * design makes in JS rather than in media queries (nav variant, project grid).
 *
 * @param onBreakpointChange called with the new flag whenever mobile/desktop flips
 */
export function useViewport(onBreakpointChange) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [vw, setVw] = useState(() => window.innerWidth);
  const isMobileRef = useRef(isMobile);
  const vwRef = useRef(vw);
  const cbRef = useRef(onBreakpointChange);
  useEffect(() => {
    cbRef.current = onBreakpointChange;
  });

  useEffect(() => {
    const onResize = () => {
      const m = window.innerWidth < MOBILE_BREAKPOINT;
      const w = window.innerWidth;
      if (m !== isMobileRef.current) {
        isMobileRef.current = m;
        setIsMobile(m);
        cbRef.current?.(m);
      }
      if (w !== vwRef.current) {
        vwRef.current = w;
        setVw(w);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { isMobile, vw };
}
