import React from "react";
import "./Project.css";

import ParallaxImage from "../../components/ParallaxImage/ParallaxImage";
import AnimatedCopy from "../../components/AnimatedCopy/AnimatedCopy";

import ReactLenis from "lenis/react";
import { useParams, Link } from "react-router-dom";
import { useDisplayProfile } from "../../utils/profileHelper";

import Transition from "../../components/Transition/Transition";

const Project = () => {
  const { id } = useParams();
  const { projectEntries = [] } = useDisplayProfile();
  const projects = projectEntries;

  const project = projects.find((p) => p.id === id) || projects[0];

  if (!project) {
    return (
      <div className="page project">
        <div className="container" style={{ paddingTop: "100px" }}>
          <h1>Project not found</h1>
          <p>
            <Link to="/portfolio">Back to portfolio</Link>
          </p>
        </div>
      </div>
    );
  }

  // Find next project
  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  const bannerImg = project.images?.[0] || "";
  const nextProjectImg = nextProject?.images?.[0] || "";

  return (
    <ReactLenis root>
      <div className="page project">
        <section className="project-header">
          <AnimatedCopy
            delay={1}
            animateOnScroll={false}
            className="primary sm"
          >
            {project.category} • {project.techStack}
          </AnimatedCopy>
          <AnimatedCopy tag="h2" delay={1}>
            {project.title}
          </AnimatedCopy>
        </section>

        {bannerImg && (
          <section className="project-banner-img">
            <div className="project-banner-img-wrapper">
              <ParallaxImage src={bannerImg} alt={project.title} />
            </div>
          </section>
        )}

        <section className="project-details">
          <div className="details">
            <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
              Overview
            </AnimatedCopy>
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              {project.description}
            </AnimatedCopy>
          </div>

          <div className="details">
            <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
              Year
            </AnimatedCopy>
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              {project.year || "2024"}
            </AnimatedCopy>
          </div>

          <div className="details">
            <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
              Category
            </AnimatedCopy>
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              {project.category || "General"}
            </AnimatedCopy>
          </div>

          {project.duration && (
            <div className="details">
              <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
                Duration
              </AnimatedCopy>
              <AnimatedCopy tag="h4" animateOnScroll={true}>
                {project.duration}
              </AnimatedCopy>
            </div>
          )}

          <div className="details">
            <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
              Role
            </AnimatedCopy>
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              {project.role || "Lead Contributor"}
            </AnimatedCopy>
          </div>
        </section>

        {project.images && project.images.length > 1 && (
          <section className="project-images">
            <div className="project-images-container">
              {project.images.slice(1).map((img, i) => (
                <div className="project-img" key={i}>
                  <div className="project-img-wrapper">
                    <ParallaxImage src={img} alt="" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.credits && (
          <section className="project-details">
            {project.credits.client && (
              <div className="details">
                <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
                  Client
                </AnimatedCopy>
                <AnimatedCopy tag="h4" animateOnScroll={true}>
                  {project.credits.client}
                </AnimatedCopy>
              </div>
            )}

            {project.credits.creativeDirection && (
              <div className="details">
                <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
                  Creative Direction
                </AnimatedCopy>
                <AnimatedCopy tag="h4" animateOnScroll={true}>
                  {project.credits.creativeDirection}
                </AnimatedCopy>
              </div>
            )}

            {project.credits.artDirector && (
              <div className="details">
                <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
                  Art Director
                </AnimatedCopy>
                <AnimatedCopy tag="h4" animateOnScroll={true}>
                  {project.credits.artDirector}
                </AnimatedCopy>
              </div>
            )}

            {project.credits.producer && (
              <div className="details">
                <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
                  Producer
                </AnimatedCopy>
                <AnimatedCopy tag="h4" animateOnScroll={true}>
                  {project.credits.producer}
                </AnimatedCopy>
              </div>
            )}

            {project.link && (
              <div className="details">
                <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
                  Link
                </AnimatedCopy>
                <AnimatedCopy tag="h4" animateOnScroll={true}>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                    Launch Project
                  </a>
                </AnimatedCopy>
              </div>
            )}

            {project.pdfs?.length > 0 && (
              <div className="details">
                <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
                  Documents
                </AnimatedCopy>
                <div className="project-pdfs">
                  {project.pdfs.map((pdf) => (
                    <a
                      key={pdf.url}
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="primary sm"
                    >
                      {pdf.name || "Download PDF"}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Always show link/docs even without credits object */}
        {!project.credits && (project.link || project.pdfs?.length > 0) && (
          <section className="project-details">
            {project.link && (
              <div className="details">
                <p className="primary sm">Link</p>
                <h4>
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    Launch Project
                  </a>
                </h4>
              </div>
            )}
            {project.pdfs?.map((pdf) => (
              <div className="details" key={pdf.url}>
                <p className="primary sm">Document</p>
                <h4>
                  <a href={pdf.url} target="_blank" rel="noopener noreferrer" download>
                    {pdf.name || "Download PDF"}
                  </a>
                </h4>
              </div>
            ))}
          </section>
        )}

        {nextProject && (
          <section className="next-project">
            <AnimatedCopy tag="p" animateOnScroll={true} className="primary sm">
              Next
            </AnimatedCopy>
            <AnimatedCopy tag="h3" animateOnScroll={true}>
              <Link to={`/project/${nextProject.id}`}>Next Project</Link>
            </AnimatedCopy>

            {nextProjectImg && (
              <div className="next-project-img">
                <div className="next-project-img-wrapper">
                  <ParallaxImage src={nextProjectImg} alt={nextProject.title} />
                </div>
              </div>
            )}

            <AnimatedCopy tag="h4" animateOnScroll={true}>
              {nextProject.title}
            </AnimatedCopy>
          </section>
        )}
      </div>
    </ReactLenis>
  );
};

export default Transition(Project);
