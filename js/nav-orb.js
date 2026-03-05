/* ============================================
   nav-orb.js — Radial Navigation Orb
   ============================================ */
const NavOrb = (function () {
    let orb, menu, isOpen = false;

    function init() {
        orb = document.getElementById('nav-orb');
        menu = document.getElementById('nav-orb-menu');
        if (!orb) return;

        const main = orb.querySelector('.nav-orb-main');
        main.addEventListener('click', toggle);

        // Nav items click
        const items = orb.querySelectorAll('.nav-orb-item');
        items.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                const target = document.querySelector(href);
                if (target) {
                    // Warp speed effect
                    document.body.style.animation = 'warp-speed 0.6s ease';
                    setTimeout(() => {
                        document.body.style.animation = '';
                    }, 600);

                    target.scrollIntoView({ behavior: 'smooth' });
                    SoundManager.playWhoosh();
                }
                close();
            });
        });

        // Close on click outside
        document.addEventListener('click', function (e) {
            if (isOpen && !orb.contains(e.target)) close();
        });

        // Mobile nav
        initMobileNav();
    }

    function toggle() {
        if (isOpen) close(); else open();
    }

    function open() {
        isOpen = true;
        orb.classList.add('open');
        SoundManager.playWhoosh();
    }

    function close() {
        isOpen = false;
        orb.classList.remove('open');
    }

    function initMobileNav() {
        const toggle = document.getElementById('mobile-nav-toggle');
        const overlay = document.getElementById('mobile-nav-overlay');
        if (!toggle || !overlay) return;

        toggle.addEventListener('click', function () {
            const isOpen = overlay.classList.contains('open');
            if (isOpen) {
                overlay.classList.remove('open');
                toggle.classList.remove('open');
            } else {
                overlay.classList.add('open');
                toggle.classList.add('open');
            }
        });

        overlay.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', function () {
                overlay.classList.remove('open');
                toggle.classList.remove('open');
                SoundManager.playWhoosh();
            });
        });
    }

    return { init };
})();
