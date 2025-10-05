interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

interface SpeechRecognitionResult {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

export class VoiceManager {
  private recognition: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private isSupported = false;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.isSupported = true;
      }
    }
  }

  startListening(onResult: (transcript: string) => void, onError: (error: string) => void): boolean {
    if (!this.isSupported || this.isListening) return false;

    this.recognition.onresult = (event: SpeechRecognitionResult) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      this.isListening = false;
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      onError(event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      onError(error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string, options: VoiceOptions = {}): boolean {
    if (!this.synthesis) return false;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.lang = options.lang || 'en-US';

    this.synthesis.speak(utterance);
    return true;
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isSpeechSupported(): boolean {
    return this.isSupported;
  }

  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}