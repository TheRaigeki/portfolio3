const LangToggle = ({ lang, onSetLang }) => {
  const de = lang === "de";
  return (
    <div className="lang-toggle">
      <span
        className="lang-thumb"
        style={{ transform: `translateX(${de ? "0%" : "100%"})` }}
      />
      <button
        onClick={() => onSetLang("de")}
        className="lang-btn"
        style={{ color: de ? "#fff" : "#7d8da5" }}
      >
        de
      </button>
      <button
        onClick={() => onSetLang("en")}
        className="lang-btn"
        style={{ color: de ? "#7d8da5" : "#fff" }}
      >
        en
      </button>
    </div>
  );
};

export default LangToggle;
