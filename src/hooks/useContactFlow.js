import { useEffect, useRef, useState } from "react";

import {
  CONTACT_ACCESS_KEY,
  CONTACT_ENDPOINT,
  CONTACT_SUBJECT,
} from "../constants";

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
  const [values, setValues] = useState({ name: "", email: "", msg: "", botcheck: "" });
  const [sending, setSending] = useState(false);
  // the step that is animating out; it stays mounted for one beat
  const [leaving, setLeaving] = useState(null);
  const [error, setError] = useState("");
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  /**
   * Snapshot of the last committed step. The effect runs after each commit, so
   * when a handler calls goTo it still holds the step we are leaving — which is
   * what the outgoing block needs to render itself while it fades away.
   */
  const snapRef = useRef(null);

  /** Every step change goes through here so the outgoing block can fade out. */
  const goTo = (to) => {
    if (to === step) return;
    if (snapRef.current) setLeaving({ ...snapRef.current, id: Date.now() });
    setStep(to);
    setError("");
  };

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setLeaving(null), 620);
    return () => clearTimeout(t);
  }, [leaving]);

  const i = step - 1;
  const def = t.steps[i];
  const key = KEYS[i];

  /**
   * Hands the message to the configured endpoint. Nothing is confirmed to the
   * visitor until the endpoint says it took it — the old mailto: hand-off
   * showed "sent" even when no mail client existed and nothing was ever sent.
   */
  const submit = async () => {
    if (!CONTACT_ENDPOINT) {
      setError(t.sendFailed);
      return false;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...(CONTACT_ACCESS_KEY ? { access_key: CONTACT_ACCESS_KEY } : {}),
          subject: CONTACT_SUBJECT,
          from_name: values.name,
          name: values.name,
          email: values.email,
          message: values.msg,
          // honeypot: a real visitor never sees this field, bots fill it in
          botcheck: values.botcheck,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      return true;
    } catch (e) {
      setError(t.sendFailed);
      return false;
    } finally {
      setSending(false);
    }
  };

  const next = async () => {
    if (sending) return;
    if (step === 0) {
      goTo(1);
      return;
    }
    if (step > 3) return;
    if (!VALIDATORS[i](values[key])) {
      setError(def.err);
      return;
    }
    if (step === 3) {
      if (await submit()) goTo(4);
      return;
    }
    goTo(step + 1);
  };

  const back = () => goTo(Math.max(0, step - 1));

  const change = (e) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [key]: v }));
    setError("");
  };

  /**
   * Back to the intro. What happens to the answers depends on why we left:
   * an abandoned conversation keeps them, so an accidental close costs
   * nothing and they survive until the page reloads — but a message that was
   * actually sent is done, and must not be sitting in the fields next time.
   */
  const toStart = () => {
    if (step === 4) setValues({ name: "", email: "", msg: "", botcheck: "" });
    setStep(0);
    setLeaving(null);
    setError("");
  };

  const keyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      next();
    }
    // the "← Back" label promises a key; Backspace only once there is nothing
    // left to delete, so it never eats a character the visitor still wants
    if (e.key === "Backspace" && step > 0 && !values[key]) {
      e.preventDefault();
      back();
    }
    if (e.key === "Escape") closeRef.current();
  };

  useEffect(() => {
    snapRef.current = {
      step,
      question: def
        ? typeof def.q === "function"
          ? def.q(values.name || (isDe ? "du" : "there"))
          : def.q
        : "",
      value: key ? values[key] : "",
      placeholder: def?.ph,
      isMessage: step === 3,
    };
  });

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
    nextLabel: sending ? t.sending : step === 3 ? t.send : t.ok,
    sending,
    leaving,
    botcheck: values.botcheck,
    setBotcheck: (v) => setValues((prev) => ({ ...prev, botcheck: v })),
    next,
    back,
    toStart,
    change,
    keyDown,
  };
}
