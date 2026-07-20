import React, { useMemo, useState } from "react";
import "./Contact.css";
import "../../components/ContactForm/ContactForm.css";

import Footer from "../../components/Footer/Footer";
import ReactLenis from "lenis/react";
import Transition from "../../components/Transition/Transition";
import { useDisplayProfile } from "../../utils/profileHelper";

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  if (typeof window === "undefined") return "http://localhost:5001";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "http://localhost:5001";
  return "";
};

const Contact = () => {
  const { ownerEmail, socials, profile, user, headline } = useDisplayProfile();
  const handle = profile?.handle;
  const year = new Date().getFullYear();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
      form.message.trim().length >= 10
    );
  }, [form]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || status === "submitting") return;
    if (!handle) {
      setStatus("error");
      setError("Portfolio handle is unavailable. Please try again later.");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const apiBase = getApiBase();
      const response = await fetch(
        `${apiBase}/api/profile/public/${encodeURIComponent(handle)}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            message: form.message.trim(),
            website: form.website,
          }),
        },
      );

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Unable to send your message right now.");
      }

      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "", website: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message || "Unable to send your message right now.");
    }
  };

  return (
    <ReactLenis root>
      <div className="page contact">
        <div className="contact-form">
          <div className="contact-form-row">
            <div className="contact-form-row-copy-item">
              <p className="primary sm">Let’s create together</p>
            </div>
            <div className="contact-form-row-copy-item">
              <p className="primary sm">{headline || "Contact"}</p>
            </div>
            <div className="contact-form-row-copy-item">
              <p className="primary sm">&copy; {year}</p>
            </div>
          </div>

          <div className="contact-form-row">
            <div className="contact-form-col">
              <div className="contact-form-header">
                <h3>Start a Conversation</h3>
                <p>
                  Have a story in mind? Let’s bring it to life. I’d love to hear
                  what you’re working on and explore how we can collaborate.
                </p>
              </div>

              <div className="contact-form-availability">
                <p className="primary sm">
                  {user?.openToHire ? "Open to collaborations" : "Available for enquiries"}
                </p>
                {ownerEmail && (
                  <a className="primary sm" href={`mailto:${ownerEmail}`}>
                    {ownerEmail}
                  </a>
                )}
              </div>

              {socials?.length > 0 && (
                <div className="contact-socials">
                  {socials.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary sm"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="contact-form-col">
              <form onSubmit={onSubmit} noValidate>
                <div className="form-item">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={onChange}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="form-item">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={onChange}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="form-item">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (optional)"
                    value={form.phone}
                    onChange={onChange}
                    autoComplete="tel"
                  />
                </div>
                {/* Honeypot */}
                <div className="form-item form-honeypot" aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={onChange}
                  />
                </div>
                <div className="form-item">
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Message"
                    value={form.message}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-item">
                  <button className="btn" type="submit" disabled={!canSubmit || status === "submitting"}>
                    {status === "submitting" ? "Sending…" : "Send Message"}
                  </button>
                </div>
                {status === "success" && (
                  <p className="primary sm contact-status contact-status--ok">Message sent. Thank you.</p>
                )}
                {status === "error" && (
                  <p className="primary sm contact-status contact-status--err">{error}</p>
                )}
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Transition(Contact);
