/* ============================================
   timeline.js — Experience Timeline Animations
   ============================================ */
const Timeline = (function () {
    function init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            // Fallback: just show items
            document.querySelectorAll('.timeline-item').forEach(item => {
                item.style.opacity = '1';
            });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Animate timeline items
        const items = document.querySelectorAll('.timeline-item');
        items.forEach((item, i) => {
            const isLeft = item.classList.contains('left');
            gsap.fromTo(item, {
                x: isLeft ? -100 : 100,
                opacity: 0,
                filter: 'blur(10px)'
            }, {
                x: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    end: 'bottom 60%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Animate timeline nodes
        document.querySelectorAll('.timeline-node').forEach(node => {
            gsap.fromTo(node, {
                scale: 0,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: 'back.out(2)',
                scrollTrigger: {
                    trigger: node,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    return { init };
})();
