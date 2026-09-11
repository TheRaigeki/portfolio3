import { useGreeting } from "../hooks/useGreeting";

import Greeting from "./Greeting";

/**
 * The block above the button. Only this part changes between steps: the
 * heading rises out of view while the field sinks, and the next one arrives
 * the same way. Rendered read-only when `ghost`, because the outgoing copy
 * stays mounted for the length of the animation and must not be focusable.
 */
const Stage = ({ t, c, greeting, snap, ghost = false }) => {
  const step = snap ? snap.step : c.step;
  const key = ghost ? `out-${snap.id}` : `in-${step}`;

  if (step === 0) {
    return (
      <div
        key={key}
        className="c-stage"
        data-leaving={ghost || undefined}
        aria-hidden={ghost || undefined}
      >
        <Greeting index={greeting.index} still={greeting.still} frozen={ghost} />
        <p className="contact-p contact-p--first">{t.contactIntro}</p>
        <p className="contact-p">{t.contactIntro2}</p>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div
        key={key}
        className="c-stage"
        data-leaving={ghost || undefined}
        aria-hidden={ghost || undefined}
      >
        <div className="contact-sent">{t.sent}</div>
        <h2 className="contact-h2">
          {t.thanks}, {c.name}.
        </h2>
        <p className="contact-p">
          {t.reply} <span className="contact-mail">{c.email}</span>.
        </p>
      </div>
    );
  }

  const question = snap ? snap.question : c.question;
  const value = snap ? snap.value : c.value;
  const placeholder = snap ? snap.placeholder : c.placeholder;
  const isMessage = snap ? snap.isMessage : c.isMessage;
  const fieldClass = `contact-field contact-field--${isMessage ? "textarea" : "input"}`;

  return (
    <div
      key={key}
      className="c-stage"
      data-leaving={ghost || undefined}
      aria-hidden={ghost || undefined}
    >
      <label className="contact-q">{question}</label>
      <div className="c-sink">
        {ghost ? (
          // a still of the field, so there is never a second focusable input
          <div className={`${fieldClass} contact-field--ghost`}>
            {value || <span className="contact-ghost-ph">{placeholder}</span>}
          </div>
        ) : isMessage ? (
          <textarea
            rows={3}
            value={value}
            onChange={c.change}
            onKeyDown={c.keyDown}
            placeholder={placeholder}
            autoFocus
            className={fieldClass}
          />
        ) : (
          <input
            type={c.type}
            value={value}
            onChange={c.change}
            onKeyDown={c.keyDown}
            placeholder={placeholder}
            autoFocus
            className={fieldClass}
          />
        )}
      </div>
    </div>
  );
};

const Contact = ({ t, c, onClose, greetingStart }) => {
  const greeting = useGreeting(greetingStart);

  const primary = c.isIntro
    ? { label: t.start, onClick: c.next }
    : c.isDone
    ? { label: t.backHome, onClick: onClose }
    : { label: c.nextLabel, onClick: c.next };

  return (
    <div className="contact">
      <div className="contact-top">
        <button onClick={onClose} className="contact-close">
          <span className="contact-close-slash">/</span>
          {t.close}
        </button>
        <span className="contact-progress">{c.progress}</span>
      </div>

      <div className="contact-body">
        <div className="contact-inner">
          <div className="c-content">
            {c.leaving && (
              <Stage t={t} c={c} greeting={greeting} snap={c.leaving} ghost />
            )}
            <Stage t={t} c={c} greeting={greeting} />
          </div>

          {/* space is reserved whether or not there is an error, so the button
              below never moves when one appears */}
          <div className="c-errorslot">
            {c.error && <div className="contact-error">{c.error}</div>}
          </div>

          {/* honeypot — off-screen and hidden from assistive tech, so only
              bots ever fill it */}
          <input
            type="text"
            className="contact-botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={c.botcheck}
            onChange={(e) => c.setBotcheck(e.target.value)}
          />

          {/* the button and the line under it are fixtures: they hold their
              place across every step and only swap their labels */}
          <div className="c-controls">
            <button
              onClick={primary.onClick}
              onKeyDown={c.isIntro ? c.keyDown : undefined}
              autoFocus={c.isIntro || undefined}
              disabled={c.sending}
              className="pill-lg contact-cta"
            >
              {primary.label}
            </button>
            <div className="contact-sub">
              {c.isIntro && <span className="contact-note">{t.pressEnter}</span>}
              {c.isAsking && (
                <>
                  <button onClick={c.back} className="contact-back">
                    ← {t.back}
                  </button>
                  <span className="contact-sep">·</span>
                  <span>{c.hint}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="contact-foot">
        {c.isIntro ? (
          t.takes
        ) : (
          <div
            className="contact-bar"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={3}
            aria-valuenow={Math.min(c.step, 3)}
          >
            <span
              className="contact-bar-fill"
              style={{ transform: `scaleX(${Math.min(c.step, 3) / 3})` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
