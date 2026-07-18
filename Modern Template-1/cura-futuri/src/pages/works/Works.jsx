import React, { useRef, useEffect } from "react";
import "./works.css";

import Transition from "../../components/transition/Transition";
import { Link } from "react-router-dom";

import Marquee from "react-fast-marquee";
import MagneticButton from "../../components/magneticbutton/MagneticButton";
import gsap from "gsap";
import { useProfile } from "../../utils/profileHelper";

const Works = () => {
  const workCopyReveal = useRef();
  const { sections } = useProfile();
  const projects = sections?.projects?.entries || [];

  useEffect(() => {
    workCopyReveal.current = gsap.timeline({ paused: true }).to("h1", {
      top: "0",
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.35,
    });

    workCopyReveal.current.play();
  }, []);

  let lastHoveredIndex = null;

  const handleResetPreview = () => {
    gsap.to(".project-preview img", {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        lastHoveredIndex = -1;
      },
    });
  };

  const handleMouseOver = (index, imageUrl) => {
    const projectPreviewContainer = document.querySelector(".project-preview");
    if (!projectPreviewContainer) return;

    if (index !== lastHoveredIndex) {
      const img = document.createElement("img");
      img.src = imageUrl;
      projectPreviewContainer.appendChild(img);

      gsap.to(img, {
        opacity: 1,
        duration: 0.3,
        onComplete: () => {
          const allPrevImages = projectPreviewContainer.querySelectorAll("img");

          if (allPrevImages.length > 1) {
            Array.from(allPrevImages)
              .slice(0, -1)
              .forEach((img) => {
                setTimeout(() => {
                  img.remove();
                }, 1000);
              });
          }
        },
      });

      lastHoveredIndex = index;
    }
  };

  useEffect(() => {
    // Cleanup if component unmounts
    return () => {
      const projectPreviewContainer = document.querySelector(".project-preview");
      if (projectPreviewContainer) {
        projectPreviewContainer.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="works page">
      <div className="project-preview"></div>
      <div className="container">
        <section
          className="works-hero"
          onMouseOver={() => {
            handleResetPreview();
          }}
        >
          <div className="work-copy-wrapper">
            <h1>CASES</h1>
          </div>
          <div className="work-copy-wrapper">
            <h1>2018 • 2021</h1>
          </div>
        </section>

        <section className="project-list">
          {projects.map((project, index) => {
            const isLeft = index % 2 === 0; // Even indexes are on the left, odd on the right
            const imageUrl = project.images?.[0] || "";
            
            return (
              <div className="project-list-row" key={project.id || index}>
                {isLeft ? (
                  <>
                    <div className="project-list-col">
                      <div
                        className="project-item"
                        onMouseOver={() => handleMouseOver(index, imageUrl)}
                      >
                        {imageUrl && (
                          <div className="project-img">
                            <Link to={`/projects/${project.id}`}>
                              <img src={imageUrl} alt={project.title} />
                            </Link>
                          </div>
                        )}
                        <div className="project-copy copy-pos-right">
                          <h2>{project.title}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="project-list-col whitespace-col"></div>
                  </>
                ) : (
                  <>
                    <div className="project-list-col whitespace-col"></div>
                    <div className="project-list-col">
                      <div
                        className="project-item"
                        onMouseOver={() => handleMouseOver(index, imageUrl)}
                      >
                        {imageUrl && (
                          <div className="project-img">
                            <Link to={`/projects/${project.id}`}>
                              <img src={imageUrl} alt={project.title} />
                            </Link>
                          </div>
                        )}
                        <div className="project-copy copy-pos-left">
                          <h2>{project.title}</h2>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </section>

        <div
          className="works-marquee"
          onMouseOver={() => {
            handleResetPreview();
          }}
        >
          <Marquee>
            <h1>
              Transforming Ideas Into Immersive Digital Experiences • Motion Design • Creative Direction
            </h1>
          </Marquee>
        </div>

        <div
          className="magnetic-btn"
          onMouseOver={() => {
            handleResetPreview();
          }}
        >
          <MagneticButton />
        </div>
      </div>
    </div>
  );
};

export default Transition(Works);
