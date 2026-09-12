// Web Audio API sound engine for MULTIVERSE PRO
// Provides subtle UI blips + ambient hum without external assets.

let ctx = null;
let masterGain = null;
let ambient = null;
let enabled = false;

function getCtx() {
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        masterGain = ctx.createGain();
        masterGain.gain.value = 0.6;
        masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

function tone(frequency, duration, type = 'sine', volume = 0.08) {
    if (!enabled) return;
    const audio = getCtx();
    if (!audio || !masterGain) return;

    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(now);
    oscillator.stop(now + duration);
}

export function setEnabled(value) {
    enabled = value;
    if (!value && ambient) {
        ambient.stop();
        ambient.disconnect();
        ambient = null;
    }
    if (value) getCtx();
}

export function tick() {
    tone(660, 0.06, 'sine', 0.04);
}

export function chord() {
    tone(440, 0.12, 'sine', 0.04);
    setTimeout(() => tone(660, 0.16, 'sine', 0.035), 45);
}

export function warn() {
    tone(220, 0.12, 'square', 0.035);
}