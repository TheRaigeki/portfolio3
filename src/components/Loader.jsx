const Loader = ({ strokes, pct, fading }) => (
  <div className="loader" style={{ opacity: fading ? 0 : 1 }}>
    <svg viewBox="0 0 230 109" className="loader-svg">
      <g
        fill="none"
        stroke="#ecebf3"
        strokeWidth="5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {strokes.map((s, i) => (
          <path
            key={i}
            d={s.d}
            transform={s.tf}
            style={{
              strokeDasharray: s.len,
              strokeDashoffset: s.len,
              animation: `draw ${s.dur}s ${s.delay}s cubic-bezier(.3,.1,.3,1) forwards`,
            }}
          />
        ))}
      </g>
    </svg>
    <div className="loader-meta">
      <span>raigeki</span>
      <span className="loader-slash">/</span>
      <span className="loader-pct">{String(pct).padStart(3, "0")}</span>
      <span>%</span>
    </div>
  </div>
);

export default Loader;
