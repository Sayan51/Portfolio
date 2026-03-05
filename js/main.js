/* ============================================
   main.js — App Initialization Orchestrator
   ============================================ */

// Global state
window.portfolioState = {
    device: window.innerWidth >= 992 ? 'desktop' : (window.innerWidth >= 768 ? 'tablet' : 'mobile'),
    soundEnabled: false,
    bootComplete: false,
    activeSection: 'hero',
    navOpen: false,
    idleTimer: null,
    easterEggsFound: []
};

document.addEventListener('DOMContentLoaded', function () {
    // 1. Init sound manager first (needs user interaction to enable)
    SoundManager.init();

    // 2. Setup sound toggle button
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        // Restore preference
        if (localStorage.getItem('portfolio-sound') === 'true') {
            soundToggle.querySelector('.sound-icon').textContent = '🔊';
        }
        soundToggle.addEventListener('click', function () {
            const enabled = SoundManager.toggle();
            this.querySelector('.sound-icon').textContent = enabled ? '🔊' : '🔇';
        });
    }

    // 3. Init Three.js background
    ParticleGalaxy.init();

    // 4. Init custom cursor
    CustomCursor.init();

    // 5. Run boot sequence, then init everything else
    BootSequence.init(function onBootComplete() {
        window.portfolioState.bootComplete = true;

        // Init all modules
        TypedHero.init();
        NavOrb.init();
        StatsCounter.init();
        SkillSphere.init();
        ProjectCards.init();
        Timeline.init();
        MatrixRain.init();
        ContactForm.init();
        ScrollAnimations.init();
        EasterEggs.init();

        // Add hover sound to interactive elements
        document.querySelectorAll('a, button, .project-card, .nav-orb-item, .skill-tag').forEach(el => {
            el.addEventListener('mouseenter', () => SoundManager.playHover());
        });
        document.querySelectorAll('button, .hero-btn, .nav-orb-main').forEach(el => {
            el.addEventListener('click', () => SoundManager.playClick());
        });
    });

    // 6. Device detection and resize handler
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            window.portfolioState.device = window.innerWidth >= 992 ? 'desktop' : (window.innerWidth >= 768 ? 'tablet' : 'mobile');
        }, 250);
    });

    // 7. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 8. Active section detection
    const sections = document.querySelectorAll('.section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                window.portfolioState.activeSection = entry.target.id;
            }
        });
    }, { threshold: 0.3 });
    sections.forEach(s => sectionObserver.observe(s));
});
