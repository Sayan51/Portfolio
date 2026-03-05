/* ============================================
   sound-manager.js — Web Audio API Sound System
   ============================================ */
const SoundManager = (function () {
    let audioCtx = null;
    let enabled = false;
    let initialized = false;

    function init() {
        if (initialized) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
        // Load preference
        const saved = localStorage.getItem('portfolio-sound');
        if (saved === 'true') enable();
    }

    function enable() {
        enabled = true;
        localStorage.setItem('portfolio-sound', 'true');
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    }

    function disable() {
        enabled = false;
        localStorage.setItem('portfolio-sound', 'false');
    }

    function toggle() {
        if (enabled) disable(); else enable();
        return enabled;
    }

    function playTone(freq, duration, type, vol) {
        if (!enabled || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(vol || 0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) { }
    }

    function playHover() { playTone(800, 0.05, 'sine', 0.08); }

    function playClick() { playTone(600, 0.08, 'square', 0.06); }

    function playWhoosh() {
        if (!enabled || !audioCtx) return;
        try {
            const bufferSize = audioCtx.sampleRate * 0.3;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const bandpass = audioCtx.createBiquadFilter();
            bandpass.type = 'bandpass';
            bandpass.frequency.setValueAtTime(2000, audioCtx.currentTime);
            bandpass.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.3);
            bandpass.Q.value = 1;
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            noise.connect(bandpass);
            bandpass.connect(gain);
            gain.connect(audioCtx.destination);
            noise.start();
            noise.stop(audioCtx.currentTime + 0.3);
        } catch (e) { }
    }

    function playBoot() {
        if (!enabled || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 2);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);
            osc.start();
            osc.stop(audioCtx.currentTime + 2.5);
        } catch (e) { }
    }

    function playTransmission() {
        if (!enabled || !audioCtx) return;
        try {
            [440, 554, 659].forEach((freq, i) => {
                setTimeout(() => playTone(freq, 0.3, 'sine', 0.12), i * 150);
            });
        } catch (e) { }
    }

    function isEnabled() { return enabled; }

    return { init, enable, disable, toggle, isEnabled, playHover, playClick, playWhoosh, playBoot, playTransmission };
})();
