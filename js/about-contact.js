(function () {
  const CONTACT_EMAIL = "tcyedesign@gmail.com";
  const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
  const modal = document.getElementById("about-contact-modal");
  const openBtn = document.querySelector("[data-about-contact-open]");
  const form = document.querySelector("[data-about-contact-form]");

  if (!modal || !openBtn || !form) return;

  const panel = modal.querySelector(".about-contact-modal__panel");
  const closeControls = modal.querySelectorAll("[data-about-contact-close]");
  const fieldsWrap = form.querySelector("[data-about-contact-fields]");
  const successWrap = form.querySelector("[data-about-contact-success]");
  const statusEl = form.querySelector("[data-about-contact-status]");
  const submitBtn = form.querySelector("[data-about-contact-submit]");
  const nameInput = form.querySelector("#about-contact-name");
  const emailInput = form.querySelector("#about-contact-email");
  const messageInput = form.querySelector("#about-contact-message");
  const honeyInput = form.querySelector("#about-contact-gotcha");
  const defaultSubmitLabel = submitBtn?.textContent?.trim() || "Send message";

  let lastFocus = null;
  let open = false;
  let sending = false;

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

  function setStatus(type, message) {
    if (!statusEl) return;

    if (!type || !message) {
      statusEl.hidden = true;
      statusEl.textContent = "";
      statusEl.removeAttribute("data-state");
      statusEl.removeAttribute("role");
      return;
    }

    statusEl.hidden = false;
    statusEl.dataset.state = type;
    statusEl.textContent = message;
    statusEl.setAttribute("role", type === "error" ? "alert" : "status");
  }

  function setSending(isSending) {
    sending = isSending;
    if (!submitBtn) return;
    submitBtn.disabled = isSending;
    submitBtn.setAttribute("aria-busy", isSending ? "true" : "false");
    submitBtn.textContent = isSending ? "Sending…" : defaultSubmitLabel;
  }

  function showFormView() {
    if (fieldsWrap) fieldsWrap.hidden = false;
    if (successWrap) successWrap.hidden = true;
    setStatus(null);
    setSending(false);
  }

  function showSuccessView(message) {
    if (fieldsWrap) fieldsWrap.hidden = true;
    if (successWrap) {
      const copy = successWrap.querySelector("[data-about-contact-success-copy]");
      if (copy && message) copy.textContent = message;
      successWrap.hidden = false;
      const focusTarget =
        successWrap.querySelector("[data-about-contact-close]") || successWrap;
      window.requestAnimationFrame(() => focusTarget.focus?.());
    } else {
      setStatus("success", message);
      setSending(false);
    }
  }

  function mailtoFallback(name, email, message) {
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  function resetModalState() {
    form.reset();
    showFormView();
  }

  function openModal() {
    if (open) return;
    open = true;
    lastFocus = document.activeElement;
    resetModalState();
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
    setSending(false);
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;

    const name = (nameInput?.value || "").trim();
    const email = (emailInput?.value || "").trim();
    const message = (messageInput?.value || "").trim();
    const honey = (honeyInput?.value || "").trim();

    if (honey) {
      showSuccessView("Thanks — your message is on its way.");
      return;
    }

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

    setStatus(null);
    setSending(true);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _replyto: email,
          _subject: `Portfolio message from ${name}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      const successFlag = data?.success;
      const ok =
        response.ok &&
        (successFlag === true ||
          successFlag === "true" ||
          successFlag === undefined);

      if (!ok) {
        throw new Error(
          (data && (data.message || data.error)) || "Unable to send message."
        );
      }

      form.reset();
      showSuccessView("Thanks! Your message was sent. I’ll get back to you soon.");
    } catch {
      const fallback = mailtoFallback(name, email, message);
      setSending(false);
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.dataset.state = "error";
        statusEl.setAttribute("role", "alert");
        statusEl.innerHTML =
          `Couldn’t send automatically. ` +
          `<a href="${fallback}">Open your email app instead</a>, or try again.`;
      }
    }
  });
})();
