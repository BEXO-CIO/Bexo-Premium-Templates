import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import gsap from "gsap";

import Transition from "../../components/transition/Transition";
import Lightbox from "../../components/lightbox/Lightbox";
import { useDisplayProfile } from "../../utils/profileHelper";
import "./portfolio.css";

const SectionLabel = ({ children, count }) => (
  <div className="portfolio-label">
    <span className="portfolio-label-text">{children}</span>
    <i className="portfolio-label-line" aria-hidden="true" />
    {typeof count === "number" && count > 0 && (
      <em className="portfolio-label-count">{String(count).padStart(2, "0")}</em>
    )}
  </div>
);

const LinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FileIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M6 1V8M6 8L3.5 5.5M6 8L8.5 5.5M2 10.5H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <rect x="1" y="2.5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 3.5L6 6.8L10.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1.5" y="4" width="11" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 4V2.8C5 2.36 5.36 2 5.8 2H8.2C8.64 2 9 2.36 9 2.8V4" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 7H12.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const CapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M1 5.2L7 2.5L13 5.2L7 7.9L1 5.2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M3.6 6.4V9.4C3.6 9.4 4.9 10.8 7 10.8C9.1 10.8 10.4 9.4 10.4 9.4V6.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const AwardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="5.2" r="3.4" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 8.2L4.2 12L7 10.6L9.8 12L9 8.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AssetActions = ({ link, linkLabel = "Open link", pdfs = [] }) => {
  if (!link && !pdfs.length) return null;
  return (
    <div className="portfolio-actions">
      {link && (
        <a className="portfolio-btn portfolio-btn--solid" href={link} target="_blank" rel="noopener noreferrer">
          <LinkIcon />
          <span>{linkLabel}</span>
        </a>
      )}
      {pdfs.map((pdf) => (
        <a
          key={pdf.url}
          className="portfolio-btn"
          href={pdf.url}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          <FileIcon />
          <span>{pdf.name || "Download PDF"}</span>
        </a>
      ))}
    </div>
  );
};

const MediaGallery = ({ images = [], title, onOpen, variant = "default" }) => {
  if (!images.length) return null;
  const [cover, ...rest] = images;
  return (
    <div className={`portfolio-media portfolio-media--${variant}`}>
      <button
        type="button"
        className="portfolio-media-cover"
        onClick={() => onOpen(images, 0, title)}
        aria-label={`View ${title || "images"} (${images.length} image${images.length > 1 ? "s" : ""})`}
      >
        <img src={cover} alt={title || "Project image"} loading="lazy" />
        <span className="portfolio-media-count">
          {images.length > 1 ? `View all ${images.length}` : "View"}
        </span>
      </button>
      {rest.length > 0 && (
        <div className="portfolio-media-thumbs">
          {rest.slice(0, 4).map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              className="portfolio-media-thumb"
              onClick={() => onOpen(images, idx + 1, title)}
              aria-label={`View image ${idx + 2} of ${title || "gallery"}`}
            >
              <img src={src} alt="" loading="lazy" />
              {idx === 3 && rest.length > 4 && (
                <span className="portfolio-media-more">+{rest.length - 4}</span>
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
    skillEntries,
    ownerEmail,
    socials,
    photoUrl,
    headline,
    summary,
    resumeUrl,
  } = useDisplayProfile();

  const aboutEntry = aboutEntries?.[0] || {};
  const headerReveal = useRef();
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (images, startIndex, title) =>
    setLightbox({ images, startIndex, title });

  const SKILL_CATEGORY_LABELS = [
    { id: "technical", label: "Technical" },
    { id: "tools", label: "Tools" },
    { id: "soft", label: "Soft" },
    { id: "languages", label: "Languages" },
  ];

  useEffect(() => {
    headerReveal.current = gsap
      .timeline()
      .from(".portfolio-hero .portfolio-clip > *", {
        yPercent: 110,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      })
      .from(
        ".portfolio-section",
        {
          opacity: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.4",
      );

    return () => headerReveal.current?.kill();
  }, []);

  const hasAnyContent =
    aboutEntries?.length ||
    educationEntries?.length ||
    experienceEntries?.length ||
    projectEntries?.length ||
    certificateEntries?.length ||
    achievementEntries?.length ||
    researchEntries?.length ||
    skillEntries?.length;

  return (
    <div className="portfolio page">
      <div className="container">
        <section className="portfolio-hero">
          <div className="portfolio-clip">
            <p className="portfolio-hero-kicker">Portfolio</p>
          </div>
          <div className="portfolio-clip">
            <h1>{user?.name || "Selected Work"}</h1>
          </div>
          <div className="portfolio-clip">
            <p className="portfolio-lead">
              {headline || summary || "Selected work, experience, and credentials."}
            </p>
          </div>
        </section>

        {(profile?.bio || aboutEntry.bio || aboutEntry.description || photoUrl) && (
          <section className="portfolio-section portfolio-section--about" id="about">
            <div className="portfolio-about-grid">
              <div className="portfolio-about-copy">
                <SectionLabel>About</SectionLabel>
                <h3 className="portfolio-about-greeting">
                  Hello, I&rsquo;m {user?.name || "here"}
                </h3>
                <p className="portfolio-about-bio">
                  {aboutEntry.bio || aboutEntry.description || profile?.bio}
                </p>
                {profile?.careerGoal &&
                  profile.careerGoal !== (aboutEntry.bio || aboutEntry.description) && (
                    <p className="portfolio-muted">{profile.careerGoal}</p>
                  )}
                {aboutEntry.currentStatus && (
                  <p className="portfolio-status">
                    <BriefcaseIcon />
                    <span>{aboutEntry.currentStatus}</span>
                  </p>
                )}
                <div className="portfolio-about-meta">
                  {ownerEmail && (
                    <a className="portfolio-chip" href={`mailto:${ownerEmail}`}>
                      <MailIcon />
                      {ownerEmail}
                    </a>
                  )}
                  {socials?.map((social) => (
                    <a
                      key={`${social.label}-${social.url}`}
                      className="portfolio-chip"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                      <LinkIcon />
                    </a>
                  ))}
                </div>
                {resumeUrl && (
                  <AssetActions pdfs={[{ url: resumeUrl, name: "Download Resume" }]} />
                )}
              </div>
              {photoUrl && (
                <div className="portfolio-portrait">
                  <img src={photoUrl} alt={user?.name || "Portrait"} />
                </div>
              )}
            </div>
          </section>
        )}

        {experienceEntries?.length > 0 && (
          <section className="portfolio-section" id="experience">
            <div className="portfolio-row">
              <div className="portfolio-col portfolio-col--label">
                <SectionLabel count={experienceEntries.length}>
                  <BriefcaseIcon /> Experience
                </SectionLabel>
              </div>
              <div className="portfolio-col">
                <div className="portfolio-list">
                  {experienceEntries.map((exp) => (
                    <article
                      className="portfolio-list-item portfolio-list-item--stack"
                      key={exp.id || `${exp.company}-${exp.role}`}
                    >
                      <div className="portfolio-list-head">
                        <div>
                          <h4>{exp.role}</h4>
                          <p className="portfolio-org">{exp.company}</p>
                        </div>
                        <p className="portfolio-list-meta">
                          {exp.duration ||
                            [exp.startDate || exp.startYear, exp.endDate || exp.endYear]
                              .filter(Boolean)
                              .join(" — ")}
                        </p>
                      </div>
                      {(exp.responsibilities?.length > 0 || exp.description) && (
                        <ul className="portfolio-bullets">
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
          <section className="portfolio-section" id="education">
            <div className="portfolio-row">
              <div className="portfolio-col portfolio-col--label">
                <SectionLabel count={educationEntries.length}>
                  <CapIcon /> Education
                </SectionLabel>
              </div>
              <div className="portfolio-col">
                <div className="portfolio-list">
                  {educationEntries.map((edu) => (
                    <article className="portfolio-list-item" key={edu.id || edu.institution}>
                      <div>
                        <h4>{edu.degree}</h4>
                        <p className="portfolio-org">{edu.institution || edu.school}</p>
                      </div>
                      <div className="portfolio-list-meta">
                        <p>
                          {edu.duration ||
                            edu.year ||
                            [edu.startYear, edu.endYear].filter(Boolean).join(" — ")}
                        </p>
                        {edu.grade && <p>{edu.grade}</p>}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {projectEntries?.length > 0 && (
          <section className="portfolio-section portfolio-section--projects" id="projects">
            <div className="portfolio-marquee" aria-hidden="true">
              <Marquee speed={40}>
                <h2>Selected Projects — Selected Projects — </h2>
              </Marquee>
            </div>
            <div className="portfolio-projects">
              {projectEntries.map((project, index) => (
                <article
                  className={`portfolio-project${index % 2 === 1 ? " portfolio-project--flip" : ""}`}
                  key={project.id || project.title}
                >
                  <div className="portfolio-project-media-col">
                    <MediaGallery
                      images={project.images}
                      title={project.title}
                      onOpen={openLightbox}
                    />
                  </div>
                  <div className="portfolio-project-copy">
                    <div className="portfolio-project-head">
                      <span className="portfolio-project-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="portfolio-kicker">
                        {[project.category, project.role, project.year]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <h3>{project.title}</h3>
                    {project.description && <p>{project.description}</p>}
                    {project.techStack && (
                      <div className="portfolio-tags">
                        {project.techStack
                          .split(/[,|]/)
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                      </div>
                    )}
                    <AssetActions
                      link={project.link}
                      linkLabel="View project"
                      pdfs={project.pdfs}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {certificateEntries?.length > 0 && (
          <section className="portfolio-section" id="certificates">
            <div className="portfolio-row">
              <div className="portfolio-col portfolio-col--label">
                <SectionLabel count={certificateEntries.length}>
                  <AwardIcon /> Certificates
                </SectionLabel>
              </div>
              <div className="portfolio-col">
                <div className="portfolio-card-grid">
                  {certificateEntries.map((cert) => (
                    <article className="portfolio-card" key={cert.id || cert.title}>
                      {cert.images?.length > 0 && (
                        <MediaGallery
                          images={cert.images}
                          title={cert.title || cert.name}
                          onOpen={openLightbox}
                          variant="card"
                        />
                      )}
                      <div className="portfolio-card-body">
                        <h4>{cert.title || cert.name}</h4>
                        {cert.issuer && <p className="portfolio-org">{cert.issuer}</p>}
                        {cert.date && <p className="portfolio-list-meta">{cert.date}</p>}
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
          <section className="portfolio-section" id="achievements">
            <div className="portfolio-row">
              <div className="portfolio-col portfolio-col--label">
                <SectionLabel count={achievementEntries.length}>
                  <AwardIcon /> Achievements
                </SectionLabel>
              </div>
              <div className="portfolio-col">
                <div className="portfolio-list">
                  {achievementEntries.map((item) => (
                    <article
                      className="portfolio-list-item portfolio-list-item--stack"
                      key={item.id || item.title}
                    >
                      <div className="portfolio-list-head">
                        <div>
                          <h4>{item.title}</h4>
                          <p className="portfolio-org">
                            {[item.awarder || item.organization, item.project]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <p className="portfolio-list-meta">{item.year || item.date}</p>
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

        {skillEntries?.length > 0 && (
          <section className="portfolio-section" id="skills">
            <div className="portfolio-row">
              <div className="portfolio-col portfolio-col--label">
                <SectionLabel count={skillEntries.length}>Skills</SectionLabel>
              </div>
              <div className="portfolio-col">
                <div className="portfolio-skills">
                  {SKILL_CATEGORY_LABELS.map((cat) => {
                    const group = skillEntries.filter(
                      (s) => (s.category || "technical") === cat.id,
                    );
                    if (!group.length) return null;
                    return (
                      <div className="portfolio-skills-group" key={cat.id}>
                        <p className="portfolio-skills-label">{cat.label}</p>
                        <div className="portfolio-tags">
                          {group.map((skill) => (
                            <span key={skill.id || skill.name}>{skill.name}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {researchEntries?.length > 0 && (
          <section className="portfolio-section" id="research">
            <div className="portfolio-row">
              <div className="portfolio-col portfolio-col--label">
                <SectionLabel count={researchEntries.length}>Research</SectionLabel>
              </div>
              <div className="portfolio-col">
                <div className="portfolio-list">
                  {researchEntries.map((item) => (
                    <article
                      className="portfolio-list-item portfolio-list-item--stack"
                      key={item.id || item.title}
                    >
                      <div className="portfolio-list-head">
                        <div>
                          <h4>{item.title}</h4>
                          <p className="portfolio-org">
                            {item.publication || item.journal || item.organization}
                          </p>
                          {item.authors && <p className="portfolio-muted">{item.authors}</p>}
                        </div>
                        <p className="portfolio-list-meta">{item.year || item.date}</p>
                      </div>
                      <AssetActions link={item.link} linkLabel="Read publication" pdfs={item.pdfs} />
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {!hasAnyContent && (
          <section className="portfolio-section">
            <div className="portfolio-empty">
              <h3>Portfolio content is being prepared.</h3>
              <p>Check back soon, or reach out directly.</p>
              <Link className="hero-btn" to="/contact">
                Contact
              </Link>
            </div>
          </section>
        )}
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.startIndex}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

export default Transition(Portfolio);
