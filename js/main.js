
// ==========================================================
// EARTHLINK WEBSITE - COMPLETE MAIN.JS
// Mobile menu, feedback form, footer year, page transition,
// portfolio sliders, project preview, and intro animation
// ==========================================================

// ---------- 1. MOBILE MENU ----------
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- 2. FEEDBACK FORM ----------
const form = document.getElementById("feedbackForm");
const statusText = document.getElementById("formStatus");

function showStatus(message, type) {
  if (!statusText) return;

  statusText.textContent = message;
  statusText.className = "form-status " + type;
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    if (!name || !email || !message) {
      showStatus(
        "Please fill in your name, email, and message.",
        "error"
      );
      return;
    }

    // Validate email format.
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showStatus(
        "Enter a valid email address, like name@example.com.",
        "error"
      );
      return;
    }

    // This form displays a confirmation only.
    // It does not send data to a server or email service.
    showStatus(
      "Thank you, " + name + ". Your message was sent.",
      "success"
    );

    form.reset();
  });
}

// ---------- 3. FOOTER YEAR ----------
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// ---------- 4. PAGE TRANSITION ----------
const mainContent = document.querySelector("main");
const FADE_TIME = 350;

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (!target || !mainContent) return;

    event.preventDefault();

    if (reduceMotion) {
      target.scrollIntoView({ behavior: "auto" });
      history.replaceState(null, "", targetId);
      return;
    }

    mainContent.classList.add("is-fading");

    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "auto" });
      history.replaceState(null, "", targetId);
      mainContent.classList.remove("is-fading");
    }, FADE_TIME);
  });
});

// ---------- 5. CREATE THE PROJECT PREVIEW WINDOW ----------
const previewModal = document.createElement("div");
previewModal.id = "projectPreview";
previewModal.className = "preview-modal";
previewModal.setAttribute("aria-hidden", "true");

previewModal.innerHTML = `
  <div class="preview-window"
       role="dialog"
       aria-modal="true"
       aria-labelledby="previewTitle">

    <div class="preview-header">
      <h3 id="previewTitle">Project Preview</h3>

      <button type="button"
              class="preview-close"
              aria-label="Close preview">
        &times;
      </button>
    </div>

    <div class="preview-frame-wrap">
      <iframe
        id="previewFrame"
        title="Project preview"
        loading="eager">
      </iframe>
    </div>

    <div class="preview-footer">
      <button type="button"
              class="btn btn-small"
              id="previewPrevious">
        Previous
      </button>

      <span id="previewCounter"
            class="preview-counter"
            aria-live="polite">
      </span>

      <button type="button"
              class="btn btn-small"
              id="previewNext">
        Next
      </button>
    </div>
  </div>
`;

document.body.appendChild(previewModal);

const previewFrame = previewModal.querySelector("#previewFrame");
const previewTitle = previewModal.querySelector("#previewTitle");
const previewCounter = previewModal.querySelector("#previewCounter");
const previewPrevious = previewModal.querySelector("#previewPrevious");
const previewNext = previewModal.querySelector("#previewNext");
const previewClose = previewModal.querySelector(".preview-close");

let previewSlides = [];
let previewIndex = 0;
let lastPreviewButton = null;

// Get the title of a project card.
function getProjectTitle(slide) {
  const heading = slide.querySelector("h4");

  return heading
    ? heading.textContent.trim()
    : "Project Preview";
}

// Get the project URL from its Open project link.
function getProjectUrl(slide) {
  const link = slide.querySelector('a[href]');

  return link ? link.href : "";
}

// Update the preview without closing the modal.
function updatePreview() {
  if (previewSlides.length === 0) return;

  const slide = previewSlides[previewIndex];
  const url = getProjectUrl(slide);

  previewTitle.textContent = getProjectTitle(slide);
  previewCounter.textContent =
    `${previewIndex + 1} of ${previewSlides.length}`;

  previewPrevious.disabled = previewIndex === 0;
  previewNext.disabled = previewIndex === previewSlides.length - 1;

  if (url) {
    previewFrame.src = url;
  } else {
    previewFrame.src = "about:blank";
  }
}

// Open a selected project in the preview window.
function openProjectPreview(slides, index, button) {
  previewSlides = slides;
  previewIndex = index;
  lastPreviewButton = button;

  updatePreview();

  previewModal.classList.add("is-open");
  previewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("preview-open");

  previewClose.focus();
}

// Close the preview window.
function closeProjectPreview() {
  previewModal.classList.remove("is-open");
  previewModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("preview-open");

  // Stop the displayed project when the preview closes.
  previewFrame.src = "about:blank";

  if (lastPreviewButton) {
    lastPreviewButton.focus();
  }
}

// ---------- 6. PORTFOLIO SLIDERS ----------
// Each data-slider section gets its own Previous/Next controls.

document.querySelectorAll("[data-slider]").forEach((slider) => {
  const slides = Array.from(
    slider.querySelectorAll(".project")
  );

  if (slides.length === 0) return;

  let current = 0;

  slider.classList.add("is-slider");

  // Create slider controls.
  const controls = document.createElement("div");
  controls.className = "slider-controls";

  controls.innerHTML = `
    <button type="button"
            class="btn btn-small"
            data-dir="-1">
      Previous
    </button>

    <span class="slider-counter" aria-live="polite"></span>

    <button type="button"
            class="btn btn-small"
            data-dir="1">
      Next
    </button>
  `;

  slider.appendChild(controls);

  const prevBtn = controls.querySelector('[data-dir="-1"]');
  const nextBtn = controls.querySelector('[data-dir="1"]');
  const counter = controls.querySelector(".slider-counter");

  // Display one project card at a time.
  function showSlide(index) {
    current = Math.max(0, Math.min(index, slides.length - 1));

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
    });

    counter.textContent = `${current + 1} of ${slides.length}`;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }

  // Add a Preview button beside each Open project link.
  slides.forEach((slide, index) => {
    const projectLink = slide.querySelector('a[href]');

    if (!projectLink) return;

    // Avoid creating duplicate buttons.
    if (slide.querySelector(".preview-button")) return;

    const previewButton = document.createElement("button");

    previewButton.type = "button";
    previewButton.className = "btn btn-small preview-button";
    previewButton.textContent = "Preview";

    previewButton.addEventListener("click", () => {
      openProjectPreview(slides, index, previewButton);
    });

    projectLink.insertAdjacentElement("afterend", previewButton);
  });

  prevBtn.addEventListener("click", () => {
    showSlide(current - 1);
  });

  nextBtn.addEventListener("click", () => {
    showSlide(current + 1);
  });

  showSlide(0);
});

// ---------- 7. PREVIEW WINDOW NAVIGATION ----------
// These buttons change the project while keeping the modal open.

previewPrevious.addEventListener("click", () => {
  if (previewIndex > 0) {
    previewIndex--;
    updatePreview();
  }
});

previewNext.addEventListener("click", () => {
  if (previewIndex < previewSlides.length - 1) {
    previewIndex++;
    updatePreview();
  }
});

previewClose.addEventListener("click", closeProjectPreview);

// Close when clicking the dark background outside the window.
previewModal.addEventListener("click", (event) => {
  if (event.target === previewModal) {
    closeProjectPreview();
  }
});

// Close the preview by pressing Escape.
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    previewModal.classList.contains("is-open")
  ) {
    closeProjectPreview();
  }
});

// ---------- 8. INTRO / LOGO ANIMATION ----------
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");

  if (!intro) return;

  // Show the logo for 2.8 seconds, then fade out.
  window.setTimeout(() => {
    intro.classList.add("hide");
  }, 2800);

  // Allow clicking the intro to skip it.
  intro.addEventListener("click", () => {
    intro.classList.add("hide");
  });
});
