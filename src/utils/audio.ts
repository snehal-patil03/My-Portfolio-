// src/utils/audio.ts

class FluidAudio {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  // Granular Engine variables
  private bgBuffer: AudioBuffer | null = null;
  private bgBufferReversed: AudioBuffer | null = null;
  private lotusFilter: BiquadFilterNode | null = null;
  private trackGain: GainNode | null = null;
  private lastProgress = 0;
  private lastTargetGain = 1.0;
  
  // Transport Control variables
  private virtualTime = 0; 
  private lastPlayStartTime = 0;
  private isPlaying = false;
  private currentDirection: 'forward' | 'reverse' | null = null;
  private scrollTimeout: NodeJS.Timeout | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private currentEnvelope: GainNode | null = null;
  
  public isInitialized = false;
  public hasBgTrackStarted = false;
  public isLoaded = false;

  public init() {
    if (this.isInitialized) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioContextClass();
    
    // Master Gain for global volume control
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = 1.0;
    this.masterGain.connect(this.audioCtx.destination);
    
    this.trackGain = this.audioCtx.createGain();
    this.trackGain.gain.value = 1.0;

    // Create the "Emergence" filter (Lowpass)
    this.lotusFilter = this.audioCtx.createBiquadFilter();
    this.lotusFilter.type = 'lowpass';
    this.lotusFilter.frequency.value = 200; 
    
    // Connect: Filter -> TrackGain -> MasterGain -> Destination
    this.lotusFilter.connect(this.trackGain);
    this.trackGain.connect(this.masterGain);

    this.isInitialized = true;
    this.loadBackgroundTrack();
  }

  private async loadBackgroundTrack() {
    if (!this.audioCtx) return;
    try {
      const response = await fetch('/Petals_Breaking_Surface.mp3');
      const arrayBuffer = await response.arrayBuffer();
      this.bgBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
      
      // Create the reversed buffer for upward scrolling
      this.bgBufferReversed = this.reverseBuffer(this.bgBuffer);
      this.isLoaded = true;
      console.log("Granular Engine Loaded successfully.");
    } catch (e) {
      console.error("Failed to load granular audio track:", e);
    }
  }

  private reverseBuffer(buffer: AudioBuffer): AudioBuffer {
    if (!this.audioCtx) return buffer;
    const reversed = this.audioCtx.createBuffer(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const dest = reversed.getChannelData(i);
      const src = buffer.getChannelData(i);
      for (let j = 0; j < buffer.length; j++) {
        dest[j] = src[buffer.length - 1 - j];
      }
    }
    return reversed;
  }

  public playBackgroundTrack() {
    // Only used to mark that the user has interacted. Granular engine handles actual playback.
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.hasBgTrackStarted = true;
  }

  /**
   * Smoothly map the scroll progress to the audio filter to simulate 
   * the lotus emerging from the water.
   * @param progress 0.0 (underwater) to 1.0 (fully bloomed)
   */
  public setLotusProgress(progress: number) {
    if (this.lotusFilter && this.audioCtx && this.trackGain && this.bgBuffer && this.bgBufferReversed) {
      // 1. Map progress to frequency (Muffled to Crystal Clear - raised minFreq so it's audible)
      const minFreq = 400;
      const maxFreq = 20000;
      const targetFreq = minFreq * Math.pow(maxFreq / minFreq, progress);
      this.lotusFilter.frequency.setTargetAtTime(targetFreq, this.audioCtx.currentTime, 0.1);

      // Calculate true dynamic playhead position (since virtualTime only updates on pause)
      let currentPlayhead = this.virtualTime;
      if (this.isPlaying) {
          const elapsed = this.audioCtx.currentTime - this.lastPlayStartTime;
          currentPlayhead += this.currentDirection === 'forward' ? elapsed : -elapsed;
      }

      // 2. Map volume to the exact time in the track
      let targetGain = 2.5;
      if (currentPlayhead < 4.0) targetGain = 2.5; // Huge intro drop
      else if (currentPlayhead >= 4.0 && currentPlayhead < 40.0) targetGain = 1.5; // Much louder bed while reading
      else if (currentPlayhead >= 40.0) targetGain = 1.8; // Strong swell back up later

      // Only apply the ramp if the target has actually changed
      if (this.lastTargetGain !== targetGain) {
          const t = this.audioCtx.currentTime;
          this.trackGain.gain.cancelScheduledValues(t);
          // Anchor the current volume so the ramp has a starting point
          this.trackGain.gain.setValueAtTime(this.trackGain.gain.value, t);
          // Smooth 1-second linear fade
          this.trackGain.gain.linearRampToValueAtTime(targetGain, t + 1.0);
          this.lastTargetGain = targetGain;
      }

      // 3. Native Transport Scrubbing (Play/Pause on scroll)
      const velocity = progress - this.lastProgress;
      this.lastProgress = progress;

      if (Math.abs(velocity) < 0.0001) return;

      const direction = velocity > 0 ? 'forward' : 'reverse';

      // If direction changed, or we are currently stopped, start a new audio node
      if (!this.isPlaying || this.currentDirection !== direction) {
        const t = this.audioCtx.currentTime;

        // Stop the old node with a very fast crossfade to prevent pops
        if (this.isPlaying && this.currentSource && this.currentEnvelope) {
            const oldSource = this.currentSource;
            this.currentEnvelope.gain.cancelScheduledValues(t);
            this.currentEnvelope.gain.setValueAtTime(this.currentEnvelope.gain.value, t);
            this.currentEnvelope.gain.linearRampToValueAtTime(0, t + 0.1); // 100ms fade out

            setTimeout(() => {
                try { oldSource.stop(); } catch (e) {}
            }, 150);

            const elapsed = t - this.lastPlayStartTime;
            this.virtualTime += this.currentDirection === 'forward' ? elapsed : -elapsed;
            // Clamp to prevent out of bounds
            this.virtualTime = Math.max(0, Math.min(this.virtualTime, this.bgBuffer.duration - 0.1));
        }

        this.currentDirection = direction;
        this.isPlaying = true;
        this.lastPlayStartTime = t;

        this.currentSource = this.audioCtx.createBufferSource();
        this.currentSource.buffer = direction === 'forward' ? this.bgBuffer : this.bgBufferReversed;
        
        // Create an envelope for smooth start/stop fades
        this.currentEnvelope = this.audioCtx.createGain();
        this.currentEnvelope.gain.setValueAtTime(0, t);
        this.currentEnvelope.gain.linearRampToValueAtTime(1.0, t + 0.2); // 200ms smooth fade-in
        
        this.currentSource.connect(this.currentEnvelope);
        this.currentEnvelope.connect(this.lotusFilter);

        let offset = this.virtualTime;
        if (direction === 'reverse') {
            offset = this.bgBuffer.duration - offset;
        }

        this.currentSource.start(0, offset);
      }

      // 4. Stop playback completely with a smooth fade if the mouse hasn't moved for 150ms
      if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
          if (this.isPlaying && this.currentSource && this.currentEnvelope && this.audioCtx) {
              const t = this.audioCtx.currentTime;
              const oldSource = this.currentSource;
              
              // Smooth 400ms fade out so it doesn't abruptly chop the audio
              this.currentEnvelope.gain.cancelScheduledValues(t);
              this.currentEnvelope.gain.setValueAtTime(this.currentEnvelope.gain.value, t);
              this.currentEnvelope.gain.linearRampToValueAtTime(0, t + 0.4);
              
              setTimeout(() => {
                  try { oldSource.stop(); } catch (e) {}
              }, 450);

              const elapsed = t - this.lastPlayStartTime;
              this.virtualTime += this.currentDirection === 'forward' ? elapsed : -elapsed;
              this.virtualTime = Math.max(0, Math.min(this.virtualTime, this.bgBuffer!.duration - 0.1));
              
              this.isPlaying = false;
              this.currentSource = null;
              this.currentEnvelope = null;
          }
      }, 150);
    }
  }

  // --- UI SOUNDS (Soft Glass & Fluid) ---
  
  // Rate limiting to prevent overlapping audio spam during fast scrolling
  private lastGlassTickTime = 0;
  private lastCardLockTime = 0;

  // 1. Crystal Cascade: For hero stagger. High pitched, airy water droplets.
  public playSubDrop() {
    if (!this.audioCtx || !this.masterGain) return;
    
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200 + (Math.random() * 400), t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  // 2. Airy Glass Shimmer: Soft fluid sweep for hovering over Experience rows.
  public playWhoosh() {
    if (!this.audioCtx || !this.masterGain) return;

    const t = this.audioCtx.currentTime;
    const bufferSize = this.audioCtx.sampleRate * 0.5;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.5;
    filter.frequency.setValueAtTime(4000, t);
    filter.frequency.exponentialRampToValueAtTime(1000, t + 0.3);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.3);
  }

  // 3. Soft Marble Tick: For Magnetic Snaps
  public playMagneticSnap() {
    if (!this.audioCtx || !this.masterGain) return;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // 3.5. Premium Glass Tick: For Projects locking into place (extremely subtle)
  public playGlassTick() {
    if (!this.audioCtx || !this.masterGain) return;
    
    // Rate limit: prevent overlapping spams (e.g., during fast scrolling)
    const now = Date.now();
    if (now - this.lastGlassTickTime < 50) return; // 50ms debounce
    this.lastGlassTickTime = now;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    // Very high, crisp frequency
    osc.frequency.setValueAtTime(2500, t);
    // Instant drop to give it a "tick" transient
    osc.frequency.exponentialRampToValueAtTime(1500, t + 0.02);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.002); // Very quiet, fast attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05); // Fast decay

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // 4. Rain on Glass: Tiny water droplets tapping frosted glass (for text scrub)
  public playRainOnGlass() {
    if (!this.audioCtx || !this.masterGain) return;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    
    // Randomize pitch for different sized droplets
    const baseFreq = 1500 + Math.random() * 1500;
    osc.frequency.setValueAtTime(baseFreq, t);
    // Instant drop for the "tap" transient
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, t + 0.02);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  // 5. Water Droplet: Pure, organic Apple-style fluid drop
  public playWaterDroplet() {
    if (!this.audioCtx || !this.masterGain) return;

    const t = this.audioCtx.currentTime;
    
    // Layer 1: Main droplet body (sweeps UP to give the 'plop' character)
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.08);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);
    
    // Layer 2: Surface tension pop (transient snap DOWN for physical texture)
    const popOsc = this.audioCtx.createOscillator();
    const popGain = this.audioCtx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(1500, t);
    popOsc.frequency.exponentialRampToValueAtTime(300, t + 0.02); 
    
    popGain.gain.setValueAtTime(0, t);
    popGain.gain.linearRampToValueAtTime(0.3, t + 0.005);
    popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    
    popOsc.connect(popGain);
    popGain.connect(this.masterGain);
    popOsc.start(t);
    popOsc.stop(t + 0.03);
  }

  // 6. Felt Brush: Extremely soft, pitch-less noise burst for ultimate smooth scrubbing
  public playFeltBrush() {
    if (!this.audioCtx || !this.masterGain) return;

    const t = this.audioCtx.currentTime;
    const bufferSize = this.audioCtx.sampleRate * 0.05; // 50ms buffer
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill with pure white noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    // Heavily filter it to sound like soft wind or felt (removes all harshness)
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.8;
    filter.frequency.setValueAtTime(1200 + Math.random() * 400, t); // Warm, muffled frequency
    
    // Extremely soft volume envelope
    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.01); // Soft attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05); // Smooth decay

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.05);
  }

  // 7. Digital Crown Tick: Ultra-premium tactile bump (no pitch, just physical feel)
  public playDigitalCrownTick() {
    if (!this.audioCtx || !this.masterGain) return;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    // Low frequency for a "thud/bump" feel rather than a audible "beep"
    osc.frequency.setValueAtTime(200, t); // Increased from 150 for more presence
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.02);

    // Extremely fast envelope (20ms total)
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.002); // Louder for better haptics
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02); // Fast decay

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.02);
  }

  // 8. Accordion Expand: Soft premium mechanical 'thock' + fluid breath
  public playAccordionExpand() {
    if (!this.audioCtx || !this.masterGain) return;
    const t = this.audioCtx.currentTime;

    // The "Thock" (Low frequency mechanical bump)
    const thock = this.audioCtx.createOscillator();
    const thockGain = this.audioCtx.createGain();
    thock.type = 'sine';
    thock.frequency.setValueAtTime(300, t);
    thock.frequency.exponentialRampToValueAtTime(50, t + 0.05);
    thockGain.gain.setValueAtTime(0, t);
    thockGain.gain.linearRampToValueAtTime(0.15, t + 0.005);
    thockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    thock.connect(thockGain);
    thockGain.connect(this.masterGain);
    thock.start(t);
    thock.stop(t + 0.05);

    // The "Breath" (Extremely soft filtered noise)
    const bufferSize = this.audioCtx.sampleRate * 0.15;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.5;
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.linearRampToValueAtTime(2000, t + 0.1);
    
    const noiseGain = this.audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.03, t + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);
    noise.stop(t + 0.15);
  }

  // 9. Accordion Close: Subtle high-to-low tick
  public playAccordionClose() {
    if (!this.audioCtx || !this.masterGain) return;
    const t = this.audioCtx.currentTime;

    const tick = this.audioCtx.createOscillator();
    const tickGain = this.audioCtx.createGain();
    tick.type = 'sine';
    tick.frequency.setValueAtTime(1000, t);
    tick.frequency.exponentialRampToValueAtTime(400, t + 0.03);
    tickGain.gain.setValueAtTime(0, t);
    tickGain.gain.linearRampToValueAtTime(0.02, t + 0.005);
    tickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    tick.connect(tickGain);
    tickGain.connect(this.masterGain);
    tick.start(t);
    tick.stop(t + 0.05);
  }

  // 10. Timeline Glow: Buttery smooth, ethereal resonant chime for text unblurring
  public playTimelineGlow() {
    if (!this.audioCtx || !this.masterGain) return;
    const t = this.audioCtx.currentTime;

    // Soft resonant chime
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    // Lower, warmer frequency
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(450, t + 0.4); 

    gain.gain.setValueAtTime(0, t);
    // Ultra-soft, slow buttery attack and very quiet max volume (0.04)
    gain.gain.linearRampToValueAtTime(0.04, t + 0.2); 
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6); 

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.6);

    // Layer an extremely subtle, warm "breath"
    const bufferSize = this.audioCtx.sampleRate * 0.4;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.1;
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.0;
    // Lowered the noise filter frequency to make it sound like a soft breath instead of a hiss
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(1200, t + 0.4);
    
    const noiseGain = this.audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, t);
    // Barely audible background texture (0.01)
    noiseGain.gain.linearRampToValueAtTime(0.01, t + 0.2);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);
    noise.stop(t + 0.4);
  }

  // 11. Card Lock: Barely perceptible ambient breath (Maximum smooth and soft)
  public playCardLock() {
    if (!this.audioCtx || !this.masterGain) return;
    
    // Rate limit: prevent stacking overlapping swells when scrolling fast
    const now = Date.now();
    if (now - this.lastCardLockTime < 200) return; // 200ms debounce
    this.lastCardLockTime = now;

    const t = this.audioCtx.currentTime;

    // A very soft, warm low-mid frequency swell (almost subsonic)
    const osc = this.audioCtx.createOscillator();
    const oscGain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.5); 

    // Ultra-smooth buttery attack (fade in over 300ms) - Louder max volume (0.1)
    oscGain.gain.setValueAtTime(0, t);
    oscGain.gain.linearRampToValueAtTime(0.1, t + 0.3); 
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8); 

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.8);

    // A whisper of air 
    const bufferSize = this.audioCtx.sampleRate * 0.5;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.05;
    
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; // Extremely muffled

    const noiseGain = this.audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.05, t + 0.2); 
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);
    noise.stop(t + 0.5);
  }

  // 12. Soft Swipe: Extremely gentle, low-frequency wind sweep for horizontal scrolling cards
  private lastSoftSwipeTime = 0;
  public playSoftSwipe() {
    if (!this.audioCtx || !this.masterGain) return;
    
    // Rate limit for horizontal scrolling
    const now = Date.now();
    if (now - this.lastSoftSwipeTime < 150) return; // 150ms debounce
    this.lastSoftSwipeTime = now;

    const t = this.audioCtx.currentTime;
    
    // Create a very long, soft noise buffer (400ms)
    const bufferSize = this.audioCtx.sampleRate * 0.4;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.1;
    
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    // Heavily muffle the noise so it sounds like soft wind or felt
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.5;
    // Sweep the filter from very low to mid-low for a bit more clarity
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(1200, t + 0.3);

    const noiseGain = this.audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.15, t + 0.15); // Increased volume significantly
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    noise.start(t);
    noise.stop(t + 0.4);
  }

  // 13. Cert Hover: Soft, premium tactile UI click (like pressing a soft membrane button)
  public playCertHover() {
    if (!this.audioCtx || !this.masterGain) return;
    const t = this.audioCtx.currentTime;
    
    // Quick, high-pitched tick
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.005); // Very fast attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05); // Very fast decay

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // 14. Cert Unhover: Extremely soft, slightly lower release click
  public playCertUnhover() {
    if (!this.audioCtx || !this.masterGain) return;
    const t = this.audioCtx.currentTime;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.02, t + 0.005); 
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // 15. Contact Reveal: Warm, welcoming, gentle ambient chord
  public playContactReveal() {
    if (!this.audioCtx || !this.masterGain) return;
    const t = this.audioCtx.currentTime;
    
    // Create a major chord (warm and resolving)
    const freqs = [300, 375, 450]; // Root, Major 3rd, Perfect 5th
    
    freqs.forEach(freq => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq - 20, t);
      osc.frequency.exponentialRampToValueAtTime(freq, t + 0.4);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.015, t + 0.3); // Very soft
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2); // Long tail

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  }

  // 16. Button Hover: Soft, premium UI click
  public playButtonHover() {
    if (!this.audioCtx || !this.masterGain) return;
    const t = this.audioCtx.currentTime;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.03, t + 0.005); 
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // 17. Button Click: Satisfying but soft confirmation tap
  public playButtonClick() {
    if (!this.audioCtx || !this.masterGain) return;
    const t = this.audioCtx.currentTime;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.08);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.002); 
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }
}

export const cinematicAudio = typeof window !== 'undefined' ? new FluidAudio() : null;
