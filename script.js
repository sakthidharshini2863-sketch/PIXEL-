const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const headerActions = document.querySelector(".header-actions");
const navLinks = document.querySelectorAll(".site-nav a");

const slider = document.getElementById("slider");
const compareImage = document.getElementById("my-img");

const contactForm = document.getElementById("contactForm");
const contactSubmit = document.getElementById("contactSubmit");
const formFeedback = document.getElementById("formFeedback");

function setHeaderState() {
    header.classList.toggle("scrolled", window.scrollY > 16);
}

function toggleMenu(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !siteNav.classList.contains("open");

    siteNav.classList.toggle("open", shouldOpen);
    headerActions.classList.toggle("open", shouldOpen);
    menuToggle.classList.toggle("active", shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
}

function updateCompareSlider(value) {
    if (!compareImage) {
        return;
    }

    compareImage.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
}

function setupRevealAnimations() {
    const revealItems = document.querySelectorAll(".reveal:not(.price-card):not(.compare-card):not(.compare-section .section-heading)");
    const priceCards = document.querySelectorAll(".pricing-grid .price-card");
    const compareItems = document.querySelectorAll(".compare-section .section-heading, .compare-card");

    if (!window.gsap || !window.ScrollTrigger || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        priceCards.forEach((item) => item.classList.add("is-visible"));
        compareItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    revealItems.forEach((item, index) => {
        const isLowerSection = item.closest(".reviews-section, .contact-section, .site-footer");
        const direction = item.dataset.reveal || (index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right");
        const fromVars = {
            opacity: 0,
            duration: isLowerSection ? 1.1 : 1,
            ease: isLowerSection ? "expo.out" : "power3.out"
        };

        if (isLowerSection) {
            fromVars.y = 36;
            fromVars.scale = 0.985;
            fromVars.filter = "blur(4px)";
        } else if (direction === "left") {
            fromVars.x = -56;
        } else if (direction === "right") {
            fromVars.x = 56;
        } else {
            fromVars.y = 42;
        }

        gsap.fromTo(
            item,
            fromVars,
            {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: isLowerSection ? 1.15 : 1,
                ease: isLowerSection ? "expo.out" : "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: isLowerSection ? "top 92%" : "top 86%",
                    end: "bottom 18%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    if (priceCards.length) {
        gsap.fromTo(
            priceCards,
            {
                opacity: 0,
                y: 58,
                scale: 0.96,
                filter: "blur(6px)"
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1.15,
                ease: "expo.out",
                stagger: 0.14,
                scrollTrigger: {
                    trigger: ".pricing-grid",
                    start: "top 84%",
                    end: "bottom 24%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    if (compareItems.length) {
        gsap.fromTo(
            compareItems,
            {
                opacity: 0,
                y: 28,
                scale: 0.985,
                filter: "blur(4px)"
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1.2,
                ease: "expo.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: ".compare-section",
                    start: "top 82%",
                    end: "bottom 28%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    gsap.fromTo(
        ".hero-copy > *",
        { opacity: 0, y: 32 },
        {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12
        }
    );

    gsap.to(".home__box", {
        yPercent: -4,
        duration: 3.4,
        ease: "sine.inOut",
        stagger: {
            each: 0.08,
            yoyo: true,
            repeat: -1
        }
    });

    gsap.to(".trust-row span", {
        y: -6,
        duration: 1.8,
        ease: "sine.inOut",
        stagger: {
            each: 0.1,
            repeat: -1,
            yoyo: true
        }
    });
}

if (menuToggle) {
    menuToggle.addEventListener("click", () => toggleMenu());
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 860) {
            toggleMenu(false);
        }
    });
});

if (slider) {
    updateCompareSlider(slider.value);
    slider.addEventListener("input", (event) => {
        updateCompareSlider(event.target.value);
    });
}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            formFeedback.textContent = "Please fill in all fields before sending.";
            contactForm.reportValidity();
            return;
        }

        contactSubmit.disabled = true;
        contactSubmit.textContent = "Sending...";
        formFeedback.textContent = "";

        window.setTimeout(() => {
            contactSubmit.disabled = false;
            contactSubmit.textContent = "Send Message";
            formFeedback.textContent = "Message sent successfully. We'll get back to you soon.";
            contactForm.reset();
        }, 1200);
    });
}

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
        toggleMenu(false);
    }
});

setHeaderState();
setupRevealAnimations();
