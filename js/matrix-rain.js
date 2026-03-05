/* ============================================
   matrix-rain.js — Code Rain Effect
   ============================================ */
const MatrixRain = (function () {
    let canvas, ctx;
    let columns, drops;
    let animId;
    const chars = 'import def const let return if else for while class self print console.log = == != + - * { } [ ] ( ) ; : 0 1'.split(' ');

    function init() {
        if (window.innerWidth < 768) return; // Disable on mobile

        canvas = document.getElementById('matrix-rain-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        resize();

        // Start only when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) startRain();
                else stopRain();
            });
        }, { threshold: 0.1 });

        const section = document.getElementById('github');
        if (section) observer.observe(section);
    }

    function resize() {
        const section = canvas.closest('.section') || canvas.parentElement;
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
        const fontSize = 14;
        columns = Math.floor(canvas.width / fontSize);
        drops = new Array(columns).fill(1);
    }

    function startRain() {
        if (animId) return;
        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = '12px "Fira Code", monospace';

            for (let i = 0; i < columns; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * 14;
                const y = drops[i] * 14;

                // Gradient: bright at top of drop, dim as it falls
                const alpha = Math.max(0.1, 1 - (drops[i] * 14 / canvas.height));
                ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.6})`;
                ctx.fillText(char, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += 0.5; // Slow speed
            }
            animId = requestAnimationFrame(draw);
        }
        draw();
    }

    function stopRain() {
        if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
        }
    }

    window.addEventListener('resize', () => {
        if (canvas) resize();
    });

    return { init };
})();
