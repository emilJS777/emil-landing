/* =========================================================
   EMIL HAMBARDZUMYAN — RESUME & PORTFOLIO
   Shared JavaScript for all pages
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeCurrentYear();
    initializeMobileMenu();
    initializeRevealAnimations();
    initializeActiveNavigation();
    initializeExternalLinks();
    initializeContactForm();
});


/* =========================
   CURRENT YEAR
   ========================= */

function initializeCurrentYear() {
    const yearElements = document.querySelectorAll("[data-current-year]");
    const currentYear = new Date().getFullYear();

    yearElements.forEach((element) => {
        element.textContent = currentYear;
    });
}


/* =========================
   MOBILE NAVIGATION
   ========================= */

function initializeMobileMenu() {
    const menuButton = document.querySelector("[data-menu-button]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");

    if (!menuButton || !mobileMenu) {
        return;
    }

    const closeMenu = () => {
        menuButton.classList.remove("active");
        mobileMenu.classList.remove("open");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
        menuButton.classList.add("active");
        mobileMenu.classList.add("open");

        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        document.body.classList.add("menu-open");
    };

    menuButton.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.contains("open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        const clickedInsideMenu = mobileMenu.contains(event.target);
        const clickedMenuButton = menuButton.contains(event.target);

        if (!clickedInsideMenu && !clickedMenuButton) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1040) {
            closeMenu();
        }
    });
}


/* =========================
   REVEAL ANIMATIONS
   ========================= */

function initializeRevealAnimations() {
    const elements = document.querySelectorAll("[data-reveal]");

    if (!elements.length) {
        return;
    }

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        elements.forEach((element) => {
            element.classList.add("revealed");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("revealed");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    elements.forEach((element) => {
        observer.observe(element);
    });
}


/* =========================
   ACTIVE NAVIGATION
   ========================= */

function initializeActiveNavigation() {
    const currentPage = getCurrentPageName();

    const navigationLinks = document.querySelectorAll(
        ".desktop-nav .nav-link, .mobile-nav .nav-link"
    );

    navigationLinks.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href) {
            return;
        }

        const targetPage = href.split("#")[0];

        link.classList.remove("active");
        link.removeAttribute("aria-current");

        const isHomePage =
            currentPage === "" &&
            (
                targetPage === "" ||
                targetPage === "/" ||
                targetPage === "index.html"
            );

        const isCurrentPage =
            targetPage &&
            targetPage === currentPage;

        if (isHomePage || isCurrentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

function getCurrentPageName() {
    const pathname = window.location.pathname;
    const pageName = pathname.split("/").pop();

    return pageName || "index.html";
}


/* =========================
   EXTERNAL LINKS
   ========================= */

function initializeExternalLinks() {
    const links = document.querySelectorAll(
        'a[target="_blank"]'
    );

    links.forEach((link) => {
        const currentRel = link.getAttribute("rel") || "";
        const relValues = new Set(currentRel.split(" ").filter(Boolean));

        relValues.add("noopener");
        relValues.add("noreferrer");

        link.setAttribute(
            "rel",
            Array.from(relValues).join(" ")
        );
    });
}


/* =========================
   CONTACT FORM
   ========================= */

function initializeContactForm() {
    const form = document.querySelector("[data-contact-form]");

    if (!form) {
        return;
    }

    const statusElement = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const name = sanitizeValue(formData.get("name"));
        const email = sanitizeValue(formData.get("email"));
        const company = sanitizeValue(formData.get("company"));
        const subject = sanitizeValue(formData.get("subject"));
        const message = sanitizeValue(formData.get("message"));

        clearFormStatus(statusElement);

        if (!name || !email || !message) {
            showFormStatus(
                statusElement,
                "Please provide your name, email and message.",
                "error"
            );

            return;
        }

        if (!isValidEmail(email)) {
            showFormStatus(
                statusElement,
                "Please enter a valid email address.",
                "error"
            );

            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Opening email client...";
        }

        const emailSubject =
            subject ||
            `Portfolio inquiry from ${name}`;

        const emailBody = [
            `Name: ${name}`,
            `Email: ${email}`,
            company ? `Company: ${company}` : "",
            "",
            "Message:",
            message
        ]
            .filter(Boolean)
            .join("\n");

        const mailtoLink =
            "mailto:emil301992@gmail.com" +
            `?subject=${encodeURIComponent(emailSubject)}` +
            `&body=${encodeURIComponent(emailBody)}`;

        showFormStatus(
            statusElement,
            "Your email application should open now.",
            "success"
        );

        window.location.href = mailtoLink;

        window.setTimeout(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send message";
            }
        }, 1200);
    });
}

function sanitizeValue(value) {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearFormStatus(statusElement) {
    if (!statusElement) {
        return;
    }

    statusElement.textContent = "";
    statusElement.removeAttribute("data-status");
}

function showFormStatus(statusElement, message, type) {
    if (!statusElement) {
        return;
    }

    statusElement.textContent = message;
    statusElement.setAttribute("data-status", type);
}


/* =========================
   SMOOTH SAME-PAGE LINKS
   ========================= */

document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');

    if (!link) {
        return;
    }

    const targetSelector = link.getAttribute("href");

    if (!targetSelector || targetSelector === "#") {
        return;
    }

    const targetElement = document.querySelector(targetSelector);

    if (!targetElement) {
        return;
    }

    event.preventDefault();

    targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    if (history.pushState) {
        history.pushState(
            null,
            "",
            targetSelector
        );
    }
});