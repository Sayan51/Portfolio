/* ============================================
   cursor.js — Custom Dual-Element Cursor
   ============================================ */
const CustomCursor = (function () {
    let inner, outer;
    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;
    let isTouch = false;
    let rafId = null;

    function init() {
        isTouch = ('ontouchstart' in window) || window.innerWidth < 768;
        if (isTouch) {
            document.body.classList.add('touch-device');
            return;
        }

        inner = document.getElementById('cursor-inner');
        outer = document.getElementById('cursor-outer');
        if (!inner || !outer) return;

        document.body.style.cursor = 'none';
        const style = document.createElement('style');
        style.textContent = 'a,button,input,textarea,select,[role="button"],.project-card,.nav-orb-main,.skill-tag,.hero-btn,.orbit-icon,.footer-social-icon,.github-visit-btn,.project-github-btn,.contact-submit,.mobile-nav-toggle,.sound-toggle,.boot-skip,.nav-orb-item,.leadership-card,.course-tag{cursor:none!important}';
        document.head.appendChild(style);

        document.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mousedown', onDown);
        document.addEventListener('mouseup', onUp);

        // Interactive elements hover
        const interactives = 'a,button,input,textarea,select,[role="button"],.project-card,.nav-orb-main,.skill-tag,.hero-btn';
        document.addEventListener('mouseover', function (e) {
            if (e.target.closest(interactives)) {
                document.body.classList.add('cursor-hover');
            }
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest(interactives)) {
                document.body.classList.remove('cursor-hover');
            }
        });

        // Text hover
        document.addEventListener('mouseover', function (e) {
            if (e.target.matches('p,span,h1,h2,h3,h4,li,.about-description')) {
                document.body.classList.add('cursor-text');
            }
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.matches('p,span,h1,h2,h3,h4,li,.about-description')) {
                document.body.classList.remove('cursor-text');
            }
        });

        animate();
    }

    function onMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        inner.style.left = mouseX + 'px';
        inner.style.top = mouseY + 'px';
    }

    function onDown() { document.body.classList.add('cursor-click'); }
    function onUp() { document.body.classList.remove('cursor-click'); }

    function animate() {
        // Elastic follow for outer ring
        outerX += (mouseX - outerX) * 0.15;
        outerY += (mouseY - outerY) * 0.15;
        outer.style.left = outerX + 'px';
        outer.style.top = outerY + 'px';
        rafId = requestAnimationFrame(animate);
    }

    function destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        document.removeEventListener('mousemove', onMove);
    }

    return { init, destroy };
})();
