/**
 * Placeholder tile in the work grid. Not a link — it exists so the section
 * reads as "more is coming" rather than "this is all there is".
 */
const ComingSoonCard = ({ t }) => (
  <div className="card card--sm card--soon">
    <div className="card-media card-media--sm card-media--soon">
      <svg viewBox="0 0 64 64" className="soon-bolt" aria-hidden="true">
        <path d="M39 4 L19 34 H29 L32 60 L46 26 H36 Z" fill="#eef4ff" />
      </svg>
    </div>
    <div className="card-body card-body--sm">
      <div className="card-head card-head--sm">
        <h3 className="card-title card-title--sm">{t.soonTitle}</h3>
        <span className="card-kind card-kind--soon">{t.soonKind}</span>
      </div>
      <p className="card-desc card-desc--sm">{t.soonText}</p>
      <div className="card-tags card-tags--sm">— — —</div>
    </div>
  </div>
);

export default ComingSoonCard;
