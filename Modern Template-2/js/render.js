// BEXO Modern Template 2 DOM Dynamic Renderer
function renderTemplate() {
  const profile = window.__BEXO_PROFILE__;
  if (!profile) {
    console.error("BEXO Profile not found");
    return;
  }

  // 1. Helper to resolve deep paths
  function getByPath(obj, path) {
    if (!path) return undefined;
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  // 2. Name details
  const nameParts = (profile.user.name || "").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // 3. Populate simple data-bexo attributes
  document.querySelectorAll("[data-bexo]").forEach((el) => {
    const path = el.getAttribute("data-bexo");
    let val = "";

    if (path === "user.name.first") {
      val = firstName;
    } else if (path === "user.name.last") {
      val = lastName;
    } else if (path === "user.name.br") {
      el.innerHTML = `${firstName}<br />${lastName}`;
      return;
    } else {
      val = getByPath(profile, path);
    }

    if (val === undefined || val === null) return;

    const tagName = el.tagName.toLowerCase();
    if (tagName === "img") {
      el.src = val;
    } else if (tagName === "a") {
      if (path.includes("email")) {
        el.href = `mailto:${val}`;
      } else if (path.includes("phone")) {
        el.href = `tel:${val}`;
      } else {
        el.href = val;
      }
      // If it doesn't have custom content, fill it
      if (!el.textContent.trim()) {
        el.textContent = val;
      }
    } else {
      el.textContent = val;
    }
  });

  // 4. Determine pathname prefix for links based on folder nesting
  const isNested = window.location.pathname.includes("/pages/");
  const isProjectPage = window.location.pathname.includes("/projects/");
  
  let projectLinkPrefix = "./pages/projects/project.html?id=";
  let blogLinkPrefix = "./pages/blogs.html";
  
  if (isProjectPage) {
    projectLinkPrefix = "./project.html?id=";
    blogLinkPrefix = "../blogs.html";
  } else if (isNested) {
    projectLinkPrefix = "./projects/project.html?id=";
    blogLinkPrefix = "./blogs.html";
  }

  // 5. Handle lists
  // Projects List
  const projectsContainer = document.querySelector("[data-bexo-list='projects']");
  if (projectsContainer) {
    projectsContainer.innerHTML = "";
    const projects = profile.sections?.projects?.entries || [];
    projects.forEach((proj, idx) => {
      const slide = document.createElement("section");
      slide.className = "slide";
      
      const link = document.createElement("a");
      link.href = `${projectLinkPrefix}${proj.id}`;
      
      const article = document.createElement("article");
      article.className = "content";
      
      const num = document.createElement("h2");
      num.textContent = idx + 1;
      
      const title = document.createElement("h3");
      title.textContent = proj.title;
      
      const desc = document.createElement("p");
      desc.innerHTML = `${proj.category}<br />${proj.techStack}`;
      
      article.appendChild(num);
      article.appendChild(title);
      article.appendChild(desc);
      link.appendChild(article);
      slide.appendChild(link);
      projectsContainer.appendChild(slide);
    });
  }

  // Awards List
  const awardsContainer = document.querySelector("[data-bexo-list='awards']");
  if (awardsContainer) {
    awardsContainer.innerHTML = "";
    const achievements = profile.sections?.achievements?.entries || [];
    achievements.forEach((award, idx) => {
      const item = document.createElement("div");
      item.className = "award";
      
      const indexDiv = document.createElement("div");
      indexDiv.className = "award-index";
      const indexH4 = document.createElement("h4");
      indexH4.textContent = String.fromCharCode(65 + idx); // A, B, C, D...
      indexDiv.appendChild(indexH4);
      
      const copyDiv = document.createElement("div");
      copyDiv.className = "award-copy";
      const titleDiv = document.createElement("div");
      titleDiv.className = "award-title";
      
      const titleH4 = document.createElement("h4");
      titleH4.textContent = award.title;
      
      const projP = document.createElement("p");
      projP.textContent = award.project;
      
      const awarderP = document.createElement("p");
      awarderP.textContent = award.awarder;
      
      titleDiv.appendChild(titleH4);
      titleDiv.appendChild(projP);
      titleDiv.appendChild(awarderP);
      copyDiv.appendChild(titleDiv);
      
      const yearDiv = document.createElement("div");
      yearDiv.className = "award-year";
      const yearH4 = document.createElement("h4");
      yearH4.textContent = award.year;
      yearDiv.appendChild(yearH4);
      
      item.appendChild(indexDiv);
      item.appendChild(copyDiv);
      item.appendChild(yearDiv);
      awardsContainer.appendChild(item);
    });
  }

  // Experience List
  const experienceContainer = document.querySelector("[data-bexo-list='experience']");
  if (experienceContainer) {
    experienceContainer.innerHTML = "";
    const experiences = profile.sections?.experience?.entries || [];
    experiences.forEach((exp, idx) => {
      const item = document.createElement("div");
      item.className = "award"; // Re-using styling from award
      
      const indexDiv = document.createElement("div");
      indexDiv.className = "award-index";
      const indexH4 = document.createElement("h4");
      indexH4.textContent = String.fromCharCode(65 + idx); // A, B, C, D...
      indexDiv.appendChild(indexH4);
      
      const copyDiv = document.createElement("div");
      copyDiv.className = "award-copy";
      const titleDiv = document.createElement("div");
      titleDiv.className = "award-title";
      
      const titleH4 = document.createElement("h4");
      titleH4.textContent = exp.role;
      
      const projP = document.createElement("p");
      projP.textContent = exp.company;
      
      const awarderP = document.createElement("p");
      awarderP.textContent = exp.responsibilities?.[0] || "";
      
      titleDiv.appendChild(titleH4);
      titleDiv.appendChild(projP);
      titleDiv.appendChild(awarderP);
      copyDiv.appendChild(titleDiv);
      
      const yearDiv = document.createElement("div");
      yearDiv.className = "award-year";
      const yearH4 = document.createElement("h4");
      yearH4.textContent = `${exp.startDate} - ${exp.endDate}`;
      yearDiv.appendChild(yearH4);
      
      item.appendChild(indexDiv);
      item.appendChild(copyDiv);
      item.appendChild(yearDiv);
      experienceContainer.appendChild(item);
    });
  }

  // Education List
  const educationContainer = document.querySelector("[data-bexo-list='education']");
  if (educationContainer) {
    educationContainer.innerHTML = "";
    const educations = profile.sections?.education?.entries || [];
    educations.forEach((edu, idx) => {
      const item = document.createElement("div");
      item.className = "award"; 
      
      const indexDiv = document.createElement("div");
      indexDiv.className = "award-index";
      const indexH4 = document.createElement("h4");
      indexH4.textContent = String.fromCharCode(65 + idx); 
      indexDiv.appendChild(indexH4);
      
      const copyDiv = document.createElement("div");
      copyDiv.className = "award-copy";
      const titleDiv = document.createElement("div");
      titleDiv.className = "award-title";
      
      const titleH4 = document.createElement("h4");
      titleH4.textContent = edu.degree;
      
      const projP = document.createElement("p");
      projP.textContent = edu.institution;
      
      const awarderP = document.createElement("p");
      awarderP.textContent = edu.grade || "";
      
      titleDiv.appendChild(titleH4);
      titleDiv.appendChild(projP);
      titleDiv.appendChild(awarderP);
      copyDiv.appendChild(titleDiv);
      
      const yearDiv = document.createElement("div");
      yearDiv.className = "award-year";
      const yearH4 = document.createElement("h4");
      yearH4.textContent = `${edu.startYear} - ${edu.endYear}`;
      yearDiv.appendChild(yearH4);
      
      item.appendChild(indexDiv);
      item.appendChild(copyDiv);
      item.appendChild(yearDiv);
      educationContainer.appendChild(item);
    });
  }

  // Certificates List
  const certificatesContainer = document.querySelector("[data-bexo-list='certificates']");
  if (certificatesContainer) {
    certificatesContainer.innerHTML = "";
    const certificates = profile.sections?.certificates?.entries || [];
    certificates.forEach((cert, idx) => {
      const item = document.createElement("div");
      item.className = "award"; 
      
      const indexDiv = document.createElement("div");
      indexDiv.className = "award-index";
      const indexH4 = document.createElement("h4");
      indexH4.textContent = String.fromCharCode(65 + idx); 
      indexDiv.appendChild(indexH4);
      
      const copyDiv = document.createElement("div");
      copyDiv.className = "award-copy";
      const titleDiv = document.createElement("div");
      titleDiv.className = "award-title";
      
      const titleH4 = document.createElement("h4");
      titleH4.textContent = cert.name;
      
      const projP = document.createElement("p");
      projP.textContent = cert.issuer;
      
      const awarderP = document.createElement("p");
      if (cert.credentialLink) {
        awarderP.innerHTML = `<a href="${cert.credentialLink}" target="_blank" style="text-decoration: underline; color: inherit;">View Credential</a>`;
      }
      
      titleDiv.appendChild(titleH4);
      titleDiv.appendChild(projP);
      titleDiv.appendChild(awarderP);
      copyDiv.appendChild(titleDiv);
      
      const yearDiv = document.createElement("div");
      yearDiv.className = "award-year";
      const yearH4 = document.createElement("h4");
      yearH4.textContent = cert.date;
      yearDiv.appendChild(yearH4);
      
      item.appendChild(indexDiv);
      item.appendChild(copyDiv);
      item.appendChild(yearDiv);
      certificatesContainer.appendChild(item);
    });
  }

  // Blogs List
  const blogsContainer = document.querySelector("[data-bexo-list='blogs']");
  if (blogsContainer) {
    blogsContainer.innerHTML = "";
    const research = profile.sections?.research?.entries || [];
    research.forEach((paper) => {
      const item = document.createElement("div");
      item.className = "blog-item";
      
      const titleDiv = document.createElement("div");
      titleDiv.className = "blog-title";
      const titleH2 = document.createElement("h2");
      titleH2.textContent = paper.title;
      titleDiv.appendChild(titleH2);
      
      const dataDiv = document.createElement("div");
      dataDiv.className = "blog-data";
      
      const dateDiv = document.createElement("div");
      dateDiv.className = "blog-date";
      const dateP = document.createElement("p");
      dateP.textContent = paper.year;
      dateDiv.appendChild(dateP);
      
      const subDiv = document.createElement("div");
      subDiv.className = "blog-title-sub";
      const subP = document.createElement("p");
      subP.textContent = `${paper.authors} • Published in ${paper.publication}`;
      subDiv.appendChild(subP);
      
      const readDiv = document.createElement("div");
      readDiv.className = "read";
      const readLink = document.createElement("a");
      readLink.href = paper.link || "#";
      readLink.target = "_blank";
      readLink.rel = "noopener noreferrer";
      readLink.textContent = "Read Post";
      readDiv.appendChild(readLink);
      
      dataDiv.appendChild(dateDiv);
      dataDiv.appendChild(subDiv);
      dataDiv.appendChild(readDiv);
      
      item.appendChild(titleDiv);
      item.appendChild(dataDiv);
      blogsContainer.appendChild(item);
    });
  }

  // 6. Handle Project Detail Page (project.html)
  if (window.location.pathname.endsWith("project.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("id");
    
    const projects = profile.sections?.projects?.entries || [];
    const project = projects.find((p) => p.id === projectId) || projects[0];
    
    if (project) {
      // Title
      const h1Primary = document.querySelector(".project-header h1.primary");
      if (h1Primary) {
        h1Primary.innerHTML = `<div class="hr"></div>${project.title}<div class="hr"></div>`;
      }
      
      // Hero Image
      const heroImg = document.querySelector(".project-hero-img img");
      if (heroImg) {
        heroImg.src = project.images?.[0] || "../../assets/portraits/img-7.jpg";
      }
      
      // Roles & Stack
      const descCols = document.querySelectorAll(".project-description .project-desc-col");
      if (descCols.length >= 2) {
        // Roles (1st column)
        const rolesParagraph = descCols[0].querySelector("p");
        if (rolesParagraph) {
          rolesParagraph.innerHTML = `${project.role || "Lead Designer"} <br /> ${project.techStack}`;
        }
        
        // Description (2nd column)
        const descParagraph = descCols[1].querySelector("p");
        if (descParagraph) {
          descParagraph.textContent = project.description;
        }
      }
      
      // Quote (Category)
      const quoteHeader = document.querySelector(".project-quote .quote h2");
      if (quoteHeader) {
        quoteHeader.innerHTML = `&nbsp;&nbsp;&nbsp; ${project.category} <br /> ${project.year || "2024"}`;
      }
      
      // Carousel Images
      const carouselWrap = document.querySelector(".carousel--wrap");
      if (carouselWrap && project.images) {
        carouselWrap.innerHTML = "";
        project.images.forEach((imgUrl) => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "carousel--item";
          const figure = document.createElement("figure");
          const img = document.createElement("img");
          img.src = imgUrl;
          figure.appendChild(img);
          itemDiv.appendChild(figure);
          carouselWrap.appendChild(itemDiv);
        });
      }
      
      // Link to Project Site
      const projectAboutP = document.querySelector(".project-about-copy p");
      if (projectAboutP) {
        if (project.link) {
          projectAboutP.innerHTML = `
            ${project.description}<br /><br />
            <a href="${project.link}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: #fff;">
              Visit Project Repository / Website
            </a>`;
        } else {
          projectAboutP.textContent = project.description;
        }
      }

      // Next Project Link
      const currentIdx = projects.findIndex((p) => p.id === project.id);
      const nextProj = projects[(currentIdx + 1) % projects.length];
      if (nextProj) {
        const nextLink = document.querySelector(".next-project a");
        if (nextLink) {
          nextLink.href = `./project.html?id=${nextProj.id}`;
          const nextH1 = nextLink.querySelector("h1");
          if (nextH1) {
            nextH1.textContent = nextProj.title;
          }
        }
      }
    }
  }

  // 7. Inject Copyright and Resume Button into Footer
  const footerLinks = document.querySelector("footer .footer-links");
  if (footerLinks) {
    const resumeLink = document.createElement("a");
    const resumePrefix = isNested || isProjectPage ? "../" : "./";
    resumeLink.href = `${resumePrefix}resume.pdf`;
    resumeLink.download = `${profile.user.name || "User"}_Resume.pdf`;
    resumeLink.textContent = "Download Resume";
    
    const copyrightText = document.createElement("a"); // styling it like other links
    copyrightText.style.pointerEvents = "none";
    copyrightText.textContent = `© ${new Date().getFullYear()} ${profile.user.name || "Profile"}. All Rights Reserved.`;
    
    footerLinks.appendChild(resumeLink);
    footerLinks.appendChild(copyrightText);
  }
}

document.addEventListener("DOMContentLoaded", renderTemplate);

window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'BEXO_PROFILE_UPDATE') {
    window.__BEXO_PROFILE__ = event.data.profile;
    renderTemplate();
  }
});
