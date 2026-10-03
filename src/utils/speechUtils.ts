// Web Speech API Voice Synthesizer for Vietnamese educational narration
// Lightweight, zero-dependency, works directly in modern browsers (Chrome, Edge, Safari, Firefox)

export interface SpeechEngineOptions {
  rate?: number;  // 0.8 to 1.2
  pitch?: number; // 0.9 to 1.2
  lang?: string;  // default 'vi-VN'
}

class SpeechEngine {
  private isSupported: boolean = false;
  private isEnabled: boolean = true;
  private vietnameseVoice: SpeechSynthesisVoice | null = null;
  private isSpeakingState: boolean = false;
  private listeners: Set<(isSpeaking: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.isSupported = true;
      const saved = localStorage.getItem('wiki_voice_enabled');
      this.isEnabled = saved !== null ? saved === 'true' : true;

      // Initialize voices list when loaded
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.isSupported) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      // Prioritize natural Vietnamese voices
      this.vietnameseVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith('vi') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('vi') || v.lang.replace('_', '-').toLowerCase().includes('vi-vn')) ||
        voices.find((v) => v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('tiếng việt')) ||
        null;
    } catch {
      this.vietnameseVoice = null;
    }
  }

  public subscribeSpeakingState(callback: (isSpeaking: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isSpeakingState);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyState(isSpeaking: boolean) {
    this.isSpeakingState = isSpeaking;
    this.listeners.forEach((cb) => cb(isSpeaking));
  }

  public isVoiceSupported(): boolean {
    return this.isSupported;
  }

  public isVoiceEnabled(): boolean {
    return this.isEnabled;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('wiki_voice_enabled', String(enabled));
    if (!enabled) {
      this.stop();
    }
  }

  public toggleVoice(): boolean {
    const next = !this.isEnabled;
    this.setVoiceEnabled(next);
    return next;
  }

  public stop() {
    if (!this.isSupported) return;
    try {
      window.speechSynthesis.cancel();
      this.notifyState(false);
    } catch {
      // Ignore
    }
  }

  /**
   * Speak Vietnamese text using best available browser voice
   */
  public speak(
    text: string,
    options: SpeechEngineOptions = {},
    onEnd?: () => void
  ) {
    if (!this.isSupported || !this.isEnabled || !text.trim()) {
      return;
    }

    try {
      // Cancel previous speech to prevent overlapping queues
      window.speechSynthesis.cancel();

      // Clean emojis and special symbols from spoken text for clearer pronunciation
      const cleanText = text
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/•/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = options.lang || 'vi-VN';
      utterance.rate = options.rate ?? 0.95; // Slightly slower, friendly speed for kids
      utterance.pitch = options.pitch ?? 1.05; // Slightly cheerful, friendly teacher tone

      if (this.vietnameseVoice) {
        utterance.voice = this.vietnameseVoice;
      }

      utterance.onstart = () => {
        this.notifyState(true);
      };

      utterance.onend = () => {
        this.notifyState(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.notifyState(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.notifyState(false);
    }
  }
}

export const speechEngine = new SpeechEngine();
