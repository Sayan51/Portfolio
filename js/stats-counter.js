/* ============================================
   stats-counter.js — Animated Number Counters
   ============================================ */
const StatsCounter = (function () {
    let counted = false;

    function init() {
        const stats = document.querySelectorAll('.stat-hex');
        if (!stats.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    animateAll(stats);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        stats.forEach(stat => observer.observe(stat));
    }

    function animateAll(stats) {
        stats.forEach(stat => {
            const numberEl = stat.querySelector('.stat-number');
            const target = parseInt(stat.dataset.target) || 0;
            const suffix = stat.dataset.suffix || '';
            animateNumber(numberEl, 0, target, 1500, suffix);
        });
    }

    function animateNumber(el, start, end, duration, suffix) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    return { init };
})();
