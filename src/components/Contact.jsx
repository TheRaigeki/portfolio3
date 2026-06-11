import { useState } from "react";
import { motion } from "framer-motion";

import { contactInfo, githubUrl } from "../constants";
import { SectionWrapper } from "../hoc";
import { reveal } from "../utils/motion";

const EMAIL = "info@raigeki.dev";

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard API unavailable (insecure context / old browser)
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
};

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <motion.div variants={reveal()}>
        <div className="secnum">05 / contact</div>
        <h2 className="sectitle">Get in touch.</h2>
      </motion.div>

      <motion.p variants={reveal(0.05)} className="secintro">
        Have a role or a project in mind? Skip the form – my inbox is one
        click away.
      </motion.p>

      <motion.div variants={reveal(0.1)} className="term-contact">
        <div className="term-bar">
          <span className="term-dot td-r" />
          <span className="term-dot td-y" />
          <span className="term-dot td-g" />
          <span className="term-title">robin@raigeki:~</span>
        </div>

        <div className="term-screen">
          <div className="term-row">
            <span className="term-prompt">~ ❯</span>
            <span className="term-cmd">contact --robin</span>
          </div>

          <div className="term-row term-out">
            <span className="term-key">email</span>
            <a className="term-mail" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <button
              type="button"
              className={`term-copy${copied ? " is-copied" : ""}`}
              onClick={handleCopy}
              aria-label="Copy email address"
            >
              {copied ? "copied ✓" : "copy"}
            </button>
          </div>

          <div className="term-row term-out">
            <span className="term-key">github</span>
            <a
              className="term-link"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              {contactInfo.find((r) => r.k === "github")?.v}
            </a>
          </div>

          {contactInfo
            .filter((r) => r.k !== "email" && r.k !== "github")
            .map((row) => (
              <div className="term-row term-out" key={row.k}>
                <span className="term-key">{row.k}</span>
                <span className="term-val">{row.v}</span>
              </div>
            ))}

          <div className="term-row">
            <span className="term-prompt">~ ❯</span>
            <span className="term-cursor" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
