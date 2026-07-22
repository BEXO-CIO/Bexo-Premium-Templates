import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import FitText, {
  stickyCopyTier,
  fitSummary,
  fitBlockToBox,
  splitStoryBeats,
} from "../../components/FitText/FitText";
import Footer from "../../components/Footer/Footer";
import Transition from "../../components/Transition/Transition";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import { useDisplayProfile, splitDisplayName } from "../../utils/profileHelper";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const {
    user,
    profile,
    projectEntries = [],
    nameParts,
    nameFitClass,
    headline,
    summary,
    photoUrl,
  } = useDisplayProfile();

  const projects = projectEntries;
  const parts = nameParts || splitDisplayName(user?.name);
  const firstName = parts.firstName || "";
  const lastName = parts.lastName || "";
  const displayName = parts.isSingle
    ? firstName || user?.name || "Portfolio"
    : [firstName, lastName].filter(Boolean).join(" ");

  const stickyTitlesRef = useRef(null);
  const titlesRef = useRef([]);
  const homeWorkRef = useRef(null);

  const storyBeats = splitStoryBeats({
    summary,
    headline,
    careerGoal: profile?.careerGoal,
    name: user?.name,
  });
  const stickyLine1 = storyBeats[0] || "";
  const stickyLine2 = storyBeats[1] || "";
  const stickyLine3 = storyBeats[2] || "";
  const selectsLabel = `${displayName || lastName || firstName || "Featured"} selects`;

  useEffect(() => {
    const stickySection = stickyTitlesRef.current;
    const stage = stickySection?.querySelector(".sticky-titles-stage");
    const titles = titlesRef.current.filter(Boolean);

    if (!stickySection || !stage || titles.length !== 3) {
      return undefined;
    }

    const fitTitles = () => {
      titles.forEach((el) => {
        const slot = el.parentElement;
        fitBlockToBox(el, {
          box: slot,
          minPx: 22,
          step: 0.55,
          lineHeight: 1.08,
          letterSpacing: "-0.015em",
          fill: true,
        });
      });
    };

    fitTitles();
    document.fonts?.ready?.then(fitTitles).catch(() => undefined);

    gsap.set(titles[0], { opacity: 1, scale: 1 });
    gsap.set(titles[1], { opacity: 0, scale: 0.98 });
    gsap.set(titles[2], { opacity: 0, scale: 0.98 });

    // Longer pin so each beat reveals slowly while scrolling.
    const pinTrigger = ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${window.innerHeight * 4.2}`,
      pin: true,
      pinSpacing: true,
    });

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: stickySection,
        start: "top top",
        end: `+=${window.innerHeight * 3.6}`,
        scrub: 0.65,
      },
    });

    masterTimeline
      .to(titles[0], { opacity: 0, scale: 0.98, duration: 0.35, ease: "power2.out" }, 1.0)
      .to(titles[1], { opacity: 1, scale: 1, duration: 0.35, ease: "power2.in" }, 1.25)
      .to(titles[1], { opacity: 0, scale: 0.98, duration: 0.35, ease: "power2.out" }, 2.35)
      .to(titles[2], { opacity: 1, scale: 1, duration: 0.35, ease: "power2.in" }, 2.6);

    const handleResize = () => {
      fitTitles();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);
    const ro = new ResizeObserver(fitTitles);
    ro.observe(stage);

    return () => {
      pinTrigger.kill();
      masterTimeline.scrollTrigger?.kill();
      masterTimeline.kill();
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
    };
  }, [stickyLine1, stickyLine2, stickyLine3]);

  // Watermark choreography: opens as primary type on its own stage, recedes
  // to a subtle backdrop while project cards ride over it, then swells back
  // to primary once the list has passed. An IntersectionObserver watches the
  // band the sticky title occupies (~30%–52% of the viewport), so it stays
  // in sync with lazy-loaded images and works even when rAF is throttled;
  // the easing itself is a CSS transition.
  useEffect(() => {
    const section = homeWorkRef.current;
    const text = section?.querySelector(".home-work-watermark-text");
    if (!section || !text) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      text.classList.add("is-subtle");
      return undefined;
    }

    const items = Array.from(section.querySelectorAll(".home-work-item"));
    if (!items.length) return undefined;

    const inBand = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        });
        text.classList.toggle("is-subtle", inBand.size > 0);
      },
      // Watermark band: sticky top is 42vh desktop / 38vh mobile
      { rootMargin: "-30% 0% -48% 0%", threshold: 0 },
    );
    items.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [projects.length, selectsLabel]);

  // Dynamically fit long project titles into their boxes (letter-count aware).
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".home-work-title"));
    if (!nodes.length) return undefined;

    const fitAll = () => {
      nodes.forEach((el) => {
        fitBlockToBox(el, {
          minPx: 15,
          maxPx: 28,
          step: 0.55,
          lineHeight: 1.28,
          letterSpacing: "0.01em",
          maxWidthPx: el.parentElement?.clientWidth || undefined,
        });
      });
    };

    fitAll();
    document.fonts?.ready?.then(fitAll).catch(() => undefined);
    window.addEventListener("resize", fitAll);
    return () => window.removeEventListener("resize", fitAll);
  }, [projects]);

  const hireLabel = user?.openToHire ? "Open to hire" : "Portfolio";
  const headlineLabel = fitSummary(headline || "Professional Portfolio", 36);

  return (
    <ReactLenis root>
      <div className="page home">
        <section
          className={`hero ${nameFitClass}${photoUrl ? "" : " hero--no-photo"}${
            parts.isSingle ? " hero--solo" : ""
          }`}
        >
          <div className="hero-copy">
            <p className="primary sm hero-kicker">{headlineLabel}</p>

            <div className="hero-name">
              {parts.isSingle || !lastName ? (
                <div className="hero-name-line">
                  <FitText text={displayName} className="hero-name-text" minPx={28} />
                </div>
              ) : (
                <>
                  <div className="hero-name-line">
                    <FitText text={firstName} className="hero-name-text" minPx={28} />
                  </div>
                  <div className="hero-name-line">
                    <FitText text={lastName} className="hero-name-text hero-name-text--last" minPx={28} />
                  </div>
                </>
              )}
            </div>

            {summary && (
              <p className="hero-lede secondary">{fitSummary(summary, 140)}</p>
            )}

            <div className="hero-actions">
              <Link to="/portfolio" className="btn">
                View Portfolio
              </Link>
              <Link to="/contact" className="btn btn--ghost">
                Contact
              </Link>
              {user?.openToHire && (
                <Link to="/hire-me" className="btn btn--ghost">
                  Hire Me
                </Link>
              )}
            </div>
          </div>

          <div className="hero-portrait" aria-hidden={!photoUrl}>
            {photoUrl ? (
              <div className="hero-portrait-frame">
                <img src={photoUrl} alt={user?.name || ""} />
              </div>
            ) : (
              <div className="hero-portrait-frame hero-portrait-frame--fallback">
                <span>{(firstName || "B").charAt(0)}</span>
              </div>
            )}
          </div>
        </section>

        <section ref={stickyTitlesRef} className="sticky-titles">
          <div className="sticky-titles-nav">
            <Link to="/portfolio" className="primary sm">
              Portfolio
            </Link>
            <Link to="/contact" className="primary sm">
              Let’s Connect
            </Link>
          </div>

          <div className="sticky-titles-stage">
            {[stickyLine1, stickyLine2, stickyLine3].map((line, i) => (
              <div className="sticky-copy-slot" key={i}>
                <h2
                  ref={(el) => {
                    titlesRef.current[i] = el;
                  }}
                  className={`sticky-copy ${stickyCopyTier(line)}`}
                >
                  {line}
                </h2>
              </div>
            ))}
          </div>

          <div className="sticky-titles-footer">
            <p className="primary sm sticky-meta" title={headline || undefined}>
              {headlineLabel}
            </p>
            <p className="primary sm sticky-meta">{hireLabel}</p>
          </div>
        </section>

        {projects.length > 0 && (
          <section ref={homeWorkRef} className={`home-work ${nameFitClass || ""}`}>
            <p className="primary sm home-work-kicker">Selected Work</p>

            {/* Sticky title — opens as primary type on its own stage, recedes
                while cards ride over it, then returns as the section releases */}
            <div className="home-work-watermark" aria-hidden="true">
              <div className="home-work-watermark-inner">
                <FitText
                  text={selectsLabel}
                  className="home-work-watermark-text"
                  minPx={28}
                />
              </div>
            </div>

            <div className="home-work-foreground">
              <div className="home-work-list">
                {projects.map((work, index) => {
                  const title = work.title || "Untitled project";
                  const titleTier =
                    title.length > 72 ? "title-xl" : title.length > 42 ? "title-lg" : "title-md";
                  const hasImage = Boolean(work.images?.[0]);
                  return (
                    <Link
                      to={`/project/${work.id}`}
                      key={work.id || index}
                      className={`home-work-item ${titleTier}${hasImage ? "" : " home-work-item--text"}`}
                    >
                      <div className="home-work-item-copy">
                        <p className="primary sm">
                          {`${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`}
                        </p>
                        <div className="home-work-title-box">
                          <h3 className="home-work-title">{title}</h3>
                        </div>
                        {(work.category || work.techStack) && (
                          <p className="primary sm home-work-meta">
                            {work.category || work.techStack}
                          </p>
                        )}
                      </div>
                      {hasImage && (
                        <div className="home-work-item-media">
                          <img src={work.images[0]} alt="" loading="lazy" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="home-cta-band">
          <Link to="/portfolio" className="btn">
            View Portfolio
          </Link>
          <Link to="/contact" className="btn btn--ghost">
            Contact
          </Link>
          {user?.openToHire && (
            <Link to="/hire-me" className="btn btn--ghost">
              Hire Me
            </Link>
          )}
        </section>

        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
