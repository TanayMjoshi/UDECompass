export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private isSupported = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = this.checkSupport();
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  private checkSupport(): boolean {
    return !!(
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) &&
      'speechSynthesis' in window
    );
  }

  // Speech-to-Text
  startListening(
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    language: 'en' | 'de' = 'en'
  ): void {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser');
      return;
    }

    if (this.isListening) {
      this.stopListening();
      return;
    }

    this.recognition.lang = language === 'de' ? 'de-DE' : 'en-US';
    
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      this.isListening = false;
    };

    this.recognition.onerror = (event) => {
      onError(`Speech recognition error: ${event.error}`);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      onError('Failed to start speech recognition');
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Text-to-Speech
  speak(text: string, language: 'en' | 'de' = 'en'): void {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Try to find a voice for the specified language
    const voices = this.synthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(language === 'de' ? 'de' : 'en'));
    if (voice) {
      utterance.voice = voice;
    }

    this.synthesis.speak(utterance);
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isSupported(): boolean {
    return this.isSupported;
  }

  isSpeechRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  isSpeechSynthesisSupported(): boolean {
    return !!this.synthesis;
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();