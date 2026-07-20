import React from "react";
import "./About.css";

import AnimatedCopy from "../../components/AnimatedCopy/AnimatedCopy";
import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";

import ReactLenis from "lenis/react";
import { useProfile } from "../../utils/profileHelper";

import Transition from "../../components/Transition/Transition";

const About = () => {
  const { user, profile, sections } = useProfile();
  const aboutEntry = sections?.about?.entries?.[0] || {};
  const experiences = sections?.experience?.entries || [];
  const educations = sections?.education?.entries || [];
  const certificates = sections?.certificates?.entries || [];
  const achievements = sections?.achievements?.entries || [];
  const research = sections?.research?.entries || [];

  return (
    <ReactLenis root>
      <div className="page about">
        <section className="about-header">
          <h1>Est</h1>
          <h1>{aboutEntry.estYear || "1997"}</h1>
        </section>

        {user?.photoUrl && (
          <section className="about-hero">
            <div className="about-hero-img">
              <img src={user.photoUrl} alt={user?.name} />
            </div>
          </section>
        )}

        <section className="about-me-copy">
          <div className="about-me-copy-wrapper">
            <AnimatedCopy animateOnScroll={true} tag="h3">
              I'm {user?.name || "Nico Palmer"} — {profile?.headline || "a filmmaker..."}
            </AnimatedCopy>

            <AnimatedCopy animateOnScroll={true} tag="h3">
              {profile?.bio || "For me, storytelling is about what those designs make us feel..."}
            </AnimatedCopy>

            {profile?.careerGoal && (
              <AnimatedCopy animateOnScroll={true} tag="h3">
                {profile.careerGoal}
              </AnimatedCopy>
            )}
          </div>
        </section>

        {experiences.length > 0 && (
          <section className="services">
            <div className="services-col">
              {user?.photoUrl && (
                <div className="services-banner">
                  <img src={user.photoUrl} alt="" />
                </div>
              )}
              <p className="primary">Professional Path</p>
            </div>
            <div className="services-col">
              <h4>
                Every project is a chance to explore new visual language, push
                creative boundaries, and solve problems with purpose.
              </h4>

              <div className="services-list">
                {experiences.map((exp, i) => (
                  <div className="service-list-row" key={i}>
                    <div className="service-list-col">
                      <h5>{exp.company}</h5>
                      <p className="primary sm">{exp.startDate} - {exp.endDate}</p>
                    </div>
                    <div className="service-list-col" style={{ paddingLeft: "1.5em" }}>
                      <h6 style={{ fontSize: "1.1em", fontWeight: "600", marginBottom: "0.5em" }}>{exp.role}</h6>
                      <ul style={{ paddingLeft: "1em", listStyle: "disc", lineHeight: "1.6" }}>
                        {exp.responsibilities?.map((resp, ri) => (
                          <li key={ri} style={{ marginBottom: "0.25em" }}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {educations.length > 0 && (
          <section className="services" style={{ marginTop: "4em" }}>
            <div className="services-col">
              <p className="primary">Education</p>
            </div>
            <div className="services-col">
              <div className="services-list">
                {educations.map((edu, i) => (
                  <div className="service-list-row" key={i}>
                    <div className="service-list-col">
                      <h5>{edu.institution}</h5>
                      <p className="primary sm">{edu.startYear} - {edu.endYear}</p>
                    </div>
                    <div className="service-list-col" style={{ paddingLeft: "1.5em" }}>
                      <h6 style={{ fontSize: "1.1em", fontWeight: "600", marginBottom: "0.5em" }}>{edu.degree}</h6>
                      <p>{edu.grade}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {certificates.length > 0 && (
          <section className="services" style={{ marginTop: "4em" }}>
            <div className="services-col">
              <p className="primary">Certificates</p>
            </div>
            <div className="services-col">
              <div className="services-list">
                {certificates.map((cert, i) => (
                  <div className="service-list-row" key={i}>
                    <div className="service-list-col">
                      <h5>{cert.name}</h5>
                      <p className="primary sm">{cert.date}</p>
                    </div>
                    <div className="service-list-col" style={{ paddingLeft: "1.5em" }}>
                      <h6 style={{ fontSize: "1.1em", fontWeight: "600", marginBottom: "0.5em" }}>{cert.issuer}</h6>
                      {cert.credentialLink && (
                        <a href={cert.credentialLink} target="_blank" rel="noopener noreferrer">
                          View Credential
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {achievements.length > 0 && (
          <section className="services" style={{ marginTop: "4em" }}>
            <div className="services-col">
              <p className="primary">Achievements</p>
            </div>
            <div className="services-col">
              <div className="services-list">
                {achievements.map((ach, i) => (
                  <div className="service-list-row" key={i}>
                    <div className="service-list-col">
                      <h5>{ach.title}</h5>
                      <p className="primary sm">{ach.year}</p>
                    </div>
                    <div className="service-list-col" style={{ paddingLeft: "1.5em" }}>
                      <h6 style={{ fontSize: "1.1em", fontWeight: "600", marginBottom: "0.5em" }}>{ach.awarder}</h6>
                      <p>{ach.project}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {research.length > 0 && (
          <section className="services" style={{ marginTop: "4em" }}>
            <div className="services-col">
              <p className="primary">Research & Press</p>
            </div>
            <div className="services-col">
              <div className="services-list">
                {research.map((res, i) => (
                  <div className="service-list-row" key={i}>
                    <div className="service-list-col">
                      <h5>{res.title}</h5>
                      <p className="primary sm">{res.year}</p>
                    </div>
                    <div className="service-list-col" style={{ paddingLeft: "1.5em" }}>
                      <h6 style={{ fontSize: "1.1em", fontWeight: "600", marginBottom: "0.5em" }}>{res.publication}</h6>
                      <p>{res.authors}</p>
                      {res.link && (
                        <a href={res.link} target="_blank" rel="noopener noreferrer">
                          Read More
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="about-banner-img">
          <div className="about-banner-img-wrapper">
            <img src="/about/about-banner.jpg" alt="" />
          </div>
        </section>

        <section className="fav-tools">
          <div className="fav-tools-header">
            <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
              Core Capabilities
            </AnimatedCopy>
            <AnimatedCopy tag="h2" animateOnScroll={true} delay={0.25}>
              Technical Skills
            </AnimatedCopy>
            <AnimatedCopy
              tag="p"
              animateOnScroll={true}
              className="secondary"
              delay={0.5}
            >
              My expertise covers modern frontend tech, interaction tools, and frameworks.
            </AnimatedCopy>
          </div>

          <div className="fav-tools-list">
            <div className="fav-tools-list-row">
              <div className="fav-tool">
                <div className="fav-tool-img">
                  <img src="/about/tool-1.jpg" alt="" />
                </div>
                <h4>React & GSAP</h4>
                <p className="primary sm">Interactive UI</p>
              </div>
              <div className="fav-tool">
                <div className="fav-tool-img">
                  <img src="/about/tool-2.jpg" alt="" />
                </div>
                <h4>Framer Motion</h4>
                <p className="primary sm">Transitions</p>
              </div>
              <div className="fav-tool">
                <div className="fav-tool-img">
                  <img src="/about/tool-3.jpg" alt="" />
                </div>
                <h4>WebGL & CSS Grid</h4>
                <p className="primary sm">Layout Design</p>
              </div>
            </div>
          </div>
        </section>

        <ContactForm />

        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Transition(About);
