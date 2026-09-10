import { useEffect, useRef, useState } from "react";

import { GREETINGS, GREETING_INTERVAL } from "../constants";

/**
 * Splitting a word with `.split("")` cuts UTF-16 code units apart, which tears
 * combining marks off their base letter — नमस्ते becomes न म स ् त े and Thai
 * loses its vowel signs. Grapheme segmentation keeps each cluster intact.
 */
let segmenter;
const graphemes = (word) => {
  if (segmenter === undefined) {
    try {
      segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    } catch (e) {
      segmenter = null;
    }
  }
  return segmenter
    ? [...segmenter.segment(word)].map((s) => s.segment)
    : [...word];
};

/** Mirrors the exit timing in the stylesheet, to unmount the old word after it. */
const EXIT_DELAY = 100;
const EXIT_STAGGER = 15;
const EXIT_DURATION = 250;

const prefersReducedMotion = () =>
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

const Word = ({ word, leaving = false }) => (
  <span
    className="greeting-word"
    data-leaving={leaving || undefined}
    aria-hidden={leaving || undefined}
  >
    {graphemes(word).map((ch, n) => (
      <span key={n} className="greeting-char" style={{ "--n": n }}>
        {ch}
      </span>
    ))}
  </span>
);

/**
 * The greeting cycles through languages, each character blurring up into place
 * and out again. Timings match lue.studio/contact, but both words are stacked
 * in one grid cell and centred independently — the outgoing word must not shift
 * when the incoming one has a different length.
 */
const Greeting = ({ startIndex = 0 }) => {
  const [still] = useState(prefersReducedMotion);
  const [index, setIndex] = useState(startIndex);
  const [leaving, setLeaving] = useState(null);
  const indexRef = useRef(startIndex);
  const idRef = useRef(0);

  useEffect(() => {
    if (still) return;
    const tick = setInterval(() => {
      const from = indexRef.current;
      const to = (from + 1) % GREETINGS.length;
      indexRef.current = to;
      idRef.current += 1;
      setLeaving({ word: GREETINGS[from], id: idRef.current });
      setIndex(to);
    }, GREETING_INTERVAL);
    return () => clearInterval(tick);
  }, [still]);

  // drop the outgoing word once its last character has finished leaving
  useEffect(() => {
    if (!leaving) return;
    const chars = graphemes(leaving.word).length;
    const ms =
      EXIT_DELAY + EXIT_STAGGER * Math.max(0, chars - 1) + EXIT_DURATION + 60;
    const t = setTimeout(() => setLeaving(null), ms);
    return () => clearTimeout(t);
  }, [leaving]);

  if (still) return <h2 className="contact-h2 greeting">{GREETINGS[index]}</h2>;

  return (
    <h2 className="contact-h2 greeting">
      {leaving && (
        <Word key={`out-${leaving.id}`} word={leaving.word} leaving />
      )}
      <Word key={`in-${index}`} word={GREETINGS[index]} />
    </h2>
  );
};

export default Greeting;
