import React, { useEffect, useRef } from "react";
import "./sample-project.css";

import Transition from "../../components/transition/Transition";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { useProfile } from "../../utils/profileHelper";

const SampleProject = () => {
  const { id } = useParams();
  const { sections } = useProfile();
  const projects = sections?.projects?.entries || [];

  // Find the selected project or fall back to the first one
  const project = projects.find((p) => p.id === id) || projects[0];

  const nextProjectPreview = useRef();
  const nextProjectPreviewBg = useRef();

  const handleNextProjectHover = () => {
    nextProjectPreview.current.play();
    nextProjectPreviewBg.current.play();
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const nextProjectContainer = document.querySelector(
      ".next-project-preview"
    );
    if (!nextProjectContainer) return;

    gsap.to(".next-project-preview", {
      x: clientX - nextProjectContainer.offsetWidth / 2,
      y: clientY - nextProjectContainer.offsetHeight / 2,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleNextProjectHoverOut = () => {
    nextProjectPreview.current.reverse();
    nextProjectPreviewBg.current.reverse();
  };

  useEffect(() => {
    nextProjectPreview.current = gsap
      .timeline({ paused: true })
      .to(".next-project-preview", {
        duration: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "power4.inOut",
      });

    nextProjectPreviewBg.current = gsap
      .timeline({ paused: true })
      .to(".nextProjectPreviewBg", {
        opacity: 1,
        duration: 0.3,
      });

    return () => {
      if (nextProjectPreview.current) nextProjectPreview.current.kill();
      if (nextProjectPreviewBg.current) nextProjectPreviewBg.current.kill();
    };
  }, [id]);

  if (!project) {
    return (
      <div className="project page">
        <div className="container">
          <h1>Project not found</h1>
          <p><Link to="/works">Back to works</Link></p>
        </div>
      </div>
    );
  }

  // Find the next project in the list
  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  const heroImage = project.images?.[0] || "";
  const secondImage = project.images?.[1] || "";
  const thirdImage = project.images?.[2] || "";
  const fourthImage = project.images?.[3] || "";
  const fifthImage = project.images?.[4] || "";

  const nextProjectImage = nextProject?.images?.[0] || "";

  return (
    <div className="project page">
      {heroImage && (
        <section className="project-hero">
          <img src={heroImage} alt={project.title} />
        </section>
      )}

      {nextProjectImage && (
        <div className="nextProjectPreviewBg">
          <img src={nextProjectImage} alt={nextProject?.title} />
        </div>
      )}

      <div className="container">
        <section className="project-title">
          <h1>{project.title}</h1>
          <p>{project.techStack} • {project.category}</p>
        </section>

        <section className="project-brief">
          <h2>{project.description}</h2>
        </section>

        <section className="project-description">
          <div className="project-row">
            <div className="project-col">
              <div className="project-sub-col">
                <p>
                  <span>Year</span>
                </p>
                <p>{project.year || "2024"}</p>
              </div>
              {project.credits && (
                <div className="project-sub-col">
                  <p>
                    <span>Credits</span>
                  </p>
                  {project.credits.client && <p>Client: {project.credits.client}</p>}
                  {project.credits.creativeDirection && <p>Creative Direction: {project.credits.creativeDirection}</p>}
                  {project.credits.artDirector && <p>Art Director: {project.credits.artDirector}</p>}
                  {project.credits.producer && <p>Producer: {project.credits.producer}</p>}
                  {project.role && <p>Role: {project.role}</p>}
                </div>
              )}
            </div>
            <div className="project-col">
              <p>
                <span>Details & Link</span>
              </p>
              <p style={{ marginBottom: "1em" }}>
                This project showcases high performance and quality implementation, built with care. Explore the code repository or live link below:
              </p>
              {project.link && (
                <p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                    View Project Repository / Site
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="project-images">
          {(secondImage || thirdImage) && (
            <div className="project-img-row">
              {secondImage && (
                <div className="project-img">
                  <img src={secondImage} alt="" />
                </div>
              )}
              {thirdImage && (
                <div className="project-img">
                  <img src={thirdImage} alt="" />
                </div>
              )}
            </div>
          )}
          {(fourthImage || fifthImage) && (
            <div className="project-img-row">
              {fourthImage && (
                <div className="project-img">
                  <img src={fourthImage} alt="" />
                </div>
              )}
              {fifthImage && (
                <div className="project-img">
                  <img src={fifthImage} alt="" />
                </div>
              )}
            </div>
          )}
        </section>

        {nextProject && (
          <section className="next-project">
            <div className="next-project-preview">
              {nextProjectImage && <img src={nextProjectImage} alt="" />}
            </div>
            <div className="next-project-copy">
              <p>
                <span>Next Project</span>
              </p>
              <h1
                onMouseOver={() => {
                  handleNextProjectHover();
                  document.addEventListener("mousemove", handleMouseMove);
                }}
                onMouseOut={() => {
                  handleNextProjectHoverOut();
                  document.removeEventListener("mousemove", handleMouseMove);
                }}
              >
                <Link to={`/projects/${nextProject.id}`}>{nextProject.title}</Link>
              </h1>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Transition(SampleProject);
