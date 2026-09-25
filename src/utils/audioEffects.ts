// Web Audio API Synthesizer - Zero external dependencies, pure physics sound generation

class SoundEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. Water drop "plop" sound for color droppers
  playWaterDrop() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Pitch envelope: starts low, quick jump up, then drop (bubble plop)
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.14);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Ignore audio autoplay restrictions
    }
  }

  // 2. Magic chime for unlocking a new color
  playMagicChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major arpeggio)
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } catch {
      // Ignore
    }
  }

  // 3. Victory fanfare when completing a core mission
  playSuccessFanfare() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.2, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.45);
      });
    } catch {
      // Ignore
    }
  }

  // 4. Voice assistant for reading mission to preschoolers
  speakText(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95; // Gentle and clear pace for kids
      utterance.pitch = 1.1; // Friendly tone
      window.speechSynthesis.speak(utterance);
    }
  }

  // 5. Realistic Water Splash (Tõm / Bõm khi vật rơi vào nước)
  playWaterSplash(heavy: boolean = false) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Layer 1: Low frequency impact thump (thìa sắt / hòn sỏi tạo tiếng uỳnh trầm)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = heavy ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(heavy ? 120 : 180, now);
      osc.frequency.exponentialRampToValueAtTime(heavy ? 45 : 70, now + (heavy ? 0.22 : 0.15));

      gain.gain.setValueAtTime(heavy ? 0.45 : 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (heavy ? 0.25 : 0.18));

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + (heavy ? 0.25 : 0.18));

      // Layer 2: White Noise splash burst (giọt nước bắn tung tóe)
      const bufferSize = this.ctx.sampleRate * (heavy ? 0.25 : 0.16);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Bandpass filter to shape watery splash timbre
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(heavy ? 650 : 1100, now);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(heavy ? 0.28 : 0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (heavy ? 0.25 : 0.16));

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + (heavy ? 0.25 : 0.16));
    } catch {
      // Ignore
    }
  }

  // 6. Underwater Glug-Glug Bubble Cascade (Bọt khí ùng ục khi vật chìm)
  playBubbleGlug() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [380, 480, 320, 560];

      freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        const startT = now + i * 0.055;
        osc.frequency.setValueAtTime(f, startT);
        osc.frequency.exponentialRampToValueAtTime(f * 1.5, startT + 0.07);

        gain.gain.setValueAtTime(0.16, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startT);
        osc.stop(startT + 0.08);
      });
    } catch {
      // Ignore
    }
  }

  // 7. Buoyant Pop (Tiếng quả bóng bị dìm xuống rồi bật tung vút lên mặt nước)
  playBuoyantPop() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Rising chirping swoop (vèo... pop!)
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  // 8. Gentle Dip (Nhẹ nhàng nhúng chạm mặt nước)
  playGentleDip() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Ignore
    }
  }

  // 9. Net Scoop (Vớt đồ chơi bằng vợt lưới ra khỏi nước)
  playNetScoop() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.15);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
