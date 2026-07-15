// setup
const tl = gsap.timeline({ paused: true });
let path = document.querySelector("path");
var spanBefore = CSSRulePlugin.getRule("#hamburger span:before");
var menuAfter = CSSRulePlugin.getRule(".menu-item:after");

gsap.set(spanBefore, { background: "#e4e3db" });
gsap.set(menuAfter, { opacity: 0 });
gsap.set(".menu", { visibility: "hidden" });

// toggle menu
function revealMenu() {
  revealMenuItems();

  const hamburger = document.getElementById("hamburger");
  const toggleBtn = document.getElementById("toggle-btn");

  toggleBtn.onclick = function (e) {
    hamburger.classList.toggle("active");
    tl.reversed(!tl.reversed());
  };
}

revealMenu();

// how to reveal
function revealMenuItems() {
  const start = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
  const end = "M0,1005S175,995,500,995s500,5,500,5V0H0Z";
  const power4 = "power4.inOut";
  const power2 = "power2.inOut";

  // Check if the device width is less than or equal to 900px
  if (window.matchMedia("(max-width: 900px)").matches) {
    tl.to("#hamburger", 1.25, {
      x: 0,
      y: 0,
      ease: power4,
    });

    tl.to("#hamburger span", 1, { background: "#e4e3db", ease: power2 }, "<");
    tl.to(spanBefore, 1, { background: "#e4e3db", ease: power2 }, "<");

    tl.to(
      ".btn .btn-outline",
      1.25,
      {
        x: 0,
        y: 0,
        width: "80px", // Set width to 100px for mobile devices
        height: "80px", // Set height to 100px for mobile devices
        border: "1px solid #e4e3db",
        ease: power4,
      },
      "<"
    );
  } else {
    tl.to("#hamburger", 1.25, {
      marginTop: "-5px",
      x: -40,
      y: 40,
      ease: power4,
    });

    tl.to("#hamburger span", 1, { background: "#e4e3db", ease: power2 }, "<");
    tl.to(spanBefore, 1, { background: "#e4e3db", ease: power2 }, "<");

    tl.to(
      ".btn .btn-outline",
      1.25,
      {
        x: -40,
        y: 40,
        width: "140px", // Set width to 140px for desktop devices
        height: "140px", // Set height to 140px for desktop devices
        border: "1px solid #e4e3db",
        ease: power4,
      },
      "<"
    );
  }

  tl.to(path, 0.8, { attr: { d: start }, ease: "power2.in" }, "<").to(
    path,
    0.8,
    { attr: { d: end }, ease: "power2" },
    "-=0.5"
  );

  tl.to(
    ".logo .logo-wrapper a",
    0.5,
    {
      color: "#e4e3db",
    },
    "<"
  );

  gsap.to(".menu", 0.2, { opacity: 1 }, "<");
  tl.to(".menu", 1, { visibility: "visible" });
  gsap.to(menuAfter, 0.1, { opacity: 1 });

  tl.to(
    ".menu-item > a",
    1,
    {
      top: 0,
      ease: "power3.out",
      stagger: {
        amount: 0.5,
      },
    },
    "-=1"
  ).reverse();
}
