class AudioService {
  private static instance: AudioService;
  private beepAudio: HTMLAudioElement | null = null;
  private musicAudio: HTMLAudioElement | null = null;
  private isInitialized = false;
  private isMusicPlaying = false;
  private musicStartTime = 0;
  private musicPausePosition = 0;

  private constructor() {}

  static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('🎵 Initializing Global Audio Service');
    
    // Tạo audio elements
    this.beepAudio = new Audio('/sounds/beep.mp3');
    this.musicAudio = new Audio('/sounds/birthday.mp3');
    
    if (this.musicAudio) {
      this.musicAudio.loop = true;
      this.musicAudio.volume = 0.7;
      this.musicAudio.preload = 'auto';
    }
    
    if (this.beepAudio) {
      this.beepAudio.volume = 0.7;
      this.beepAudio.preload = 'auto';
    }
    
    // Kích hoạt audio context với silent play
    await this.unlockAudio();
    
    this.isInitialized = true;
    console.log('✅ Audio Service Initialized');
  }

  private async unlockAudio(): Promise<void> {
    try {
      // Phương pháp 1: Play silent audio
      const silentAudio = new Audio();
      silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
      silentAudio.volume = 0.000001;
      
      const playPromise = silentAudio.play();
      if (playPromise) {
        await playPromise;
        silentAudio.pause();
      }
      
      // Phương pháp 2: Resume AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        audioContext.close();
      }
      
      console.log('🔓 Audio unlocked successfully');
    } catch (error) {
      console.log('Audio unlock failed:', error);
    }
  }

  async playBeep(): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    
    if (this.beepAudio) {
      try {
        this.beepAudio.currentTime = 0;
        await this.beepAudio.play();
      } catch (error) {
        console.log('Beep play failed:', error);
      }
    }
  }

  async playMusic(forceRestart = false): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    
    if (!this.musicAudio) return;
    
    // Nếu nhạc đang phát và không force restart, chỉ resume nếu bị pause
    if (this.isMusicPlaying && !forceRestart) {
      if (this.musicAudio.paused) {
        try {
          await this.musicAudio.play();
        } catch (error) {
          console.log('Resume music failed:', error);
        }
      }
      return;
    }
    
    // Phát nhạc mới
    try {
      if (forceRestart) {
        this.musicAudio.currentTime = 0;
      }
      
      await this.musicAudio.play();
      this.isMusicPlaying = true;
      this.musicStartTime = Date.now();
      console.log('🎶 Music started playing');
    } catch (error) {
      console.log('Music play failed:', error);
      
      // Fallback: Tự động retry sau khi user interaction
      document.addEventListener('click', () => {
        this.playMusic(forceRestart);
      }, { once: true });
    }
  }

  pauseMusic(): void {
    if (this.musicAudio && !this.musicAudio.paused) {
      this.musicAudio.pause();
      this.musicPausePosition = this.musicAudio.currentTime;
      this.isMusicPlaying = false;
      console.log('⏸️ Music paused at:', this.musicPausePosition);
    }
  }

  stopMusic(): void {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
      this.isMusicPlaying = false;
    }
  }

  getMusicPosition(): number {
    if (this.musicAudio && this.isMusicPlaying) {
      return this.musicAudio.currentTime;
    }
    return this.musicPausePosition;
  }

  isMusicActive(): boolean {
    return this.isMusicPlaying && this.musicAudio !== null;
  }
}

export default AudioService.getInstance();