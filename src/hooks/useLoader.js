import { useEffect, useState } from "react";

import { KANJI } from "../constants";

/**
 * Measures every KanjiVG stroke once so the dash animation can be timed to the
 * stroke's real length. Returns the strokes plus the total run time in seconds.
 */
const buildStrokes = () => {
  const ns = "http://www.w3.org/2000/svg";
  const probe = document.createElementNS(ns, "path");
  const out = [];
  let t = 0.15;
  KANJI.forEach((k, ki) => {
    k.forEach((d) => {
      probe.setAttribute("d", d);
      const len = Math.ceil(probe.getTotalLength()) + 1;
      const dur = 0.02 + len * 0.0011;
      out.push({
        d,
        tf: `translate(${ki * 121},0)`,
        len,
        dur: +dur.toFixed(3),
        delay: +t.toFixed(3),
      });
      t += dur + 0.02;
    });
    t += 0.1;
  });
  return { strokes: out, total: t };
};

/**
 * Drives the intro loader: the percentage counts up over exactly as long as the
 * stroke animation runs, then the overlay fades out and unmounts.
 */
export function useLoader(showLoader) {
  const [loading, setLoading] = useState(showLoader !== false);
  const [pct, setPct] = useState(showLoader === false ? 100 : 0);
  const [fading, setFading] = useState(false);
  const [strokes, setStrokes] = useState([]);

  useEffect(() => {
    if (showLoader === false) return;

    // The intro always plays at the top. Its backdrop is translucent so the
    // storm shows through, and the storm stops drawing once the viewport is
    // scrolled past the canvas — a reload at some offset down the page would
    // otherwise leave a frozen canvas behind the loader. `instant` matters:
    // the page scrolls smoothly, and an animated jump would do the same.
    const restore = history.scrollRestoration || "auto";
    try {
      history.scrollRestoration = "manual";
    } catch (e) {}
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch (e) {
      window.scrollTo(0, 0);
    }
    const releaseScroll = () => {
      try {
        history.scrollRestoration = restore;
      } catch (e) {}
    };

    const built = buildStrokes();
    setStrokes(built.strokes);

    const t0 = performance.now();
    const dur = built.total * 1000 + 120;
    let raf;
    let timer;
    const tick = () => {
      const p = Math.min(100, Math.round(((performance.now() - t0) / dur) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else {
        setFading(true);
        timer = setTimeout(() => {
          setLoading(false);
          releaseScroll();
        }, 550);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      releaseScroll();
    };
  }, [showLoader]);

  return { loading, pct, fading, strokes };
}
