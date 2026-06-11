import { useRef, useState } from "react";
import { motion } from "framer-motion";

import { contactInfo } from "../constants";
import { SectionWrapper } from "../hoc";
import { reveal } from "../utils/motion";

const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        throw new Error(error || `request failed (${res.status})`);
      }

      alert("Thanks – I'll get back to you as soon as possible.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div variants={reveal()}>
        <div className="secnum">05 / contact</div>
        <h2 className="sectitle">Get in touch.</h2>
      </motion.div>

      <motion.div variants={reveal(0.05)} className="contact">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="field">
            <label>Your name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              maxLength={100}
              required
            />
          </div>
          <div className="field">
            <label>Your email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@foo.com"
              maxLength={254}
              required
            />
          </div>
          <div className="field">
            <label>Message</label>
            <textarea
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me something..."
              maxLength={5000}
              required
            />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "sending..." : "send →"}
          </button>
        </form>

        <div className="info">
          {contactInfo.map((row) => (
            <div className="line" key={row.k}>
              <span className="k">{row.k}</span>
              <span className="v">{row.v}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
