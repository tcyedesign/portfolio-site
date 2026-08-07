(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let pointerDirty = true;

  // Inlined hero dog overlay (.dog-ig-body) pupil / eye-white pairs.
  // Each live pupil track includes its brown outline so the eye remains
  // coherent while tracking the cursor over the static WebP body.
  const eyePairs = [
    { ball: "dog-pupil-right", white: "dog-eye-white-right", spring: 0.16, damping: 0.72 },
    { ball: "dog-pupil-left", white: "dog-eye-white-left", spring: 0.14, damping: 0.74 },
  ];

  const XLINK_NS = "http://www.w3.org/1999/xlink";

  function useHref(el) {
    return (
      el.getAttribute("href") ||
      el.getAttributeNS(XLINK_NS, "href") ||
      el.getAttribute("xlink:href") ||
      ""
    );
  }

  /** Prefer markup `<g id="…-track">`; otherwise wrap pupil + sketch-stroke <use> stamps. */
  function groupPupilWithOutline(svg, eyeball, strokeId) {
    if (!eyeball) return null;
    const existing = svg.getElementById(`${eyeball.id}-track`);
    if (existing) return existing;
    if (!strokeId) return eyeball;

    const parent = eyeball.parentNode;
    if (!parent) return eyeball;

    const NS = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(NS, "g");
    group.setAttribute("id", `${eyeball.id}-track`);
    parent.insertBefore(group, eyeball);
    group.appendChild(eyeball);

    const strokeRef = `#${strokeId}`;
    let node = group.nextSibling;
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const next = node.nextSibling;
        group.appendChild(node);
        node = next;
        continue;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        if (tag === "use" && useHref(node) === strokeRef) {
          const next = node.nextSibling;
          group.appendChild(node);
          node = next;
          continue;
        }
      }
      break;
    }

    return group;
  }

  function clientToSvg(svg, clientX, clientY) {
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    return point.matrixTransform(matrix.inverse());
  }

  function svgPointToScreen(svg, x, y) {
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const screen = point.matrixTransform(matrix);
    return { x: screen.x, y: screen.y };
  }

  function createDraggableBase(restCx, restCy, hit, target, options = {}) {
    const {
      spring = 0.2,
      damping = 0.66,
      createProxy,
      hideTarget,
      showTarget,
    } = options;

    return {
      hit,
      target,
      restCx,
      restCy,
      spring,
      damping,
      createProxy,
      hideTarget,
      showTarget,
      dragging: false,
      returning: false,
      proxy: null,
      proxyX: 0,
      proxyY: 0,
      proxyVx: 0,
      proxyVy: 0,
    };
  }

  function updateDragProxy(item) {
    if (!item.proxy) return;
    item.proxy.style.transform = `translate(${item.proxyX}px, ${item.proxyY}px) translate(-50%, -50%)`;
  }

  function destroyDragProxy(item) {
    if (item.proxy) {
      item.proxy.remove();
      item.proxy = null;
    }
  }

  function finishDragReturn(item) {
    destroyDragProxy(item);
    item.showTarget();
    item.returning = false;
    item.proxyX = 0;
    item.proxyY = 0;
    item.proxyVx = 0;
    item.proxyVy = 0;
  }

  function createHatDotState(svg) {
    const target = svg.getElementById("hat-pin");
    if (!target) return null;

    let bbox;
    try {
      bbox = target.getBBox();
    } catch {
      return null;
    }

    const restCx = bbox.x + bbox.width / 2;
    const restCy = bbox.y + bbox.height / 2;
    const hitR = Math.max(bbox.width, bbox.height) * 0.55;

    const hit = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    hit.setAttribute("class", "pushable-hit hat-dot-hit");
    hit.setAttribute("cx", String(restCx));
    hit.setAttribute("cy", String(restCy));
    hit.setAttribute("r", String(hitR + 8));
    hit.setAttribute("fill", "transparent");
    target.parentNode.insertBefore(hit, target.nextSibling);

    return createDraggableBase(restCx, restCy, hit, target, {
      createProxy() {
        const topLeft = svgPointToScreen(svg, bbox.x, bbox.y);
        const bottomRight = svgPointToScreen(svg, bbox.x + bbox.width, bbox.y + bbox.height);
        const center = svgPointToScreen(svg, restCx, restCy);
        if (!topLeft || !bottomRight || !center) return null;

        const width = Math.max(20, Math.abs(bottomRight.x - topLeft.x));
        const height = Math.max(20, Math.abs(bottomRight.y - topLeft.y));

        const proxy = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        proxy.setAttribute("class", "drag-proxy hat-pin-proxy");
        proxy.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        proxy.setAttribute("width", String(width));
        proxy.setAttribute("height", String(height));
        proxy.setAttribute("overflow", "visible");

        const clone = target.cloneNode(true);
        clone.removeAttribute("id");
        clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        proxy.appendChild(clone);
        document.body.appendChild(proxy);
        return { proxy, center };
      },
      hideTarget() {
        target.style.opacity = "0";
      },
      showTarget() {
        target.style.opacity = "";
      },
    });
  }

  /** Tag the dark nose pad + nostrils when the asset lacks `id="big black nose"`. */
  function ensureNoseId(svg) {
    if (svg.getElementById("big black nose")) return;

    const pad = [...svg.querySelectorAll("rect")].find((el) => (
      el.getAttribute("x") === "287.927" &&
      el.getAttribute("y") === "214.724" &&
      el.getAttribute("fill") === "#3A3A3A"
    ));
    if (!pad || !pad.parentNode) return;

    const leftNostril = [...svg.querySelectorAll("circle")].find((el) => (
      el.getAttribute("cx") === "251.92" && el.getAttribute("cy") === "233.98"
    ));
    const rightNostril = [...svg.querySelectorAll("circle")].find((el) => (
      el.getAttribute("cx") === "273.686" && el.getAttribute("cy") === "233.98"
    ));

    const NS = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(NS, "g");
    group.setAttribute("id", "big black nose");
    pad.parentNode.insertBefore(group, pad);
    group.appendChild(pad);
    if (leftNostril) group.appendChild(leftNostril);
    if (rightNostril) group.appendChild(rightNostril);
  }

  function createNosePushState(svg) {
    ensureNoseId(svg);
    const target = svg.getElementById("big black nose");
    if (!target) return null;

    // Cover the baked WebP nose so only this live pad shows when it moves.
    if (!svg.getElementById("nose-webp-cover")) {
      const pad = target.querySelector("rect");
      if (pad && target.parentNode) {
        const cover = pad.cloneNode(true);
        cover.setAttribute("id", "nose-webp-cover");
        cover.setAttribute("fill", "#F7F7F7");
        cover.removeAttribute("fill-opacity");
        // Slightly larger than the live pad so the WebP nose never peeks.
        const w = parseFloat(cover.getAttribute("width") || "0");
        const h = parseFloat(cover.getAttribute("height") || "0");
        if (w && h) {
          cover.setAttribute("width", String(w + 4));
          cover.setAttribute("height", String(h + 4));
          const x = parseFloat(cover.getAttribute("x") || "0");
          const y = parseFloat(cover.getAttribute("y") || "0");
          cover.setAttribute("x", String(x - 2));
          cover.setAttribute("y", String(y - 2));
        }
        target.parentNode.insertBefore(cover, target);
      }
    }

    let bbox;
    try {
      bbox = target.getBBox();
    } catch {
      return null;
    }

    const restCx = bbox.x + bbox.width / 2;
    const restCy = bbox.y + bbox.height / 2;
    // Generous soft radius so approaching from any side feels pushy.
    const hitRadius = Math.max(bbox.width, bbox.height) * 0.75 + 10;

    // Hit sits above sketch-stroke <use> stamps so pointer events still work;
    // push itself is driven from page pointer (eyes-style) for reliability.
    const hit = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    hit.setAttribute("class", "nose-push-hit");
    hit.setAttribute("cx", String(restCx));
    hit.setAttribute("cy", String(restCy));
    hit.setAttribute("r", String(hitRadius));
    hit.setAttribute("fill", "transparent");
    hit.style.pointerEvents = "none";
    target.parentNode.appendChild(hit);

    target.style.transformBox = "fill-box";
    target.style.transformOrigin = "center";
    target.style.willChange = "transform";

    return {
      target,
      hit,
      restCx,
      restCy,
      hitRadius,
      maxPush: 1.3,
      pushScale: 0.08,
      spring: 0.12,
      damping: 0.89,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      targetX: 0,
      targetY: 0,
    };
  }

  function updateNosePushTarget(nose, svg, clientX, clientY) {
    const cursor = clientToSvg(svg, clientX, clientY);
    if (!cursor) return;

    // Vector from cursor → rest center: approach from the right yields leftward
    // displacement (and similarly for other sides).
    const dx = nose.restCx - cursor.x;
    const dy = nose.restCy - cursor.y;
    const dist = Math.hypot(dx, dy);

    if (dist >= nose.hitRadius) {
      nose.targetX = 0;
      nose.targetY = 0;
      return;
    }

    const awayX = dist < 0.001 ? 0 : dx / dist;
    const awayY = dist < 0.001 ? -1 : dy / dist;
    const penetration = (nose.hitRadius - dist) * nose.pushScale;

    nose.targetX = Math.max(-nose.maxPush, Math.min(nose.maxPush, awayX * penetration));
    nose.targetY = Math.max(-nose.maxPush, Math.min(nose.maxPush, awayY * penetration));
  }

  function applyNosePush(nose) {
    nose.target.style.transform = `translate(${nose.x.toFixed(2)}px, ${nose.y.toFixed(2)}px)`;
  }

  function snapNosePush(nose, svg) {
    updateNosePushTarget(nose, svg, pointer.x, pointer.y);
    nose.x = nose.targetX;
    nose.y = nose.targetY;
    nose.vx = 0;
    nose.vy = 0;
    applyNosePush(nose);
  }

  function animateNosePush(nose, svg) {
    updateNosePushTarget(nose, svg, pointer.x, pointer.y);
    nose.vx = (nose.vx + (nose.targetX - nose.x) * nose.spring) * nose.damping;
    nose.vy = (nose.vy + (nose.targetY - nose.y) * nose.spring) * nose.damping;
    nose.x += nose.vx;
    nose.y += nose.vy;

    // Settle when nearly home so we don't micro-jitter forever.
    if (
      Math.abs(nose.x) < 0.02 &&
      Math.abs(nose.y) < 0.02 &&
      Math.abs(nose.vx) < 0.02 &&
      Math.abs(nose.vy) < 0.02 &&
      nose.targetX === 0 &&
      nose.targetY === 0
    ) {
      nose.x = 0;
      nose.y = 0;
      nose.vx = 0;
      nose.vy = 0;
    }

    applyNosePush(nose);
  }

  function animatePushable(item, svg) {
    if (item.dragging || !item.returning || !item.proxy) return;

    const rest = svgPointToScreen(svg, item.restCx, item.restCy);
    if (!rest) return;

    item.proxyVx = (item.proxyVx + (rest.x - item.proxyX) * item.spring) * item.damping;
    item.proxyVy = (item.proxyVy + (rest.y - item.proxyY) * item.spring) * item.damping;
    item.proxyX += item.proxyVx;
    item.proxyY += item.proxyVy;
    updateDragProxy(item);

    if (
      Math.hypot(rest.x - item.proxyX, rest.y - item.proxyY) < 0.75 &&
      Math.hypot(item.proxyVx, item.proxyVy) < 0.15
    ) {
      finishDragReturn(item);
    }
  }

  function bindDraggable(item, svg, instant) {
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    function setDragging(active) {
      item.dragging = active;
      item.hit.classList.toggle("is-dragging", active);
      document.body.classList.toggle("drag-proxy-active", active);
    }

    function releaseDrag(event) {
      if (!item.dragging) return;

      setDragging(false);

      if (event?.pointerId !== undefined) {
        try {
          item.hit.releasePointerCapture(event.pointerId);
        } catch {
          // Pointer was already released.
        }
      }

      if (instant) {
        finishDragReturn(item);
        return;
      }

      item.returning = true;
      item.proxyVx = 0;
      item.proxyVy = 0;
    }

    item.hit.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;

      event.preventDefault();
      event.stopPropagation();

      const created = item.createProxy();
      if (!created || !created.center) return;

      dragOffsetX = created.center.x - event.clientX;
      dragOffsetY = created.center.y - event.clientY;

      destroyDragProxy(item);
      item.proxy = created.proxy;
      item.proxyX = created.center.x;
      item.proxyY = created.center.y;
      updateDragProxy(item);
      item.hideTarget();

      item.returning = false;
      setDragging(true);
      item.hit.setPointerCapture(event.pointerId);
    });

    item.hit.addEventListener("pointermove", (event) => {
      if (!item.dragging) return;

      item.proxyX = event.clientX + dragOffsetX;
      item.proxyY = event.clientY + dragOffsetY;
      updateDragProxy(item);
    });

    item.hit.addEventListener("pointerup", releaseDrag);
    item.hit.addEventListener("pointercancel", releaseDrag);

    window.addEventListener("resize", () => {
      if (item.dragging || item.returning) return;
      finishDragReturn(item);
    });
  }

  function createPushables(svg) {
    return [createHatDotState(svg)].filter(Boolean);
  }

  function createEyebrowStates(svg, eyes) {
    const pairs = [
      { eye: eyes[0], id: "eyebrow right" },
      { eye: eyes[1], id: "eyebrow left" },
    ];

    return pairs.map(({ eye, id }) => {
      const dot = svg.getElementById(id);
      if (!dot || !eye) return null;

      return {
        dot,
        eye,
        restCx: Number(dot.getAttribute("cx")),
        restCy: Number(dot.getAttribute("cy")),
        follow: 0.55,
      };
    }).filter(Boolean);
  }

  function updateEyebrows(eyebrows) {
    eyebrows.forEach((brow) => {
      const offsetX = brow.eye.x - brow.eye.socketCx;
      const offsetY = brow.eye.y - brow.eye.socketCy;

      brow.dot.setAttribute("cx", (brow.restCx + offsetX * brow.follow).toFixed(3));
      brow.dot.setAttribute("cy", (brow.restCy + offsetY * brow.follow).toFixed(3));
    });
  }

  function createEyeStates(svg) {
    return eyePairs.map(({ ball, white, spring, damping }) => {
      const eyeball = svg.getElementById(ball);
      const socket = svg.getElementById(white);
      if (!eyeball || !socket) return null;

      const socketCx = Number(socket.getAttribute("cx"));
      const socketCy = Number(socket.getAttribute("cy"));
      const socketR = Number(socket.getAttribute("r"));
      const ballR = Number(eyeball.getAttribute("r"));
      // Keep pupils clearly inside the eye whites.
      const maxMove = Math.max(0, socketR - ballR - 0.6);
      const restCx = Number(eyeball.getAttribute("cx"));
      const restCy = Number(eyeball.getAttribute("cy"));
      const track = groupPupilWithOutline(svg, eyeball);
      if (!track) return null;

      return {
        eyeball,
        track,
        socketCx,
        socketCy,
        maxMove,
        spring,
        damping,
        restCx,
        restCy,
        x: restCx,
        y: restCy,
        vx: 0,
        vy: 0,
      };
    }).filter(Boolean);
  }

  function applyPupilTransform(eye) {
    const tx = eye.x - eye.restCx;
    const ty = eye.y - eye.restCy;
    eye.track.setAttribute("transform", `translate(${tx.toFixed(3)} ${ty.toFixed(3)})`);
  }

  function pupilTarget(eye, cursor) {
    const dx = cursor.x - eye.socketCx;
    const dy = cursor.y - eye.socketCy;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.001) {
      return { x: eye.socketCx, y: eye.socketCy };
    }
    const scale = Math.min(1, eye.maxMove / dist);
    return {
      x: eye.socketCx + dx * scale,
      y: eye.socketCy + dy * scale,
    };
  }

  function snapPupilsToCursor(svg, eyes) {
    const cursor = clientToSvg(svg, pointer.x, pointer.y);
    if (!cursor) return;
    eyes.forEach((eye) => {
      const target = pupilTarget(eye, cursor);
      eye.x = target.x;
      eye.y = target.y;
      eye.vx = 0;
      eye.vy = 0;
      applyPupilTransform(eye);
    });
  }

  function animateFrame(svg, eyes, eyebrows, pushables, nose) {
    const cursor = clientToSvg(svg, pointer.x, pointer.y);
    if (cursor) {
      eyes.forEach((eye) => {
        const target = pupilTarget(eye, cursor);

        eye.vx = (eye.vx + (target.x - eye.x) * eye.spring) * eye.damping;
        eye.vy = (eye.vy + (target.y - eye.y) * eye.spring) * eye.damping;
        eye.x += eye.vx;
        eye.y += eye.vy;

        applyPupilTransform(eye);
      });
    }

    updateEyebrows(eyebrows);
    pushables.forEach((item) => animatePushable(item, svg));
    if (nose) animateNosePush(nose, svg);

    requestAnimationFrame(() => animateFrame(svg, eyes, eyebrows, pushables, nose));
  }

  // Hero dog: fetch SVG from <img data-dog-inline> and replace with inline <svg>
  // so pupil / nose / hat interactions can manipulate DOM nodes.
  function ensurePupilIds(svg) {
    const pairs = [
      { id: "dog-pupil-right", cx: "288.313", cy: "178.197" },
      { id: "dog-pupil-left", cx: "235.603", cy: "178.197" },
    ];
    pairs.forEach(({ id, cx, cy }) => {
      if (svg.getElementById(id)) return;
      const match = [...svg.querySelectorAll("circle")].find((c) => (
        c.getAttribute("cx") === cx &&
        c.getAttribute("cy") === cy &&
        c.getAttribute("fill") === "black" &&
        c.getAttribute("r") === "5"
      ));
      if (match) match.setAttribute("id", id);
    });
  }

  function initDogInteractions(dogSvg) {
    if (!dogSvg) return;
    ensurePupilIds(dogSvg);
    dogSvg.classList.add("dog-ig-body");
    const isDecorative = dogSvg.getAttribute("aria-hidden") === "true";
    if (!isDecorative) dogSvg.setAttribute("role", "img");
    if (!isDecorative && !dogSvg.getAttribute("aria-label")) {
      dogSvg.setAttribute("aria-label", "Noodle the Aussie");
    }
    dogSvg.setAttribute("focusable", "false");
    dogSvg.removeAttribute("width");
    dogSvg.removeAttribute("height");
    // Sizing/position owned by CSS (.dog-ig-body) to match Figma Asset_Dog
    dogSvg.style.removeProperty("width");
    dogSvg.style.removeProperty("height");
    dogSvg.style.display = "block";
    dogSvg.style.overflow = "visible";

    const eyes = createEyeStates(dogSvg);
    const eyebrows = createEyebrowStates(dogSvg, eyes);
    const pushables = createPushables(dogSvg);
    const nose = createNosePushState(dogSvg);
    const hasMotionTargets = eyes.length > 0 || !!nose || pushables.length > 0;

    pushables.forEach((item) => bindDraggable(item, dogSvg, reducedMotion));

    // rAF-throttled pointer tracking (page-wide).
    let rafScheduled = false;
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointerDirty = true;

      if (!reducedMotion) return;
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(() => {
        rafScheduled = false;
        if (!pointerDirty) return;
        pointerDirty = false;
        snapPupilsToCursor(dogSvg, eyes);
        updateEyebrows(eyebrows);
        if (nose) snapNosePush(nose, dogSvg);
      });
    }, { passive: true });

    // Recalculate eye centers via live CTM after layout shifts.
    const onLayout = () => {
      pointerDirty = true;
      if (reducedMotion) {
        snapPupilsToCursor(dogSvg, eyes);
        if (nose) snapNosePush(nose, dogSvg);
      }
    };
    window.addEventListener("resize", onLayout, { passive: true });
    window.addEventListener("scroll", onLayout, { passive: true });

    if (!reducedMotion && hasMotionTargets) {
      requestAnimationFrame(() => animateFrame(dogSvg, eyes, eyebrows, pushables, nose));
    } else {
      if (eyes.length) snapPupilsToCursor(dogSvg, eyes);
      if (nose) snapNosePush(nose, dogSvg);
    }
  }

  function inlineDogFromImg(img) {
    const src = img.getAttribute("src");
    if (!src) return;
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dog SVG");
        return res.text();
      })
      .then((markup) => {
        const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
        const svg = doc.documentElement;
        if (!svg || svg.tagName.toLowerCase() !== "svg") {
          throw new Error("Dog asset is not SVG");
        }
        // Adopt into HTML document.
        const adopted = document.importNode(svg, true);
        const alt = img.getAttribute("alt");
        if (alt) adopted.setAttribute("aria-label", alt);
        img.replaceWith(adopted);
        initDogInteractions(adopted);
      })
      .catch(() => {
        // Keep the static <img> if inlining fails.
      });
  }

  const dogImg = document.querySelector("img.dog-ig-body[data-dog-inline]");
  const dogSvgExisting = document.querySelector("svg.dog-ig-body");
  if (dogImg) {
    inlineDogFromImg(dogImg);
  } else if (dogSvgExisting) {
    initDogInteractions(dogSvgExisting);
  }

  // Soft cursor float for clouds (+ scroll parallax) and stars.
  // Uses CSS `translate` so it composes with any CSS `transform` (e.g. cloud rotate).
  function initSoftFloatMotion() {
    if (reducedMotion) return;

    const layers = [
      // Clouds — barely drift
      { sel: ".hero-cloud", speed: 0.08, maxPush: 1.6, pushScale: 0.022, hitPad: 28 },
      { sel: ".hero-cloud-2", speed: 0.14, maxPush: 1.4, pushScale: 0.024, hitPad: 24 },
      { sel: ".deco-cloud-3", speed: 0.1, maxPush: 1.2, pushScale: 0.022, hitPad: 22 },
      // Hero stars — float + scroll parallax
      { sel: ".hero-star-a", speed: 0.07, maxPush: 1.4, pushScale: 0.024, hitPad: 20 },
      { sel: ".hero-star-b", speed: 0.09, maxPush: 1.4, pushScale: 0.024, hitPad: 20 },
      { sel: ".hero-star-c", speed: 0.11, maxPush: 1.2, pushScale: 0.022, hitPad: 18 },
      { sel: ".hero-star-d", speed: 0.06, maxPush: 1.2, pushScale: 0.022, hitPad: 18 },
      // Project stars — float only
      { sel: ".project-star-3", speed: 0, maxPush: 1.4, pushScale: 0.024, hitPad: 20 },
      { sel: ".project-star-4", speed: 0, maxPush: 1.2, pushScale: 0.022, hitPad: 16 },
      // Arrow 1 (hero path) — float + parallax
      { sel: ".hero-arrow-path", speed: 0.07, maxPush: 1.5, pushScale: 0.02, hitPad: 32 },
      // Flower — soft float only (no scroll parallax)
      { sel: ".hero-flower", speed: 0, maxPush: 1.5, pushScale: 0.022, hitPad: 26 },
    ]
      .map(({ sel, speed, maxPush, pushScale, hitPad }) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        return {
          el,
          speed,
          maxPush,
          pushScale,
          hitPad,
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
        layer.parallaxY = scrollY * layer.speed;
      });
    }

    function updatePushTarget(layer) {
      const rect = layer.el.getBoundingClientRect();
      // Undo current push so the rest center stays anchored to layout + parallax.
      const restCx = rect.left + rect.width / 2 - layer.x;
      const restCy = rect.top + rect.height / 2 - layer.y;
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
      layer.el.style.translate = `${layer.x.toFixed(2)}px ${(layer.parallaxY + layer.y).toFixed(2)}px`;
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
      "pointermove",
      (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointerDirty = true;
      },
      { passive: true }
    );

    syncParallax();
    layers.forEach(applyLayer);
    requestAnimationFrame(animate);
  }

  initSoftFloatMotion();

  // Dog-orbit stars (b/c/d): each twinkles once every 5s; order randomized per cycle.
  (function initDogStarTwinkle() {
    if (reducedMotion) return;
    const stars = [
      ...document.querySelectorAll(".hero-star-b, .hero-star-c, .hero-star-d"),
    ];
    if (stars.length < 2) return;

    function shuffle(list) {
      const out = [...list];
      for (let i = out.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    }

    function twinkle(star) {
      star.classList.remove("is-twinkling");
      void star.offsetWidth;
      star.classList.add("is-twinkling");
      const clear = () => star.classList.remove("is-twinkling");
      star.addEventListener("animationend", clear, { once: true });
    }

    function cycle() {
      const order = shuffle(stars);
      // Random delays within the 5s window; keep ~0.3s+ gaps so twinkles don't stack.
      const delays = [];
      let t = Math.random() * 0.6;
      order.forEach(() => {
        delays.push(t);
        t += 0.4 + Math.random() * 1.6;
      });
      // If we ran past ~4.5s, compress into the window while keeping relative order.
      const maxDelay = Math.max(...delays);
      const scale = maxDelay > 4.5 ? 4.5 / maxDelay : 1;
      order.forEach((star, i) => {
        setTimeout(() => twinkle(star), delays[i] * scale * 1000);
      });
      setTimeout(cycle, 5000);
    }

    setTimeout(cycle, Math.random() * 800);
  })();

  // Inline dog IG callout so scribble stroke-dash sequencing can run in CSS.
  // HTML `.dog-ig-notes` owns the copy; SVG text is unused / hidden.
  const calloutMount = document.querySelector(".dog-ig-callout[data-callout-src]");
  if (calloutMount) {
    const src = calloutMount.getAttribute("data-callout-src");
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dog IG callout");
        return res.text();
      })
      .then((markup) => {
        calloutMount.innerHTML = markup;
        const svg = calloutMount.querySelector("svg");
        if (!svg) return;
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        svg.removeAttribute("width");
        svg.removeAttribute("height");

        // Keep scribble arms; drop baked SVG text (wrong/stale copy).
        // Visibility / draw timing is CSS (.dog-ig:hover + reduced-motion rules).
        svg.querySelectorAll(".dog-ig-callout-text").forEach((el) => el.remove());
      })
      .catch(() => {
        // Scribble is progressive enhancement; dog + HTML notes still work.
        calloutMount.remove();
      });
  }
})();
