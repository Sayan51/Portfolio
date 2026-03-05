# 🌌 Sayandeep Pradhan — The Developer Universe

A cinematic, immersive portfolio website built with pure HTML, CSS, and JavaScript. Features a sci-fi inspired design with 3D backgrounds, interactive animations, and hidden easter eggs.

**🔗 Live:** [sayan51.github.io/Portfolio](https://sayan51.github.io/Portfolio/)

![Hero Screenshot](https://img.shields.io/badge/Status-Live-00f0ff?style=for-the-badge&logo=github)
![Tech](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS-b400ff?style=for-the-badge)

---

## ✨ Features

### 🎨 Design
- **Cinematic sci-fi UI** — Deep void black (#0a0a0f) with electric cyan and ultraviolet accents
- **Glassmorphism** — Frosted glass surfaces with backdrop blur
- **Custom cursor** — Reactive dual-ring cursor with glow effects
- **Scanline overlay** — CRT-style scanlines for retro-futuristic feel

### 🌐 Multi-Layered 3D Background
- **Neural Network** — 3D nodes with glowing connections and traveling signal particles (Three.js)
- **Morphing Geometric Shapes** — Wireframe polyhedra with vertex displacement
- **Particle Flow System** — 1200+ floating particles with noise-driven drift
- **Mouse Parallax** — All layers react to cursor movement at different intensities
- **Scroll Depth** — Camera zooms as you scroll through the page

### 🚀 Sections
| Section | Description |
|---------|-------------|
| **Hero** | Glitch-styled name, Typed.js role cycling, orbiting social icons |
| **WHOAMI** | About section with animated stat counters |
| **Skill Matrix** | Tech stack displayed as interactive 3D sphere |
| **War Room** | Project showcase with glassmorphic cards and tilt effects |
| **Mission Timeline** | Experience timeline with cascading reveal animations |
| **Command Deck** | Leadership achievements and hackathon highlights |
| **Git Log** | GitHub contribution activity display |
| **Transmission** | Contact form powered by Formspree |

### 🎮 Easter Eggs
- **Konami Code** (↑↑↓↓←→←→BA) — Barrel roll + temporary light mode
- **5x Name Click** — Discover "The Void"
- **Triple Backtick** — Secret developer console with commands
- **Speed Run Detection** — Scroll too fast and get called out
- **30s Idle** — ASCII robot assistant appears with fun facts
- **Mobile Double-Tap** — Confetti burst on hero name

### ⚡ Performance
- GPU tier auto-detection (Intel/AMD/NVIDIA)
- FPS monitoring with auto-quality degradation
- Mobile falls back to lightweight CSS gradient (no WebGL)
- Responsive across desktop, tablet, and mobile

---

## 🛠 Tech Stack

| Technology | Usage |
|-----------|-------|
| **Three.js** | 3D background rendering (neural network, shapes, particles) |
| **GSAP + ScrollTrigger** | Scroll-driven animations and timeline effects |
| **Typed.js** | Terminal-style typing animation in hero |
| **Vanilla Tilt** | 3D card tilt effects on hover |
| **Formspree** | Contact form email delivery |
| **Web Audio API** | Sound effects (boot, whoosh, transmission) |

---

## 📁 Project Structure

```
├── index.html              # Single-page HTML structure
├── css/
│   ├── main.css            # Global styles, variables, resets
│   ├── hero.css            # Hero section styling
│   ├── sections.css        # All section-specific styles
│   ├── components.css      # Reusable component styles
│   ├── animations.css      # Keyframe animations
│   ├── easter-eggs.css     # Hidden interaction styles
│   └── responsive.css      # Breakpoints and mobile layout
├── js/
│   ├── main.js             # App orchestrator
│   ├── bg-main.js          # Background layer manager
│   ├── bg-neural-network.js # 3D neural network layer
│   ├── bg-geom-shapes.js   # Morphing geometric shapes
│   ├── bg-particles.js     # Particle flow system
│   ├── bg-interactions.js  # Mouse/scroll/touch tracking
│   ├── bg-responsive.js    # Device detection & fallbacks
│   ├── boot-sequence.js    # Cinematic loading animation
│   ├── cursor.js           # Custom cursor
│   ├── easter-eggs.js      # All hidden interactions
│   ├── sound-manager.js    # Web Audio API sounds
│   └── ...                 # Other feature modules
└── assets/
    └── Sayandeep_resume.pdf
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Sayan51/Portfolio.git

# Navigate to project
cd Portfolio

# Serve locally (any static server works)
npx serve . -l 3000

# Open in browser
http://localhost:3000
```

---

## 📱 Responsive Breakpoints

| Device | Width | Adaptation |
|--------|-------|-----------|
| Desktop | > 1200px | Full 3D background, all effects |
| Tablet | 768–1199px | Reduced particles, simplified morphing |
| Mobile | < 768px | CSS gradient fallback, hamburger menu |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with 💙 by <a href="https://github.com/Sayan51">Sayandeep Pradhan</a>
</p>
