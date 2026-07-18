import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

import Transition from "../../components/transition/Transition";
import { useDisplayProfile } from "../../utils/profileHelper";
import "./contact.css";

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  if (typeof window === "undefined") return "http://localhost:5001";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "http://localhost:5001";
  // When proxied via subdomain, relative /api works through the gateway in production
  return "";
};

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1" y="2.8" width="12" height="8.4" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.6 4L7 8L12.4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M1.5 6.5H11M11 6.5L6.8 2.3M11 6.5L6.8 10.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="5.6" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7 4.2V7L8.8 8.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DotIcon = () => <i className="contact-dot" aria-hidden="true" />;

const Contact = () => {
  const { ownerEmail, socials, profile, user } = useDisplayProfile();
  const handle = profile?.handle;
  const firstName = user?.name?.split(" ")[0] || "me";
  const reveal = useRef();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "", // honeypot
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    reveal.current = gsap
      .timeline()
      .from(".contact-hero .contact-clip > *", {
        yPercent: 110,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      })
      .from(
        ".contact-panel",
        {
          opacity: 0,
          y: 26,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.5",
      );
    return () => reveal.current?.kill();
  }, []);

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
    <div className="contact page">
      <div className="container">
        <section className="contact-hero">
          <div className="contact-clip">
            <p className="contact-kicker">
              Contact
              <i className="contact-kicker-line" aria-hidden="true" />
            </p>
          </div>
          <div className="contact-clip">
            <h1>
              Let&rsquo;s work <em>together</em>
            </h1>
          </div>
          <div className="contact-clip">
            <p className="contact-lead">
              Write to {firstName} about an opportunity, a project, or a conversation —
              every message lands directly in their inbox.
            </p>
          </div>
        </section>

        <section className="contact-body">
          <aside className="contact-panel contact-panel--info">
            {user?.openToHire && (
              <p className="contact-availability">
                <DotIcon />
                Open to opportunities
              </p>
            )}

            <h3>Get in touch</h3>
            <p className="contact-info-note">
              Prefer email or a professional network? Reach {firstName} directly through
              any of these.
            </p>

            <div className="contact-channels">
              {ownerEmail && (
                <a className="contact-channel" href={`mailto:${ownerEmail}`}>
                  <span className="contact-channel-icon">
                    <MailIcon />
                  </span>
                  <span className="contact-channel-copy">
                    <em>Email</em>
                    <strong>{ownerEmail}</strong>
                  </span>
                </a>
              )}
              {socials?.map((social) => (
                <a
                  className="contact-channel"
                  key={`${social.label}-${social.url}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-channel-icon">
                    <LinkIcon />
                  </span>
                  <span className="contact-channel-copy">
                    <em>{social.label}</em>
                    <strong>{social.url.replace(/^https?:\/\/(www\.)?/, "")}</strong>
                  </span>
                </a>
              ))}
            </div>

            <p className="contact-response">
              <ClockIcon />
              Usually responds within 1–2 business days
            </p>
          </aside>

          <div className="contact-panel contact-panel--form">
            <form onSubmit={onSubmit} noValidate>
              <div className="contact-field-row">
                <label className="contact-field">
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={onChange}
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="contact-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={onChange}
                    autoComplete="email"
                    inputMode="email"
                    required
                  />
                </label>
              </div>
              <label className="contact-field">
                <span>
                  Phone Number <small>(optional)</small>
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={onChange}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </label>
              <label className="contact-field">
                <span>Message</span>
                <textarea
                  name="message"
                  placeholder="Share the opportunity, timeline, and how we can help."
                  rows={6}
                  value={form.message}
                  onChange={onChange}
                  required
                />
              </label>
              {/* Honeypot */}
              <label className="contact-honeypot" aria-hidden="true">
                <span>Website</span>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={onChange}
                />
              </label>

              <div className="contact-actions">
                <button type="submit" disabled={!canSubmit || status === "submitting"}>
                  {status === "submitting" ? (
                    <>
                      <i className="contact-spinner" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <SendIcon />
                    </>
                  )}
                </button>
              </div>

              {status === "success" && (
                <p className="contact-status contact-status--success" role="status">
                  Message received. {firstName} will get back to you soon.
                </p>
              )}
              {status === "error" && (
                <p className="contact-status contact-status--error" role="alert">
                  {error}{" "}
                  <button type="button" className="contact-retry" onClick={onSubmit}>
                    Retry
                  </button>
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Transition(Contact);
