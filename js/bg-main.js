/* ============================================
   bg-main.js — Background Layer Orchestrator
   ============================================ */
const BackgroundManager = (function () {
    let scene, camera, renderer;
    let animId;
    let config;
    let clock;
    let fpsTracker = { frames: 0, lastTime: 0, fps: 60 };

    function init() {
        config = BgResponsive.getConfig();

        // Mobile fallback — no WebGL
        if (config.deviceType === 'mobile') {
            BgResponsive.applyCssFallback();
            return;
        }

        if (typeof THREE === 'undefined') {
            BgResponsive.applyCssFallback();
            return;
        }

        const container = document.getElementById('galaxy-container');
        if (!container) return;

        // Three.js setup
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0a0a0f, 0.0015);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 200);

        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(config.pixelRatio);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        clock = new THREE.Clock();

        // Initialize interaction tracking
        BgInteractions.init();

        // Initialize layers
        NeuralNetworkLayer.init(scene, config);
        GeomShapesLayer.init(scene, config);
        ParticlesFlowLayer.init(scene, config);

        // Resize handler
        window.addEventListener('resize', onResize);

        // Start animation
        fpsTracker.lastTime = performance.now();
        animate();
    }

    function animate() {
        animId = requestAnimationFrame(animate);
        const delta = clock.getDelta();

        // FPS monitoring — drop quality if needed
        trackFPS();

        // Scroll-driven camera depth
        const scroll = BgInteractions.getScroll();
        camera.position.z = 200 - scroll * 80;

        // Camera parallax
        const mx = BgInteractions.getMouseX();
        const my = BgInteractions.getMouseY();
        camera.position.x += (mx * 20 - camera.position.x) * 0.02;
        camera.position.y += (my * 15 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, -100);

        // Animate all layers
        NeuralNetworkLayer.animate(delta);
        GeomShapesLayer.animate(delta);
        ParticlesFlowLayer.animate(delta);

        renderer.render(scene, camera);
    }

    function trackFPS() {
        fpsTracker.frames++;
        const now = performance.now();
        if (now - fpsTracker.lastTime >= 2000) {
            fpsTracker.fps = (fpsTracker.frames * 1000) / (now - fpsTracker.lastTime);
            fpsTracker.frames = 0;
            fpsTracker.lastTime = now;

            // Auto-degrade if FPS drops below 20
            if (fpsTracker.fps < 20) {
                console.warn('[BG] Low FPS detected (' + Math.round(fpsTracker.fps) + '), reducing quality');
                if (renderer) renderer.setPixelRatio(1);
            }
        }
    }

    function onResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function explodeParticles() {
        ParticlesFlowLayer.explode();
    }

    function dispose() {
        if (animId) cancelAnimationFrame(animId);
        NeuralNetworkLayer.dispose();
        GeomShapesLayer.dispose();
        ParticlesFlowLayer.dispose();
        window.removeEventListener('resize', onResize);
        if (renderer) renderer.dispose();
    }

    return { init, explodeParticles, dispose };
})();
