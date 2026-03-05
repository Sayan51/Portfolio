/* ============================================
   bg-interactions.js — Mouse/Scroll/Touch Input
   ============================================ */
const BgInteractions = (function () {
    let mouseX = 0, mouseY = 0;
    let normalizedX = 0, normalizedY = 0;
    let scrollProgress = 0;
    let isIdle = false;
    let idleTimer = null;
    const listeners = [];

    function init() {
        // Mouse tracking (debounced)
        let moveQueued = false;
        document.addEventListener('mousemove', function (e) {
            if (moveQueued) return;
            moveQueued = true;
            requestAnimationFrame(() => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
                normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
                isIdle = false;
                resetIdleTimer();
                moveQueued = false;
            });
        }, { passive: true });

        // Scroll tracking
        let scrollQueued = false;
        window.addEventListener('scroll', function () {
            if (scrollQueued) return;
            scrollQueued = true;
            requestAnimationFrame(() => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
                scrollQueued = false;
            });
        }, { passive: true });

        // Touch tracking
        document.addEventListener('touchmove', function (e) {
            if (e.touches.length > 0) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
                normalizedX = (mouseX / window.innerWidth) * 2 - 1;
                normalizedY = -(mouseY / window.innerHeight) * 2 + 1;
            }
        }, { passive: true });

        resetIdleTimer();
    }

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => { isIdle = true; }, 5000);
    }

    function getMouseX() { return normalizedX; }
    function getMouseY() { return normalizedY; }
    function getRawMouse() { return { x: mouseX, y: mouseY }; }
    function getScroll() { return scrollProgress; }
    function getIdle() { return isIdle; }

    return { init, getMouseX, getMouseY, getRawMouse, getScroll, getIdle };
})();
