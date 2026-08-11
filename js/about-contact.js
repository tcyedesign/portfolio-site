(function () {
  const CONTACT_EMAIL = "tcyedesign@gmail.com";
  const modal = document.getElementById("about-contact-modal");
  const openBtn = document.querySelector("[data-about-contact-open]");
  const form = document.querySelector("[data-about-contact-form]");

  if (!modal || !openBtn || !form) return;

  const panel = modal.querySelector(".about-contact-modal__panel");
  const closeControls = modal.querySelectorAll("[data-about-contact-close]");
  const nameInput = form.querySelector("#about-contact-name");
  const emailInput = form.querySelector("#about-contact-email");
  const messageInput = form.querySelector("#about-contact-message");

  let lastFocus = null;
  let open = false;

  function getFocusable() {
    return Array.from(
      panel.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("hidden") && el.getClientRects().length > 0);
  }

  function setPageInert(inert) {
    document.body.classList.toggle("about-contact-open", inert);
    document.body.style.overflow = inert ? "hidden" : "";
  }

  function openModal() {
    if (open) return;
    open = true;
    lastFocus = document.activeElement;
    modal.hidden = false;
    setPageInert(true);
    window.requestAnimationFrame(() => {
      (nameInput || getFocusable()[0] || panel).focus();
    });
  }

  function closeModal() {
    if (!open) return;
    open = false;
    modal.hidden = true;
    setPageInert(false);
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    } else {
      openBtn.focus();
    }
  }

  openBtn.addEventListener("click", openModal);

  closeControls.forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      closeModal();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!open) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusable();
    if (!focusable.length) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = (nameInput?.value || "").trim();
    const email = (emailInput?.value || "").trim();
    const message = (messageInput?.value || "").trim();

    if (!name) {
      nameInput?.focus();
      nameInput?.reportValidity?.();
      return;
    }
    if (!email || !emailInput.checkValidity()) {
      emailInput?.focus();
      emailInput?.reportValidity?.();
      return;
    }
    if (!message) {
      messageInput?.focus();
      messageInput?.reportValidity?.();
      return;
    }

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    closeModal();
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });
})();
