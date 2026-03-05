/* ============================================
   easter-eggs.js — All Hidden Interactions
   ============================================ */
const EasterEggs = (function () {
    let clickCount = 0;
    let clickTimer = null;
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let idleTimer = null;
    let idleAssistant = null;
    let idleFactInterval = null;
    let backtickCount = 0;
    let backtickTimer = null;
    let scrollStartTime = 0;
    let voidFound = false;

    function init() {
        initNameClick();
        initKonamiCode();
        initIdleDetection();
        initSecretConsole();
        initSpeedRunDetection();
        initRightClickBlock();
        initDoubleTapMobile();
    }

    // === EASTER EGG 1: Name Click (5x) ===
    function initNameClick() {
        const heroName = document.getElementById('hero-name');
        if (!heroName) return;

        heroName.addEventListener('click', function () {
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { clickCount = 0; }, 2000);

            if (clickCount >= 5) {
                clickCount = 0;
                triggerVoid();
            }
        });
    }

    function triggerVoid() {
        if (voidFound) return;
        const overlay = document.createElement('div');
        overlay.className = 'void-overlay active';
        overlay.innerHTML = `
            <div class="void-text-main">YOU FOUND THE VOID.</div>
            <div class="void-text-sub">Welcome, curious one.</div>
        `;
        document.body.appendChild(overlay);
        SoundManager.playBoot();

        setTimeout(() => {
            overlay.style.transition = 'opacity 1s ease';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                // Add badge
                if (!voidFound) {
                    voidFound = true;
                    const heroName = document.getElementById('hero-name');
                    if (heroName) {
                        const badge = document.createElement('span');
                        badge.className = 'void-badge';
                        badge.textContent = '🔓';
                        heroName.appendChild(badge);
                    }
                }
            }, 1000);
        }, 2000);
    }

    // === EASTER EGG 2: Konami Code ===
    function initKonamiCode() {
        document.addEventListener('keydown', function (e) {
            konamiCode.push(e.key);
            if (konamiCode.length > konamiSequence.length) konamiCode.shift();

            if (konamiCode.join(',') === konamiSequence.join(',')) {
                konamiCode = [];
                triggerKonami();
            }
        });
    }

    function triggerKonami() {
        // Barrel roll
        document.body.style.transition = 'transform 1s ease-in-out';
        document.body.style.transform = 'rotate(360deg)';
        setTimeout(() => { document.body.style.transform = ''; }, 1000);

        // Light mode
        document.documentElement.setAttribute('data-theme', 'light');

        // Banner
        const banner = document.createElement('div');
        banner.className = 'konami-banner';
        banner.textContent = '🎮 CHEAT CODE ACTIVATED — LIGHT MODE UNLOCKED FOR 10 SECONDS';
        document.body.appendChild(banner);

        SoundManager.playWhoosh();

        setTimeout(() => {
            document.documentElement.setAttribute('data-theme', 'dark');
            banner.remove();
            document.body.style.transition = '';
        }, 10000);
    }

    // === EASTER EGG 3: Idle Detection ===
    function initIdleDetection() {
        const events = ['mousemove', 'scroll', 'keydown', 'click', 'touchstart'];
        function resetIdle() {
            clearTimeout(idleTimer);
            clearInterval(idleFactInterval);
            if (idleAssistant && idleAssistant.classList.contains('visible')) {
                // Say welcome back
                const msg = idleAssistant.querySelector('.idle-message');
                if (msg) msg.textContent = 'Welcome back! 🚀';
                setTimeout(() => {
                    idleAssistant.classList.remove('visible');
                }, 1500);
            }
            idleTimer = setTimeout(showIdleAssistant, 30000);
        }
        events.forEach(ev => document.addEventListener(ev, resetIdle, { passive: true }));
        idleTimer = setTimeout(showIdleAssistant, 30000);
    }

    function showIdleAssistant() {
        if (!idleAssistant) {
            idleAssistant = document.createElement('div');
            idleAssistant.className = 'idle-assistant';
            idleAssistant.innerHTML = `
                <div class="idle-robot">┌─────────┐
│  ◉   ◉  │
│    ▽    │
│  ╰───╯  │
└─────────┘</div>
                <div class="idle-message"></div>
            `;
            document.body.appendChild(idleAssistant);
        }

        const msg = idleAssistant.querySelector('.idle-message');
        idleAssistant.classList.add('visible');
        msg.textContent = "Hey! Still there? 👀\nLet me give you a tour...";

        // Pulse nav orb
        const orb = document.querySelector('.nav-orb-main');
        if (orb) orb.style.animation = 'pulse-glow 0.5s ease infinite';

        // Fun facts after 15 more seconds
        let factIndex = 0;
        const facts = [
            "Did you know? Sayandeep has 5+ open source repos!",
            "Fun fact: He led a hackathon team of 4!",
            "He builds AI health platforms for rural India 🏥",
            "He's mastered 3+ tech stacks and counting!",
            "He predicted stock prices with ML pipelines 📈"
        ];

        clearInterval(idleFactInterval);
        idleFactInterval = setTimeout(() => {
            msg.textContent = "Okay, I'll just vibe here... 🎵";
            idleFactInterval = setInterval(() => {
                msg.textContent = facts[factIndex % facts.length];
                factIndex++;
            }, 5000);
        }, 15000);
    }

    // === EASTER EGG 4: Secret Console ===
    function initSecretConsole() {
        document.addEventListener('keydown', function (e) {
            if (e.key === '`') {
                backtickCount++;
                clearTimeout(backtickTimer);
                backtickTimer = setTimeout(() => { backtickCount = 0; }, 1000);

                if (backtickCount >= 3) {
                    backtickCount = 0;
                    toggleSecretConsole();
                }
            }
        });

        const consoleInput = document.getElementById('console-input');
        const consoleOutput = document.getElementById('console-output');
        const closeBtn = document.getElementById('console-close');

        if (closeBtn) closeBtn.addEventListener('click', closeSecretConsole);

        if (consoleInput) {
            consoleInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    const cmd = this.value.trim().toLowerCase();
                    this.value = '';
                    processCommand(cmd, consoleOutput);
                }
            });
        }
    }

    function toggleSecretConsole() {
        const console = document.getElementById('secret-console');
        if (!console) return;
        if (console.classList.contains('open')) {
            closeSecretConsole();
        } else {
            console.classList.add('open');
            SoundManager.playWhoosh();
            document.getElementById('console-input').focus();
        }
    }

    function closeSecretConsole() {
        const console = document.getElementById('secret-console');
        if (console) console.classList.remove('open');
    }

    function processCommand(cmd, output) {
        const p = document.createElement('p');
        p.textContent = '> ' + cmd;
        p.style.color = '#a0a0b0';
        output.appendChild(p);

        const response = document.createElement('p');
        const commands = {
            'help': 'Available commands: help, about, skills, projects, contact, theme matrix, theme cyberpunk, party, exit',
            'about': null,
            'skills': null,
            'projects': null,
            'contact': null,
            'exit': null,
            'theme matrix': null,
            'theme cyberpunk': null,
            'party': null
        };

        if (cmd === 'help') {
            response.textContent = commands.help;
        } else if (['about', 'skills', 'projects', 'contact'].includes(cmd)) {
            response.textContent = '> Navigating to ' + cmd + '...';
            const target = document.getElementById(cmd);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth' });
                    closeSecretConsole();
                }, 500);
            }
        } else if (cmd === 'theme matrix') {
            response.textContent = '> Entering the Matrix...';
            document.body.style.filter = 'hue-rotate(80deg) saturate(2)';
            setTimeout(() => { document.body.style.filter = ''; }, 10000);
        } else if (cmd === 'theme cyberpunk') {
            response.textContent = '> Welcome to Night City...';
            document.body.style.filter = 'hue-rotate(-30deg) saturate(1.5) contrast(1.1)';
            setTimeout(() => { document.body.style.filter = ''; }, 10000);
        } else if (cmd === 'party') {
            response.textContent = '> 🎉 PARTY MODE ACTIVATED!';
            document.body.style.animation = 'barrel-roll 0.5s ease 2';
            document.body.style.filter = 'hue-rotate(0deg)';
            let hue = 0;
            const partyInterval = setInterval(() => {
                hue += 30;
                document.body.style.filter = `hue-rotate(${hue}deg)`;
            }, 100);
            setTimeout(() => {
                clearInterval(partyInterval);
                document.body.style.filter = '';
                document.body.style.animation = '';
            }, 5000);
        } else if (cmd === 'exit') {
            closeSecretConsole();
            return;
        } else {
            response.textContent = "> Command not found. Type 'help' for available commands.";
            response.style.color = '#ff003c';
        }

        output.appendChild(response);
        output.scrollTop = output.scrollHeight;
    }

    // === EASTER EGG 5: Speed Run Detection ===
    function initSpeedRunDetection() {
        let isAtTop = true;

        window.addEventListener('scroll', function () {
            if (window.scrollY < 100) {
                isAtTop = true;
                scrollStartTime = Date.now();
            }

            if (isAtTop && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                isAtTop = false;
                const elapsed = (Date.now() - scrollStartTime) / 1000;
                if (elapsed < 5 && scrollStartTime > 0) {
                    showSpeedRunBadge();
                }
            }
        }, { passive: true });
    }

    function showSpeedRunBadge() {
        const badge = document.createElement('div');
        badge.className = 'speed-run-badge';
        badge.innerHTML = `
            <h3>⚡ SPEED RUN DETECTED</h3>
            <p>Whoa! Slow down, speedrunner! 🏃💨</p>
            <p>You missed all the good stuff. Scroll back up!</p>
        `;
        document.body.appendChild(badge);
        SoundManager.playWhoosh();

        setTimeout(() => {
            badge.style.transition = 'opacity 0.5s ease';
            badge.style.opacity = '0';
            setTimeout(() => badge.remove(), 500);
        }, 4000);
    }

    // === Right-Click Block ===
    function initRightClickBlock() {
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            // Show custom message
            const msg = document.createElement('div');
            msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);border:1px solid #00f0ff;border-radius:12px;padding:20px 30px;z-index:10002;font-family:"Fira Code",monospace;color:#00f0ff;font-size:0.9rem;text-align:center;';
            msg.textContent = 'Nice try, but this source code is classified 😎';
            document.body.appendChild(msg);
            setTimeout(() => {
                msg.style.transition = 'opacity 0.5s ease';
                msg.style.opacity = '0';
                setTimeout(() => msg.remove(), 500);
            }, 2000);
        });
    }

    // === Double-Tap (Mobile) ===
    function initDoubleTapMobile() {
        if (!('ontouchstart' in window)) return;
        const heroName = document.getElementById('hero-name');
        if (!heroName) return;

        let lastTap = 0;
        heroName.addEventListener('touchend', function (e) {
            const now = Date.now();
            if (now - lastTap < 300) {
                // Double tap!
                if (navigator.vibrate) navigator.vibrate(50);

                // Confetti burst
                for (let i = 0; i < 20; i++) {
                    const confetti = document.createElement('div');
                    const color = Math.random() > 0.5 ? '#00f0ff' : '#b400ff';
                    confetti.style.cssText = `position:fixed;width:8px;height:8px;background:${color};border-radius:50%;left:${e.changedTouches[0].clientX}px;top:${e.changedTouches[0].clientY}px;pointer-events:none;z-index:10000;`;
                    document.body.appendChild(confetti);

                    const angle = (Math.PI * 2 * i) / 20;
                    const distance = 50 + Math.random() * 100;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance - 100;

                    confetti.animate([
                        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                        { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
                    ], { duration: 800, easing: 'ease-out' });

                    setTimeout(() => confetti.remove(), 800);
                }

                // Toast
                const toast = document.createElement('div');
                toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);border:1px solid #00f0ff;border-radius:20px;padding:8px 20px;color:#00f0ff;font-family:"Fira Code",monospace;font-size:0.8rem;z-index:10000;';
                toast.textContent = '✨ You discovered a secret!';
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.style.transition = 'opacity 0.5s ease';
                    toast.style.opacity = '0';
                    setTimeout(() => toast.remove(), 500);
                }, 2000);
            }
            lastTap = now;
        });
    }

    return { init };
})();
