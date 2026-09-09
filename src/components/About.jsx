const About = ({ t, stack }) => (
  <section id="about" className="section">
    <div className="section-head section-head--about">
      <span className="section-num">02</span>
      <span className="section-label">{t.navAbout}</span>
      <span className="section-dot" />
      <p className="section-lead">{t.aboutTitle}</p>
      <p className="about-p about-p--first">{t.aboutP1}</p>
      <p className="about-p">{t.aboutP2}</p>
    </div>

    <div className="stack-grid">
      {stack.map((col) => (
        <div key={col.group}>
          <div className="stack-group">{col.group}</div>
          <div className="stack-items">
            {col.items.map((item) => (
              <span key={item} className="stack-item">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default About;
