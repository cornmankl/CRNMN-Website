/**
 * WebAuthn/Passkey Authentication Service
 * Implements modern passwordless authentication
 */

export interface PasskeyCredential {
  id: string;
  rawId: ArrayBuffer;
  type: 'public-key';
  response: AuthenticatorAssertionResponse | AuthenticatorAttestationResponse;
}

export interface PasskeyUser {
  id: string;
  name: string;
  displayName: string;
}

export interface PasskeyConfig {
  rpName: string;
  rpId: string;
  timeout: number;
  userVerification: UserVerificationRequirement;
  authenticatorSelection: AuthenticatorSelectionCriteria;
}

export class PasskeyAuthService {
  private config: PasskeyConfig;

  constructor() {
    this.config = {
      rpName: 'CRNMN - Premium Corn Ordering',
      rpId: window.location.hostname,
      timeout: 60000,
      userVerification: 'required',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        requireResidentKey: true
      }
    };
  }

  /**
   * Check if WebAuthn is supported
   */
  static isSupported(): boolean {
    return !!(window.PublicKeyCredential && 
              window.PublicKeyCredential.create && 
              window.PublicKeyCredential.get);
  }

  /**
   * Check if platform authenticator is available (Face ID, Touch ID, Windows Hello)
   */
  static async isPlatformAuthenticatorAvailable(): Promise<boolean> {
    try {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }

  /**
   * Register a new passkey for the user
   */
  async registerPasskey(user: PasskeyUser): Promise<PasskeyCredential> {
    if (!PasskeyAuthService.isSupported()) {
      throw new Error('WebAuthn is not supported in this browser');
    }

    const challenge = this.generateChallenge();
    const userId = new TextEncoder().encode(user.id);

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: this.config.rpName,
        id: this.config.rpId,
      },
      user: {
        id: userId,
        name: user.name,
        displayName: user.displayName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' } // RS256
      ],
      authenticatorSelection: this.config.authenticatorSelection,
      timeout: this.config.timeout,
      attestation: 'direct'
    };

    try {
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create credential');
      }

      return {
        id: credential.id,
        rawId: credential.rawId,
        type: credential.type as 'public-key',
        response: credential.response
      };
    } catch (error) {
      console.error('Passkey registration error:', error);
      throw new Error('Passkey registration failed. Please try again.');
    }
  }

  /**
   * Authenticate using an existing passkey
   */
  async authenticateWithPasskey(userEmail?: string): Promise<PasskeyCredential> {
    if (!PasskeyAuthService.isSupported()) {
      throw new Error('WebAuthn is not supported in this browser');
    }

    const challenge = this.generateChallenge();

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      rpId: this.config.rpId,
      timeout: this.config.timeout,
      userVerification: this.config.userVerification
    };

    // If we have stored credential IDs for this user, we could add them here
    // allowCredentials: [...] 

    try {
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential;

      if (!assertion) {
        throw new Error('Authentication was cancelled or failed');
      }

      return {
        id: assertion.id,
        rawId: assertion.rawId,
        type: assertion.type as 'public-key',
        response: assertion.response
      };
    } catch (error) {
      console.error('Passkey authentication error:', error);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Authentication was cancelled or timed out');
        } else if (error.name === 'InvalidStateError') {
          throw new Error('No compatible authenticator found');
        } else if (error.name === 'NotSupportedError') {
          throw new Error('This authenticator is not supported');
        }
      }
      
      throw new Error('Biometric authentication failed. Please try again.');
    }
  }

  /**
   * Check if user has registered passkeys
   */
  async hasRegisteredPasskeys(): Promise<boolean> {
    try {
      // In a real implementation, you'd check with your backend
      // For now, we'll use localStorage to simulate
      const storedCredentials = localStorage.getItem('crnmn_passkeys');
      return !!storedCredentials;
    } catch {
      return false;
    }
  }

  /**
   * Store passkey credential (in real app, send to backend)
   */
  async storePasskeyCredential(credential: PasskeyCredential, userEmail: string): Promise<void> {
    try {
      // In production, send this to your backend securely
      const credentialData = {
        id: credential.id,
        userEmail,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('crnmn_passkeys', JSON.stringify([credentialData]));
    } catch (error) {
      console.error('Failed to store passkey credential:', error);
      throw new Error('Failed to save your passkey. Please try again.');
    }
  }

  /**
   * Generate cryptographic challenge
   */
  private generateChallenge(): Uint8Array {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    return challenge;
  }

  /**
   * Convert ArrayBuffer to Base64 (for API transmission)
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Create a conditional UI for different authenticator types
   */
  static getAuthenticatorInfo(): {
    hasPlatformAuthenticator: boolean;
    hasRoamingAuthenticator: boolean;
    supportedMethods: string[];
  } {
    const supportedMethods: string[] = [];
    
    // Check for platform authenticator (built-in biometrics)
    const hasPlatform = window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable;
    if (hasPlatform) supportedMethods.push('Platform Biometrics');
    
    // Check for roaming authenticator (USB keys, etc.)
    // This is harder to detect, so we assume it's available if WebAuthn is supported
    if (PasskeyAuthService.isSupported()) {
      supportedMethods.push('Security Keys');
    }

    return {
      hasPlatformAuthenticator: !!hasPlatform,
      hasRoamingAuthenticator: PasskeyAuthService.isSupported(),
      supportedMethods
    };
  }

  /**
   * Get user-friendly authenticator names based on platform
   */
  static getAuthenticatorDisplayName(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return 'Face ID or Touch ID';
    } else if (userAgent.includes('android')) {
      return 'Fingerprint or Face Unlock';
    } else if (userAgent.includes('windows')) {
      return 'Windows Hello';
    } else if (userAgent.includes('mac')) {
      return 'Touch ID';
    }
    
    return 'Device Biometrics';
  }
}

/**
 * Utility functions for passkey management
 */
export class PasskeyUtils {
  /**
   * Generate a user-friendly display name for credentials
   */
  static generateCredentialDisplayName(email: string): string {
    const domain = email.split('@')[1];
    const timestamp = new Date().toLocaleDateString();
    return `CRNMN Account (${domain}) - ${timestamp}`;
  }

  /**
   * Validate passkey support and show appropriate UI
   */
  static async getPasskeyCapabilities(): Promise<{
    supported: boolean;
    platformAvailable: boolean;
    recommendedMethod: string;
    fallbackMessage: string;
  }> {
    const supported = PasskeyAuthService.isSupported();
    
    if (!supported) {
      return {
        supported: false,
        platformAvailable: false,
        recommendedMethod: 'traditional',
        fallbackMessage: 'Your browser doesn\'t support passkeys. Please use email/password authentication.'
      };
    }

    const platformAvailable = await PasskeyAuthService.isPlatformAuthenticatorAvailable();
    const displayName = PasskeyAuthService.getAuthenticatorDisplayName();

    return {
      supported: true,
      platformAvailable,
      recommendedMethod: platformAvailable ? 'passkey' : 'traditional',
      fallbackMessage: platformAvailable 
        ? `Use ${displayName} for secure, passwordless authentication`
        : 'Passkeys are supported, but no biometric authenticator was found on this device'
    };
  }

  /**
   * Check if current device is trusted
   */
  static async isDeviceTrusted(): Promise<boolean> {
    try {
      const trustedDevices = localStorage.getItem('crnmn_trusted_devices');
      if (!trustedDevices) return false;

      const devices = JSON.parse(trustedDevices);
      const currentFingerprint = this.generateDeviceFingerprint();
      
      return devices.some((device: any) => 
        device.fingerprint === currentFingerprint && 
        Date.now() - new Date(device.lastSeen).getTime() < 30 * 24 * 60 * 60 * 1000 // 30 days
      );
    } catch {
      return false;
    }
  }

  /**
   * Mark current device as trusted
   */
  static markDeviceAsTrusted(userEmail: string): void {
    try {
      const trustedDevices = JSON.parse(localStorage.getItem('crnmn_trusted_devices') || '[]');
      const deviceInfo = {
        fingerprint: this.generateDeviceFingerprint(),
        userEmail,
        deviceName: this.getDeviceName(),
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      // Remove old entries for this device
      const filteredDevices = trustedDevices.filter((d: any) => d.fingerprint !== deviceInfo.fingerprint);
      filteredDevices.push(deviceInfo);

      // Keep only last 5 trusted devices
      const limitedDevices = filteredDevices.slice(-5);
      
      localStorage.setItem('crnmn_trusted_devices', JSON.stringify(limitedDevices));
    } catch (error) {
      console.error('Failed to mark device as trusted:', error);
    }
  }

  /**
   * Simple device fingerprinting (non-invasive)
   */
  private static generateDeviceFingerprint(): string {
    const components = [
      navigator.userAgent,
      screen.width + 'x' + screen.height,
      navigator.language,
      navigator.platform,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    ];
    
    // Simple hash function
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Get human-readable device name
   */
  private static getDeviceName(): string {
    const userAgent = navigator.userAgent;
    
    if (/iPhone/.test(userAgent)) return 'iPhone';
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/Android/.test(userAgent)) return 'Android Device';
    if (/Windows/.test(userAgent)) return 'Windows PC';
    if (/Macintosh/.test(userAgent)) return 'Mac';
    if (/Linux/.test(userAgent)) return 'Linux PC';
    
    return 'Unknown Device';
  }
}