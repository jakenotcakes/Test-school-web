
document.addEventListener("DOMContentLoaded", () => {
 
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // ---------------------------------------------------------------
  // Footer year — keeps the copyright line correct without editing
  // the HTML every January.
  // ---------------------------------------------------------------
  const yearEl = document.getElementById("copyright-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------------------------------------------------------------
  // Mobile nav toggle — shows/hides the nav panel on small screens
  // and keeps aria-expanded in sync for screen-reader users.
  // ---------------------------------------------------------------
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // ---------------------------------------------------------------
  // Smooth-scroll for every "#section" link on the page (nav links,
  // hero buttons, "Learn More" links, footer links all included).
  // navLinks is kept separate because only the nav gets the
  // "active" highlight — the scroll-spy below reads from this list.
  // ---------------------------------------------------------------
  const navLinks = Array.from(
    document.querySelectorAll('.site-nav a[href^="#"]'),
  );
  const allAnchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));

  allAnchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return; // "#" alone has nowhere to scroll to

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault(); 
      if (nav && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle && toggle.setAttribute("aria-expanded", "false");
      }

    
      if (navLinks.includes(link)) {
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      history.pushState(null, "", href);
    });
  });

  // ---------------------------------------------------------------
  // Scroll-spy — watches each section and highlights the matching
  // nav link as the visitor scrolls past it, using IntersectionObserver
  // instead of a scroll-event listener (better performance).
  // ---------------------------------------------------------------
  const sectionTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sectionTargets.length) {
    const headerHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
      ) || 78;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = document.querySelector(
            `.site-nav a[href="#${entry.target.id}"]`,
          );
          if (link) {
            navLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      {
        root: null,
        rootMargin: `-${Math.round(headerHeight)}px 0px -40% 0px`,
        threshold: 0.15,
      },
    );
    sectionTargets.forEach((section) => observer.observe(section));
  }

  // ---------------------------------------------------------------
  // Contact form — no server is wired up yet, so this only checks
  // the fields and shows an inline message instead of submitting
  // anywhere. Replace the body of the "submit" listener with a real
  // fetch() call (or a service like Formspree) once you have one.
  // ---------------------------------------------------------------
  const form = document.getElementById("contactForm");
  if (form) {
    const status = form.querySelector(".form-status");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setStatus = (text, type) => {
      if (!status) return;
      status.textContent = text;
      status.className = "form-status " + type; 
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault(); 

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        setStatus("Please complete all fields before sending.", "error");
        return;
      }
      if (!emailPattern.test(email)) {
        setStatus("Please enter a valid email address.", "error");
        return;
      }

      setStatus(
        `Thank you, ${name}! Your message has been received.`,
        "success",
      );
      form.reset();
    });
  }
});
