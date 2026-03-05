/* ============================================
   skill-sphere.js — 3D Rotating Skill Tag Cloud
   ============================================ */
const SkillSphere = (function () {
    const skills = [
        { name: 'Python', category: 'Language' },
        { name: 'JavaScript', category: 'Language' },
        { name: 'SQL', category: 'Language' },
        { name: 'HTML5', category: 'Language' },
        { name: 'CSS3', category: 'Language' },
        { name: 'React.js', category: 'Framework' },
        { name: 'TensorFlow', category: 'Framework' },
        { name: 'NumPy', category: 'Framework' },
        { name: 'Pandas', category: 'Framework' },
        { name: 'Scikit-learn', category: 'Framework' },
        { name: 'Streamlit', category: 'Framework' },
        { name: 'Git', category: 'Tool' },
        { name: 'GitHub', category: 'Tool' },
        { name: 'VS Code', category: 'Tool' },
        { name: 'Jupyter', category: 'Tool' },
        { name: 'Colab', category: 'Tool' },
        { name: 'Deep Learning', category: 'Concept' },
        { name: 'REST APIs', category: 'Concept' },
        { name: 'Responsive Design', category: 'Concept' },
        { name: 'Clean Code', category: 'Concept' },
        { name: 'Agile', category: 'Concept' },
        { name: 'EDA', category: 'Concept' },
        { name: 'Feature Engineering', category: 'Concept' },
        { name: 'Cross Validation', category: 'Concept' }
    ];

    let container;
    let tags = [];
    let radius;
    let angleX = 0, angleY = 0;
    let autoRotateSpeed = 0.003;
    let isDragging = false;
    let lastMouseX, lastMouseY;
    let dragAngleX = 0, dragAngleY = 0;
    let animId;
    let tooltip;

    function init() {
        container = document.getElementById('skill-sphere');
        if (!container) return;

        radius = window.innerWidth < 768 ? 150 : window.innerWidth < 992 ? 180 : 250;

        // Create tooltip
        tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        container.appendChild(tooltip);

        // Create tags
        skills.forEach((skill, i) => {
            const phi = Math.acos(-1 + (2 * i + 1) / skills.length);
            const theta = Math.sqrt(skills.length * Math.PI) * phi;

            const tag = document.createElement('span');
            tag.className = 'skill-sphere-tag';
            tag.textContent = skill.name;
            tag.dataset.category = skill.category;
            container.appendChild(tag);

            tag.addEventListener('mouseenter', function (e) {
                tooltip.textContent = skill.category;
                tooltip.classList.add('visible');
                autoRotateSpeed = 0;
            });
            tag.addEventListener('mouseleave', function () {
                tooltip.classList.remove('visible');
                autoRotateSpeed = 0.003;
            });
            tag.addEventListener('mousemove', function (e) {
                const rect = container.getBoundingClientRect();
                tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
                tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
            });

            tags.push({
                el: tag,
                x: radius * Math.sin(phi) * Math.cos(theta),
                y: radius * Math.sin(phi) * Math.sin(theta),
                z: radius * Math.cos(phi)
            });
        });

        // Drag
        container.addEventListener('mousedown', function (e) {
            isDragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });
        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            dragAngleY += (e.clientX - lastMouseX) * 0.005;
            dragAngleX += (e.clientY - lastMouseY) * 0.005;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });
        document.addEventListener('mouseup', function () { isDragging = false; });

        // Touch
        container.addEventListener('touchstart', function (e) {
            isDragging = true;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        }, { passive: true });
        container.addEventListener('touchmove', function (e) {
            if (!isDragging) return;
            dragAngleY += (e.touches[0].clientX - lastMouseX) * 0.005;
            dragAngleX += (e.touches[0].clientY - lastMouseY) * 0.005;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        }, { passive: true });
        container.addEventListener('touchend', function () { isDragging = false; });

        animate();
    }

    function animate() {
        animId = requestAnimationFrame(animate);

        angleY += autoRotateSpeed;
        const ax = angleX + dragAngleX;
        const ay = angleY + dragAngleY;

        const cosAX = Math.cos(ax), sinAX = Math.sin(ax);
        const cosAY = Math.cos(ay), sinAY = Math.sin(ay);

        const centerX = container.offsetWidth / 2;
        const centerY = container.offsetHeight / 2;

        tags.forEach(tag => {
            // Rotate Y
            let x = tag.x * cosAY - tag.z * sinAY;
            let z = tag.x * sinAY + tag.z * cosAY;
            // Rotate X
            let y = tag.y * cosAX - z * sinAX;
            z = tag.y * sinAX + z * cosAX;

            const scale = (z + radius * 1.5) / (radius * 3);
            const opacity = Math.max(0.3, scale);
            const fontSize = Math.max(0.6, scale * 1.2);

            tag.el.style.transform = `translate(-50%, -50%)`;
            tag.el.style.left = (centerX + x) + 'px';
            tag.el.style.top = (centerY + y) + 'px';
            tag.el.style.opacity = opacity;
            tag.el.style.fontSize = fontSize + 'rem';
            tag.el.style.zIndex = Math.round(scale * 100);

            // Color gradient: cyan (front) to purple (back)
            const hue = 180 + (1 - scale) * 100;
            tag.el.style.color = `hsl(${hue}, 100%, 60%)`;
        });
    }

    return { init };
})();
