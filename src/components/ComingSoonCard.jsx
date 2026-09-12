import { useRef } from "react";

import { useSoonStorm } from "../hooks/useSoonStorm";

/**
 * Placeholder tile in the work grid. Not a link — it exists so the section
 * reads as "more is coming" rather than "this is all there is". Instead of a
 * screenshot it frames the hero's thunderstorm: the next thing is still
 * out there, somewhere under that sky.
 */
const ComingSoonCard = ({ t }) => {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  useSoonStorm(canvasRef, cardRef);

  return (
    <div ref={cardRef} className="card card--sm card--soon">
      <div className="card-media card-media--sm card-media--soon">
        <canvas ref={canvasRef} className="soon-canvas" aria-hidden="true" />
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
};

export default ComingSoonCard;
