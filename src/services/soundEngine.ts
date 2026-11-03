import type { SoundType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentType: SoundType | null = null;
  private isRunning: boolean = false;
  private volume: number = 0.5;

  // Active nodes cleanup handles
  private cleanupFn: (() => void) | null = null;

  private initContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Generate pink/white noise buffer
  private createNoiseBuffer(ctx: AudioContext, seconds: number = 3): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // 1. Rain Synthesizer
  private startRain(ctx: AudioContext, dest: AudioNode): () => void {
    const noiseBuffer = this.createNoiseBuffer(ctx, 4);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to sound like rain on window
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1100;
    lowpass.Q.value = 0.8;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 180;

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.75;

    noiseSource.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(rainGain);
    rainGain.connect(dest);

    noiseSource.start();

    // Occasional subtle droplet ticks
    let active = true;
    const triggerDrop = () => {
      if (!active || ctx.state === 'closed') return;
      try {
        const osc = ctx.createOscillator();
        const dropGain = ctx.createGain();
        osc.type = 'sine';
        const freq = 1200 + Math.random() * 800;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + 0.08);

        dropGain.gain.setValueAtTime(0.04, ctx.currentTime);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

        osc.connect(dropGain);
        dropGain.connect(dest);

        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch {
        // audio context might be paused/stopped
      }

      if (active) {
        const nextTime = 200 + Math.random() * 800;
        setTimeout(triggerDrop, nextTime);
      }
    };
    triggerDrop();

    return () => {
      active = false;
      try {
        noiseSource.stop();
        noiseSource.disconnect();
        highpass.disconnect();
        lowpass.disconnect();
        rainGain.disconnect();
      } catch {
        // ignore
      }
    };
  }

  // 2. Ocean Waves Synthesizer
  private startWaves(ctx: AudioContext, dest: AudioNode): () => void {
    const noiseBuffer = this.createNoiseBuffer(ctx, 5);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 520;
    filter.Q.value = 1.2;

    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.4;

    // LFO to modulate gain like ocean swell
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12; // ~8.3 seconds wave cycle

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.35; // depth of swell

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    noiseSource.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(dest);

    noiseSource.start();
    lfo.start();

    return () => {
      try {
        lfo.stop();
        noiseSource.stop();
        lfo.disconnect();
        lfoGain.disconnect();
        noiseSource.disconnect();
        filter.disconnect();
        waveGain.disconnect();
      } catch {
        // ignore
      }
    };
  }

  // 3. Cafe Ambience Synthesizer
  private startCafe(ctx: AudioContext, dest: AudioNode): () => void {
    const noiseBuffer = this.createNoiseBuffer(ctx, 4);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 450;

    const cafeGain = ctx.createGain();
    cafeGain.gain.value = 0.45;

    noiseSource.connect(lowpass);
    lowpass.connect(cafeGain);
    cafeGain.connect(dest);

    noiseSource.start();

    // Occasional gentle cup/glass clinks
    let active = true;
    const triggerClink = () => {
      if (!active || ctx.state === 'closed') return;
      try {
        const osc = ctx.createOscillator();
        const clinkGain = ctx.createGain();
        osc.type = 'triangle';
        const freqs = [2093, 2349, 2637, 3135];
        const chosen = freqs[Math.floor(Math.random() * freqs.length)];
        osc.frequency.setValueAtTime(chosen, ctx.currentTime);

        clinkGain.gain.setValueAtTime(0.035, ctx.currentTime);
        clinkGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

        osc.connect(clinkGain);
        clinkGain.connect(dest);

        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } catch {
        // ignore
      }

      if (active) {
        const nextTime = 2500 + Math.random() * 4500;
        setTimeout(triggerClink, nextTime);
      }
    };
    triggerClink();

    return () => {
      active = false;
      try {
        noiseSource.stop();
        noiseSource.disconnect();
        lowpass.disconnect();
        cafeGain.disconnect();
      } catch {
        // ignore
      }
    };
  }

  // 4. Lofi Chill Synthesizer (Warm Rhodes-like chord loops)
  private startLofi(ctx: AudioContext, dest: AudioNode): () => void {
    let active = true;

    // Chords (Hz):
    // 1. Dm9: D3 (146.83), F3 (174.61), A3 (220.0), C4 (261.63), E4 (329.63)
    // 2. G13: G3 (196.0), B3 (246.94), F4 (349.23), E4 (329.63)
    // 3. Cmaj7: C3 (130.81), E3 (164.81), G3 (196.0), B3 (246.94)
    // 4. Am7: A2 (110.0), C3 (130.81), E3 (164.81), G3 (196.0)
    const chords: number[][] = [
      [146.83, 174.61, 220.0, 261.63, 329.63],
      [196.0, 246.94, 349.23, 329.63],
      [130.81, 164.81, 196.0, 246.94],
      [110.0, 130.81, 164.81, 196.0, 246.94],
    ];

    let chordIndex = 0;

    // Subtle background vinyl noise
    const noiseBuffer = this.createNoiseBuffer(ctx, 3);
    const vinylSource = ctx.createBufferSource();
    vinylSource.buffer = noiseBuffer;
    vinylSource.loop = true;

    const vinylFilter = ctx.createBiquadFilter();
    vinylFilter.type = 'bandpass';
    vinylFilter.frequency.value = 1800;
    vinylFilter.Q.value = 2.0;

    const vinylGain = ctx.createGain();
    vinylGain.gain.value = 0.035;

    vinylSource.connect(vinylFilter);
    vinylFilter.connect(vinylGain);
    vinylGain.connect(dest);
    vinylSource.start();

    // Play chord function
    const playNextChord = () => {
      if (!active || ctx.state === 'closed') return;

      const chord = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      const chordGain = ctx.createGain();
      const chordFilter = ctx.createBiquadFilter();
      chordFilter.type = 'lowpass';
      chordFilter.frequency.value = 750; // warm muted lofi tone
      chordFilter.Q.value = 1.0;

      chordGain.gain.setValueAtTime(0.001, ctx.currentTime);
      chordGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.35); // soft attack
      chordGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2); // smooth release

      const oscillators: OscillatorNode[] = [];

      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle'; // warm keyboard sound
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // tiny subtle detune for vintage tape vibrato
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);
        osc.connect(chordFilter);
        osc.start();
        osc.stop(ctx.currentTime + 3.3);
        oscillators.push(osc);
      });

      chordFilter.connect(chordGain);
      chordGain.connect(dest);

      setTimeout(() => {
        try {
          oscillators.forEach(o => o.disconnect());
          chordFilter.disconnect();
          chordGain.disconnect();
        } catch {
          // ignore
        }
      }, 3500);

      if (active) {
        setTimeout(playNextChord, 3200);
      }
    };

    playNextChord();

    return () => {
      active = false;
      try {
        vinylSource.stop();
        vinylSource.disconnect();
        vinylFilter.disconnect();
        vinylGain.disconnect();
      } catch {
        // ignore
      }
    };
  }

  // Public API
  public play(type: SoundType, initialVolume: number = this.volume) {
    const ctx = this.initContext();
    this.stop(); // Stop any existing sound cleanly

    this.currentType = type;
    this.volume = initialVolume;
    this.isRunning = true;

    // Master gain node
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    switch (type) {
      case 'rain':
        this.cleanupFn = this.startRain(ctx, this.masterGain);
        break;
      case 'waves':
        this.cleanupFn = this.startWaves(ctx, this.masterGain);
        break;
      case 'cafe':
        this.cleanupFn = this.startCafe(ctx, this.masterGain);
        break;
      case 'lofi':
        this.cleanupFn = this.startLofi(ctx, this.masterGain);
        break;
    }
  }

  public stop() {
    if (this.cleanupFn) {
      this.cleanupFn();
      this.cleanupFn = null;
    }
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {
        // ignore
      }
      this.masterGain = null;
    }
    this.isRunning = false;
    this.currentType = null;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  public getCurrentType(): SoundType | null {
    return this.currentType;
  }
}

export const soundEngine = new SoundEngine();
