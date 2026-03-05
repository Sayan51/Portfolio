/* ============================================
   particles-bg.js — Three.js Galaxy Background
   ============================================ */
const ParticleGalaxy = (function () {
    let scene, camera, renderer, particles;
    let mouseX = 0, mouseY = 0;
    let originalPositions;
    let animId;
    const isMobile = window.innerWidth < 768;

    function init() {
        if (isMobile || typeof THREE === 'undefined') {
            // Use CSS gradient on mobile
            const gradBg = document.createElement('div');
            gradBg.className = 'mobile-gradient-bg';
            document.body.prepend(gradBg);
            return;
        }

        const container = document.getElementById('galaxy-container');
        if (!container) return;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0a0a0f, 0.0008);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 300;

        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        createParticles();

        document.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        }, { passive: true });

        window.addEventListener('resize', onResize);

        animate();
    }

    function createParticles() {
        const isTablet = window.innerWidth < 992;
        const count = isTablet ? 2000 : 5000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const arm = Math.floor(Math.random() * 3);
            const armAngle = (arm / 3) * Math.PI * 2;
            const distance = Math.random() * 200;
            const spiralAngle = distance * 0.05;
            const scatter = (Math.random() - 0.5) * 30;

            positions[i * 3] = Math.cos(armAngle + spiralAngle) * distance + scatter;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20 + scatter * 0.3;
            positions[i * 3 + 2] = Math.sin(armAngle + spiralAngle) * distance + scatter;

            const roll = Math.random();
            if (roll < 0.6) {
                colors[i * 3] = 0; colors[i * 3 + 1] = 0.94; colors[i * 3 + 2] = 1;
            } else if (roll < 0.9) {
                colors[i * 3] = 0.71; colors[i * 3 + 1] = 0; colors[i * 3 + 2] = 1;
            } else {
                colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
            }
        }

        originalPositions = new Float32Array(positions);

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            depthWrite: false
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    function animate() {
        animId = requestAnimationFrame(animate);
        if (!particles) return;

        particles.rotation.y += 0.0003;

        // Subtle camera parallax with mouse
        camera.position.x += (mouseX * 30 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 20 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    function explodeFromCenter() {
        if (!particles) return;
        const pos = particles.geometry.attributes.position.array;
        for (let i = 0; i < pos.length; i += 3) {
            pos[i] *= 1.5;
            pos[i + 1] *= 1.5;
            pos[i + 2] *= 1.5;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Slowly restore
        let frame = 0;
        function restore() {
            frame++;
            const pos = particles.geometry.attributes.position.array;
            for (let i = 0; i < pos.length; i++) {
                pos[i] += (originalPositions[i] - pos[i]) * 0.02;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            if (frame < 120) requestAnimationFrame(restore);
        }
        requestAnimationFrame(restore);
    }

    function onResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return { init, explodeFromCenter };
})();
