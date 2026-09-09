import LangToggle from "./LangToggle";

const Navbar = ({
  t,
  lang,
  isMobile,
  scrolled,
  menuOpen,
  contactOpen,
  loading,
  fading,
  onSetLang,
  onOpenContact,
  onToggleMenu,
  onCloseMenu,
}) => {
  // the burger only appears once the hero is scrolled past — or while the menu is open
  const burger = scrolled || menuOpen;
  return (
    <nav
      className="nav"
      style={{
        opacity: (loading && !fading) || contactOpen ? 0 : 1,
        pointerEvents: contactOpen ? "none" : "auto",
      }}
    >
      <a href="#top" onClick={onCloseMenu} className="nav-brand">
        raigeki.dev
      </a>

      {!isMobile && (
        <div className="nav-desktop">
          <a href="#work" className="nav-link">
            {t.navWork}
          </a>
          <a href="#about" className="nav-link">
            {t.navAbout}
          </a>
          <button onClick={onOpenContact} className="pill-sm nav-cta">
            {t.navContact}
          </button>
          <LangToggle lang={lang} onSetLang={onSetLang} />
        </div>
      )}

      {isMobile && (
        <div className="nav-mobile">
          <button
            onClick={onOpenContact}
            className="pill-sm nav-cta nav-cta--mobile"
          >
            {t.navContact}
          </button>
          <button
            onClick={onToggleMenu}
            aria-label="Menu"
            className="pill-sm burger"
            style={{
              width: burger ? "42px" : "0px",
              marginLeft: burger ? "10px" : "0px",
              opacity: burger ? 1 : 0,
              transform: `scale(${burger ? 1 : 0.6})`,
              pointerEvents: burger ? "auto" : "none",
            }}
          >
            <span
              className="burger-bar"
              style={{
                transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="burger-bar burger-bar--mid"
              style={{
                transform: menuOpen ? "scaleX(0)" : "none",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="burger-bar"
              style={{
                transform: menuOpen
                  ? "translateY(-6.5px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
