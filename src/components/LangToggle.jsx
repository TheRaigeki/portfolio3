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
        style={{ color: de ? "#fff" : "#8b88a3" }}
      >
        de
      </button>
      <button
        onClick={() => onSetLang("en")}
        className="lang-btn"
        style={{ color: de ? "#8b88a3" : "#fff" }}
      >
        en
      </button>
    </div>
  );
};

export default LangToggle;
