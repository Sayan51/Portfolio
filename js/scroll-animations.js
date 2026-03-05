/* ============================================
   scroll-animations.js — GSAP ScrollTrigger
   ============================================ */
const ScrollAnimations = (function () {
    function init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        // Fade in all sections
        document.querySelectorAll('.section').forEach(section => {
            if (section.id === 'hero') return; // Skip hero

            gsap.fromTo(section.querySelector('.section-container') || section, {
                opacity: 0,
                y: 60
            }, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 50%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // About section
        gsap.fromTo('.about-avatar', { opacity: 0, x: -60 }, {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.about-avatar', start: 'top 80%', toggleActions: 'play none none none' }
        });
        gsap.fromTo('.about-text', { opacity: 0, x: 60 }, {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.about-text', start: 'top 80%', toggleActions: 'play none none none' }
        });

        // Stat hexes
        gsap.fromTo('.stat-hex', { scale: 0, opacity: 0 }, {
            scale: 1, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(2)',
            scrollTrigger: { trigger: '.about-stats', start: 'top 85%', toggleActions: 'play none none none' }
        });

        // Skill cards
        gsap.fromTo('.skill-card', { y: 40, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '.skill-categories', start: 'top 85%', toggleActions: 'play none none none' }
        });

        // Project cards
        gsap.fromTo('.project-card', { y: 50, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: '.project-cards', start: 'top 85%', toggleActions: 'play none none none' }
        });

        // Education card
        gsap.fromTo('.education-card', { scale: 0.8, opacity: 0 }, {
            scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.education-card', start: 'top 80%', toggleActions: 'play none none none' }
        });

        // Leadership cards
        gsap.fromTo('.leadership-card', { y: 40, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power3.out',
            scrollTrigger: { trigger: '.leadership-cards', start: 'top 85%', toggleActions: 'play none none none' }
        });

        // GitHub section
        gsap.fromTo('.github-content', { y: 40, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.github-content', start: 'top 85%', toggleActions: 'play none none none' }
        });

        // Contact section
        gsap.fromTo('.contact-terminal', { x: -60, opacity: 0 }, {
            x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.contact-layout', start: 'top 80%', toggleActions: 'play none none none' }
        });
        gsap.fromTo('.contact-info', { x: 60, opacity: 0 }, {
            x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.contact-layout', start: 'top 80%', toggleActions: 'play none none none' }
        });

        // Glitch trigger loop for hero name
        setInterval(() => {
            const glitch = document.querySelector('.glitch');
            if (glitch) {
                glitch.classList.add('glitching');
                setTimeout(() => glitch.classList.remove('glitching'), 300);
            }
        }, 3000);

        // GitHub contribution graph generation
        generateContributionGraph();

        // Init Vanilla Tilt
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll('[data-tilt]'));
        }
    }

    function generateContributionGraph() {
        const container = document.getElementById('github-graph');
        if (!container) return;

        const grid = document.createElement('div');
        grid.className = 'contribution-grid';

        for (let week = 0; week < 52; week++) {
            for (let day = 0; day < 7; day++) {
                const cell = document.createElement('div');
                cell.className = 'contribution-cell';
                const rand = Math.random();
                if (rand > 0.7) cell.classList.add('level-1');
                if (rand > 0.82) cell.classList.add('level-2');
                if (rand > 0.9) cell.classList.add('level-3');
                if (rand > 0.96) cell.classList.add('level-4');
                grid.appendChild(cell);
            }
        }

        container.appendChild(grid);
    }

    return { init };
})();
