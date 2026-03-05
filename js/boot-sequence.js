/* ============================================
   boot-sequence.js — Cinematic Loading Animation
   ============================================ */
const BootSequence = (function () {
    let overlay;
    let skipped = false;

    function typeWriter(el, text, speed) {
        return new Promise(resolve => {
            let i = 0;
            const interval = setInterval(() => {
                if (skipped) { el.textContent = text; clearInterval(interval); resolve(); return; }
                el.textContent += text.charAt(i);
                i++;
                if (i >= text.length) { clearInterval(interval); resolve(); }
            }, speed || 30);
        });
    }

    function wait(ms) {
        return new Promise(resolve => {
            if (skipped) { resolve(); return; }
            setTimeout(resolve, ms);
        });
    }

    async function init(onComplete) {
        overlay = document.getElementById('boot-overlay');
        if (!overlay) { onComplete(); return; }

        const container = overlay.querySelector('.boot-text-container');
        const skipBtn = overlay.querySelector('.boot-skip');

        // Skip handlers
        const doSkip = () => { skipped = true; finish(onComplete); };
        skipBtn.addEventListener('click', doSkip);
        const keyHandler = (e) => { if (e.key) doSkip(); };
        setTimeout(() => document.addEventListener('keydown', keyHandler, { once: true }), 800);

        SoundManager.playBoot();

        // Step 1: INITIALIZING
        const p1 = document.createElement('p');
        container.appendChild(p1);
        await typeWriter(p1, '> INITIALIZING SYSTEM...', 25);
        await wait(400);

        if (skipped) return;

        // Step 2: LOADING MODULES
        const p2 = document.createElement('p');
        container.appendChild(p2);
        await typeWriter(p2, '> LOADING MODULES...', 25);

        // Progress bar
        const barContainer = document.createElement('div');
        barContainer.className = 'boot-progress-bar';
        const barFill = document.createElement('div');
        barFill.className = 'boot-progress-fill';
        barContainer.appendChild(barFill);
        container.appendChild(barContainer);

        // Animate progress
        await new Promise(resolve => {
            let progress = 0;
            const interval = setInterval(() => {
                if (skipped) { clearInterval(interval); resolve(); return; }
                progress += 3 + Math.random() * 5;
                if (progress > 100) progress = 100;
                barFill.style.width = progress + '%';
                if (progress >= 100) { clearInterval(interval); resolve(); }
            }, 40);
        });

        // Module names
        const modules = ['three.js ✓', 'gsap ✓', 'particles ✓', 'neural-net ✓'];
        for (const mod of modules) {
            if (skipped) break;
            const pMod = document.createElement('p');
            pMod.style.color = '#00ff88';
            pMod.style.fontSize = '0.8rem';
            pMod.textContent = '  ' + mod;
            container.appendChild(pMod);
            await wait(150);
        }

        await wait(300);
        if (skipped) return;

        // Step 3: SYSTEM ONLINE
        container.innerHTML = '';
        const sysOnline = document.createElement('div');
        sysOnline.className = 'boot-system-online';
        sysOnline.textContent = 'SYSTEM ONLINE';
        container.appendChild(sysOnline);

        // Flicker
        overlay.style.animation = 'boot-flicker 0.15s 3';
        await wait(800);
        if (skipped) return;

        // Step 4: Reveal
        finish(onComplete);
    }

    function finish(onComplete) {
        if (!overlay) return;
        document.removeEventListener('keydown', () => { });

        // Fade out (simplified — no shatter for performance)
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '0';

        setTimeout(() => {
            overlay.remove();
            // Explode particles
            if (typeof BackgroundManager !== 'undefined') {
                BackgroundManager.explodeParticles();
            }
            if (onComplete) onComplete();
        }, 500);
    }

    return { init };
})();
