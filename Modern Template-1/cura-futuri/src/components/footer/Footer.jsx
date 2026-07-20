import React from "react";
import { Link } from "react-router-dom";
import { useDisplayProfile } from "../../utils/profileHelper";
import bexoLogo from "../../assets/bexo-logo.png";
import "./footer.css";

const Footer = () => {
  const { user, resumeUrl, socials, ownerEmail } = useDisplayProfile();

  return (
    <div className="footer">
      <div className="container">
        <div className="footer-col">
          <div className="footer-item">
            <Link to="/">Home</Link>
          </div>
          <div className="footer-item">
            <Link to="/portfolio">Portfolio</Link>
          </div>
          <div className="footer-item">
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-item">
            <Link to="/hire-me">Hire Me</Link>
          </div>
          {resumeUrl && (
            <div className="footer-item">
              <a href={resumeUrl} download={`${user?.name || "User"}_Resume.pdf`}>
                Download Resume
              </a>
            </div>
          )}
        </div>
        <div className="footer-col">
          {socials.map((social) => (
            <div className="footer-item" key={`${social.label}-${social.url}`}>
              <a href={social.url} target="_blank" rel="noopener noreferrer">
                {social.label}
              </a>
            </div>
          ))}
          {ownerEmail && (
            <div className="footer-item">
              <a href={`mailto:${ownerEmail}`}>{ownerEmail}</a>
            </div>
          )}
        </div>
      </div>
      <div className="footer-copyright">
        <p>
          &copy; 2026 BEXO From Ace Digital. All rights reserved.
        </p>
        <a
          className="footer-bexo"
          href="https://mybexo.cyou"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Built with BEXO"
        >
          <img src={bexoLogo} alt="" loading="lazy" />
          <span>Built with BEXO</span>
        </a>
      </div>
    </div>
  );
};

export default Footer;
