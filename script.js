(() => {
    "use strict";

    const body = document.body;
    const header = document.getElementById("site-header");
    const progressBar = document.getElementById("scroll-progress-bar");
    const navToggle = document.getElementById("nav-toggle");
    const navLinksContainer = document.getElementById("nav-links");
    const navLinks = [...document.querySelectorAll(".nav-link")];
    const sections = [...document.querySelectorAll("main section[id]")];
    const toTopButton = document.getElementById("to-top");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.getElementById("current-year").textContent = new Date().getFullYear();

    /* ---------------------------------------------------------
       Mobile navigation
       --------------------------------------------------------- */

    const closeNavigation = () => {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
        navLinksContainer.classList.remove("open");
        body.classList.remove("nav-open");
    };

    const openNavigation = () => {
        navToggle.setAttribute("aria-expanded", "true");
        navToggle.setAttribute("aria-label", "Close menu");
        navLinksContainer.classList.add("open");
        body.classList.add("nav-open");
    };

    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        isOpen ? closeNavigation() : openNavigation();
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNavigation();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 960) {
            closeNavigation();
        }
    });

    /* ---------------------------------------------------------
       Scroll state: header, progress, active section, top button
       --------------------------------------------------------- */

    let scrollTicking = false;

    const updateActiveLink = () => {
        const marker = window.scrollY + window.innerHeight * 0.34;
        let activeId = sections[0]?.id;

        sections.forEach((section) => {
            if (section.offsetTop <= marker) {
                activeId = section.id;
            }
        });

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
            activeId = sections[sections.length - 1]?.id;
        }

        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${activeId}`;
            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const updateScrollState = () => {
        const scrollTop = window.scrollY;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;

        header.classList.toggle("scrolled", scrollTop > 16);
        progressBar.style.transform = `scaleX(${progress})`;
        toTopButton.classList.toggle("visible", scrollTop > 700);
        updateActiveLink();
        scrollTicking = false;
    };

    const requestScrollUpdate = () => {
        if (!scrollTicking) {
            scrollTicking = true;
            window.requestAnimationFrame(updateScrollState);
        }
    };

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    updateScrollState();

    toTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    });

    /* ---------------------------------------------------------
       Reveal-on-scroll
       --------------------------------------------------------- */

    const revealElements = [...document.querySelectorAll("[data-reveal]")];

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -48px 0px"
            }
        );

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    /* ---------------------------------------------------------
       Subtle pointer spotlight on cards
       --------------------------------------------------------- */

    const spotlightCards = document.querySelectorAll(".spotlight");

    spotlightCards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") return;

            const bounds = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
            card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
        });
    });

    /* ---------------------------------------------------------
       Typing effect
       --------------------------------------------------------- */

    if (window.Typed && !prefersReducedMotion) {
        new window.Typed("#typed-role", {
            strings: ["Software Developer", "Python Developer", "Problem Solver"],
            typeSpeed: 66,
            backSpeed: 38,
            backDelay: 1800,
            startDelay: 350,
            loop: true,
            smartBackspace: true,
            cursorChar: "_"
        });
    }

    /* ---------------------------------------------------------
       Contact form → opens the visitor's email app
       --------------------------------------------------------- */

    const contactForm = document.getElementById("contact-form");

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const formData = new FormData(contactForm);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const message = String(formData.get("message") || "").trim();

        const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
        const bodyText = encodeURIComponent(
            `Hi Krishna,\n\n${message}\n\n— ${name}\nEmail: ${email}`
        );

        window.location.href = `mailto:krishnapatil50604@gmail.com?subject=${subject}&body=${bodyText}`;
    });
})();
