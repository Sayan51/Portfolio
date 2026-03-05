/* ============================================
   project-cards.js — Expandable Mission Cards
   ============================================ */
const ProjectCards = (function () {
    function init() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            const header = card.querySelector('.project-card-header');
            header.addEventListener('click', function () {
                const isExpanded = card.classList.contains('expanded');

                // Collapse all others
                cards.forEach(c => {
                    if (c !== card) c.classList.remove('expanded');
                });

                if (isExpanded) {
                    card.classList.remove('expanded');
                } else {
                    card.classList.add('expanded');
                    SoundManager.playWhoosh();

                    // GSAP animation if available
                    if (typeof gsap !== 'undefined') {
                        const details = card.querySelector('.project-card-details');
                        const items = details.querySelectorAll('li, .project-github-btn');
                        gsap.fromTo(items,
                            { opacity: 0, y: 15 },
                            { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, delay: 0.2, ease: 'power2.out' }
                        );
                    }
                }
            });
        });
    }

    return { init };
})();
