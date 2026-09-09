import LangToggle from "./LangToggle";

const MobileMenu = ({ t, lang, onSetLang, onCloseMenu }) => (
  <div className="menu-overlay">
    <a href="#work" onClick={onCloseMenu} className="menu-link">
      {t.navWork}
    </a>
    <a href="#about" onClick={onCloseMenu} className="menu-link">
      {t.navAbout}
    </a>
    <div className="menu-lang">
      <LangToggle lang={lang} onSetLang={onSetLang} />
    </div>
  </div>
);

export default MobileMenu;
