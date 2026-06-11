import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { heroChips } from "../constants";
import { MacbookCanvas } from "./canvas";

const HINT_SHOW_AFTER_MS = 3500;
const HINT_VISIBLE_FOR_MS = 6000;

const Hero = () => {
  const [showHint, setShowHint] = useState(false);
  const interacted = useRef(false);

  useEffect(() => {
    const show = setTimeout(() => {
      if (!interacted.current) setShowHint(true);
    }, HINT_SHOW_AFTER_MS);
    const hide = setTimeout(
      () => setShowHint(false),
      HINT_SHOW_AFTER_MS + HINT_VISIBLE_FOR_MS
    );
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  const dismissHint = () => {
    interacted.current = true;
    setShowHint(false);
  };

  return (
    <header className="hero">
      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="eyebrow">// application developer</div>
          <h1 className="title">
            Robin<span className="efz">/dev</span>
          </h1>
          <p className="lede">
            I build <b>fullstack applications</b> and keep the pipes running
            underneath them – Spring Boot &amp; Angular on top, Docker Swarm
            &amp; GitLab CI/CD below.
          </p>
          <div className="chips">
            {heroChips.map((chip) => (
              <span key={chip} className="chip">
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="macslot" onPointerDown={dismissHint}>
          <MacbookCanvas />
          <AnimatePresence>
            {showHint && (
              <motion.div
                className="drag-hint"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <span className="drag-hint-chev">‹</span>
                drag to rotate
                <span className="drag-hint-chev drag-hint-chev-r">›</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Hero;
