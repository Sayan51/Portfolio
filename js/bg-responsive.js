/* ============================================
   bg-responsive.js — Device Detection & Fallback
   ============================================ */
const BgResponsive = (function () {
    let deviceType = 'desktop'; // desktop, tablet, mobile
    let gpuTier = 'high';       // high, medium, low

    function detect() {
        const w = window.innerWidth;
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (w < 768 || (isTouch && w < 1024)) {
            deviceType = 'mobile';
        } else if (w < 1200) {
            deviceType = 'tablet';
        } else {
            deviceType = 'desktop';
        }

        // Rough GPU tier detection
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
                    if (renderer.includes('intel') || renderer.includes('mesa') || renderer.includes('swiftshader')) {
                        gpuTier = 'low';
                    } else if (renderer.includes('amd') || renderer.includes('radeon')) {
                        gpuTier = 'medium';
                    }
                }
            } else {
                gpuTier = 'low';
            }
            canvas.remove();
        } catch (e) {
            gpuTier = 'medium';
        }

        return { deviceType, gpuTier };
    }

    function getConfig() {
        detect();
        const configs = {
            desktop: {
                neuralNodes: gpuTier === 'low' ? 14 : 22,
                neuralConnections: gpuTier === 'low' ? 25 : 40,
                geoShapes: gpuTier === 'low' ? 3 : 6,
                particles: gpuTier === 'low' ? 500 : 1200,
                enableMorphing: true,
                enableSignals: true,
                pixelRatio: Math.min(window.devicePixelRatio, 1.5)
            },
            tablet: {
                neuralNodes: 18,
                neuralConnections: 30,
                geoShapes: 4,
                particles: 600,
                enableMorphing: true,
                enableSignals: true,
                pixelRatio: 1.5
            },
            mobile: {
                neuralNodes: 0,
                neuralConnections: 0,
                geoShapes: 0,
                particles: 0,
                enableMorphing: false,
                enableSignals: false,
                pixelRatio: 1
            }
        };
        return { ...configs[deviceType], deviceType, gpuTier };
    }

    function isMobile() { return deviceType === 'mobile'; }

    function applyCssFallback() {
        const el = document.getElementById('galaxy-container');
        if (el) el.style.display = 'none';

        let grad = document.querySelector('.mobile-gradient-bg');
        if (!grad) {
            grad = document.createElement('div');
            grad.className = 'mobile-gradient-bg';
            document.body.prepend(grad);
        }
    }

    return { detect, getConfig, isMobile, applyCssFallback };
})();
