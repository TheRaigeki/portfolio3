import { useEffect, useRef, useState } from "react";

import { CONTACT_EMAIL } from "../constants";

/** Steps 1–3 map onto these fields, in this order. */
const KEYS = ["name", "email", "msg"];
const TYPES = ["text", "email", "text"];
const VALIDATORS = [
  (v) => v.trim().length > 1,
  (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  (v) => v.trim().length > 4,
];

/**
 * The contact conversation: step 0 is the intro, 1–3 ask name / email / message,
 * step 4 confirms after the mail draft has been handed to the mail client.
 */
export function useContactFlow({ t, isDe, onClose }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ name: "", email: "", msg: "" });
  const [error, setError] = useState("");
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  const i = step - 1;
  const def = t.steps[i];
  const key = KEYS[i];

  const submit = () => {
    const body = encodeURIComponent(
      `${values.msg}\n\n— ${values.name} (${values.email})`
    );
    try {
      window.open(
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("raigeki.dev")}&body=${body}`,
        "_self"
      );
    } catch (e) {}
  };

  const next = () => {
    if (step === 0) {
      setStep(1);
      setError("");
      return;
    }
    if (step > 3) return;
    if (!VALIDATORS[i](values[key])) {
      setError(def.err);
      return;
    }
    if (step === 3) {
      submit();
      setStep(4);
      setError("");
      return;
    }
    setStep(step + 1);
    setError("");
  };

  const back = () => {
    setStep(Math.max(0, step - 1));
    setError("");
  };

  const change = (e) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [key]: v }));
    setError("");
  };

  const keyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      next();
    }
    if (e.key === "Escape") closeRef.current();
  };

  return {
    step,
    error,
    setError,
    name: values.name,
    email: values.email,
    isIntro: step === 0,
    isAsking: step >= 1 && step <= 3,
    isDone: step === 4,
    isMessage: step === 3,
    isInput: step === 1 || step === 2,
    progress: step >= 1 && step <= 3 ? `0${step} / 03` : "",
    question: def
      ? typeof def.q === "function"
        ? def.q(values.name || (isDe ? "du" : "there"))
        : def.q
      : "",
    placeholder: def?.ph,
    hint: def?.hint,
    type: TYPES[i],
    value: key ? values[key] : "",
    nextLabel: step === 3 ? t.send : t.ok,
    next,
    back,
    change,
    keyDown,
  };
}
