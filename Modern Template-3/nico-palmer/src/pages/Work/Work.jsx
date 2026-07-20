import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Work.css";

import gsap from "gsap";
import { useProfile } from "../../utils/profileHelper";
import Transition from "../../components/Transition/Transition";

const Work = () => {
  const { sections } = useProfile();
  const projects = sections?.projects?.entries || [];
  
  const [activeProject, setActiveProject] = useState(projects[0] || {});
  const carouselDescriptionRef = useRef(null);
  const carouselTitleRef = useRef(null);
  const workSliderImgRef = useRef(null);
  const descriptionTextRef = useRef(null);
  const titleTextRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  // If activeProject is empty (due to async loading), sync it once projects is populated
  useEffect(() => {
    if (projects.length > 0 && !activeProject.id) {
      setActiveProject(projects[0]);
    }
  }, [projects, activeProject.id]);

  const animateCarouselInfo = (newProject) => {
    const tl = gsap.timeline();

    tl.to([descriptionTextRef.current, titleTextRef.current], {
      yPercent: -100,
      duration: 0.75,
      stagger: 0.25,
      ease: "power4.in",
    });

    const newImageUrl = newProject.images?.[0] || "";

    tl.to(
      imageRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          if (descriptionTextRef.current) descriptionTextRef.current.remove();
          if (titleTextRef.current && titleTextRef.current.parentNode) {
            titleTextRef.current.parentNode.remove();
          }
          if (imageRef.current) imageRef.current.remove();

          const newDescriptionEl = document.createElement("p");
          newDescriptionEl.className = "primary sm";
          newDescriptionEl.textContent = newProject.description;

          const titleContainer = document.createElement("div");
          titleContainer.className = "project-title-container";
          titleContainer.style.cursor = "pointer";

          const newTitleEl = document.createElement("h1");
          newTitleEl.textContent = newProject.title;

          titleContainer.onclick = () => navigate(`/project/${newProject.id}`);

          titleContainer.appendChild(newTitleEl);

          const newImageEl = document.createElement("img");
          newImageEl.src = newImageUrl;
          newImageEl.alt = newProject.title;

          gsap.set(newDescriptionEl, { yPercent: 100 });
          gsap.set(newTitleEl, { yPercent: 100 });
          gsap.set(newImageEl, { opacity: 0 });

          carouselDescriptionRef.current.appendChild(newDescriptionEl);
          carouselTitleRef.current.appendChild(titleContainer);
          workSliderImgRef.current.appendChild(newImageEl);

          descriptionTextRef.current = newDescriptionEl;
          titleTextRef.current = newTitleEl;
          imageRef.current = newImageEl;

          const inTl = gsap.timeline();

          inTl.to(newImageEl, {
            opacity: 1,
            duration: 0.75,
            ease: "power2.out",
          });

          inTl.to(
            [newDescriptionEl, newTitleEl],
            {
              yPercent: 0,
              duration: 0.75,
              stagger: 0.25,
              ease: "power4.out",
            },
            "-=0.5"
          );
          setActiveProject(newProject);
        },
      },
      "-=0.5"
    );
  };

  useEffect(() => {
    if (
      carouselDescriptionRef.current &&
      carouselTitleRef.current &&
      workSliderImgRef.current &&
      activeProject.id
    ) {
      descriptionTextRef.current =
        carouselDescriptionRef.current.querySelector("p");

      const initialTitleLink = carouselTitleRef.current.querySelector("a");
      if (initialTitleLink) {
        const initialTitle = initialTitleLink.querySelector("h1");

        const titleContainer = document.createElement("div");
        titleContainer.className = "project-title-container";
        titleContainer.style.cursor = "pointer";

        const newTitle = initialTitle.cloneNode(true);
        titleContainer.appendChild(newTitle);

        titleContainer.onclick = () => navigate(`/project/${activeProject.id}`);

        initialTitleLink.parentNode.replaceChild(
          titleContainer,
          initialTitleLink
        );

        titleTextRef.current = newTitle;
      } else {
        titleTextRef.current = carouselTitleRef.current.querySelector("h1");
      }

      imageRef.current = workSliderImgRef.current.querySelector("img");
    }
  }, [navigate, activeProject.id]);

  const handleWorkItemClick = (project) => {
    if (project.id !== activeProject.id) {
      animateCarouselInfo(project);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="page work">
        <div className="container">
          <h1>No projects found</h1>
        </div>
      </div>
    );
  }

  const activeImageUrl = activeProject.images?.[0] || "";

  return (
    <div className="page work">
      <div className="work-carousel">
        <div className="work-slider-img" ref={workSliderImgRef}>
          <img src={activeImageUrl} alt={activeProject.title} />
        </div>

        <div className="work-items-preview-container">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`work-item ${
                activeProject.id === project.id ? "active" : ""
              }`}
              onClick={() => handleWorkItemClick(project)}
            >
              <div className="work-slider-item-img">
                {project.images?.[0] && <img src={project.images[0]} alt={project.title} />}
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-info">
          <div className="carousel-description" ref={carouselDescriptionRef}>
            <p className="primary sm">{activeProject.description}</p>
          </div>
          <div className="carousel-title" ref={carouselTitleRef}>
            <Link to={`/project/${activeProject.id}`}>
              <h1>{activeProject.title}</h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transition(Work);
