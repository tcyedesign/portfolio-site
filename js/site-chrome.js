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
        <img src="${asset("assets/icons/logo-eyes.svg")}" alt="">
      </a>
      <nav class="nav" aria-label="Primary">
        <a class="${active === "work" ? "active" : ""}" href="${href("index.html")}">Work</a>
        <a class="${active === "play" ? "active" : ""}" href="${href("play.html")}">Play</a>
        <a class="${active === "about" ? "active" : ""}" href="${href("about.html")}">About</a>
      </nav>
    `;
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

  // Visual System & Craft carousel — endless DOM rotate on desktop; vertical stack on mobile
  document.querySelectorAll('[data-craft-carousel]').forEach((root) => {
    const viewport = root.querySelector('.craft-viewport');
    const track = root.querySelector('.craft-track');
    const prev = root.querySelector('[data-craft-prev]');
    const next = root.querySelector('[data-craft-next]');
    if (!viewport || !track) return;

    const mobileQuery =
      window.matchMedia && window.matchMedia('(max-width: 1100px)');

    let busy = false;
    const durationMs = 350;
    const reducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function isMobileCraft() {
      return Boolean(mobileQuery && mobileQuery.matches);
    }

    function step() {
      const first = track.querySelector('.craft-card');
      if (!first) return 0;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return first.getBoundingClientRect().width + gap;
    }

    function snapLeft() {
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';
      void track.offsetWidth;
      track.style.transition = '';
    }

    function resetMobile() {
      track.style.transition = 'none';
      track.style.transform = '';
      busy = false;
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
      const first = track.querySelector('.craft-card');
      if (!first || track.querySelectorAll('.craft-card').length < 2) return;
      busy = true;
      const distance = step();

      if (reducedMotion || distance <= 0) {
        track.appendChild(first);
        snapLeft();
        busy = false;
        return;
      }

      track.style.transition = `transform ${durationMs}ms ease`;
      track.style.transform = `translateX(${-distance}px)`;
      afterSlide(() => {
        track.appendChild(first);
        snapLeft();
        busy = false;
      });
    }

    function goPrev() {
      if (isMobileCraft() || busy) return;
      const cards = track.querySelectorAll('.craft-card');
      if (cards.length < 2) return;
      busy = true;
      const last = cards[cards.length - 1];
      const distance = step();

      if (reducedMotion || distance <= 0) {
        track.insertBefore(last, track.firstChild);
        snapLeft();
        busy = false;
        return;
      }

      track.insertBefore(last, track.firstChild);
      track.style.transition = 'none';
      track.style.transform = `translateX(${-distance}px)`;
      void track.offsetWidth;
      track.style.transition = `transform ${durationMs}ms ease`;
      track.style.transform = 'translateX(0)';
      afterSlide(() => {
        snapLeft();
        busy = false;
      });
    }

    function syncMode() {
      if (isMobileCraft()) {
        resetMobile();
        if (prev) prev.disabled = true;
        if (next) next.disabled = true;
        return;
      }
      if (prev) prev.disabled = false;
      if (next) next.disabled = false;
      snapLeft();
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
