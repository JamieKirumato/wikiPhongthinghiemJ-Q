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

      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private isViLang(lang: string): boolean {
    const l = lang.toLowerCase().replace('_', '-');
    return l.startsWith('vi') || l === 'vi-vn' || l === 'vie';
  }

  private loadVoices() {
    if (!this.isSupported) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      // CHỈ CHỌN GIỌNG NÓI TIẾNG VIỆT (vi / vi-VN)
      // Tuyệt đối không chọn giọng tiếng Anh hay ngôn ngữ khác để đọc tiếng Việt
      const viVoices = voices.filter((v) => this.isViLang(v.lang));

      if (viVoices.length > 0) {
        // Ưu tiên giọng tự nhiên (Google, Natural, Online)
        this.vietnameseVoice =
          viVoices.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online')) ||
          viVoices[0];
      } else {
        this.vietnameseVoice = null;
      }
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

  /**
   * Kiểm tra xem thiết bị có sẵn giọng đọc tiếng Việt thực thụ hay không
   */
  public hasVietnameseVoice(): boolean {
    if (!this.isSupported) return false;
    if (!this.vietnameseVoice) {
      this.loadVoices();
    }
    return this.vietnameseVoice !== null;
  }

  public getVoiceStatusMessage(): string | null {
    if (!this.isSupported) {
      return 'Trình duyệt chưa hỗ trợ phát âm thanh lời thoại.';
    }
    if (!this.hasVietnameseVoice()) {
      return 'Thiết bị chưa cài đặt giọng đọc tiếng Việt (Cô Mimi sẽ hướng dẫn bằng chữ viết).';
    }
    return null;
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
   * Đọc lời dẫn tiếng Việt bằng giọng tiếng Việt chuẩn.
   * Nếu không có giọng tiếng Việt, từ chối đọc để tránh phát âm tiếng Anh ngọng nghịu.
   */
  public speak(
    text: string,
    options: SpeechEngineOptions = {},
    onEnd?: () => void
  ): boolean {
    if (!this.isSupported || !this.isEnabled || !text.trim()) {
      return false;
    }

    if (!this.vietnameseVoice) {
      this.loadVoices();
    }

    // NẾU KHÔNG CÓ GIỌNG TIẾNG VIỆT, KHÔNG ĐƯỢC ĐỌC BẰNG GIỌNG TIẾNG ANH!
    if (!this.vietnameseVoice) {
      return false;
    }

    try {
      window.speechSynthesis.cancel();

      // Làm sạch emoji và ký tự đặc biệt để phát âm mượt mà
      const cleanText = text
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/[•*#_~]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return false;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'vi-VN';
      utterance.rate = options.rate ?? 0.92; // Tốc độ ấm áp, từ tốn cho trẻ mầm non
      utterance.pitch = options.pitch ?? 1.05; // Cao độ vui tươi, thân thiện
      utterance.voice = this.vietnameseVoice;

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
      return true;
    } catch {
      this.notifyState(false);
      return false;
    }
  }
}

export const speechEngine = new SpeechEngine();
