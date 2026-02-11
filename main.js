import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Lenis for Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// 1.1 Smooth Scroll to Anchors (Lenis)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            lenis.scrollTo(targetElement, {
                offset: 0,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        }
    });
});

// 2. Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const interactiveElements = document.querySelectorAll('a, button, .magnetic');

let posX = 0, posY = 0;
let mouseX = 0, mouseY = 0;

gsap.to({}, {
    duration: 0.016,
    repeat: -1,
    onRepeat: () => {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;

        gsap.set(follower, {
            css: {
                left: posX,
                top: posY
            }
        });

        gsap.set(cursor, {
            css: {
                left: mouseX,
                top: mouseY
            }
        });
    }
});

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const addCursorActive = () => {
    cursor.classList.add('active');
    follower.classList.add('active');
};
const removeCursorActive = () => {
    cursor.classList.remove('active');
    follower.classList.remove('active');
};

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', addCursorActive);
    el.addEventListener('mouseleave', removeCursorActive);
});

// 3. Magnetic Effect
const magnetics = document.querySelectorAll('.magnetic');
magnetics.forEach((magnetic) => {
    magnetic.addEventListener('mousemove', (e) => {
        const rect = magnetic.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(magnetic, {
            x: x * 0.1,
            y: y * 0.1,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    magnetic.addEventListener('mouseleave', () => {
        gsap.to(magnetic, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// 4. Page Transition & Loader Logic
const hasLoader = document.querySelector('.loader');
const isTransitionMode = document.documentElement.classList.contains('transition-mode');

// A. Entrance: Handle Page Load
window.addEventListener('load', () => {
    if (isTransitionMode) {
        // Returning/Navigating: Transition Mode is active (CSS handled initial state)

        // 1. Match GSAP state to CSS state (Covering)
        gsap.set('.page-transition', { y: 0 });
        if (hasLoader) gsap.set('.loader', { y: '-100%' });
        gsap.set('.hero-title span', { y: 0, opacity: 1 });

        document.querySelectorAll('.stat-number').forEach(el => {
            const target = el.getAttribute('data-target');
            if (target) el.textContent = target;
        });

        // 2. Remove class to unblock GSAP (remove !important overrides)
        document.documentElement.classList.remove('transition-mode');

        // 3. Animate Reveal
        gsap.to('.page-transition', {
            y: '-100%',
            duration: 1.0,
            ease: 'power4.inOut',
            delay: 0.1
        });

        // Clear flag
        sessionStorage.removeItem('ielc-transition-active');

    } else {
        // First Visit: Loader Sequence
        // Curtain is hidden by default in CSS, so just play loader

        const tlLoader = gsap.timeline();
        tlLoader
            .to('.logo-path', {
                strokeDashoffset: 0,
                duration: 1.8,
                ease: 'power2.inOut',
                stagger: 0.05
            })
            .to('.logo-path', {
                fill: (i, target) => target.classList.contains('cls-1') ? '#E63946' : '#ffffff',
                duration: 0.4,
                ease: 'power1.out'
            })
            .to('.loader', {
                y: '-100%',
                duration: 1.0,
                ease: 'power4.inOut',
                delay: 0.1
            })
            .to('.hero-title span', {
                y: 0,
                opacity: 1,
                duration: 1.5,
                stagger: 0.1,
                ease: 'power3.out',
            }, '-=0.6')
            .to('.stat-number', {
                innerHTML: (i, el) => el.getAttribute('data-target'),
                duration: 2,
                snap: { innerHTML: 1 },
                ease: 'power1.out',
                stagger: 0.2
            }, '-=1.0');
    }
});

// B. Exit: Cover and Navigate
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || this.getAttribute('target') === '_blank') {
            return;
        }

        e.preventDefault();

        // 1. Set flag for next page (Inline script will pick this up)
        sessionStorage.setItem('ielc-transition-active', 'true');

        // 2. Animate Cover
        gsap.set('.page-transition', { y: '100%' }); // Ensure it starts from bottom
        gsap.to('.page-transition', {
            y: 0,
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete: () => {
                window.location.href = href;
            }
        });
    });
});

// C. Browser Back/Forward Cache Handling (bfcache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was restored from cache. ensure curtain is covering then animate reveal
        document.documentElement.classList.remove('transition-mode');
        gsap.set('.page-transition', { y: 0 }); // Force cover first

        // Ensure loader is hidden too
        const hasLoader = document.querySelector('.loader');
        if (hasLoader) gsap.set('.loader', { y: '-100%' });

        // Ensure content is visible
        gsap.set('.hero-title span', { y: 0, opacity: 1 });

        // Animate reveal
        gsap.to('.page-transition', {
            y: '-100%',
            duration: 1.0,
            ease: 'power4.inOut',
            delay: 0.1
        });
    }
});

// 6. ScrollTriggered Reveal Animations
// Paragraphs
document.querySelectorAll('.reveal-paragraph').forEach((p) => {
    gsap.to(p, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: p,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        },
    });
});

// Milestones
if (document.querySelector('.about-milestones')) {
    gsap.from('.milestone-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.about-milestones',
            start: 'top 80%',
        },
    });
}

// Moderator Parallax
if (document.querySelector('.moderator-img')) {
    gsap.from('.moderator-img', {
        scale: 1.2,
        filter: 'blur(10px)',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.moderator-section',
            start: 'top 70%',
        },
    });
}

// 7. Horizontal Scroll (What We Do)
if (window.innerWidth > 768) {
    const race = document.querySelector('.pin-wrap');
    if (race) {
        function getScrollAmount() {
            let raceWidth = race.scrollWidth;
            return -(raceWidth - window.innerWidth + 100);
        }

        const tween = gsap.to(race, {
            x: getScrollAmount,
            duration: 3,
            ease: "none"
        });

        ScrollTrigger.create({
            trigger: ".pin-wrap-container",
            start: "top top",
            end: () => `+=${Math.abs(getScrollAmount())}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true,
        });
    }
}

// 8. Nav Change on Scroll
const nav = document.querySelector('.nav');
if (nav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// 9. Mobile Menu Logic
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        if (mobileMenu.classList.contains('active')) {
            // Animate Links In
            gsap.to(mobileLinks, {
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2
            });
        } else {
            // Reset Links
            gsap.to(mobileLinks, {
                y: '100%',
                duration: 0.3,
                ease: 'power3.in'
            });
        }
    });

    // Close menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            gsap.to(mobileLinks, {
                y: '100%',
                duration: 0.3,
                ease: 'power3.in'
            });
        });
    });
}
