/* ============================================
   bg-geom-shapes.js — Morphing Geometric Shapes
   ============================================ */
const GeomShapesLayer = (function () {
    let shapes = [];
    let group;
    let time = 0;

    function init(scene, cfg) {
        group = new THREE.Group();
        scene.add(group);

        const shapeCount = cfg.geoShapes;
        const geometries = [
            () => new THREE.TetrahedronGeometry(6 + Math.random() * 6, 0),
            () => new THREE.OctahedronGeometry(5 + Math.random() * 5, 0),
            () => new THREE.IcosahedronGeometry(5 + Math.random() * 4, 0),
            () => new THREE.DodecahedronGeometry(4 + Math.random() * 4, 0),
            () => new THREE.TorusGeometry(4 + Math.random() * 3, 1.5, 8, 6)
        ];

        for (let i = 0; i < shapeCount; i++) {
            const geoFn = geometries[i % geometries.length];
            const geo = geoFn();
            const isCyan = Math.random() > 0.4;

            const mat = new THREE.MeshBasicMaterial({
                color: isCyan ? 0x00f0ff : 0xb400ff,
                wireframe: true,
                transparent: true,
                opacity: 0.12 + Math.random() * 0.08,
                blending: THREE.AdditiveBlending
            });

            const mesh = new THREE.Mesh(geo, mat);

            // Distribute in space — spread out widely
            const angle = (i / shapeCount) * Math.PI * 2;
            const radius = 150 + Math.random() * 200;
            mesh.position.set(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 200,
                Math.sin(angle) * radius - 200 + Math.random() * 100
            );

            mesh.userData = {
                rotSpeed: {
                    x: (Math.random() - 0.5) * 0.008,
                    y: (Math.random() - 0.5) * 0.008,
                    z: (Math.random() - 0.5) * 0.005
                },
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.3 + Math.random() * 0.5,
                floatAmplitude: 5 + Math.random() * 10,
                baseY: mesh.position.y,
                baseScale: 0.8 + Math.random() * 0.6,
                pulseOffset: Math.random() * Math.PI * 2,
                morphPhase: Math.random() * Math.PI * 2
            };

            mesh.scale.setScalar(mesh.userData.baseScale);
            group.add(mesh);
            shapes.push(mesh);
        }
    }

    function animate(deltaTime) {
        time += 0.01;
        const mx = BgInteractions.getMouseX();
        const my = BgInteractions.getMouseY();

        shapes.forEach((shape, i) => {
            const ud = shape.userData;

            // Rotation
            shape.rotation.x += ud.rotSpeed.x;
            shape.rotation.y += ud.rotSpeed.y;
            shape.rotation.z += ud.rotSpeed.z;

            // Floating
            shape.position.y = ud.baseY + Math.sin(time * ud.floatSpeed + ud.floatOffset) * ud.floatAmplitude;

            // Scale pulsing (morph effect)
            const pulse = 1 + Math.sin(time * 0.8 + ud.pulseOffset) * 0.12;
            shape.scale.setScalar(ud.baseScale * pulse);

            // Opacity breathing
            shape.material.opacity = 0.08 + Math.sin(time * 0.5 + ud.morphPhase) * 0.06;

            // Vertex morphing (subtle displacement)
            if (shape.geometry.attributes && shape.geometry.attributes.position) {
                const pos = shape.geometry.attributes.position;
                if (!shape.userData.originalPositions) {
                    shape.userData.originalPositions = new Float32Array(pos.array);
                }
                const orig = shape.userData.originalPositions;
                for (let v = 0; v < pos.count; v++) {
                    const ox = orig[v * 3];
                    const oy = orig[v * 3 + 1];
                    const oz = orig[v * 3 + 2];
                    const noise = Math.sin(time * 1.5 + v * 0.5 + ud.morphPhase) * 0.8;
                    pos.array[v * 3] = ox + (ox > 0 ? noise : -noise) * 0.15;
                    pos.array[v * 3 + 1] = oy + noise * 0.15;
                    pos.array[v * 3 + 2] = oz + (oz > 0 ? -noise : noise) * 0.15;
                }
                pos.needsUpdate = true;
            }
        });

        // Mouse parallax on group
        group.rotation.y += (mx * 0.03 - group.rotation.y) * 0.01;
        group.rotation.x += (my * 0.02 - group.rotation.x) * 0.01;
    }

    function dispose() {
        shapes.forEach(s => { s.geometry.dispose(); s.material.dispose(); });
        shapes = [];
    }

    return { init, animate, dispose };
})();
