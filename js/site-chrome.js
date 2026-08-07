(function () {
  const script = document.currentScript;
  const base = script?.dataset.base || "";
  const active = script?.dataset.active || "";

  function asset(path) {
    return base + path;
  }

  function href(path) {
    return base + path;
  }

  function formatLATime(date) {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
      }).format(date);
    } catch (_) {
      return date.toLocaleTimeString();
    }
  }

  function renderHeader() {
    const header = document.querySelector("[data-site-header]");
    if (!header) return;

    header.innerHTML = `
      <a class="logo" href="${href("index.html")}" aria-label="Tc home">
        <svg class="logo-eyes" width="39" height="32" viewBox="0 0 39 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <g class="logo-eye logo-eye--left">
            <path d="M10.6953 1.92029C13.1131 1.92045 15.4356 3.3264 17.207 5.87048C18.9753 8.4102 20.1094 11.9879 20.1094 16.0004C20.1093 20.0128 18.9753 23.5906 17.207 26.1302C15.4357 28.6742 13.113 30.0803 10.6953 30.0804C8.27748 30.0804 5.9541 28.6744 4.18262 26.1302C2.4143 23.5906 1.28034 20.0128 1.28027 16.0004C1.28027 11.9879 2.41436 8.41019 4.18262 5.87048C5.95412 3.32626 8.27742 1.92029 10.6953 1.92029Z" fill="white" stroke="#333333" stroke-width="2.56"/>
            <path d="M13.0188 8.57594C12.8586 7.58206 11.4286 7.58206 11.2685 8.57594L11.0738 9.78427C10.6865 12.1881 9.19105 14.2698 7.03655 15.4042C6.55703 15.6566 6.55703 16.3433 7.03655 16.5957C9.19105 17.7301 10.6865 19.8118 11.0738 22.2156L11.2685 23.424C11.4286 24.4178 12.8586 24.4178 13.0188 23.424L13.2135 22.2156C13.6008 19.8118 15.0962 17.7301 17.2507 16.5957C17.7302 16.3433 17.7302 15.6566 17.2507 15.4042C15.0962 14.2698 13.6008 12.1881 13.2135 9.78426L13.0188 8.57594Z" fill="#333333"/>
          </g>
          <g class="logo-eye logo-eye--right">
            <path d="M27.7054 1.92029C30.1232 1.92045 32.4458 3.3264 34.2172 5.87048C35.9854 8.4102 37.1195 11.9879 37.1195 16.0004C37.1194 20.0128 35.9855 23.5906 34.2172 26.1302C32.4458 28.6742 30.1231 30.0803 27.7054 30.0804C25.2876 30.0804 22.9642 28.6744 21.1927 26.1302C19.4244 23.5906 18.2905 20.0128 18.2904 16.0004C18.2904 11.9879 19.4245 8.41019 21.1927 5.87048C22.9642 3.32626 25.2876 1.92029 27.7054 1.92029Z" fill="white" stroke="#333333" stroke-width="2.56"/>
            <path d="M30.0289 8.57594C29.8688 7.58206 28.4388 7.58206 28.2786 8.57594L28.084 9.78427C27.6966 12.1881 26.2012 14.2698 24.0467 15.4042C23.5672 15.6566 23.5672 16.3433 24.0467 16.5957C26.2012 17.7301 27.6966 19.8118 28.084 22.2156L28.2786 23.424C28.4388 24.4178 29.8688 24.4178 30.0289 23.424L30.2236 22.2156C30.6109 19.8118 32.1064 17.7301 34.2609 16.5957C34.7404 16.3433 34.7404 15.6566 34.2609 15.4042C32.1064 14.2698 30.6109 12.1881 30.2236 9.78426L30.0289 8.57594Z" fill="#333333"/>
          </g>
        </svg>
      </a>
      <div class="nav-cluster">
        <button
          class="nav-menu-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="site-primary-nav"
          aria-label="Open menu"
        >
          <svg class="nav-menu-icon" width="32" height="32" viewBox="0 0 256 256" fill="none" aria-hidden="true" focusable="false">
            <path d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8ZM40 72h176a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16Zm176 112H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Z" fill="currentColor"/>
          </svg>
        </button>
        <nav class="nav" id="site-primary-nav" aria-label="Primary">
          <a class="${active === "work" ? "active" : ""}" href="${href("index.html")}">Work</a>
          <a class="${active === "play" ? "active" : ""}" href="${href("play.html")}">Play</a>
          <a class="${active === "about" ? "active" : ""}" href="${href("about.html")}">About</a>
        </nav>
      </div>
    `;

    initMobileNav(header);
  }

  function initMobileNav(header) {
    const toggle = header.querySelector(".nav-menu-toggle");
    const nav = header.querySelector("#site-primary-nav");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      header.classList.toggle("is-nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(!header.classList.contains("is-nav-open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("click", (event) => {
      if (!header.classList.contains("is-nav-open")) return;
      if (header.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });

    const mobileNavQuery =
      window.matchMedia && window.matchMedia("(max-width: 700px)");
    if (mobileNavQuery) {
      const onViewportChange = (event) => {
        if (!event.matches) setOpen(false);
      };
      if (typeof mobileNavQuery.addEventListener === "function") {
        mobileNavQuery.addEventListener("change", onViewportChange);
      } else if (typeof mobileNavQuery.addListener === "function") {
        mobileNavQuery.addListener(onViewportChange);
      }
    }
  }

  function initStickyHeader() {
    const header = document.querySelector("[data-site-header]");
    if (!header) return;

    const heroBand = document.querySelector(".hero-band");
    let lastY = window.scrollY;
    let ticking = false;

    const updateSurface = () => {
      // Underline follows scroll-from-top on every page (not hero crossing).
      header.classList.toggle("is-scrolled", window.scrollY > 0);

      if (heroBand) {
        // Home: cream + noise over hero; white once past the hero band.
        const headerBottom = header.getBoundingClientRect().bottom;
        const heroBottom = heroBand.getBoundingClientRect().bottom;
        const pastHero = heroBottom <= headerBottom;
        header.classList.toggle("is-past-hero", pastHero);
        header.classList.toggle("is-home-hero", !pastHero);
      } else {
        // Non-home: always white (never peach/noise).
        header.classList.remove("is-home-hero", "is-past-hero");
      }
    };

    const updateVisibility = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      const nearTop = y <= 8;

      if (nearTop) {
        header.classList.remove("is-hidden");
      } else if (delta > 4) {
        // Scrolling down — hide
        header.classList.add("is-hidden");
      } else if (delta < -4) {
        // Scrolling up — show
        header.classList.remove("is-hidden");
      }

      lastY = y;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateSurface();
        updateVisibility();
        ticking = false;
      });
    };

    updateSurface();
    updateVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateSurface);
  }

  function renderFooter() {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return;

    footer.innerHTML = `
      <div class="footer-left">
        <span>Tianchan Ye</span>
        <span class="sep" aria-hidden="true"></span>
        <a href="mailto:tcyedesign@gmail.com">tcyedesign@gmail.com</a>
        <span class="sep" aria-hidden="true"></span>
        <span class="footer-item">
          <img src="${asset("assets/icons/island-footer.svg")}" alt="">
          Los Angeles
        </span>
        <span class="sep" aria-hidden="true"></span>
        <span class="footer-item">
          <img src="${asset("assets/icons/clock.svg")}" alt="">
          <time data-la-clock datetime=""></time>
        </span>
        <span class="sep" aria-hidden="true"></span>
        <span class="footer-item">
          <img class="sm" src="${asset("assets/icons/copyright.svg")}" alt="">
          2026
        </span>
      </div>
      <div class="footer-social">
        <a href="https://www.linkedin.com/in/tianchanye" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
          <img src="${asset("assets/icons/linkedin.svg")}" alt="">
        </a>
        <a href="https://www.instagram.com/noodle.the.aussie/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
          <img src="${asset("assets/icons/instagram.svg")}" alt="">
        </a>
        <a href="mailto:tcyedesign@gmail.com" aria-label="Email">
          <img src="${asset("assets/icons/envelope.svg")}" alt="">
        </a>
      </div>
    `;

    const clock = footer.querySelector("[data-la-clock]");
    if (!clock) return;

    const tick = () => {
      const now = new Date();
      clock.textContent = formatLATime(now);
      clock.setAttribute("datetime", now.toISOString());
    };
    tick();
    setInterval(tick, 1000);
  }

  renderHeader();
  initStickyHeader();
  renderFooter();
})();

  // Sliding white pill for tab switchers
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function createTabPill(tabsEl, pillClass) {
    let pill = tabsEl.querySelector('.' + pillClass);
    if (!pill) {
      pill = document.createElement('span');
      pill.className = pillClass;
      pill.setAttribute('aria-hidden', 'true');
      tabsEl.prepend(pill);
    }
    return pill;
  }

  function moveTabPill(pill, tab, instant) {
    if (!pill || !tab) return;
    const reduce = prefersReducedMotion.matches || instant;
    if (reduce) {
      pill.style.transition = 'none';
    } else {
      pill.style.transition = '';
    }
    pill.style.width = tab.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
    if (reduce) {
      // Force reflow so a later animated move still transitions.
      void pill.offsetWidth;
      if (!prefersReducedMotion.matches) {
        pill.style.transition = '';
      }
    }
  }

  function initSlidingTabs(tabsEl, tabSelector, activeClass, pillClass) {
    if (!tabsEl) return null;
    const tabs = tabsEl.querySelectorAll(tabSelector);
    if (!tabs.length) return null;

    const pill = createTabPill(tabsEl, pillClass);

    function sync(instant) {
      const active = tabsEl.querySelector(tabSelector + '.' + activeClass) || tabs[0];
      moveTabPill(pill, active, instant);
    }

    sync(true);
    window.addEventListener('resize', () => sync(true));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => sync(true));
    }

    return { pill, tabs, sync, moveTo: (tab, instant) => moveTabPill(pill, tab, instant) };
  }

  // Visual System & Craft carousel — duplicated track for seamless left crop on desktop
  document.querySelectorAll('[data-craft-carousel]').forEach((root) => {
    const viewport = root.querySelector('.craft-viewport');
    const track = root.querySelector('.craft-track');
    const prev = root.querySelector('[data-craft-prev]');
    const next = root.querySelector('[data-craft-next]');
    if (!viewport || !track) return;

    const mobileQuery =
      window.matchMedia && window.matchMedia('(max-width: 1100px)');

    let busy = false;
    let index = 0;
    let setCount = 0;
    let cloned = false;
    const durationMs = 350;
    const reducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    track.querySelectorAll('img').forEach((img) => {
      img.loading = 'eager';
      img.decoding = 'async';
    });

    function isMobileCraft() {
      return Boolean(mobileQuery && mobileQuery.matches);
    }

    function originals() {
      return [...track.querySelectorAll('.craft-card:not([data-craft-clone])')];
    }

    function ensureClones() {
      if (cloned || isMobileCraft()) return;
      const cards = originals();
      setCount = cards.length;
      if (setCount < 2) return;
      cards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('data-craft-clone', 'true');
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
        track.appendChild(clone);
      });
      cloned = true;
    }

    function removeClones() {
      track.querySelectorAll('.craft-card[data-craft-clone]').forEach((el) => el.remove());
      cloned = false;
      setCount = originals().length;
      index = 0;
    }

    function step() {
      const first = track.querySelector('.craft-card');
      if (!first) return 0;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return first.offsetWidth + gap;
    }

    function applyIndex(animate) {
      const distance = step() * index;
      if (!animate || reducedMotion) {
        track.style.transition = 'none';
        track.style.transform = `translate3d(${-distance}px, 0, 0)`;
        void track.offsetWidth;
        track.style.transition = '';
        return;
      }
      track.style.transition = `transform ${durationMs}ms ease`;
      track.style.transform = `translate3d(${-distance}px, 0, 0)`;
    }

    function wrapIfNeeded() {
      if (!setCount) return;
      if (index >= setCount) {
        index -= setCount;
        applyIndex(false);
      } else if (index < 0) {
        index += setCount;
        applyIndex(false);
      }
    }

    function afterSlide(callback) {
      if (reducedMotion) {
        callback();
        return;
      }
      window.setTimeout(callback, durationMs + 40);
    }

    function goNext() {
      if (isMobileCraft() || busy) return;
      ensureClones();
      if (setCount < 2) return;
      busy = true;
      index += 1;
      applyIndex(!reducedMotion);
      afterSlide(() => {
        wrapIfNeeded();
        busy = false;
      });
    }

    function goPrev() {
      if (isMobileCraft() || busy) return;
      ensureClones();
      if (setCount < 2) return;
      busy = true;

      if (index === 0) {
        // Jump to the clone set (same pixels) so we can animate backward.
        index = setCount;
        applyIndex(false);
      }

      requestAnimationFrame(() => {
        index -= 1;
        applyIndex(!reducedMotion);
        afterSlide(() => {
          wrapIfNeeded();
          busy = false;
        });
      });
    }

    function syncMode() {
      if (isMobileCraft()) {
        removeClones();
        track.style.transition = 'none';
        track.style.transform = '';
        busy = false;
        if (prev) prev.disabled = true;
        if (next) next.disabled = true;
        return;
      }
      ensureClones();
      if (prev) prev.disabled = false;
      if (next) next.disabled = false;
      applyIndex(false);
    }

    prev && prev.addEventListener('click', goPrev);
    next && next.addEventListener('click', goNext);
    if (mobileQuery) {
      if (typeof mobileQuery.addEventListener === 'function') {
        mobileQuery.addEventListener('change', syncMode);
      } else if (typeof mobileQuery.addListener === 'function') {
        mobileQuery.addListener(syncMode);
      }
    }
    syncMode();
  });

  // Legacy Visual Section Tabs (if present)
  const visualSlides = document.querySelectorAll('.visual-slide');
  const visualTabs = document.querySelectorAll('.visual-tab');
  const visualTabsEl = document.querySelector('.visual-tabs');
  const visualPill = initSlidingTabs(visualTabsEl, '.visual-tab', 'active', 'visual-tab-indicator');

  if (visualSlides.length > 0 && visualTabs.length > 0) {
    visualTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetIndex = tab.dataset.index;

        visualTabs.forEach((t) => {
          t.classList.toggle('active', t === tab);
        });

        if (visualPill) visualPill.moveTo(tab, false);

        visualSlides.forEach((slide) => {
          slide.classList.toggle('active', slide.dataset.index === targetIndex);
        });
      });
    });
  }

  // Case study Updated / Legacy (and similar) compare tabs
  document.querySelectorAll('[data-case-compare]').forEach((root) => {
    const tabsEl = root.querySelector('.case-compare-tabs');
    const tabs = root.querySelectorAll('.case-compare-tab');
    const panels = root.querySelectorAll('[data-compare-panel]');
    if (!tabs.length || !panels.length) return;

    const comparePill = initSlidingTabs(tabsEl, '.case-compare-tab', 'is-active', 'case-compare-pill');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.compare;

        tabs.forEach((t) => {
          const on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });

        if (comparePill) comparePill.moveTo(tab, false);

        panels.forEach((panel) => {
          const on = panel.dataset.comparePanel === key;
          panel.classList.toggle('is-active', on);
          panel.hidden = !on;
        });
      });
    });
  });
