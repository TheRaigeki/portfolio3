const Contact = ({ t, c, onClose }) => (
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
        {c.isIntro && (
          <div className="contact-stage">
            <h2 className="contact-h2">{t.hello}</h2>
            <p className="contact-p contact-p--first">{t.contactIntro}</p>
            <p className="contact-p">{t.contactIntro2}</p>
            <button
              onClick={c.next}
              onKeyDown={c.keyDown}
              autoFocus
              className="pill-lg contact-start"
            >
              {t.start}
            </button>
            <span className="contact-note">{t.pressEnter}</span>
          </div>
        )}

        {c.isAsking && (
          // remounting on every step replays the fade-up and moves the focus
          <div key={c.step} className="contact-stage contact-stage--asking">
            <label className="contact-q">{c.question}</label>

            {c.isMessage && (
              <textarea
                rows={3}
                value={c.value}
                onChange={c.change}
                onKeyDown={c.keyDown}
                placeholder={c.placeholder}
                autoFocus
                className="contact-field contact-field--textarea"
              />
            )}
            {c.isInput && (
              <input
                type={c.type}
                value={c.value}
                onChange={c.change}
                onKeyDown={c.keyDown}
                placeholder={c.placeholder}
                autoFocus
                className="contact-field contact-field--input"
              />
            )}

            {c.error && <div className="contact-error">{c.error}</div>}

            <div className="contact-actions">
              <button onClick={c.next} className="pill-lg contact-next">
                {c.nextLabel}
              </button>
              <div className="contact-sub">
                <button onClick={c.back} className="contact-back">
                  ← {t.back}
                </button>
                <span className="contact-sep">·</span>
                <span>{c.hint}</span>
              </div>
            </div>
          </div>
        )}

        {c.isDone && (
          <div className="contact-stage">
            <div className="contact-sent">{t.sent}</div>
            <h2 className="contact-h2">
              {t.thanks}, {c.name}.
            </h2>
            <p className="contact-p">
              {t.reply} <span className="contact-mail">{c.email}</span>.
            </p>
            <button onClick={onClose} className="pill-lg contact-home">
              {t.backHome}
            </button>
          </div>
        )}
      </div>
    </div>

    <div className="contact-foot">{t.takes}</div>
  </div>
);

export default Contact;
