(function () {
  // Paste your GA4 Measurement ID here (G-XXXXXXXXXX), or set meta[name="ga-measurement-id"] on any page.
  // Create a free property at https://analytics.google.com
  const DEFAULT_GA_MEASUREMENT_ID = "";

  const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", ""]);

  function getMeasurementId() {
    const meta = document.querySelector('meta[name="ga-measurement-id"]');
    const fromMeta = meta?.content?.trim();
    if (fromMeta) return fromMeta;
    return DEFAULT_GA_MEASUREMENT_ID.trim();
  }

  function isLocalDev() {
    return LOCAL_HOSTS.has(window.location.hostname);
  }

  function projectSlugFromHref(href) {
    try {
      const url = new URL(href, window.location.href);
      const match = url.pathname.match(/\/projects\/([^/?#]+)\.html$/);
      return match ? match[1] : null;
    } catch (_) {
      return null;
    }
  }

  function clickSourceFromLink(link) {
    if (link.closest(".nav-work-menu")) return "nav";
    if (link.classList.contains("project-cover-link")) return "homepage-cover";
    if (link.classList.contains("project-title-link")) return "homepage-title";
    if (link.closest(".craft-card-media-link")) return "craft-card";
    if (link.closest(".craft-card")) return "craft-card";
    return "other";
  }

  function initProjectClickTracking() {
    document.addEventListener(
      "click",
      (event) => {
        const link = event.target.closest('a[href*="projects/"]');
        if (!link || !link.href) return;

        const project = projectSlugFromHref(link.getAttribute("href") || link.href);
        if (!project || typeof window.gtag !== "function") return;

        window.gtag("event", "project_click", {
          project,
          click_source: clickSourceFromLink(link),
        });
      },
      { capture: true }
    );
  }

  function loadGA4(measurementId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: true,
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);

    initProjectClickTracking();
  }

  const measurementId = getMeasurementId();
  if (!measurementId || isLocalDev()) return;

  loadGA4(measurementId);
})();
