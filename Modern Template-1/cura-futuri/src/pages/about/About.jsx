import React from "react";
import "./about.css";

import Transition from "../../components/transition/Transition";
import Faq from "react-faq-component";
import Marquee from "react-fast-marquee";
import MagneticButton from "../../components/magneticbutton/MagneticButton";
import { useProfile } from "../../utils/profileHelper";

const About = () => {
  const { user, profile, sections } = useProfile();

  const aboutEntry = sections?.about?.entries?.[0] || {};
  const contactEntry = sections?.contact?.entries?.[0] || {};
  const achievements = sections?.achievements?.entries || [];
  const research = sections?.research?.entries || [];
  const education = sections?.education?.entries || [];
  const certificates = sections?.certificates?.entries || [];
  const experience = sections?.experience?.entries || [];

  const data = {
    title: "",
    rows: [
      {
        title: "What type of works do you take on?",
        content:
          "I specialize in web interaction and animation design, focusing on creating engaging and dynamic user experiences for websites and web applications. My work encompasses a range of projects, including but not limited to interactive web animations, UI/UX design, motion graphics for online platforms, and custom animations for brand storytelling. I am passionate about bringing brands to life through immersive digital experiences and work with clients across Tech, Education, Entertainment, and eCommerce industries.",
      },
      {
        title: "How do you charge for projects?",
        content:
          "My project pricing is tailored to the specific needs and scope of each project. I typically offer a project-based fee after a thorough discussion about the project's requirements, timelines, and expected deliverables. This approach allows for a clear understanding of the project costs upfront. For larger or more complex projects, I may also work with a phased payment schedule, ensuring transparency and alignment with project milestones.",
      },
      {
        title: "What is your hourly rate?",
        content:
          "While I primarily work with project-based pricing, I understand that some projects may require an hourly or day rate, especially during the initial phases or for ongoing support. My hourly rate is reflecting my expertise and the value I bring to each project. For long-term engagements or larger projects, I am open to discussing a customized rate or retainer model that aligns with the client's needs and project goals.",
      },
    ],
  };

  return (
    <div className="about page">
      <div className="container">
        <section className="about-marquee">
          <Marquee>
            <h1>
              Transforming Your Digital Presence with Unforgettable Web
              Animations.
            </h1>
          </Marquee>
        </section>

        <section className="about-intro">
          <h2>{profile?.bio || "Innovative Web Interaction Animation Designer..."}</h2>
        </section>

        <section className="about-intro-copy">
          <div className="about-row">
            <div className="about-col">
              <p>
                <span>Est. {aboutEntry.estYear || "1997"}</span>
              </p>
            </div>
            <div className="about-col">
              <h3>
                {aboutEntry.bio || "Partners with a broad spectrum of clients in Tech..."}
              </h3>
            </div>
          </div>
        </section>

        <section className="about-portrait">
          <div className="about-row">
            <div className="about-col">
              <p>
                <span>Contact</span>
              </p>
              <br />
              <br />
              <p>
                <span>Email: </span> <span>{contactEntry.email || user?.email || "hello@curafuturi.com"}</span>
              </p>
              <p>
                <span>Phone: </span> <span>{contactEntry.phone || user?.phone || "+1 416 555 1234"}</span>
              </p>
              <p>
                <span>Address: </span>{" "}
                <span>{contactEntry.address || "789 Town Way, Toronto M1A 2B3"}</span>
              </p>

              <br />
              <br />
              <br />
            </div>
            <div className="about-col">
              <div className="about-portrait-img">
                <img src={user?.photoUrl || "/assets/images/home/portrait.jpg"} alt="" />
              </div>

              <div className="faqs">
                <Faq data={data} />
              </div>
            </div>
          </div>
        </section>

        {achievements.length > 0 && (
          <section className="about-awards">
            <div className="about-row">
              <div className="about-col"></div>
              <div className="about-col award-header">
                <p>
                  <span>Honors and Awards</span>
                </p>
              </div>
            </div>

            {achievements.map((award, i) => (
              <div className="about-row award-row" key={i}>
                <div className="about-col">
                  <div className="award-year">
                    <p>{award.year}</p>
                  </div>
                  <div className="award-view">
                    <p>{award.title}</p>
                  </div>
                </div>
                <div className="about-col">
                  <div className="award-info">
                    <p>{award.awarder}</p>
                  </div>
                  <div className="award-project">
                    <p>{award.project}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {research.length > 0 && (
          <section className="about-awards in-press">
            <div className="about-row">
              <div className="about-col"></div>
              <div className="about-col award-header">
                <p>
                  <span>In Press</span>
                </p>
              </div>
            </div>

            {research.map((press, i) => (
              <div className="about-row award-row" key={i}>
                <div className="about-col">
                  <div className="award-year">
                    <p>{press.year}</p>
                  </div>
                  <div className="award-view">
                    <p>{press.authors}</p>
                  </div>
                </div>
                <div className="about-col">
                  <div className="award-info">
                    <p>{press.publication}</p>
                  </div>
                  <div className="award-project">
                    <p>
                      {press.link ? (
                        <a href={press.link} target="_blank" rel="noopener noreferrer">
                          {press.title}
                        </a>
                      ) : (
                        press.title
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {experience.length > 0 && (
          <section className="about-awards in-press">
            <div className="about-row">
              <div className="about-col"></div>
              <div className="about-col award-header">
                <p>
                  <span>Experience</span>
                </p>
              </div>
            </div>

            {experience.map((exp, i) => (
              <div className="about-row award-row" key={i}>
                <div className="about-col">
                  <div className="award-year">
                    <p>{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <div className="award-view">
                    <p>{exp.role}</p>
                  </div>
                </div>
                <div className="about-col">
                  <div className="award-info">
                    <p>{exp.company}</p>
                  </div>
                  <div className="award-project">
                    {exp.responsibilities?.length > 0 && (
                      <p>{exp.responsibilities[0]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="about-awards in-press">
            <div className="about-row">
              <div className="about-col"></div>
              <div className="about-col award-header">
                <p>
                  <span>Education</span>
                </p>
              </div>
            </div>

            {education.map((edu, i) => (
              <div className="about-row award-row" key={i}>
                <div className="about-col">
                  <div className="award-year">
                    <p>{edu.startYear} - {edu.endYear}</p>
                  </div>
                  <div className="award-view">
                    <p>{edu.degree}</p>
                  </div>
                </div>
                <div className="about-col">
                  <div className="award-info">
                    <p>{edu.institution}</p>
                  </div>
                  <div className="award-project">
                    <p>{edu.grade}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {certificates.length > 0 && (
          <section className="about-awards in-press">
            <div className="about-row">
              <div className="about-col"></div>
              <div className="about-col award-header">
                <p>
                  <span>Certificates</span>
                </p>
              </div>
            </div>

            {certificates.map((cert, i) => (
              <div className="about-row award-row" key={i}>
                <div className="about-col">
                  <div className="award-year">
                    <p>{cert.date}</p>
                  </div>
                  <div className="award-view">
                    <p>{cert.name}</p>
                  </div>
                </div>
                <div className="about-col">
                  <div className="award-info">
                    <p>{cert.issuer}</p>
                  </div>
                  <div className="award-project">
                    <p>
                      {cert.credentialLink ? (
                        <a href={cert.credentialLink} target="_blank" rel="noopener noreferrer">
                          View Credential
                        </a>
                      ) : null}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        <section className="about-contact">
          <div className="about-contact-copy">
            <h2>Powered by Your Creativity</h2>
            <p>
              <span>
                For a CV, portfolio, or inquiries, please reach out to{" "}
                {contactEntry.email || user?.email || "hello@curafuturi.com"}
              </span>
            </p>

            <br />
            <p>
              <span>{contactEntry.phone || user?.phone || "+1 416 555 1234"}</span>
            </p>
            {contactEntry.socials && (
              <p>
                <span>
                  {contactEntry.socials.map((s) => s.label).join(" • ")}
                </span>
              </p>
            )}
          </div>
        </section>

        <MagneticButton />
      </div>
    </div>
  );
};

export default Transition(About);
