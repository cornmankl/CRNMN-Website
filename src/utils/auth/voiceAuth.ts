/**
 * Voice Authentication Service
 * Implements voice-based authentication and commands
 */

export interface VoiceConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  timeout: number;
}

export interface VoiceCommand {
  command: string;
  confidence: number;
  timestamp: number;
  action: VoiceAction;
  parameters?: Record<string, any>;
}

export type VoiceAction = 
  | 'login'
  | 'signup'
  | 'fill_email'
  | 'fill_name'
  | 'submit'
  | 'cancel'
  | 'help'
  | 'repeat'
  | 'switch_mode'
  | 'unknown';

export interface VoiceAuthResult {
  success: boolean;
  action: VoiceAction;
  data?: Record<string, any>;
  message: string;
  confidence: number;
}

export class VoiceAuthService {
  private recognition: any;
  private config: VoiceConfig;
  private isListening: boolean = false;
  private commandHistory: VoiceCommand[] = [];
  private onResultCallback?: (result: VoiceAuthResult) => void;
  private onErrorCallback?: (error: string) => void;

  constructor(config?: Partial<VoiceConfig>) {
    this.config = {
      language: 'en-US',
      continuous: false,
      interimResults: false,
      maxAlternatives: 1,
      timeout: 10000,
      ...config
    };

    this.initializeRecognition();
  }

  /**
   * Check if speech recognition is supported
   */
  static isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Initialize speech recognition
   */
  private initializeRecognition(): void {
    if (!VoiceAuthService.isSupported()) {
      console.warn('Speech recognition is not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.lang = this.config.language;
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Voice recognition started');
    };

    this.recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript.toLowerCase().trim();
      const confidence = lastResult[0].confidence || 0;

      console.log('Voice input:', transcript, 'Confidence:', confidence);

      const command = this.parseVoiceCommand(transcript, confidence);
      this.commandHistory.push(command);
      
      const result = this.executeVoiceCommand(command);
      this.onResultCallback?.(result);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      this.isListening = false;
      
      let errorMessage = 'Voice recognition failed';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone access denied. Please enable microphone permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error during voice recognition.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Voice recognition service is not available.';
          break;
      }
      
      this.onErrorCallback?.(errorMessage);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
    };
  }

  /**
   * Start listening for voice commands
   */
  startListening(
    onResult?: (result: VoiceAuthResult) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not available'));
        return;
      }

      this.onResultCallback = onResult;
      this.onErrorCallback = onError;

      try {
        this.recognition.start();
        
        // Auto-stop after timeout
        setTimeout(() => {
          if (this.isListening) {
            this.stopListening();
          }
        }, this.config.timeout);
        
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop listening for voice commands
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Parse voice command and extract intent
   */
  private parseVoiceCommand(transcript: string, confidence: number): VoiceCommand {
    const command: VoiceCommand = {
      command: transcript,
      confidence,
      timestamp: Date.now(),
      action: 'unknown'
    };

    // Login commands
    if (this.matchesPattern(transcript, ['login', 'sign in', 'log in', 'signin'])) {
      command.action = 'login';
    }
    // Signup commands
    else if (this.matchesPattern(transcript, ['sign up', 'signup', 'register', 'create account', 'join'])) {
      command.action = 'signup';
    }
    // Email input
    else if (transcript.includes('email') || transcript.includes('@')) {
      command.action = 'fill_email';
      const emailMatch = transcript.match(/(\S+@\S+\.\S+)/);
      if (emailMatch) {
        command.parameters = { email: emailMatch[1] };
      }
    }
    // Name input
    else if (this.matchesPattern(transcript, ['my name is', 'name is', 'i am', 'im'])) {
      command.action = 'fill_name';
      const nameMatch = transcript.match(/(?:my name is|name is|i am|im)\s+(.+)/);
      if (nameMatch) {
        command.parameters = { name: nameMatch[1].trim() };
      }
    }
    // Submit commands
    else if (this.matchesPattern(transcript, ['submit', 'send', 'go', 'continue', 'proceed'])) {
      command.action = 'submit';
    }
    // Cancel commands
    else if (this.matchesPattern(transcript, ['cancel', 'stop', 'exit', 'close', 'back'])) {
      command.action = 'cancel';
    }
    // Help commands
    else if (this.matchesPattern(transcript, ['help', 'what can i say', 'commands', 'options'])) {
      command.action = 'help';
    }
    // Switch mode
    else if (this.matchesPattern(transcript, ['switch', 'change', 'different', 'other way'])) {
      command.action = 'switch_mode';
    }

    return command;
  }

  /**
   * Execute parsed voice command
   */
  private executeVoiceCommand(command: VoiceCommand): VoiceAuthResult {
    const result: VoiceAuthResult = {
      success: false,
      action: command.action,
      message: '',
      confidence: command.confidence
    };

    switch (command.action) {
      case 'login':
        result.success = true;
        result.message = 'Switching to login mode';
        result.data = { isLogin: true };
        break;

      case 'signup':
        result.success = true;
        result.message = 'Switching to signup mode';
        result.data = { isLogin: false };
        break;

      case 'fill_email':
        if (command.parameters?.email) {
          result.success = true;
          result.message = `Email set to ${command.parameters.email}`;
          result.data = { email: command.parameters.email };
        } else {
          result.message = 'Please speak your email address clearly';
        }
        break;

      case 'fill_name':
        if (command.parameters?.name) {
          result.success = true;
          result.message = `Name set to ${command.parameters.name}`;
          result.data = { name: command.parameters.name };
        } else {
          result.message = 'Please say "My name is [your name]"';
        }
        break;

      case 'submit':
        result.success = true;
        result.message = 'Submitting form';
        result.data = { submit: true };
        break;

      case 'cancel':
        result.success = true;
        result.message = 'Closing authentication';
        result.data = { cancel: true };
        break;

      case 'help':
        result.success = true;
        result.message = this.getHelpMessage();
        break;

      case 'switch_mode':
        result.success = true;
        result.message = 'What authentication method would you like to use?';
        result.data = { showModeOptions: true };
        break;

      default:
        result.message = `I didn't understand "${command.command}". Try saying "help" for available commands.`;
    }

    return result;
  }

  /**
   * Check if transcript matches any of the patterns
   */
  private matchesPattern(transcript: string, patterns: string[]): boolean {
    return patterns.some(pattern => 
      transcript.includes(pattern) || 
      this.calculateSimilarity(transcript, pattern) > 0.7
    );
  }

  /**
   * Calculate similarity between two strings (simple Levenshtein-based)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator  // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Get help message with available commands
   */
  private getHelpMessage(): string {
    return `Available voice commands:
    • "Login" or "Sign in" - Switch to login mode
    • "Sign up" or "Register" - Switch to signup mode  
    • "My name is [name]" - Fill in your name
    • "My email is [email]" - Fill in your email
    • "Submit" or "Continue" - Submit the form
    • "Cancel" or "Close" - Close the dialog
    • "Switch" - Change authentication method`;
  }

  /**
   * Get current listening status
   */
  getListeningStatus(): boolean {
    return this.isListening;
  }

  /**
   * Get command history
   */
  getCommandHistory(): VoiceCommand[] {
    return [...this.commandHistory];
  }

  /**
   * Clear command history
   */
  clearHistory(): void {
    this.commandHistory = [];
  }
}

/**
 * Voice Authentication Context for React components
 */
export const VoiceAuthCommands = {
  LOGIN: ['login', 'sign in', 'log in', 'signin'],
  SIGNUP: ['sign up', 'signup', 'register', 'create account', 'join'],
  SUBMIT: ['submit', 'send', 'go', 'continue', 'proceed'],
  CANCEL: ['cancel', 'stop', 'exit', 'close', 'back'],
  HELP: ['help', 'what can i say', 'commands', 'options'],
  SWITCH: ['switch', 'change', 'different', 'other way']
} as const;