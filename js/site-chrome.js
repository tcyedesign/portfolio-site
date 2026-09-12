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

  /** Pacific 24h clock: `14:32:05 PDT` / `… PST` (hero live tag + footer). */
  function formatLATime(date) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      }).formatToParts(date);

      const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
      let hour = get("hour");
      if (hour === "24") hour = "00";
      hour = hour.padStart(2, "0");

      let zone = get("timeZoneName");
      if (zone === "GMT-7" || zone === "UTC-7") zone = "PDT";
      if (zone === "GMT-8" || zone === "UTC-8") zone = "PST";

      return `${hour}:${get("minute")}:${get("second")} ${zone}`;
    } catch (_) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
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
          <div class="nav-item nav-item--work">
            <a class="nav-work-trigger${active === "work" ? " active" : ""}" href="${href("index.html")}" aria-haspopup="true" aria-expanded="false" aria-controls="nav-work-menu">Work</a>
            <div class="nav-work-menu" id="nav-work-menu" role="menu">
              <div class="nav-work-panel">
                <a role="menuitem" href="${href("index.html")}">All Projects</a>
                <div class="nav-work-sep" role="separator"></div>
                <p class="nav-work-label">Featured product work</p>
                <a role="menuitem" href="${href("projects/cloudflare-one-client.html")}">Cloudflare One Client</a>
                <a role="menuitem" href="${href("projects/warp.html")}">WARP</a>
                <div class="nav-work-sep" role="separator"></div>
                <p class="nav-work-label">Visual System</p>
                <a role="menuitem" href="${href("projects/what-is-cloudflare.html")}">What is Cloudflare Animation</a>
                <a role="menuitem" href="${href("projects/global-icon-system.html")}">Global Icon System</a>
                <a role="menuitem" href="${href("projects/b2b-illustration-system.html")}">B2B Illustration System</a>
              </div>
            </div>
          </div>
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
        // Home: cream + noise over hero; page wash once past the hero band.
        const headerBottom = header.getBoundingClientRect().bottom;
        const heroBottom = heroBand.getBoundingClientRect().bottom;
        const pastHero = heroBottom <= headerBottom;
        header.classList.toggle("is-past-hero", pastHero);
        header.classList.toggle("is-home-hero", !pastHero);
      } else {
        // Non-home: default CSS page wash (no hero noise states).
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
          <img src="${asset("assets/icons/footer-island-light.svg")}" alt="">
          Los Angeles
        </span>
        <span class="sep" aria-hidden="true"></span>
        <span class="footer-item">
          <img src="${asset("assets/icons/footer-clock-light.svg")}" alt="">
          <time data-la-clock datetime=""></time>
        </span>
        <span class="sep" aria-hidden="true"></span>
        <span class="footer-item">
          <img class="sm" src="${asset("assets/icons/footer-copyright-light.svg")}" alt="">
          2026
        </span>
      </div>
      <div class="footer-social">
        <a href="https://www.linkedin.com/in/tianchanye" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
          <img src="${asset("assets/icons/footer-linkedin-light.svg")}" alt="">
        </a>
        <a href="https://www.instagram.com/noodle.the.aussie/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
          <img src="${asset("assets/icons/footer-instagram-light.svg")}" alt="">
        </a>
        <a href="mailto:tcyedesign@gmail.com" aria-label="Email">
          <img src="${asset("assets/icons/footer-envelope-light.svg")}" alt="">
        </a>
      </div>
    `;

  }

  /** Keep every [data-la-clock] (footer + hero live tag) on one tick/format. */
  function initLAClocks() {
    const clocks = document.querySelectorAll("[data-la-clock]");
    if (!clocks.length) return;

    const tick = () => {
      const now = new Date();
      const text = formatLATime(now);
      const iso = now.toISOString();
      clocks.forEach((clock) => {
        clock.textContent = text;
        clock.setAttribute("datetime", iso);
      });
    };
    tick();
    setInterval(tick, 1000);
  }

  /** Live °F for Los Angeles via Open-Meteo; keep Figma fallback on failure. */
  function initLAWeather() {
    const temps = document.querySelectorAll("[data-la-temp]");
    if (!temps.length) return;

    const FALLBACK = "72°F";
    const setAll = (text) => {
      temps.forEach((el) => {
        el.textContent = text;
      });
    };

    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=34.0522&longitude=-118.2437" +
      "&current=temperature_2m&temperature_unit=fahrenheit" +
      "&timezone=America%2FLos_Angeles";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("weather " + res.status);
        return res.json();
      })
      .then((data) => {
        const value = data?.current?.temperature_2m;
        if (typeof value !== "number" || Number.isNaN(value)) {
          throw new Error("weather missing");
        }
        setAll(`${Math.round(value)}°F`);
      })
      .catch(() => {
        setAll(FALLBACK);
      });
  }

  renderHeader();
  initStickyHeader();
  renderFooter();
  initLAClocks();
  initLAWeather();
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

  // Mobile Featured/Craft chip rows: .is-scrolling clears side gutters while scrolled
  (function initMobileTagGroupScroll() {
    const mq =
      window.matchMedia && window.matchMedia("(max-width: 700px)");
    const selector =
      ".section-product .project-meta .tag-group, #visual.section .craft-card-meta .tag-group";

    function bind(el) {
      if (el.dataset.tagScrollBound === "1") return;
      el.dataset.tagScrollBound = "1";

      let ticking = false;

      const sync = () => {
        const active = Boolean(mq && mq.matches) && el.scrollLeft > 0;
        el.classList.toggle("is-scrolling", active);
      };

      el.addEventListener(
        "scroll",
        () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            sync();
            ticking = false;
          });
        },
        { passive: true }
      );

      if (mq) {
        if (typeof mq.addEventListener === "function") {
          mq.addEventListener("change", sync);
        } else if (typeof mq.addListener === "function") {
          mq.addListener(sync);
        }
      }
      sync();
    }

    document.querySelectorAll(selector).forEach(bind);
  })();

  // Visual System & Craft carousel — duplicated track for seamless left crop on desktop
  document.querySelectorAll('[data-craft-carousel]').forEach((root) => {
    const viewport = root.querySelector('.craft-viewport');
    const track = root.querySelector('.craft-track');
    const prev = root.querySelector('[data-craft-prev]');
    const next = root.querySelector('[data-craft-next]');
    if (!viewport || !track) return;

    const mobileQuery =
      window.matchMedia && window.matchMedia('(max-width: 700px)');

    let busy = false;
    let index = 0;
    let setCount = 0;
    let cloned = false;
    let wheelAccum = 0;
    let wheelLockUntil = 0;
    const durationMs = 350;
    const wheelThreshold = 40;
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
      wheelAccum = 0;
      wheelLockUntil = 0;
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

    function onWheel(event) {
      // Mobile uses stacked layout — leave page scroll alone.
      if (isMobileCraft()) return;

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);

      // Vertical (or non-horizontal) gestures: do not claim the event —
      // let the browser scroll the page. Only dominant deltaX moves the row.
      if (absX <= absY || absX < 1) return;

      event.preventDefault();
      event.stopPropagation();

      ensureClones();
      if (setCount < 2) return;

      const now = performance.now();
      if (busy || now < wheelLockUntil) return;

      let amount = event.deltaX;
      if (event.deltaMode === 1) amount *= 16;
      else if (event.deltaMode === 2) amount *= Math.max(viewport.clientWidth, 1);

      wheelAccum += amount;
      if (Math.abs(wheelAccum) < wheelThreshold) return;

      const goingNext = wheelAccum > 0;
      wheelAccum = 0;
      wheelLockUntil = now + (reducedMotion ? 80 : durationMs);

      if (goingNext) goNext();
      else goPrev();
    }

    prev && prev.addEventListener('click', goPrev);
    next && next.addEventListener('click', goNext);
    viewport.addEventListener('wheel', onWheel, { passive: false });
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

  // About-page deco: scroll parallax (+ soft cursor float, same system as home clouds).
  (function initAboutDecoMotion() {
    const reducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;
    if (!document.body.classList.contains('about-page')) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const layers = [
      { sel: '.about-deco-cloud-1', speed: 0.18, maxPush: 10, pushScale: 0.045, hitPad: 48 },
      { sel: '.about-deco-cloud-2', speed: 0.28, maxPush: 10, pushScale: 0.045, hitPad: 44 },
      // Stars are photo-relative with overhang; tiny motion only (no drift onto bio/experience).
      { sel: '.about-deco-stars', speed: 0.015, maxParallax: 2, maxPush: 2, pushScale: 0.01, hitPad: 16 },
    ]
      .map(({ sel, speed, maxPush, pushScale, hitPad, maxParallax }) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        return {
          el,
          speed,
          maxPush,
          pushScale,
          hitPad,
          maxParallax: maxParallax == null ? Infinity : maxParallax,
          spring: 0.02,
          damping: 0.97,
          parallaxY: 0,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          targetX: 0,
          targetY: 0,
        };
      })
      .filter(Boolean);

    if (!layers.length) return;

    function syncParallax() {
      const scrollY = Math.max(window.scrollY || window.pageYOffset || 0, 0);
      layers.forEach((layer) => {
        const raw = scrollY * layer.speed;
        layer.parallaxY = Math.max(-layer.maxParallax, Math.min(layer.maxParallax, raw));
      });
    }

    function updatePushTarget(layer) {
      const rect = layer.el.getBoundingClientRect();
      // Undo current push + parallax so the rest center stays layout-anchored.
      const restCx = rect.left + rect.width / 2 - layer.x;
      const restCy = rect.top + rect.height / 2 - layer.y - layer.parallaxY;
      const dx = restCx - pointer.x;
      const dy = restCy - pointer.y;
      const dist = Math.hypot(dx, dy);
      const hitRadius = Math.max(rect.width, rect.height) * 0.75 + layer.hitPad;

      if (dist >= hitRadius) {
        layer.targetX = 0;
        layer.targetY = 0;
        return;
      }

      const awayX = dist < 0.001 ? 0 : dx / dist;
      const awayY = dist < 0.001 ? -1 : dy / dist;
      const penetration = (hitRadius - dist) * layer.pushScale;

      layer.targetX = Math.max(-layer.maxPush, Math.min(layer.maxPush, awayX * penetration));
      layer.targetY = Math.max(-layer.maxPush, Math.min(layer.maxPush, awayY * penetration));
    }

    function applyLayer(layer) {
      layer.el.style.translate =
        layer.x.toFixed(2) + 'px ' + (layer.parallaxY + layer.y).toFixed(2) + 'px';
    }

    function animate() {
      syncParallax();
      layers.forEach((layer) => {
        updatePushTarget(layer);
        layer.vx = (layer.vx + (layer.targetX - layer.x) * layer.spring) * layer.damping;
        layer.vy = (layer.vy + (layer.targetY - layer.y) * layer.spring) * layer.damping;
        layer.x += layer.vx;
        layer.y += layer.vy;

        if (
          Math.abs(layer.x) < 0.015 &&
          Math.abs(layer.y) < 0.015 &&
          Math.abs(layer.vx) < 0.015 &&
          Math.abs(layer.vy) < 0.015 &&
          layer.targetX === 0 &&
          layer.targetY === 0
        ) {
          layer.x = 0;
          layer.y = 0;
          layer.vx = 0;
          layer.vy = 0;
        }

        applyLayer(layer);
      });
      requestAnimationFrame(animate);
    }

    window.addEventListener(
      'pointermove',
      (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      },
      { passive: true }
    );

    syncParallax();
    layers.forEach(applyLayer);
    requestAnimationFrame(animate);
  })();

  // Custom cursor — Figma 1078:8711: logo eyes + VIEW (desktop pointer only).
  (function initCoverCursor() {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    const targets = document.querySelectorAll(
      '.project-cover-link, .craft-card-media-link'
    );
    if (!targets.length) return;

    const cursor = document.createElement('div');
    cursor.className = 'cover-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML =
      '<svg class="cover-cursor-eyes" width="14" height="12" viewBox="0 0 14.4 11.5201" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<path class="cover-cursor-eyes-sclera" d="M4.01075 0.480469C4.91726 0.48053 5.78793 1.00721 6.45216 1.96094C7.11526 2.91329 7.54098 4.25514 7.54103 5.75977C7.54103 7.26448 7.1153 8.6062 6.45216 9.55859C5.7879 10.5125 4.91736 11.04 4.01075 11.04C3.10404 11.04 2.23268 10.5127 1.56837 9.55859C0.905293 8.60621 0.480479 7.26441 0.480479 5.75977C0.480524 4.25514 0.905267 2.91329 1.56837 1.96094C2.23267 1.00696 3.1041 0.480469 4.01075 0.480469Z" fill="white" stroke="currentColor" stroke-width="0.96"/>' +
      '<path d="M4.882 2.97644C4.82195 2.60374 4.2857 2.60374 4.22565 2.97644L4.15264 3.42956C4.0074 4.33101 3.4466 5.11164 2.63867 5.53702C2.45885 5.6317 2.45885 5.88919 2.63867 5.98387C3.4466 6.40925 4.0074 7.18988 4.15264 8.09133L4.22565 8.54445C4.2857 8.91715 4.82195 8.91715 4.882 8.54445L4.95501 8.09133C5.10025 7.18988 5.66105 6.40925 6.46898 5.98387C6.6488 5.88919 6.6488 5.6317 6.46898 5.53702C5.66105 5.11164 5.10025 4.33101 4.95501 3.42956L4.882 2.97644Z" fill="currentColor"/>' +
      '<path class="cover-cursor-eyes-sclera" d="M10.3895 0.480539C11.2961 0.4806 12.1667 1.00728 12.831 1.96101C13.4941 2.91336 13.9198 4.25521 13.9198 5.75984C13.9198 7.26455 13.4941 8.60627 12.831 9.55866C12.1667 10.5126 11.2962 11.04 10.3895 11.0401C9.48284 11.0401 8.61148 10.5127 7.94717 9.55866C7.28409 8.60628 6.85928 7.26447 6.85928 5.75984C6.85932 4.25521 7.28406 2.91336 7.94717 1.96101C8.61146 1.00703 9.48289 0.480539 10.3895 0.480539Z" fill="white" stroke="currentColor" stroke-width="0.96"/>' +
      '<path d="M11.2609 2.97644C11.2008 2.60374 10.6646 2.60374 10.6045 2.97644L10.5315 3.42956C10.3863 4.33101 9.82548 5.11164 9.01754 5.53702C8.83772 5.6317 8.83772 5.88919 9.01754 5.98387C9.82548 6.40925 10.3863 7.18988 10.5315 8.09133L10.6045 8.54445C10.6646 8.91715 11.2008 8.91715 11.2609 8.54445L11.3339 8.09133C11.4791 7.18988 12.0399 6.40925 12.8479 5.98387C13.0277 5.88919 13.0277 5.6317 12.8479 5.53702C12.0399 5.11164 11.4791 4.33101 11.3339 3.42956L11.2609 2.97644Z" fill="currentColor"/>' +
      '</svg>' +
      '<span class="cover-cursor-label">VIEW</span>';
    document.body.appendChild(cursor);

    let active = false;

    function setPosition(nextX, nextY) {
      cursor.style.transform =
        'translate3d(' + nextX.toFixed(1) + 'px,' + nextY.toFixed(1) + 'px,0) translate(-50%,-50%)';
    }

    function setTone(target) {
      cursor.classList.toggle(
        'cover-cursor--light',
        target?.getAttribute('data-cover-cursor') === 'light'
      );
    }

    function show(event) {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      setPosition(event.clientX, event.clientY);
      setTone(event.currentTarget);
      active = true;
      cursor.classList.add('is-active');
    }

    function hide() {
      active = false;
      cursor.classList.remove('is-active');
      cursor.classList.remove('cover-cursor--light');
    }

    targets.forEach((target) => {
      target.addEventListener('pointerenter', show);
      target.addEventListener('pointerleave', hide);
      target.addEventListener(
        'pointermove',
        (event) => {
          if (!active) return;
          setPosition(event.clientX, event.clientY);
        },
        { passive: true }
      );
    });

    window.addEventListener('blur', hide);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) hide();
    });
  })();

  // WARP Final Design — horizontal phone strip carousel (scroll-snap + arrows)
  (function initWarpCarousel() {
    document.querySelectorAll('[data-warp-carousel]').forEach((root) => {
      const track = root.querySelector('[data-warp-carousel-track]');
      const prev = root.querySelector('[data-warp-carousel-prev]');
      const next = root.querySelector('[data-warp-carousel-next]');
      if (!track) return;

      const slides = () => [...track.querySelectorAll('[data-warp-slide]')];
      const reducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function maxScroll() {
        return Math.max(0, track.scrollWidth - track.clientWidth);
      }

      function syncButtons() {
        const left = track.scrollLeft;
        const max = maxScroll();
        const atStart = left <= 2;
        const atEnd = left >= max - 2;
        if (prev) prev.disabled = atStart;
        if (next) next.disabled = atEnd || max <= 0;
      }

      function slideStep() {
        const first = slides()[0];
        if (!first) return track.clientWidth * 0.4;
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap) || 0;
        return first.offsetWidth + gap;
      }

      function scrollBySlide(dir) {
        const delta = slideStep() * dir;
        track.scrollBy({
          left: delta,
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
      }

      if (prev) {
        prev.addEventListener('click', () => scrollBySlide(-1));
      }
      if (next) {
        next.addEventListener('click', () => scrollBySlide(1));
      }

      track.addEventListener('scroll', syncButtons, { passive: true });
      window.addEventListener('resize', syncButtons);

      // Pointer drag-to-scroll (desktop); touch already natively scrolls.
      let dragPointerId = null;
      let dragStartX = 0;
      let dragStartScroll = 0;
      let dragged = false;

      track.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        dragPointerId = event.pointerId;
        dragStartX = event.clientX;
        dragStartScroll = track.scrollLeft;
        dragged = false;
        track.classList.add('is-dragging');
        try {
          track.setPointerCapture(event.pointerId);
        } catch (_) {
          /* ignore */
        }
      });

      track.addEventListener('pointermove', (event) => {
        if (dragPointerId !== event.pointerId) return;
        const dx = event.clientX - dragStartX;
        if (Math.abs(dx) > 3) dragged = true;
        track.scrollLeft = dragStartScroll - dx;
      });

      function endDrag(event) {
        if (dragPointerId !== event.pointerId) return;
        dragPointerId = null;
        track.classList.remove('is-dragging');
        // Settle to the nearest slide once snap is restored.
        const step = slideStep();
        if (step > 0) {
          const nearest = Math.round(track.scrollLeft / step) * step;
          track.scrollTo({
            left: Math.max(0, Math.min(nearest, maxScroll())),
            behavior: reducedMotion ? 'auto' : 'smooth',
          });
        }
        requestAnimationFrame(syncButtons);
      }

      track.addEventListener('pointerup', endDrag);
      track.addEventListener('pointercancel', endDrag);

      track.addEventListener('click', (event) => {
        if (dragged) {
          event.preventDefault();
          event.stopPropagation();
          dragged = false;
        }
      }, true);

      track.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollBySlide(-1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollBySlide(1);
        } else if (event.key === 'Home') {
          event.preventDefault();
          track.scrollTo({ left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        } else if (event.key === 'End') {
          event.preventDefault();
          track.scrollTo({
            left: maxScroll(),
            behavior: reducedMotion ? 'auto' : 'smooth',
          });
        }
      });

      // Images can alter scrollWidth after decode.
      track.querySelectorAll('img').forEach((img) => {
        if (img.complete) return;
        img.addEventListener('load', syncButtons, { once: true });
      });

      syncButtons();
    });
  })();

  // Flower petal spin — hover on desktop; click/tap everywhere (mobile has no hover).
  (function initFlowerSpin() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    document.querySelectorAll('.hero-flower, .play-flower').forEach((flower) => {
      const bloom = flower.querySelector('.hero-flower-bloom, .play-flower-bloom');
      if (!bloom) return;

      flower.addEventListener('click', () => {
        flower.classList.remove('is-spinning');
        // Restart keyframes when tapping again mid-spin or after sticky hover.
        void bloom.offsetWidth;
        flower.classList.add('is-spinning');
      });

      bloom.addEventListener('animationend', () => {
        flower.classList.remove('is-spinning');
      });
    });
  })();
