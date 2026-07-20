import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactLenis from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Transition from "../../components/Transition/Transition";
import FitText, { fitSummary } from "../../components/FitText/FitText";
import Footer from "../../components/Footer/Footer";
import Lightbox from "../../components/Lightbox/Lightbox";
import { useDisplayProfile } from "../../utils/profileHelper";

import "./Portfolio.css";

gsap.registerPlugin(ScrollTrigger);

const SectionLabel = ({ children, count }) => (
  <div className="pf-label">
    <span className="pf-label-text">{children}</span>
    <i className="pf-label-line" aria-hidden="true" />
    {typeof count === "number" && count > 0 && (
      <em className="pf-label-count">{String(count).padStart(2, "0")}</em>
    )}
  </div>
);

const tidyPdfLabel = (name) => {
  const raw = String(name || "").trim();
  if (!raw) return "Download PDF";
  // Storage keys / long uploaded filenames → short label
  if (raw.length > 36 || /^\d{10,}-/.test(raw) || /[a-z0-9]{8,}-/i.test(raw)) {
    return "Download PDF";
  }
  return raw.replace(/\.pdf$/i, "") || "Download PDF";
};

const AssetActions = ({ link, linkLabel = "Open link", pdfs = [], to }) => {
  if (!link && !pdfs.length && !to) return null;
  return (
    <div className="pf-actions">
      {to && (
        <Link className="btn" to={to}>
          {linkLabel}
        </Link>
      )}
      {link && (
        <a className="btn btn--ghost" href={link} target="_blank" rel="noopener noreferrer">
          {linkLabel}
        </a>
      )}
      {pdfs.map((pdf) => (
        <a
          key={pdf.url}
          className="btn btn--ghost"
          href={pdf.url}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          {tidyPdfLabel(pdf.name)}
        </a>
      ))}
    </div>
  );
};

const MediaGallery = ({ images = [], title, onOpen, variant = "default" }) => {
  if (!images.length) return null;
  const [cover, ...rest] = images;
  return (
    <div className={`pf-media pf-media--${variant}`}>
      <button
        type="button"
        className="pf-media-cover"
        onClick={() => onOpen(images, 0, title)}
        aria-label={`View ${title || "images"} (${images.length} image${images.length > 1 ? "s" : ""})`}
      >
        <img src={cover} alt={title || "Project image"} loading="lazy" />
        <span className="pf-media-count">
          {images.length > 1 ? `View all ${images.length}` : "View"}
        </span>
      </button>
      {rest.length > 0 && (
        <div className="pf-media-thumbs">
          {rest.slice(0, 4).map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              className="pf-media-thumb"
              onClick={() => onOpen(images, idx + 1, title)}
              aria-label={`View image ${idx + 2} of ${title || "gallery"}`}
            >
              <img src={src} alt="" loading="lazy" />
              {idx === 3 && rest.length > 4 && (
                <span className="pf-media-more">+{rest.length - 4}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Portfolio = () => {
  const {
    user,
    profile,
    aboutEntries,
    educationEntries,
    experienceEntries,
    projectEntries,
    certificateEntries,
    achievementEntries,
    researchEntries,
    ownerEmail,
    socials,
    photoUrl,
    headline,
    summary,
    resumeUrl,
    nameFitClass,
  } = useDisplayProfile();

  const aboutEntry = aboutEntries?.[0] || {};
  const pageRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (images, startIndex, title) =>
    setLightbox({ images, startIndex, title });

  const hasAnyContent =
    aboutEntries?.length ||
    educationEntries?.length ||
    experienceEntries?.length ||
    projectEntries?.length ||
    certificateEntries?.length ||
    achievementEntries?.length ||
    researchEntries?.length ||
    profile?.bio ||
    photoUrl;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pf-hero .pf-clip > *", {
        yPercent: 110,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.utils.toArray(".pf-section").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 36,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      gsap.utils.toArray(".pf-project").forEach((project, i) => {
        const media = project.querySelector(".pf-project-media-col");
        const copy = project.querySelector(".pf-project-copy");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: project,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });
        if (media) {
          tl.from(media, {
            opacity: 0,
            x: i % 2 === 1 ? 40 : -40,
            duration: 0.9,
            ease: "power3.out",
          });
        }
        if (copy) {
          tl.from(
            copy,
            {
              opacity: 0,
              y: 28,
              duration: 0.75,
              ease: "power3.out",
            },
            "-=0.55",
          );
        }
      });
    }, pageRef);

    return () => ctx.revert();
  }, [
    experienceEntries?.length,
    educationEntries?.length,
    projectEntries?.length,
    certificateEntries?.length,
    achievementEntries?.length,
    researchEntries?.length,
  ]);

  return (
    <ReactLenis root>
      <div ref={pageRef} className={`page portfolio-page ${nameFitClass || ""}`}>
        <section className="pf-hero">
          <div className="pf-clip">
            <p className="primary sm pf-kicker">Portfolio</p>
          </div>
          <div className="pf-clip pf-hero-title">
            <FitText
              text={user?.name || "Selected Work"}
              className="pf-hero-h1"
              minPx={28}
            />
          </div>
          <div className="pf-clip">
            <p className="secondary pf-lead">
              {fitSummary(
                headline || summary || "Selected work, experience, and credentials.",
                140,
              )}
            </p>
          </div>
        </section>

        {(profile?.bio ||
          aboutEntry.bio ||
          aboutEntry.description ||
          photoUrl) && (
          <section className="pf-section pf-section--about" id="about">
            <div className="pf-about-grid">
              <div className="pf-about-copy">
                <SectionLabel>About</SectionLabel>
                <h3 className="pf-about-greeting">
                  Hello, I&rsquo;m {user?.name || "here"}
                </h3>
                <p className="secondary pf-about-bio">
                  {aboutEntry.bio || aboutEntry.description || profile?.bio}
                </p>
                {profile?.careerGoal &&
                  profile.careerGoal !==
                    (aboutEntry.bio || aboutEntry.description || profile?.bio) && (
                    <p className="secondary pf-muted">
                      {fitSummary(profile.careerGoal, 200)}
                    </p>
                  )}
                {aboutEntry.currentStatus && (
                  <p className="primary sm pf-status">{aboutEntry.currentStatus}</p>
                )}
                <div className="pf-about-meta">
                  {ownerEmail && (
                    <a className="pf-chip" href={`mailto:${ownerEmail}`}>
                      {ownerEmail}
                    </a>
                  )}
                  {socials?.map((social) => (
                    <a
                      key={`${social.label}-${social.url}`}
                      className="pf-chip"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
                {resumeUrl && (
                  <AssetActions pdfs={[{ url: resumeUrl, name: "Download Resume" }]} />
                )}
              </div>
              {photoUrl && (
                <div className="pf-portrait">
                  <img src={photoUrl} alt={user?.name || "Portrait"} />
                </div>
              )}
            </div>
          </section>
        )}

        {experienceEntries?.length > 0 && (
          <section className="pf-section" id="experience">
            <div className="pf-row">
              <div className="pf-col pf-col--label">
                <SectionLabel count={experienceEntries.length}>Experience</SectionLabel>
              </div>
              <div className="pf-col">
                <div className="pf-list">
                  {experienceEntries.map((exp) => (
                    <article
                      className="pf-list-item pf-list-item--stack"
                      key={exp.id || `${exp.company}-${exp.role}`}
                    >
                      <div className="pf-list-head">
                        <div>
                          <h4>{exp.role}</h4>
                          <p className="primary sm pf-org">{exp.company}</p>
                        </div>
                        <p className="primary sm pf-list-meta">
                          {exp.duration ||
                            [exp.startDate || exp.startYear, exp.endDate || exp.endYear]
                              .filter(Boolean)
                              .join(" — ")}
                        </p>
                      </div>
                      {(exp.responsibilities?.length > 0 || exp.description) && (
                        <ul className="pf-bullets">
                          {(exp.responsibilities?.length
                            ? exp.responsibilities
                            : String(exp.description || "")
                                .split("\n")
                                .filter(Boolean)
                          ).map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {educationEntries?.length > 0 && (
          <section className="pf-section" id="education">
            <div className="pf-row">
              <div className="pf-col pf-col--label">
                <SectionLabel count={educationEntries.length}>Education</SectionLabel>
              </div>
              <div className="pf-col">
                <div className="pf-list">
                  {educationEntries.map((edu) => (
                    <article
                      className="pf-list-item"
                      key={edu.id || edu.institution}
                    >
                      <div>
                        <h4>{edu.degree}</h4>
                        <p className="primary sm pf-org">
                          {edu.institution || edu.school}
                        </p>
                      </div>
                      <div className="pf-list-meta-block">
                        <p className="primary sm pf-list-meta">
                          {edu.duration ||
                            edu.year ||
                            [edu.startYear, edu.endYear].filter(Boolean).join(" — ")}
                        </p>
                        {edu.grade && (
                          <p className="primary sm pf-list-meta">{edu.grade}</p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {projectEntries?.length > 0 && (
          <section className="pf-section pf-section--projects" id="projects">
            <div className="pf-projects-head">
              <SectionLabel count={projectEntries.length}>Selected Projects</SectionLabel>
              <div className="pf-marquee" aria-hidden="true">
                <div className="pf-marquee-track">
                  <span>Selected Projects — </span>
                  <span>Selected Projects — </span>
                  <span>Selected Projects — </span>
                  <span>Selected Projects — </span>
                </div>
              </div>
            </div>
            <div className="pf-projects">
              {projectEntries.map((project, index) => (
                <article
                  className={`pf-project${index % 2 === 1 ? " pf-project--flip" : ""}`}
                  key={project.id || project.title}
                >
                  <div className="pf-project-media-col">
                    {project.images?.length > 0 ? (
                      <MediaGallery
                        images={project.images}
                        title={project.title}
                        onOpen={openLightbox}
                      />
                    ) : (
                      <div className="pf-media-placeholder">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                      </div>
                    )}
                  </div>
                  <div className="pf-project-copy">
                    <div className="pf-project-head">
                      <span className="pf-project-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="primary sm pf-project-kicker">
                        {[project.category, project.role, project.year]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <h3>{project.title}</h3>
                    {project.description && (
                      <p className="secondary">{project.description}</p>
                    )}
                    {project.techStack && (
                      <div className="pf-tags">
                        {project.techStack
                          .split(/[,|]/)
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                      </div>
                    )}
                    <div className="pf-actions">
                      {project.id && (
                        <Link className="btn" to={`/project/${project.id}`}>
                          Open Project
                        </Link>
                      )}
                      {project.link && (
                        <a
                          className="btn btn--ghost"
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live link
                        </a>
                      )}
                      {(project.pdfs || []).map((pdf) => (
                        <a
                          key={pdf.url}
                          className="btn btn--ghost"
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          {tidyPdfLabel(pdf.name)}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {certificateEntries?.length > 0 && (
          <section className="pf-section" id="certificates">
            <div className="pf-row">
              <div className="pf-col pf-col--label">
                <SectionLabel count={certificateEntries.length}>Certificates</SectionLabel>
              </div>
              <div className="pf-col">
                <div className="pf-card-grid">
                  {certificateEntries.map((cert) => (
                    <article className="pf-card" key={cert.id || cert.title || cert.name}>
                      {cert.images?.length > 0 && (
                        <MediaGallery
                          images={cert.images}
                          title={cert.title || cert.name}
                          onOpen={openLightbox}
                          variant="card"
                        />
                      )}
                      <div className="pf-card-body">
                        <h4>{cert.title || cert.name}</h4>
                        {cert.issuer && (
                          <p className="primary sm pf-org">{cert.issuer}</p>
                        )}
                        {cert.date && (
                          <p className="primary sm pf-list-meta">{cert.date}</p>
                        )}
                        <AssetActions
                          link={cert.credentialLink}
                          linkLabel="View credential"
                          pdfs={cert.pdfs}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {achievementEntries?.length > 0 && (
          <section className="pf-section" id="achievements">
            <div className="pf-row">
              <div className="pf-col pf-col--label">
                <SectionLabel count={achievementEntries.length}>Achievements</SectionLabel>
              </div>
              <div className="pf-col">
                <div className="pf-list">
                  {achievementEntries.map((item) => (
                    <article
                      className="pf-list-item pf-list-item--stack"
                      key={item.id || item.title}
                    >
                      <div className="pf-list-head">
                        <div>
                          <h4>{item.title}</h4>
                          <p className="primary sm pf-org">
                            {[item.awarder || item.organization, item.project]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <p className="primary sm pf-list-meta">
                          {item.year || item.date}
                        </p>
                      </div>
                      {item.images?.length > 0 && (
                        <MediaGallery
                          images={item.images}
                          title={item.title}
                          onOpen={openLightbox}
                          variant="strip"
                        />
                      )}
                      <AssetActions pdfs={item.pdfs} />
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {researchEntries?.length > 0 && (
          <section className="pf-section" id="research">
            <div className="pf-row">
              <div className="pf-col pf-col--label">
                <SectionLabel count={researchEntries.length}>Research</SectionLabel>
              </div>
              <div className="pf-col">
                <div className="pf-list">
                  {researchEntries.map((item) => (
                    <article
                      className="pf-list-item pf-list-item--stack"
                      key={item.id || item.title}
                    >
                      <div className="pf-list-head">
                        <div>
                          <h4>{item.title}</h4>
                          <p className="primary sm pf-org">
                            {item.publication || item.journal || item.organization}
                          </p>
                          {item.authors && (
                            <p className="secondary pf-muted">{item.authors}</p>
                          )}
                        </div>
                        <p className="primary sm pf-list-meta">
                          {item.year || item.date}
                        </p>
                      </div>
                      <AssetActions
                        link={item.link}
                        linkLabel="Read publication"
                        pdfs={item.pdfs}
                      />
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {!hasAnyContent && (
          <section className="pf-section">
            <div className="pf-empty">
              <h3>Portfolio content is being prepared.</h3>
              <p className="secondary">Check back soon, or reach out directly.</p>
              <Link className="btn" to="/contact">
                Contact
              </Link>
            </div>
          </section>
        )}

        <Footer />
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.startIndex}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </ReactLenis>
  );
};

export default Transition(Portfolio);
