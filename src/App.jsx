import { useEffect, useRef, useState } from "react";

import {
  About,
  Contact,
  ContactTeaser,
  Footer,
  Hero,
  Loader,
  MobileMenu,
  Navbar,
  StormCanvas,
  Work,
} from "./components";
import {
  DEFAULT_STORM,
  I18N,
  LANG_KEY,
  buildProjects,
  buildStack,
  detectLang,
} from "./constants";
import { useContactFlow } from "./hooks/useContactFlow";
import { useLoader } from "./hooks/useLoader";
import { useStorm } from "./hooks/useStorm";
import { useViewport } from "./hooks/useViewport";

/**
 * @param storm       intensity of the canvas thunderstorm: 'subtil' | 'deutlich' | 'wucht'
 * @param showLoader  set to false to skip the KanjiVG intro entirely
 */
const App = ({ storm = DEFAULT_STORM, showLoader = true }) => {
  const { loading, pct, fading, strokes } = useLoader(showLoader);
  // The loader's backdrop is translucent on purpose — the storm has to stay
  // visible behind it. That means page content would show through just as
  // readily, at whatever scroll offset the browser restored on reload, so the
  // page stays hidden and unscrollable until the loader lifts.
  const ready = fading || !loading;
  const [lang, setLangState] = useState(detectLang);
  const [contactOpen, setContactOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isMobile, vw } = useViewport(() => setMenuOpen(false));

  // the storm's animation loop reads the overlay state without re-subscribing
  const stormRef = useRef(null);
  const contactOpenRef = useRef(contactOpen);
  useEffect(() => {
    contactOpenRef.current = contactOpen;
  }, [contactOpen]);
  useStorm(stormRef, storm, contactOpenRef);

  const t = I18N[lang];
  const contact = useContactFlow({
    t,
    isDe: lang === "de",
    onClose: () => setContact(false),
  });

  useEffect(() => {
    if (location.hash === "#contact") setContactOpen(true);
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.75);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Single owner for the scroll lock. The loader, the contact overlay and the
  // mobile menu all want it; toggling it from each of them lets them clobber
  // one another (closing the menu would unlock the page behind the overlay).
  useEffect(() => {
    document.body.style.overflow =
      !ready || contactOpen || menuOpen ? "hidden" : "";
  }, [ready, contactOpen, menuOpen]);

  function setContact(open) {
    if (open) setMenuOpen(false);
    if (open) history.replaceState(null, "", "#contact");
    else if (location.hash === "#contact")
      history.replaceState(null, "", location.pathname);
    setContactOpen(open);
    contact.setError("");
  }

  const setLang = (next) => {
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch (e) {}
    setLangState(next);
    contact.setError("");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const visibility = contactOpen || !ready ? "hidden" : "visible";
  const restCols =
    vw >= 1140 ? "repeat(4,1fr)" : vw >= 560 ? "repeat(2,1fr)" : "1fr";

  return (
    <>
      <StormCanvas canvasRef={stormRef} />

      {loading && <Loader strokes={strokes} pct={pct} fading={fading} />}

      <Navbar
        t={t}
        lang={lang}
        isMobile={isMobile}
        scrolled={scrolled}
        menuOpen={menuOpen}
        contactOpen={contactOpen}
        loading={loading}
        fading={fading}
        onSetLang={setLang}
        onOpenContact={() => setContact(true)}
        onToggleMenu={toggleMenu}
        onCloseMenu={closeMenu}
      />

      {menuOpen && (
        <MobileMenu
          t={t}
          lang={lang}
          onSetLang={setLang}
          onCloseMenu={closeMenu}
        />
      )}

      <Hero t={t} visibility={visibility} ready={ready} />

      <main className="main" style={{ visibility }}>
        <div className="shell">
          <Work t={t} projects={buildProjects(t)} restCols={restCols} />
          <About t={t} stack={buildStack(t)} />
          <ContactTeaser t={t} onOpenContact={() => setContact(true)} />
        </div>
        <Footer t={t} />
      </main>

      {contactOpen && ready && (
        <Contact t={t} c={contact} onClose={() => setContact(false)} />
      )}
    </>
  );
};

export default App;
