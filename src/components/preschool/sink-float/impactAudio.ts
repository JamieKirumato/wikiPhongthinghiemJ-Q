import { impactVolume } from './playPhysics';
/**
 * Procedural Web Audio API sound synthesis for preschool sink-or-float impacts.
 * SSR-safe, cached AudioContext, zero external audio asset dependencies.
 */

export type ImpactKind = "water" | "tile" | "egg" | "apple" | "glass";

let cachedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioCtxClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioCtxClass) {
    return null;
  }

  if (!cachedAudioCtx || cachedAudioCtx.state === "closed") {
    try {
      cachedAudioCtx = new AudioCtxClass();
    } catch {
      return null;
    }
  }

  if (cachedAudioCtx.state === "suspended") {
    cachedAudioCtx.resume().catch(() => {});
  }

  return cachedAudioCtx;
}

export function unlockImpactAudio(): void {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}

function createNoiseBuffer(ctx: AudioContext, durationSec: number): AudioBuffer {
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    channelData[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function synthesizeImpact(
  kind: "water" | "tile" | "egg" | "apple" | "glass",
  strength: number = 0.5
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Bounded strength and master volume normalization (safe for preschool ears)
  const safeStrength = impactVolume(strength);
  const now = ctx.currentTime;

  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  window.setTimeout(() => masterGain.disconnect(), 600);

  switch (kind) {
    case "water": {
      // Plop & splash: upward sine sweep droplet + bandpass filtered splash spray
      const baseVol = 0.45 * safeStrength;
      masterGain.gain.setValueAtTime(baseVol, now);

      // Droplet bubble plop
      const plopOsc = ctx.createOscillator();
      const plopGain = ctx.createGain();
      plopOsc.type = "sine";
      plopOsc.frequency.setValueAtTime(320, now);
      plopOsc.frequency.exponentialRampToValueAtTime(120 + safeStrength * 70, now + 0.12);

      plopGain.gain.setValueAtTime(0.8, now);
      plopGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      plopOsc.connect(plopGain);
      plopGain.connect(masterGain);
      plopOsc.start(now);
      plopOsc.stop(now + 0.16);

      // Water spray/splash noise
      const splashSource = ctx.createBufferSource();
      splashSource.buffer = createNoiseBuffer(ctx, 0.18);

      const splashFilter = ctx.createBiquadFilter();
      splashFilter.type = "bandpass";
      splashFilter.frequency.setValueAtTime(1150, now);
      splashFilter.Q.setValueAtTime(1.8, now);

      const splashGain = ctx.createGain();
      splashGain.gain.setValueAtTime(0.05, now);
      splashGain.gain.linearRampToValueAtTime(0.55 * safeStrength, now + 0.02);
      splashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      splashSource.connect(splashFilter);
      splashFilter.connect(splashGain);
      splashGain.connect(masterGain);
      splashSource.start(now);
      splashSource.stop(now + 0.18);
      break;
    }

    case "egg": {
      // Shell crack: high-frequency brittle click + fracture ping
      const baseVol = 0.24 * safeStrength;
      masterGain.gain.setValueAtTime(baseVol, now);

      // High frequency brittle impulse
      const crackSource = ctx.createBufferSource();
      crackSource.buffer = createNoiseBuffer(ctx, 0.045);

      const crackFilter = ctx.createBiquadFilter();
      crackFilter.type = "highpass";
      crackFilter.frequency.setValueAtTime(3000, now);

      const crackGain = ctx.createGain();
      crackGain.gain.setValueAtTime(0.85, now);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      crackSource.connect(crackFilter);
      crackFilter.connect(crackGain);
      crackGain.connect(masterGain);
      crackSource.start(now);
      crackSource.stop(now + 0.045);

      // Resonant brittle shell tap
      const shellOsc = ctx.createOscillator();
      const shellGain = ctx.createGain();
      shellOsc.type = "triangle";
      shellOsc.frequency.setValueAtTime(2100, now);
      shellOsc.frequency.exponentialRampToValueAtTime(850, now + 0.055);

      shellGain.gain.setValueAtTime(0.6, now);
      shellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      shellOsc.connect(shellGain);
      shellGain.connect(masterGain);
      shellOsc.start(now);
      shellOsc.stop(now + 0.06);
      break;
    }

    case "apple": {
      // Soft thud: low-frequency muted drop with fast decay and organic thump
      const baseVol = 0.3 * safeStrength;
      masterGain.gain.setValueAtTime(baseVol, now);

      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = "sine";
      thudOsc.frequency.setValueAtTime(145, now);
      thudOsc.frequency.exponentialRampToValueAtTime(45, now + 0.13);

      thudGain.gain.setValueAtTime(0.95, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      thudOsc.connect(thudGain);
      thudGain.connect(masterGain);
      thudOsc.start(now);
      thudOsc.stop(now + 0.15);

      // Low-passed body thump noise
      const fleshSource = ctx.createBufferSource();
      fleshSource.buffer = createNoiseBuffer(ctx, 0.08);

      const fleshFilter = ctx.createBiquadFilter();
      fleshFilter.type = "lowpass";
      fleshFilter.frequency.setValueAtTime(320, now);

      const fleshGain = ctx.createGain();
      fleshGain.gain.setValueAtTime(0.45, now);
      fleshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

      fleshSource.connect(fleshFilter);
      fleshFilter.connect(fleshGain);
      fleshGain.connect(masterGain);
      fleshSource.start(now);
      fleshSource.stop(now + 0.08);
      break;
    }

    case "tile": {
      // Tile tap: crisp hard ceramic tap with high-mid resonance
      const baseVol = 0.4 * safeStrength;
      masterGain.gain.setValueAtTime(baseVol, now);

      // Ceramic transient click
      const tapOsc = ctx.createOscillator();
      const tapGain = ctx.createGain();
      tapOsc.type = "sine";
      tapOsc.frequency.setValueAtTime(1300, now);
      tapOsc.frequency.exponentialRampToValueAtTime(420, now + 0.05);

      tapGain.gain.setValueAtTime(0.85, now);
      tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      tapOsc.connect(tapGain);
      tapGain.connect(masterGain);
      tapOsc.start(now);
      tapOsc.stop(now + 0.055);

      // Crisp tile impact noise
      const tileNoise = ctx.createBufferSource();
      tileNoise.buffer = createNoiseBuffer(ctx, 0.035);

      const tileFilter = ctx.createBiquadFilter();
      tileFilter.type = "bandpass";
      tileFilter.frequency.setValueAtTime(3600, now);
      tileFilter.Q.setValueAtTime(2.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.7, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      tileNoise.connect(tileFilter);
      tileFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      tileNoise.start(now);
      tileNoise.stop(now + 0.04);
      break;
    }

    case "glass": {
      // Glass clink: bright dual-sine chime with gentle resonant decay
      const baseVol = 0.22 * safeStrength;
      masterGain.gain.setValueAtTime(baseVol, now);

      // Primary chime
      const bell1 = ctx.createOscillator();
      const bell1Gain = ctx.createGain();
      bell1.type = "sine";
      bell1.frequency.setValueAtTime(2480, now);

      bell1Gain.gain.setValueAtTime(0.75, now);
      bell1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      bell1.connect(bell1Gain);
      bell1Gain.connect(masterGain);
      bell1.start(now);
      bell1.stop(now + 0.4);

      // Secondary crystal overtone
      const bell2 = ctx.createOscillator();
      const bell2Gain = ctx.createGain();
      bell2.type = "sine";
      bell2.frequency.setValueAtTime(5860, now);

      bell2Gain.gain.setValueAtTime(0.4, now);
      bell2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      bell2.connect(bell2Gain);
      bell2Gain.connect(masterGain);
      bell2.start(now);
      bell2.stop(now + 0.25);

      // Micro tap transient
      const tapSource = ctx.createBufferSource();
      tapSource.buffer = createNoiseBuffer(ctx, 0.015);

      const tapFilter = ctx.createBiquadFilter();
      tapFilter.type = "highpass";
      tapFilter.frequency.setValueAtTime(4200, now);

      const tapGain = ctx.createGain();
      tapGain.gain.setValueAtTime(0.3, now);
      tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      tapSource.connect(tapFilter);
      tapFilter.connect(tapGain);
      tapGain.connect(masterGain);
      tapSource.start(now);
      tapSource.stop(now + 0.02);
      break;
    }
  }
}

const activeImpactMedia = new Set<HTMLAudioElement>();

/** Native media playback remains independent of narration and Web Audio device state. */
export function playImpact(kind: ImpactKind, strength: number = 2): void {
  if (typeof Audio === 'undefined') { synthesizeImpact(kind, strength); return; }
  const audio = new Audio(`/audio/impacts/${kind}.wav`);
  audio.volume = Math.min(1, 0.85 * impactVolume(strength));
  audio.preload = 'auto';
  audio.dataset.impact = kind;
  audio.hidden = true;
  audio.setAttribute('aria-hidden', 'true');
  // Bound overlapping contacts and remove media even if an ended event is delayed.
  if (activeImpactMedia.size >= 6) {
    const oldest = activeImpactMedia.values().next().value;
    oldest?.pause(); oldest?.remove();
    if (oldest) activeImpactMedia.delete(oldest);
  }
  activeImpactMedia.add(audio);
  document.body.append(audio);
  const clean = () => { activeImpactMedia.delete(audio); audio.remove(); };
  window.setTimeout(() => { audio.pause(); clean(); }, 1600);
  audio.onended = clean;
  audio.onerror = () => { clean(); synthesizeImpact(kind, strength); };
  void audio.play().catch(() => { clean(); synthesizeImpact(kind, strength); });
}
