import React from "react";
import { useProfile } from "../../utils/profileHelper";

import "./footer.css";

const Footer = () => {
  const { user } = useProfile();
  
  return (
    <div className="footer">
      <div className="container">
        <div className="footer-col">
          <div className="footer-item">
            <a href="#">Getting Started</a>
          </div>
          <div className="footer-item">
            <a href="#">Style Guide</a>
          </div>
          <div className="footer-item">
            <a href="#">Licensing</a>
          </div>
          <div className="footer-item">
            <a href="#">Changelog</a>
          </div>
          <div className="footer-item">
            <a href="#">Terms</a>
          </div>
          <div className="footer-item">
            <a href="/resume.pdf" download={`${user.name}_Resume.pdf`}>Download Resume</a>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-item">
            <a href="#">Twitter</a>
          </div>
          <div className="footer-item">
            <a href="#">Dribbble</a>
          </div>
          <div className="footer-item">
            <a href="#">Behance</a>
          </div>
          <div className="footer-item">
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} {user.name}. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
