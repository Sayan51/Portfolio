/* ============================================
   bg-particles.js — Particle Flow System
   ============================================ */
const ParticlesFlowLayer = (function () {
    let particles;
    let velocities;
    let group;
    let time = 0;
    let config;

    function init(scene, cfg) {
        config = cfg;
        group = new THREE.Group();
        scene.add(group);

        const count = cfg.particles;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        velocities = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Spread particles in a large volume
            positions[i * 3] = (Math.random() - 0.5) * 600;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 400 - 100;

            // Velocity — gentle drift
            velocities[i * 3] = (Math.random() - 0.5) * 0.15;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

            // Color: cyan, purple, or white
            const roll = Math.random();
            if (roll < 0.55) {
                // Cyan
                colors[i * 3] = 0; colors[i * 3 + 1] = 0.94; colors[i * 3 + 2] = 1;
            } else if (roll < 0.85) {
                // Purple
                colors[i * 3] = 0.71; colors[i * 3 + 1] = 0; colors[i * 3 + 2] = 1;
            } else {
                // White
                colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
            }

            sizes[i] = 0.5 + Math.random() * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            depthWrite: false
        });

        particles = new THREE.Points(geometry, material);
        group.add(particles);
    }

    function animate(deltaTime) {
        if (!particles) return;
        time += 0.01;

        const pos = particles.geometry.attributes.position.array;
        const count = pos.length / 3;
        const mx = BgInteractions.getMouseX();
        const my = BgInteractions.getMouseY();
        const rawMouse = BgInteractions.getRawMouse();

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // Apply velocity + slight noise
            pos[ix] += velocities[ix] + Math.sin(time + i * 0.01) * 0.02;
            pos[iy] += velocities[iy] + Math.cos(time * 0.8 + i * 0.02) * 0.02;
            pos[iz] += velocities[iz];

            // Wrap around bounds
            if (pos[ix] > 300) pos[ix] = -300;
            if (pos[ix] < -300) pos[ix] = 300;
            if (pos[iy] > 200) pos[iy] = -200;
            if (pos[iy] < -200) pos[iy] = 200;
            if (pos[iz] > 100) pos[iz] = -300;
            if (pos[iz] < -300) pos[iz] = 100;
        }

        particles.geometry.attributes.position.needsUpdate = true;

        // Mouse reactive: push particles outward from mouse projected position
        // (subtle — don't want it too distracting)
        group.rotation.y += (mx * 0.05 - group.rotation.y) * 0.01;
        group.rotation.x += (my * 0.03 - group.rotation.x) * 0.01;

        // Subtle pulse on opacity
        particles.material.opacity = 0.5 + Math.sin(time * 0.3) * 0.15;
    }

    function explode() {
        if (!particles) return;
        const pos = particles.geometry.attributes.position.array;
        for (let i = 0; i < pos.length; i += 3) {
            pos[i] *= 1.8;
            pos[i + 1] *= 1.8;
            pos[i + 2] *= 1.8;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Slowly restore
        let frame = 0;
        const origVels = new Float32Array(velocities);
        function restore() {
            frame++;
            const pos = particles.geometry.attributes.position.array;
            for (let i = 0; i < pos.length; i++) {
                pos[i] *= 0.995;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            if (frame < 120) requestAnimationFrame(restore);
        }
        requestAnimationFrame(restore);
    }

    function dispose() {
        if (particles) {
            particles.geometry.dispose();
            particles.material.dispose();
        }
    }

    return { init, animate, explode, dispose };
})();
