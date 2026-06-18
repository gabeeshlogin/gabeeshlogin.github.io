/* =====================================================================
   EMPOWER — interactions & motion
   Vanilla JS + GSAP/ScrollTrigger (loaded from cdnjs, optional).
   Degrades gracefully: if GSAP is missing or reduced-motion is on,
   everything is shown immediately.
   ===================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  /* If GSAP failed to load, reveal everything via CSS fallback. */
  if (!hasGSAP) document.documentElement.classList.add("no-gsap");

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------------- Year in footer ---------------- */
    var y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();

    /* ---------------- Nav: hairline border on scroll ---------------- */
    var nav = document.querySelector(".nav");
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle("is-scrolled", window.scrollY > 40);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---------------- Mobile menu ---------------- */
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.querySelector(".menu");
    if (toggle && menu) {
      var setMenu = function (open) {
        document.body.classList.toggle("menu-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        menu.setAttribute("aria-hidden", String(!open));
        document.body.style.overflow = open ? "hidden" : "";
      };
      toggle.addEventListener("click", function () {
        setMenu(!document.body.classList.contains("menu-open"));
      });
      menu.addEventListener("click", function (e) {
        if (e.target.closest("a")) setMenu(false);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && document.body.classList.contains("menu-open")) setMenu(false);
      });
    }

    /* ---------------- Mobile action bar: hide near footer ---------------- */
    var actionBar = document.querySelector(".action-bar");
    var footer = document.querySelector(".footer");
    if (actionBar && footer && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          actionBar.classList.toggle("hide", en.isIntersecting);
        });
      }, { rootMargin: "0px 0px -40% 0px" });
      io.observe(footer);
    }

    /* ---------------- FAQ accordion ---------------- */
    var accItems = document.querySelectorAll(".acc-item");
    accItems.forEach(function (item) {
      var btn = item.querySelector(".acc-q");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(isOpen));
      });
    });

    /* ---------------- Contact form: pre-select service from ?service= ---------------- */
    var serviceSelect = document.querySelector("#service");
    if (serviceSelect) {
      var param = new URLSearchParams(window.location.search).get("service");
      if (param) {
        var want = param.trim().toLowerCase();
        Array.prototype.forEach.call(serviceSelect.options, function (opt) {
          if (opt.value.toLowerCase() === want || opt.textContent.trim().toLowerCase() === want) {
            opt.selected = true;
          }
        });
      }
    }

    /* ---------------- Contact form: mailto submission ---------------- */
    var form = document.querySelector("#enquiry-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var get = function (id) { var el = form.querySelector("#" + id); return el ? el.value.trim() : ""; };
        var name = get("name"), email = get("email"), phone = get("phone");
        var service = serviceSelect ? serviceSelect.value : "";
        var message = get("message");

        var subject = "New enquiry — " + (name || "Website visitor") + " · EMPOWER website";
        var bodyLines = [
          name,
          email,
          phone,
          "Interested in: " + service,
          "",
          "Message:",
          message
        ];
        var href = "mailto:Christinadee@btinternet.com" +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(bodyLines.join("\n"));
        window.location.href = href;

        var ok = document.querySelector("#form-success");
        if (ok) {
          ok.classList.add("show");
          ok.setAttribute("tabindex", "-1");
          ok.focus();
        }
      });
    }

    /* ============================================================
       MOTION — only when GSAP present and motion allowed
       ============================================================ */
    if (!hasGSAP || reduceMotion) {
      // Make sure nothing is left hidden.
      document.documentElement.classList.add("no-gsap");
      return;
    }

    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    /* ---- Hero entrance is handled in CSS (resilient, never stranded).
       Here we only add a gentle scroll parallax on the hero photo. ---- */
    if (window.ScrollTrigger) {
      gsap.utils.toArray("[data-hero-parallax]").forEach(function (img) {
        gsap.to(img, {
          yPercent: 6, ease: "none",
          scrollTrigger: { trigger: img, start: "top top", end: "bottom top", scrub: true }
        });
      });
    }

    /* ---- Generic scroll reveals ---- */
    var reveals = gsap.utils.toArray("[data-reveal]");
    reveals.forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

    /* ---- Grouped reveals (stagger children) ---- */
    gsap.utils.toArray("[data-reveal-group]").forEach(function (group) {
      var kids = group.querySelectorAll("[data-reveal-child]");
      gsap.set(kids, { opacity: 0, y: 32 });
      gsap.to(kids, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: group, start: "top 80%", once: true }
      });
    });

    /* ---- Hairline draws ---- */
    gsap.utils.toArray("[data-draw]").forEach(function (line) {
      gsap.fromTo(line, { scaleX: 0 }, {
        scaleX: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: line, start: "top 90%", once: true }
      });
    });

    /* ---- Stat count-up + rise ---- */
    gsap.utils.toArray("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: function () { el.textContent = Math.round(obj.v); }
      });
    });
  });
})();
