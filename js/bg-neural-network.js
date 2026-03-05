/* ============================================
   bg-neural-network.js — 3D Neural Network Layer
   ============================================ */
const NeuralNetworkLayer = (function () {
    let nodes = [];
    let connections = [];
    let signals = [];
    let group;
    let config;
    let time = 0;

    function init(scene, cfg) {
        config = cfg;
        group = new THREE.Group();
        scene.add(group);

        createNodes();
        createConnections();
        if (config.enableSignals) createSignals();
    }

    function createNodes() {
        const nodeCount = config.neuralNodes;
        const layers = 4;
        const nodesPerLayer = Math.ceil(nodeCount / layers);

        for (let layer = 0; layer < layers; layer++) {
            const count = layer === 0 ? Math.floor(nodesPerLayer * 0.8) :
                layer === layers - 1 ? Math.floor(nodesPerLayer * 0.5) : nodesPerLayer;
            for (let i = 0; i < count; i++) {
                const layerSpread = 120;
                const x = (layer - layers / 2) * layerSpread;
                const angle = (i / count) * Math.PI * 2;
                const radius = 40 + Math.random() * 60;
                const y = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius - 100;

                // Node sphere
                const geo = new THREE.SphereGeometry(1.5 + Math.random(), 8, 8);
                const mat = new THREE.MeshBasicMaterial({
                    color: Math.random() > 0.4 ? 0x00f0ff : 0xb400ff,
                    transparent: true,
                    opacity: 0.7
                });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(x, y, z);
                mesh.userData = { layer, baseOpacity: 0.5 + Math.random() * 0.3, pulseOffset: Math.random() * Math.PI * 2 };
                group.add(mesh);
                nodes.push(mesh);

                // Glow sprite
                const spriteMat = new THREE.SpriteMaterial({
                    color: mat.color,
                    transparent: true,
                    opacity: 0.3,
                    blending: THREE.AdditiveBlending
                });
                const sprite = new THREE.Sprite(spriteMat);
                sprite.scale.set(8, 8, 1);
                mesh.add(sprite);
            }
        }
    }

    function createConnections() {
        const maxConnections = config.neuralConnections;
        let count = 0;

        for (let i = 0; i < nodes.length && count < maxConnections; i++) {
            const nodeA = nodes[i];
            // Connect to nearby nodes in next layer
            for (let j = i + 1; j < nodes.length && count < maxConnections; j++) {
                const nodeB = nodes[j];
                if (nodeA.userData.layer === nodeB.userData.layer) continue;
                if (Math.abs(nodeA.userData.layer - nodeB.userData.layer) > 1) continue;

                const dist = nodeA.position.distanceTo(nodeB.position);
                if (dist > 200) continue;
                if (Math.random() > 0.4) continue;

                const points = [nodeA.position, nodeB.position];
                const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                const lineMat = new THREE.LineBasicMaterial({
                    color: 0x00f0ff,
                    transparent: true,
                    opacity: 0.08,
                    blending: THREE.AdditiveBlending
                });
                const line = new THREE.Line(lineGeo, lineMat);
                line.userData = { nodeA: i, nodeB: j, baseOpacity: 0.06 + Math.random() * 0.06 };
                group.add(line);
                connections.push(line);
                count++;
            }
        }
    }

    function createSignals() {
        const signalCount = Math.min(15, Math.floor(connections.length / 3));
        for (let i = 0; i < signalCount; i++) {
            const connIdx = Math.floor(Math.random() * connections.length);
            const conn = connections[connIdx];
            const geo = new THREE.SphereGeometry(0.8, 6, 6);
            const mat = new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending
            });
            const signal = new THREE.Mesh(geo, mat);
            signal.userData = {
                connection: connIdx,
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.005,
                direction: 1
            };
            group.add(signal);
            signals.push(signal);
        }
    }

    function animate(deltaTime) {
        time += 0.01;
        const mx = BgInteractions.getMouseX();
        const my = BgInteractions.getMouseY();

        // Pulse nodes
        nodes.forEach(node => {
            const pulse = Math.sin(time * 2 + node.userData.pulseOffset) * 0.3 + 0.7;
            node.material.opacity = node.userData.baseOpacity * pulse;
            // Subtle float
            node.position.y += Math.sin(time + node.userData.pulseOffset) * 0.02;
        });

        // Pulse connections
        connections.forEach(conn => {
            conn.material.opacity = conn.userData.baseOpacity * (0.7 + Math.sin(time * 1.5) * 0.3);
        });

        // Move signals along connections
        signals.forEach(signal => {
            const conn = connections[signal.userData.connection];
            if (!conn) return;

            signal.userData.progress += signal.userData.speed * signal.userData.direction;
            if (signal.userData.progress >= 1 || signal.userData.progress <= 0) {
                signal.userData.direction *= -1;
                signal.userData.progress = Math.max(0, Math.min(1, signal.userData.progress));
            }

            const nA = nodes[conn.userData.nodeA];
            const nB = nodes[conn.userData.nodeB];
            if (nA && nB) {
                signal.position.lerpVectors(nA.position, nB.position, signal.userData.progress);
            }

            // Glow pulsing
            signal.material.opacity = 0.5 + Math.sin(time * 5 + signal.userData.progress * Math.PI) * 0.4;
        });

        // Mouse parallax on entire group
        group.rotation.y += (mx * 0.1 - group.rotation.y) * 0.02;
        group.rotation.x += (my * 0.05 - group.rotation.x) * 0.02;
    }

    function dispose() {
        nodes.forEach(n => { n.geometry.dispose(); n.material.dispose(); });
        connections.forEach(c => { c.geometry.dispose(); c.material.dispose(); });
        signals.forEach(s => { s.geometry.dispose(); s.material.dispose(); });
        nodes = []; connections = []; signals = [];
    }

    return { init, animate, dispose };
})();
