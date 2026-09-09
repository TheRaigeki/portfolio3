import { CONTACT_EMAIL } from "../constants";

const ContactTeaser = ({ t, onOpenContact }) => (
  <section id="contact-teaser" className="section section--contact">
    <div className="section-head">
      <span className="section-num">03</span>
      <span className="section-label">{t.navContact}</span>
      <span className="section-dot" />
      <p className="section-lead">{t.contactTitle}</p>
      <p className="section-lead">{t.contactTeaser}</p>
      <button onClick={onOpenContact} className="pill-lg teaser-cta">
        {t.getInTouch}
      </button>
      <a href={`mailto:${CONTACT_EMAIL}`} className="teaser-mail">
        {CONTACT_EMAIL}
      </a>
    </div>
  </section>
);

export default ContactTeaser;
