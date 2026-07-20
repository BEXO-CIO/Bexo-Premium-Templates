import React from "react";
import "./Footer.css";

import { Link } from "react-router-dom";
import FitText from "../FitText/FitText";
import { useDisplayProfile, splitDisplayName } from "../../utils/profileHelper";
import bexoLogo from "../../assets/bexo-logo.png";

const Footer = () => {
  const { user, ownerEmail, resumeUrl, nameParts, nameFitClass } = useDisplayProfile();
  const parts = nameParts || splitDisplayName(user?.name);
  const year = new Date().getFullYear();
  const emailLocal = ownerEmail?.split("@")[0];
  const emailDomain = ownerEmail?.split("@")[1];
  const firstName = parts.firstName || "Portfolio";
  const lastName = parts.lastName || "";

  return (
    <div className={`footer ${nameFitClass || ""}`}>
      <div className="footer-row footer-row--top">
        <div className="footer-contact">
          <h3>
            Let’s Collaborate
            {ownerEmail ? (
              <>
                <br />
                <span className="footer-email">
                  {emailLocal}
                  <span>@</span>
                  {emailDomain}
                </span>
              </>
            ) : (
              <>
                <br />
                Get in touch
              </>
            )}
          </h3>

          <p className="secondary">
            Open to creative collaborations and new opportunities. Reach out anytime.
          </p>

          <Link to="/contact" className="btn">
            Get in Touch
          </Link>
        </div>

        <div className="footer-nav">
          <Link to="/" className="footer-nav-item">
            <span>Home</span>
            <span>&#8594;</span>
          </Link>

          <Link to="/portfolio" className="footer-nav-item">
            <span>Portfolio</span>
            <span>&#8594;</span>
          </Link>

          <Link to="/contact" className="footer-nav-item">
            <span>Contact</span>
            <span>&#8594;</span>
          </Link>

          {user?.openToHire && (
            <Link to="/hire-me" className="footer-nav-item">
              <span>Hire Me</span>
              <span>&#8594;</span>
            </Link>
          )}

          {resumeUrl && (
            <a
              href={resumeUrl}
              download={`${user?.name || "User"}_Resume.pdf`}
              className="footer-nav-item"
            >
              <span>Resume</span>
              <span>&#8594;</span>
            </a>
          )}
        </div>
      </div>

      <div className="footer-row footer-row--bottom">
        <div className={`footer-header${parts.isSingle || !lastName ? " footer-header--solo" : ""}`}>
          {parts.isSingle || !lastName ? (
            <div className="footer-name-line">
              <FitText text={firstName} className="footer-name" minPx={28} />
            </div>
          ) : (
            <>
              <div className="footer-name-line">
                <FitText text={firstName} className="footer-name" minPx={28} />
              </div>
              <div className="footer-name-line">
                <FitText text={lastName} className="footer-name footer-name--last" minPx={24} />
              </div>
            </>
          )}
        </div>

        <div className="footer-copyright-line">
          <p className="primary sm footer-copy">
            &copy; {year} BEXO FROM Ace Digital. All rights reserved.
          </p>
          <a
            className="footer-bexo"
            href="https://mybexo.cyou"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Built with BEXO"
          >
            <img src={bexoLogo} alt="" width="14" height="14" />
            <span>Built with BEXO</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
