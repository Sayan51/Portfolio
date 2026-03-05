/* ============================================
   typed-hero.js — Typed.js Hero Text Cycling
   ============================================ */
const TypedHero = (function () {
    let typedInstance = null;

    function init() {
        const el = document.getElementById('typed-output');
        if (!el || typeof Typed === 'undefined') return;

        typedInstance = new Typed('#typed-output', {
            strings: [
                'AI/ML Engineer',
                'Full-Stack Developer',
                'Open Source Contributor',
                'Hackathon Champion',
                'Building the Future with Code'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            smartBackspace: true
        });
    }

    function destroy() {
        if (typedInstance) typedInstance.destroy();
    }

    return { init, destroy };
})();
