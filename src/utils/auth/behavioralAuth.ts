/**
 * Behavioral Authentication Service
 * Analyzes user behavior patterns for enhanced security
 */

export interface BiometricSignature {
  keystrokeDynamics: KeystrokeTiming[];
  mouseMovements: MouseMovement[];
  typingSpeed: number;
  dwellTime: number;
  riskScore: number;
  confidence: number;
}

export interface KeystrokeTiming {
  key: string;
  pressTime: number;
  releaseTime: number;
  dwellTime: number; // Time key was held down
  flightTime: number; // Time between this key and next
}

export interface MouseMovement {
  x: number;
  y: number;
  timestamp: number;
  velocity: number;
  acceleration: number;
}

export interface DeviceFingerprint {
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  touchSupport: boolean;
}

export class BehavioralAuthService {
  private keystrokeBuffer: KeystrokeTiming[] = [];
  private mouseBuffer: MouseMovement[] = [];
  private startTime: number = 0;
  private lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private lastMouseTime: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Track keystroke dynamics
   */
  recordKeystroke(key: string, isKeyDown: boolean): void {
    const timestamp = Date.now();
    
    if (isKeyDown) {
      // Find existing entry or create new one
      let keystroke = this.keystrokeBuffer.find(k => k.key === key && !k.releaseTime);
      if (!keystroke) {
        keystroke = {
          key,
          pressTime: timestamp,
          releaseTime: 0,
          dwellTime: 0,
          flightTime: 0
        };
        this.keystrokeBuffer.push(keystroke);
      }
    } else {
      // Key release
      const keystroke = this.keystrokeBuffer.find(k => k.key === key && !k.releaseTime);
      if (keystroke) {
        keystroke.releaseTime = timestamp;
        keystroke.dwellTime = keystroke.releaseTime - keystroke.pressTime;
        
        // Calculate flight time to previous keystroke
        const previousKeystroke = this.keystrokeBuffer
          .filter(k => k.releaseTime > 0 && k !== keystroke)
          .sort((a, b) => b.releaseTime - a.releaseTime)[0];
        
        if (previousKeystroke) {
          keystroke.flightTime = keystroke.pressTime - previousKeystroke.releaseTime;
        }
      }
    }

    // Keep buffer size manageable
    if (this.keystrokeBuffer.length > 100) {
      this.keystrokeBuffer = this.keystrokeBuffer.slice(-50);
    }
  }

  /**
   * Track mouse movement patterns
   */
  recordMouseMovement(x: number, y: number): void {
    const timestamp = Date.now();
    
    if (this.lastMouseTime > 0) {
      const timeDiff = timestamp - this.lastMouseTime;
      const distance = Math.sqrt(
        Math.pow(x - this.lastMousePosition.x, 2) + 
        Math.pow(y - this.lastMousePosition.y, 2)
      );
      
      const velocity = timeDiff > 0 ? distance / timeDiff : 0;
      
      // Calculate acceleration
      const lastMovement = this.mouseBuffer[this.mouseBuffer.length - 1];
      const acceleration = lastMovement ? Math.abs(velocity - lastMovement.velocity) : 0;

      this.mouseBuffer.push({
        x,
        y,
        timestamp,
        velocity,
        acceleration
      });
    }

    this.lastMousePosition = { x, y };
    this.lastMouseTime = timestamp;

    // Keep buffer size manageable
    if (this.mouseBuffer.length > 200) {
      this.mouseBuffer = this.mouseBuffer.slice(-100);
    }
  }

  /**
   * Generate behavioral biometric signature
   */
  generateSignature(): BiometricSignature {
    const completedKeystrokes = this.keystrokeBuffer.filter(k => k.releaseTime > 0);
    
    // Calculate typing speed (WPM)
    const totalTypingTime = Date.now() - this.startTime;
    const typingSpeed = completedKeystrokes.length > 0 
      ? (completedKeystrokes.length / (totalTypingTime / 60000)) 
      : 0;

    // Calculate average dwell time
    const avgDwellTime = completedKeystrokes.length > 0
      ? completedKeystrokes.reduce((sum, k) => sum + k.dwellTime, 0) / completedKeystrokes.length
      : 0;

    // Risk assessment
    const riskScore = this.calculateRiskScore(typingSpeed, avgDwellTime);
    
    // Confidence based on data quality
    const confidence = Math.min(
      (completedKeystrokes.length / 20) * 0.5 + // Keystroke sample size
      (this.mouseBuffer.length / 50) * 0.5,    // Mouse movement sample size
      1
    );

    return {
      keystrokeDynamics: completedKeystrokes,
      mouseMovements: this.mouseBuffer,
      typingSpeed,
      dwellTime: avgDwellTime,
      riskScore,
      confidence
    };
  }

  /**
   * Calculate risk score based on behavioral patterns
   */
  private calculateRiskScore(typingSpeed: number, avgDwellTime: number): number {
    let risk = 0;

    // Unusual typing speed (too fast or too slow)
    if (typingSpeed < 10 || typingSpeed > 300) risk += 0.3;
    else if (typingSpeed < 20 || typingSpeed > 150) risk += 0.1;

    // Unusual dwell time patterns
    if (avgDwellTime < 50 || avgDwellTime > 300) risk += 0.2;

    // Mouse movement analysis
    const mouseVelocities = this.mouseBuffer.map(m => m.velocity);
    const avgVelocity = mouseVelocities.reduce((sum, v) => sum + v, 0) / mouseVelocities.length;
    
    if (avgVelocity < 0.1 || avgVelocity > 10) risk += 0.2; // Unusual mouse speed
    
    // Pattern uniformity (too consistent = bot-like)
    const keystrokeVariance = this.calculateVariance(
      this.keystrokeBuffer.map(k => k.dwellTime)
    );
    if (keystrokeVariance < 10) risk += 0.3; // Too uniform

    return Math.min(risk, 1);
  }

  /**
   * Calculate variance for detecting patterns
   */
  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    
    return variance;
  }

  /**
   * Generate device fingerprint
   */
  generateDeviceFingerprint(): DeviceFingerprint {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === '1',
      touchSupport: 'ontouchstart' in window
    };
  }

  /**
   * Clear all tracked data
   */
  reset(): void {
    this.keystrokeBuffer = [];
    this.mouseBuffer = [];
    this.startTime = Date.now();
    this.lastMouseTime = 0;
  }
}