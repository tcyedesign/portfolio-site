(function () {
  const article = document.querySelector(".case-study");
  if (!article) return;

  const sections = [...article.querySelectorAll(".case-header, .case-section")];
  if (sections.length < 2) return;

  const nav = document.createElement("nav");
  nav.className = "case-progress";
  nav.setAttribute("aria-label", "On this page");

  const ticks = sections.map((section, index) => {
    const heading = section.querySelector("h1, h2, h3");
    const label =
      heading?.textContent.replace(/\s+/g, " ").trim() ||
      (index === 0 ? "Introduction" : `Section ${index + 1}`);

    if (!section.id) {
      section.id = `case-progress-${index}`;
    }

    const tick = document.createElement("a");
    tick.className = "case-progress-tick";
    tick.href = `#${section.id}`;
    tick.setAttribute("aria-label", label);

    const caption = document.createElement("span");
    caption.className = "case-progress-label";
    caption.textContent = label;
    tick.appendChild(caption);

    tick.addEventListener("click", (event) => {
      event.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    nav.appendChild(tick);
    return tick;
  });

  document.body.appendChild(nav);

  const pinToAbout = () => {
    const about = document.querySelector('.site-header .nav a[href*="about.html"]');
    if (!about) return;
    const right = about.getBoundingClientRect().right;
    nav.style.left = `${Math.round(right)}px`;
    nav.style.right = "auto";
    nav.style.transform = "translate(-100%, -50%)";
  };

  const setActive = (activeIndex) => {
    ticks.forEach((tick, index) => {
      const on = index === activeIndex;
      tick.classList.toggle("is-active", on);
      if (on) tick.setAttribute("aria-current", "true");
      else tick.removeAttribute("aria-current");
    });
  };

  const update = () => {
    const marker = window.innerHeight * 0.32;
    let activeIndex = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= marker) activeIndex = index;
    });
    setActive(activeIndex);
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", () => {
    pinToAbout();
    update();
  });
  pinToAbout();
  update();
})();
