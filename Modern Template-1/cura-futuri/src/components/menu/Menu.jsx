import React, { useEffect, useRef, useState } from "react";
import "./menu.css";

import { Link } from "react-router-dom";
import gsap from "gsap";
import { useDisplayProfile } from "../../utils/profileHelper";

const Menu = () => {
  const { handleLabel, photoUrl, projectEntries, socials, ownerEmail } =
    useDisplayProfile();

  const menuLinks = [
    { path: "/", label: "Home" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/contact", label: "Contact" },
    { path: "/hire-me", label: "Hire Me" },
  ];

  const menuContainer = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuAnimation = useRef();
  const menuLinksAnimation = useRef();

  const toggleMenu = () => {
    document.querySelector(".hamburger-icon")?.classList.toggle("active");
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    if (!isMenuOpen) return;
    document.querySelector(".hamburger-icon")?.classList.remove("active");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    gsap.set(".menu-link-item-holder", { y: 125 });
    gsap.set(".menu-footer", { opacity: 0, y: 24 });

    menuAnimation.current = gsap.timeline({ paused: true }).to(".menu", {
      duration: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power4.inOut",
    });

    menuLinksAnimation.current = gsap
      .timeline({ paused: true })
      .to(".menu-link-item-holder", {
        y: 0,
        duration: 1.25,
        stagger: 0.075,
        ease: "power3.inOut",
        delay: 0.125,
      })
      .to(
        ".menu-footer",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.8",
      );
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      menuAnimation.current?.play();
      menuLinksAnimation.current?.play();
      document.body.style.overflow = "hidden";
    } else {
      menuAnimation.current?.reverse();
      menuLinksAnimation.current?.reverse();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && isMenuOpen) closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    const previewContainer = document.querySelector(".link-preview-img");
    const menuLinkItems = document.querySelectorAll(".menu-link-item");
    if (!previewContainer || !menuLinkItems.length) return undefined;

    const projectImages = (projectEntries || []).flatMap((p) => p.images || []);
    const linkImages = menuLinks.map(
      (_, i) => projectImages[i % Math.max(projectImages.length, 1)] || photoUrl || "",
    );

    let lastHoveredIndex = null;
    const handlers = [];

    menuLinkItems.forEach((item, index) => {
      const handleMouseOver = () => {
        if (index === lastHoveredIndex || !linkImages[index]) return;
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("bind-new-img");
        const img = document.createElement("img");
        img.src = linkImages[index];
        img.alt = "";
        imgContainer.appendChild(img);
        previewContainer.appendChild(imgContainer);

        gsap.to(imgContainer, {
          top: "0%",
          left: "0%",
          rotate: 0,
          duration: 1.25,
          ease: "power3.out",
          onComplete: () => {
            gsap.delayedCall(2, () => {
              const allImgContainers = previewContainer.querySelectorAll(".bind-new-img");
              if (allImgContainers.length > 1) {
                Array.from(allImgContainers)
                  .slice(0, -1)
                  .forEach((container) => container.remove());
              }
            });
          },
        });

        lastHoveredIndex = index;
      };

      item.addEventListener("mouseover", handleMouseOver);
      handlers.push({ item, handleMouseOver });
    });

    return () => {
      handlers.forEach(({ item, handleMouseOver }) => {
        item.removeEventListener("mouseover", handleMouseOver);
      });
    };
  }, [photoUrl, projectEntries]);

  return (
    <div className="menu-container" ref={menuContainer}>
      <div className="menu-bar">
        <div className="menu-logo" onClick={closeMenu}>
          <Link to="/">{handleLabel}</Link>
        </div>
        <div className="menu-actions">
          <div className="contact-btn">
            <div className="btn">
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div className="menu-toggle">
            <button
              className="hamburger-icon"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            />
          </div>
        </div>
      </div>
      <div className="menu" aria-hidden={!isMenuOpen}>
        {photoUrl && (
          <div className="link-preview-img" aria-hidden="true">
            <img src={photoUrl} alt="" />
          </div>
        )}
        <div className="menu-col">
          <div className="menu-sub-col">
            <div className="menu-links">
              {menuLinks.map((link, index) => (
                <div key={link.path} className="menu-link-item" onClick={toggleMenu}>
                  <div className="menu-link-item-holder">
                    <Link className="menu-link" to={link.path}>
                      <span className="menu-link-index">0{index + 1}</span>
                      {link.label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="menu-footer">
          {ownerEmail && (
            <a className="menu-meta-link" href={`mailto:${ownerEmail}`} onClick={closeMenu}>
              {ownerEmail}
            </a>
          )}
          {socials?.length > 0 && (
            <div className="menu-socials">
              {socials.map((social) => (
                <a
                  key={`${social.label}-${social.url}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
