import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import "./home.css";

import Transition from "../../components/transition/Transition";
import { useDisplayProfile } from "../../utils/profileHelper";
import gsap from "gsap";

/**
 * Guarantees a hero name line fits its container for any letter count.
 * CSS clamp() picks the ideal size; we measure and scale down only when
 * the rendered line would overflow. Re-runs on resize and after fonts load.
 */
const FitLine = ({ text, className }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      el.style.fontSize = "";
      const available = parent.clientWidth;
      const width = el.scrollWidth;
      if (width > available && width > 0) {
        const base = parseFloat(window.getComputedStyle(el).fontSize);
        const next = Math.max(base * (available / width) * 0.96, 18);
        el.style.fontSize = `${next}px`;
      }
    };

    fit();
    document.fonts?.ready?.then(fit).catch(() => undefined);

    const observer = new ResizeObserver(fit);
    if (el.parentElement) observer.observe(el.parentElement);
    return () => observer.disconnect();
  }, [text]);

  return (
    <h1 ref={ref} className={className}>
      {text}
    </h1>
  );
};

/**
 * Decide how the photo and name should sit together based on name shape.
 * Short names keep the classic editorial overlap; long / single-line names
 * push the photo further right and shrink it so the type stays clean.
 */
function getHeroLayout(nameParts, nameFitClass) {
  const { firstName, lastName, isSingle, tokens } = nameParts;
  const primary = isSingle ? firstName : lastName || firstName;
  const letterCount = (primary || "").replace(/\s+/g, "").length;
  const totalLetters = [firstName, lastName].filter(Boolean).join("").replace(/\s+/g, "").length;

  if (isSingle || nameFitClass.includes("solo")) {
    // Long single-line names (e.g. "Kavinbalaji SK") look best with the
    // photo cleared to the side — never cut through the middle of the type.
    if (letterCount >= 12 || totalLetters >= 14) return "hero-layout--clear";
    if (letterCount >= 8) return "hero-layout--soft";
    return "hero-layout--classic";
  }

  const lastLen = (lastName || "").replace(/\s+/g, "").length;
  if (lastLen >= 12 || totalLetters >= 22 || tokens.some((t) => t.length > 12)) {
    return "hero-layout--clear";
  }
  if (lastLen >= 8 || totalLetters >= 16) return "hero-layout--soft";
  return "hero-layout--classic";
}

const Home = () => {
  const {
    user,
    nameParts,
    nameFitClass,
    headline,
    photoUrl,
    resumeUrl,
  } = useDisplayProfile();

  const { firstName, lastName, isSingle } = nameParts;
  const layoutClass = useMemo(
    () => getHeroLayout(nameParts, nameFitClass),
    [nameParts, nameFitClass],
  );

  // Entrances are pure CSS (see home.css). GSAP only drives the desktop
  // pointer parallax, composing with the CSS `translate`/`rotate` properties.
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 901px)").matches;
    const img = document.querySelector(".hero-img");
    const copy = document.querySelector(".hero-copy");
    if (!img || !isDesktop || prefersReduced) return undefined;

    const imgX = gsap.quickTo(img, "x", { duration: 0.9, ease: "power3.out" });
    const imgY = gsap.quickTo(img, "y", { duration: 0.9, ease: "power3.out" });
    const copyX = copy && gsap.quickTo(copy, "x", { duration: 1.1, ease: "power3.out" });
    const copyY = copy && gsap.quickTo(copy, "y", { duration: 1.1, ease: "power3.out" });

    let parallaxReady = false;
    const enableParallax = setTimeout(() => {
      parallaxReady = true;
    }, 1500); // let the CSS entrance finish first

    const onPointerMove = (event) => {
      if (!parallaxReady) return;
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      imgX(nx * 18);
      imgY(ny * 14);
      copyX?.(nx * -8);
      copyY?.(ny * -6);
    };

    window.addEventListener("pointermove", onPointerMove);

    return () => {
      clearTimeout(enableParallax);
      window.removeEventListener("pointermove", onPointerMove);
      gsap.set(img, { clearProps: "x,y,transform" });
      if (copy) gsap.set(copy, { clearProps: "x,y,transform" });
    };
  }, [firstName, lastName, photoUrl, layoutClass]);

  return (
    <section
      className={`hero-section ${nameFitClass} ${layoutClass}${
        isSingle ? " hero-section--single" : ""
      }`}
    >
      {photoUrl ? (
        <div className="hero-img">
          <img src={photoUrl} alt={user?.name || "Profile photo"} />
        </div>
      ) : (
        <div className="hero-img hero-img--fallback" aria-hidden="true">
          <span>{(firstName || "B").charAt(0)}</span>
        </div>
      )}

      <div className="hero-copy">
        <div className="hero-copy-wrapper">
          <FitLine className="hero-firstname" text={firstName || "Portfolio"} />
        </div>
        {!isSingle && lastName && (
          <div className="hero-copy-wrapper">
            <FitLine className="hero-lastname" text={lastName} />
          </div>
        )}
      </div>

      <div className="hero-cta-block">
        <div className="hero-actions">
          {resumeUrl ? (
            <a className="hero-btn" href={resumeUrl} download target="_blank" rel="noopener noreferrer">
              Download Resume
            </a>
          ) : (
            <span className="hero-btn hero-btn--disabled" aria-disabled="true">
              Download Resume
            </span>
          )}
          <Link className="hero-btn hero-btn--solid" to="/portfolio">
            View My Work
          </Link>
        </div>
        <p className="hero-tagline">{headline || "Professional Portfolio"}</p>
      </div>
    </section>
  );
};

export default Transition(Home);
