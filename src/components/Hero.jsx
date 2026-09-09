import { HERO_STACK } from "../constants";

const Hero = ({ t, visibility, ready }) => (
  <header id="top" className="hero" style={{ visibility }}>
    <div className="hero-veil" />
    <div className="hero-inner">
      <div
        className="hero-copy"
        style={{ animation: ready ? "fadeUp 1s .1s ease both" : "none" }}
      >
        <div className="hero-eyebrow">
          <span className="hero-dot" />
          Software Engineer
        </div>
        <h1 className="hero-title">
          {t.h1a}
          <br />
          {t.h1b}
          <br />
          <em>{t.h1c}</em>.
        </h1>
        <p className="hero-lede">{t.lede}</p>
      </div>
      <div
        className="hero-side"
        style={{ animation: ready ? "fadeUp 1s .5s ease both" : "none" }}
      >
        {HERO_STACK.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  </header>
);

export default Hero;
