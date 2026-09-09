import { CONTACT_EMAIL, GITHUB_URL } from "../constants";

const Footer = ({ t }) => (
  <footer className="footer">
    <span>{CONTACT_EMAIL}</span>
    <div className="footer-links">
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        className="footer-link"
      >
        GitHub
      </a>
      <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
        {t.email}
      </a>
    </div>
    {/* the intro loader draws KanjiVG stroke data (Ulrich Apel), CC BY-SA 3.0 */}
    <span>
      <span className="footer-kanji">雷撃</span> · raigeki.dev © 2026 ·{" "}
      <a
        href="https://kanjivg.tagaini.net"
        target="_blank"
        rel="noreferrer"
        className="footer-credit"
      >
        KanjiVG
      </a>
    </span>
  </footer>
);

export default Footer;
