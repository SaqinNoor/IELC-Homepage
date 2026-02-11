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

// 2. Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button, .magnetic');

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

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
    });
});

// 3. Magnetic Effect
const magnetics = document.querySelectorAll('.magnetic');

magnetics.forEach((magnetic) => {
    magnetic.addEventListener('mousemove', (e) => {
        const rect = magnetic.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(magnetic, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
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

// 4. Loading Animation
const tlLoader = gsap.timeline();

tlLoader
    .to('.loader-progress', {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut',
    })
    .to('.loader-text', {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
    })
    .to('.loader', {
        y: '-100%',
        duration: 1,
        ease: 'power4.inOut',
    }, '-=0.3')
    .to('.hero-title span', { // Fixed from .from() to .to()
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
    }, '-=0.5');

// 5. Stats Counter Animation
const stats = document.querySelectorAll('.stat-number');

stats.forEach((stat) => {
    const target = +stat.getAttribute('data-target');

    ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        once: true,
        onEnter: () => {
            gsap.to(stat, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: 'power1.out',
            });
        },
    });
});

// 6. Reveal Paragraphs
const revealParagraphs = document.querySelectorAll('.reveal-paragraph');

revealParagraphs.forEach((p) => {
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

// 7. Horizontal Scroll (What We Do)
// Only animate on desktop, fallback css handles mobile
if (window.innerWidth > 768) {
    const race = document.querySelector('.pin-wrap');

    // Calculate width to scroll: scrollWidth - clientWidth + padding buffer
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
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
    });
}

// 8. Milestones Stagger
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

// 9. Moderator Image Parallax
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

// 10. Nav Change on Scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
