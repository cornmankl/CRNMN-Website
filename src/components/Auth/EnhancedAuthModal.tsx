import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Github, 
  Chrome, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Shield,
  Fingerprint,
  Smartphone,
  Mic,
  MicOff,
  Bot,
  Wallet,
  QrCode,
  Zap,
  Star,
  Heart,
  Award,
  Magic,
  Brain,
  MousePointer,
  Timer,
  Users,
  TrendingUp,
  Gift,
  Crown,
  Gem
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { AIService } from '../../utils/ai/aiService';
import { AuthAssistantService, AIAuthSuggestion } from '../../utils/ai/authAssistant';
import { BehavioralAuthService, BiometricSignature } from '../../utils/auth/behavioralAuth';
import { PasskeyAuthService, PasskeyUtils } from '../../utils/auth/passkeyAuth';
import { VoiceAuthService, VoiceAuthResult } from '../../utils/auth/voiceAuth';
import { Web3AuthService, MockWeb3Provider } from '../../utils/auth/web3Auth';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setUser: (user: any) => void;
}

interface FormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string;
  color: string;
  suggestions: string[];
}

interface BiometricData {
  keystrokeDynamics: number[];
  mouseMovements: { x: number; y: number; timestamp: number }[];
  typingSpeed: number;
  riskScore: number;
}

interface SocialProof {
  recentSignups: number;
  totalUsers: string;
  avgRating: number;
  todayOrders: number;
}

export function EnhancedAuthModal({ open, onOpenChange, setUser }: AuthModalProps) {
  // Core state
  const [isLogin, setIsLogin] = useState(true);
  const [authMode, setAuthMode] = useState<'traditional' | 'passkey' | 'voice' | 'qr' | 'wallet'>('traditional');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  // Form data and validation
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    phone: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: '',
    color: '',
    suggestions: []
  });

  // AI-powered features
  const [aiAssistance, setAiAssistance] = useState(true); // Enable by default in 2025
  const [aiSuggestions, setAiSuggestions] = useState<AIAuthSuggestion[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  // Voice authentication
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  
  // Biometric tracking
  const [biometricSignature, setBiometricSignature] = useState<BiometricSignature | null>(null);
  const [deviceTrusted, setDeviceTrusted] = useState(false);
  
  // WebAuthn/Passkey support
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [platformAuthAvailable, setPlatformAuthAvailable] = useState(false);

  // Web3 features
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [nftAssets, setNftAssets] = useState(0);

  // Social proof data (enhanced with real-time feel)
  const [socialProof, setSocialProof] = useState<SocialProof>({
    recentSignups: 47,
    totalUsers: '12.5k',
    avgRating: 4.9,
    todayOrders: 156
  });

  // Enhanced services
  const aiService = new AIService();
  const authAssistant = useRef(new AuthAssistantService());
  const behavioralAuth = useRef(new BehavioralAuthService());
  const voiceAuth = useRef(new VoiceAuthService());
  const web3Auth = useRef(new Web3AuthService());
  const passkeyAuth = useRef(new PasskeyAuthService());

  // Animation and interaction refs
  const formRef = useRef<HTMLFormElement>(null);
  const keystrokeTimestamps = useRef<number[]>([]);
  const lastInteraction = useRef<number>(Date.now());

  useEffect(() => {
    const initializeAdvancedAuth = async () => {
      if (!open) {
        resetForm();
        return;
      }

      // Check authentication capabilities
      setPasskeySupported(PasskeyAuthService.isSupported());
      setVoiceSupported(VoiceAuthService.isSupported());
      
      // Check platform authenticator availability
      try {
        const platformAuth = await PasskeyAuthService.isPlatformAuthenticatorAvailable();
        setPlatformAuthAvailable(platformAuth);
      } catch (error) {
        console.error('Platform authenticator check failed:', error);
      }

      // Check if device is trusted
      try {
        const trusted = await PasskeyUtils.isDeviceTrusted();
        setDeviceTrusted(trusted);
      } catch (error) {
        console.error('Device trust check failed:', error);
      }

      // Check Web3 wallet connection
      if (Web3AuthService.isWeb3Available()) {
        try {
          const mockConnection = MockWeb3Provider.createMockConnection();
          if (Math.random() > 0.7) { // 30% chance of having connected wallet
            setWalletConnected(true);
            setWalletAddress(mockConnection.address);
            setNftAssets(mockConnection.nftCount || 0);
          }
        } catch (error) {
          console.error('Web3 check failed:', error);
        }
      }

      // Generate AI welcome message
      if (aiAssistance) {
        try {
          const message = await authAssistant.current.generateWelcomeMessage(isLogin);
          setWelcomeMessage(message);
        } catch (error) {
          console.error('AI welcome message failed:', error);
        }
      }

      // Update social proof with animation
      const updateSocialProof = () => {
        setSocialProof(prev => ({
          ...prev,
          recentSignups: prev.recentSignups + Math.floor(Math.random() * 3),
          todayOrders: prev.todayOrders + Math.floor(Math.random() * 5)
        }));
      };

      // Update social proof every 10 seconds
      const socialProofInterval = setInterval(updateSocialProof, 10000);

      // Initialize behavioral tracking
      behavioralAuth.current.reset();

      // Mouse and keyboard tracking
      const handleMouseMove = (e: MouseEvent) => {
        if (open) {
          behavioralAuth.current.recordMouseMovement(e.clientX, e.clientY);
          lastInteraction.current = Date.now();
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (open) {
          behavioralAuth.current.recordKeystroke(e.key, true);
          lastInteraction.current = Date.now();
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (open) {
          behavioralAuth.current.recordKeystroke(e.key, false);
        }
      };

      // Add event listeners
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        clearInterval(socialProofInterval);
      };
    };

    initializeAdvancedAuth();
  }, [open, isLogin, aiAssistance]);

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', phone: '', rememberMe: false });
    setErrors({});
    setPasswordStrength({ score: 0, feedback: '', color: '', suggestions: [] });
    setShowPassword(false);
    setStep(1);
    setAiSuggestion('');
    keystrokeTimestamps.current = [];
    mouseTracker.current = [];
    setBiometricData({
      keystrokeDynamics: [],
      mouseMovements: [],
      typingSpeed: 0,
      riskScore: 0
    });
  };

  // Enhanced AI-powered form assistance
  const getAIAssistance = async (field: string, value: string) => {
    if (!aiAssistance) return;
    
    setIsAiLoading(true);
    try {
      // Update context for AI assistant
      authAssistant.current.updateContext({
        isLogin,
        currentField: field,
        formData,
        errors,
        timestamp: Date.now()
      });

      // Get field-specific assistance
      const suggestion = await authAssistant.current.getFieldAssistance(field, value);
      
      setAiSuggestions(prev => {
        // Keep only recent suggestions (last 3)
        const filtered = prev.filter(s => Date.now() - s.timestamp < 30000).slice(-2);
        return [...filtered, { ...suggestion, timestamp: Date.now() }];
      });

      // Auto-clear suggestions after delay
      setTimeout(() => {
        setAiSuggestions(prev => prev.filter(s => Date.now() - s.timestamp < 30000));
      }, 8000);
      
    } catch (error) {
      console.error('AI assistance error:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Enhanced behavioral analysis
  const performBehavioralAnalysis = useCallback(async () => {
    const signature = behavioralAuth.current.generateSignature();
    setBiometricSignature(signature);

    // AI-powered risk assessment
    if (aiAssistance && signature.riskScore > 0.5) {
      const securitySuggestion: AIAuthSuggestion = {
        type: 'security',
        message: `Unusual typing pattern detected. For security, consider using biometric authentication or verifying your identity.`,
        confidence: signature.confidence,
        priority: signature.riskScore > 0.7 ? 'urgent' : 'high',
        timestamp: Date.now()
      };

      setAiSuggestions(prev => [...prev, securitySuggestion]);
    }

    return signature;
  }, [aiAssistance]);

  // Enhanced password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, feedback: '', color: '', suggestions: [] };
    
    let score = 0;
    const suggestions: string[] = [];
    
    // Length check
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    else suggestions.push('Use at least 8 characters (12+ recommended)');
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push('Add uppercase letters');
    
    if (/\d/.test(password)) score += 1;
    else suggestions.push('Add numbers');
    
    if (/[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>?]/.test(password)) score += 1;
    else suggestions.push('Add special characters');
    
    // Advanced checks
    if (!/(.)\1{2,}/.test(password)) score += 1; // No repeating characters
    if (!/123|abc|qwe|password|12345/i.test(password)) score += 1; // No common patterns
    
    let feedback = '';
    let color = '';
    
    switch (Math.min(score, 8)) {
      case 0:
      case 1:
        feedback = 'Very Weak 😰';
        color = 'bg-gradient-to-r from-red-500 to-red-600';
        break;
      case 2:
      case 3:
        feedback = 'Weak 😕';
        color = 'bg-gradient-to-r from-orange-500 to-red-500';
        break;
      case 4:
      case 5:
        feedback = 'Fair 😐';
        color = 'bg-gradient-to-r from-yellow-500 to-orange-500';
        break;
      case 6:
        feedback = 'Good 😊';
        color = 'bg-gradient-to-r from-blue-500 to-blue-600';
        break;
      case 7:
        feedback = 'Strong 💪';
        color = 'bg-gradient-to-r from-green-500 to-blue-500';
        break;
      case 8:
        feedback = 'Excellent 🔒';
        color = 'bg-gradient-to-r from-green-400 to-emerald-500';
        break;
    }

    return { score: Math.min(score, 8), feedback, color, suggestions };
  };

  // Behavioral authentication analysis
  const analyzeBehavior = useCallback(() => {
    const avgKeystrokeInterval = keystrokeTimestamps.current.length > 1 
      ? keystrokeTimestamps.current.reduce((sum, time, i, arr) => 
          i === 0 ? 0 : sum + (time - arr[i-1]), 0) / (keystrokeTimestamps.current.length - 1)
      : 0;

    const typingSpeed = 60000 / Math.max(avgKeystrokeInterval, 100); // WPM estimation
    
    // Calculate mouse movement patterns
    const mouseDistance = mouseTracker.current.reduce((total, point, i, arr) => {
      if (i === 0) return 0;
      const prev = arr[i-1];
      return total + Math.sqrt(Math.pow(point.x - prev.x, 2) + Math.pow(point.y - prev.y, 2));
    }, 0);

    // Simple risk scoring (in real app, this would use ML models)
    let riskScore = 0;
    if (typingSpeed < 20 || typingSpeed > 200) riskScore += 0.2; // Unusual typing speed
    if (mouseDistance < 100) riskScore += 0.1; // Minimal mouse movement
    if (keystrokeTimestamps.current.length < 10) riskScore += 0.1; // Too few keystrokes
    
    setBiometricData({
      keystrokeDynamics: keystrokeTimestamps.current,
      mouseMovements: mouseTracker.current,
      typingSpeed,
      riskScore: Math.min(riskScore, 1)
    });
  }, []);

  // Enhanced voice command handling
  const handleVoiceCommand = async (result: VoiceAuthResult) => {
    setVoiceCommand(result.action);
    setIsListening(false);

    if (result.success && result.data) {
      if ('isLogin' in result.data) {
        setIsLogin(result.data.isLogin);
      }
      if ('email' in result.data) {
        handleInputChange('email', result.data.email);
      }
      if ('name' in result.data) {
        handleInputChange('name', result.data.name);
      }
      if ('submit' in result.data) {
        await handleSubmit(new Event('submit') as any);
      }
      if ('cancel' in result.data) {
        onOpenChange(false);
      }
    }

    // Add AI suggestion based on voice result
    if (aiAssistance) {
      const voiceSuggestion: AIAuthSuggestion = {
        type: 'suggestion',
        message: result.message,
        confidence: result.confidence,
        priority: result.success ? 'low' : 'medium',
        timestamp: Date.now()
      };
      setAiSuggestions(prev => [...prev, voiceSuggestion]);
    }
  };

  // Enhanced WebAuthn/Passkey authentication
  const handlePasskeyLogin = async () => {
    if (!passkeySupported) {
      setErrors({ general: 'Passkey authentication is not supported on this device.' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Check if user has registered passkeys
      const hasPasskeys = await passkeyAuth.current.hasRegisteredPasskeys();
      
      if (!hasPasskeys && isLogin) {
        throw new Error('No passkeys found for this device. Please register a passkey first or use traditional login.');
      }

      // Authenticate or register based on mode
      let credential;
      if (isLogin) {
        credential = await passkeyAuth.current.authenticateWithPasskey();
      } else {
        // For signup, register new passkey
        const tempUser = {
          id: Date.now().toString(),
          name: formData.name || 'CRNMN User',
          displayName: formData.name || formData.email || 'CRNMN User'
        };
        credential = await passkeyAuth.current.registerPasskey(tempUser);
        
        // Store credential for future use
        if (formData.email) {
          await passkeyAuth.current.storePasskeyCredential(credential, formData.email);
        }
      }

      // Create authenticated user
      const mockUser = {
        id: Date.now(),
        name: formData.name || 'Biometric User',
        email: formData.email || 'passkey@crnmn.com',
        loyaltyPoints: Math.floor(Math.random() * 2000) + 1000,
        authMethod: 'passkey',
        premiumMember: true,
        securityLevel: 'high',
        biometricVerified: true,
        deviceTrusted: true
      };
      
      // Mark device as trusted
      PasskeyUtils.markDeviceAsTrusted(mockUser.email);
      
      setUser(mockUser);
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Passkey authentication error:', error);
      setErrors({ general: error.message || 'Biometric authentication failed. Please try another method.' });
      
      // Suggest alternative auth methods
      if (aiAssistance) {
        const helpSuggestion: AIAuthSuggestion = {
          type: 'help',
          message: 'Biometric authentication had issues. Try traditional login or voice authentication as alternatives.',
          confidence: 0.8,
          priority: 'medium',
          action: 'switch_auth_mode',
          timestamp: Date.now()
        };
        setAiSuggestions(prev => [...prev, helpSuggestion]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced wallet authentication
  const handleWalletConnect = async (provider: 'metamask' | 'walletconnect' | 'coinbase' = 'metamask') => {
    setIsLoading(true);
    setErrors({});
    
    try {
      let connection;
      
      switch (provider) {
        case 'metamask':
          connection = await web3Auth.current.connectMetaMask();
          break;
        case 'walletconnect':
          connection = await web3Auth.current.connectWalletConnect();
          break;
        case 'coinbase':
          connection = await web3Auth.current.connectCoinbase();
          break;
      }

      // Get NFT assets and loyalty tokens
      const nfts = await web3Auth.current.getUserNFTs(connection.address);
      const loyaltyTokens = await web3Auth.current.getLoyaltyTokenBalance(connection.address);
      
      // Calculate benefits based on NFT holdings
      const benefits = Web3AuthUtils.calculateLoyaltyBenefits(nfts);

      const mockUser = {
        id: Date.now(),
        name: connection.ensName || 'Crypto Corn Lover',
        email: 'wallet@crnmn.com',
        walletAddress: connection.address,
        ensName: connection.ensName,
        chainId: connection.chainId,
        balance: connection.balance,
        loyaltyPoints: loyaltyTokens,
        nftAssets: nfts,
        authMethod: 'wallet',
        provider,
        premiumMember: benefits.premiumSupport || nfts.length > 0,
        discountLevel: benefits.discountPercentage,
        earlyAccess: benefits.earlyAccess,
        loyaltyMultiplier: benefits.loyaltyMultiplier,
        securityLevel: 'high'
      };
      
      setUser(mockUser);
      onOpenChange(false);
      
      // AI celebration for Web3 users
      if (aiAssistance) {
        const celebrationSuggestion: AIAuthSuggestion = {
          type: 'suggestion',
          message: `🎉 Welcome Web3 pioneer! You've unlocked ${benefits.discountPercentage}% discount and ${nfts.length} exclusive NFT benefits!`,
          confidence: 1.0,
          priority: 'high',
          timestamp: Date.now()
        };
        setAiSuggestions(prev => [...prev, celebrationSuggestion]);
      }
      
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      setErrors({ general: error.message || 'Wallet connection failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced voice authentication
  const startVoiceAuth = async () => {
    if (!voiceSupported) {
      setErrors({ general: 'Voice authentication is not supported in this browser.' });
      return;
    }
    
    try {
      setIsListening(true);
      await voiceAuth.current.startListening(
        handleVoiceCommand,
        (error: string) => {
          setErrors({ general: error });
          setIsListening(false);
        }
      );
    } catch (error: any) {
      console.error('Voice auth error:', error);
      setErrors({ general: error.message || 'Failed to start voice authentication.' });
      setIsListening(false);
    }
  };

  const stopVoiceAuth = () => {
    voiceAuth.current.stopListening();
    setIsListening(false);
  };

  // Enhanced form validation with AI and behavioral analysis
  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};

    // Basic validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && passwordStrength.score < 4) {
      newErrors.password = 'Please create a stronger password';
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
    }

    // AI-powered comprehensive validation
    if (aiAssistance && Object.keys(newErrors).length === 0) {
      try {
        // Get smart validation from AI
        const validations = await authAssistant.current.validateFormWithAI(formData);
        
        // Check for security issues
        const securityIssues = await authAssistant.current.detectSecurityIssues(formData);
        
        // Add security warnings as suggestions rather than blocking errors
        securityIssues.forEach(issue => {
          if (issue.priority === 'urgent' || issue.priority === 'high') {
            const securitySuggestion: AIAuthSuggestion = {
              ...issue,
              timestamp: Date.now()
            };
            setAiSuggestions(prev => [...prev, securitySuggestion]);
          }
        });

        // Apply AI validation results
        validations.forEach(validation => {
          if (!validation.isValid && validation.suggestion) {
            newErrors[validation.field as keyof FormErrors] = validation.suggestion;
          }
        });

      } catch (error) {
        console.error('AI validation error:', error);
      }
    }

    // Behavioral analysis for additional security
    const behaviorSignature = await performBehavioralAnalysis();
    
    // If high risk behavior detected, suggest additional verification
    if (behaviorSignature.riskScore > 0.6) {
      const riskSuggestion: AIAuthSuggestion = {
        type: 'security',
        message: 'For your security, we recommend using biometric authentication for this login attempt.',
        confidence: behaviorSignature.confidence,
        priority: 'high',
        action: 'suggest_biometric',
        timestamp: Date.now()
      };
      setAiSuggestions(prev => [...prev, riskSuggestion]);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    // Track keystroke timing for behavioral auth
    if (typeof value === 'string' && field !== 'rememberMe') {
      keystrokeTimestamps.current.push(Date.now());
      if (keystrokeTimestamps.current.length > 50) {
        keystrokeTimestamps.current.shift(); // Keep only recent keystrokes
      }
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Update password strength and get AI assistance
    if (field === 'password' && typeof value === 'string') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Trigger AI assistance for certain fields
    if (aiAssistance && typeof value === 'string' && value.length > 2) {
      getAIAssistance(field, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(await validateForm())) return;

    setIsLoading(true);
    setErrors({});

    // Analyze behavioral patterns
    analyzeBehavior();

    try {
      // Simulate API call with behavioral analysis
      const authPayload = {
        ...formData,
        biometricSignature: {
          typingSpeed: biometricData.typingSpeed,
          riskScore: biometricData.riskScore,
          deviceFingerprint: navigator.userAgent
        }
      };

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser = {
        id: Date.now(),
        name: isLogin ? 'Enhanced User' : formData.name,
        email: formData.email,
        phone: formData.phone,
        loyaltyPoints: Math.floor(Math.random() * 3000) + 500,
        joinDate: new Date().toISOString(),
        authMethod: 'enhanced',
        biometricVerified: biometricData.riskScore < 0.3,
        premiumMember: Math.random() > 0.5,
        aiAssistanceUsed: aiAssistance
      };
      
      setUser(mockUser);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceAuth = () => {
    if (!recognitionRef.current) return;
    
    setIsListening(true);
    recognitionRef.current.start();
    
    setTimeout(() => {
      if (isListening) {
        setIsListening(false);
        recognitionRef.current.stop();
      }
    }, 10000); // 10 second timeout
  };

  const generateQRCode = () => {
    // In real implementation, generate actual QR code
    setAuthMode('qr');
    setTimeout(() => {
      const mockUser = {
        id: Date.now(),
        name: 'QR Verified User',
        email: 'qr@crnmn.com',
        loyaltyPoints: 1800,
        authMethod: 'qr',
        quickAccess: true
      };
      setUser(mockUser);
      onOpenChange(false);
    }, 3000);
  };

  // Render different authentication modes
  const renderAuthModeContent = () => {
    switch (authMode) {
      case 'passkey':
        return (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Fingerprint className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Secure Biometric Login</h3>
            <p className="text-[var(--neutral-400)]">Use your device's biometric authentication</p>
            <Button 
              onClick={handlePasskeyLogin}
              disabled={isLoading}
              className="btn-primary mx-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Authenticate with Passkey
                </>
              )}
            </Button>
          </div>
        );

      case 'voice':
        return (
          <div className="text-center py-8 space-y-4">
            <div className={cn(
              "w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-300",
              isListening 
                ? "bg-gradient-to-br from-red-500 to-pink-600 animate-pulse scale-110" 
                : "bg-gradient-to-br from-green-500 to-blue-600"
            )}>
              {isListening ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
            </div>
            <h3 className="text-xl font-bold text-white">Voice Authentication</h3>
            <p className="text-[var(--neutral-400)]">
              {isListening ? 'Listening... Say "login" or "sign up"' : 'Speak your authentication preference'}
            </p>
            {voiceCommand && (
              <Badge variant="secondary" className="bg-[var(--neon-green)]/20 text-[var(--neon-green)]">
                Heard: "{voiceCommand}"
              </Badge>
            )}
            <Button 
              onClick={startVoiceAuth}
              disabled={isListening}
              className="btn-primary mx-auto"
            >
              <Mic className="w-4 h-4 mr-2" />
              {isListening ? 'Listening...' : 'Start Voice Auth'}
            </Button>
          </div>
        );

      case 'qr':
        return (
          <div className="text-center py-8 space-y-4">
            <div className="w-32 h-32 mx-auto bg-white rounded-2xl p-4 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-[var(--neon-green)] to-green-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-16 h-16 text-black" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">QR Code Login</h3>
            <p className="text-[var(--neutral-400)]">Scan this code with your CRNMN mobile app</p>
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--neutral-500)]">
              <Timer className="w-4 h-4" />
              Code expires in 2:47
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Web3 Wallet Login</h3>
            <p className="text-[var(--neutral-400)]">Connect your crypto wallet to access premium features</p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleWalletConnect}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <img src="https://docs.metamask.io/img/metamask-fox.svg" className="w-4 h-4 mr-2" alt="MetaMask" />
                )}
                Connect MetaMask
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                <Wallet className="w-4 h-4 mr-2" />
                WalletConnect
              </Button>
            </div>
          </div>
        );

      default:
        return renderTraditionalForm();
    }
  };

  const renderTraditionalForm = () => (
    <div className="space-y-6">
      {/* AI Assistant Toggle */}
      <div className="flex items-center justify-between p-3 bg-[var(--neutral-800)]/50 rounded-xl">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[var(--neon-green)]" />
          <span className="text-sm font-medium text-white">AI Assistance</span>
        </div>
        <Checkbox
          checked={aiAssistance}
          onCheckedChange={setAiAssistance}
          className="border-[var(--neutral-600)] data-[state=checked]:bg-[var(--neon-green)]"
        />
      </div>

      {/* AI Suggestion */}
      {aiSuggestion && (
        <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <Brain className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-300">{aiSuggestion}</p>
            {isAiLoading && <Loader2 className="w-3 h-3 animate-spin mt-1" />}
          </div>
        </div>
      )}

      {/* Error Message with AI Help */}
      {errors.general && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-400">{errors.general}</p>
            {aiAssistance && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-red-300 p-0 h-auto mt-1"
                onClick={() => getAIAssistance('error', errors.general || '')}
              >
                Get AI Help →
              </Button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Multi-step Progress (Sign Up Only) */}
        {!isLogin && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--neutral-400)]">Setup Progress</span>
              <span className="text-[var(--neon-green)]">{step}/3</span>
            </div>
            <Progress 
              value={(step / 3) * 100} 
              className="h-2 bg-[var(--neutral-800)]"
            />
          </div>
        )}

        {/* Name Field (Sign Up Only) */}
        {!isLogin && (
          <div className="space-y-2 group">
            <Label htmlFor="name" className="text-[var(--neutral-300)] font-medium flex items-center gap-2">
              <User className="w-3 h-3" />
              Full Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={cn(
                  "pl-4 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                  "focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)]",
                  "transition-all duration-300 group-hover:border-[var(--neutral-600)]",
                  errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {formData.name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              )}
            </div>
            {errors.name && (
              <p className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-left-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>
        )}

        {/* Email Field with AI Domain Suggestions */}
        <div className="space-y-2 group">
          <Label htmlFor="email" className="text-[var(--neutral-300)] font-medium flex items-center gap-2">
            <Mail className="w-3 h-3" />
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn(
                "pl-4 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                "focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)]",
                "transition-all duration-300 group-hover:border-[var(--neutral-600)]",
                errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {formData.email && /\S+@\S+\.\S+/.test(formData.email) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-left-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Field (Sign Up Only) */}
        {!isLogin && (
          <div className="space-y-2 group">
            <Label htmlFor="phone" className="text-[var(--neutral-300)] font-medium flex items-center gap-2">
              <Smartphone className="w-3 h-3" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={cn(
                "pl-4 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                "focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)]",
                "transition-all duration-300 group-hover:border-[var(--neutral-600)]",
                errors.phone && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.phone && (
              <p className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-left-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>
        )}

        {/* Enhanced Password Field */}
        <div className="space-y-2 group">
          <Label htmlFor="password" className="text-[var(--neutral-300)] font-medium flex items-center gap-2">
            <Lock className="w-3 h-3" />
            Password
            {!isLogin && (
              <Badge variant="outline" className="text-xs border-[var(--neutral-600)]">
                AI-Enhanced
              </Badge>
            )}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={cn(
                "pl-4 pr-12 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                "focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)]",
                "transition-all duration-300 group-hover:border-[var(--neutral-600)]",
                errors.password && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 p-0 text-[var(--neutral-400)] hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          
          {/* Advanced Password Strength Indicator */}
          {!isLogin && formData.password && (
            <div className="space-y-2 p-3 bg-[var(--neutral-800)]/50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--neutral-400)]">Password Strength</span>
                <span className={cn("text-xs font-medium", 
                  passwordStrength.score <= 2 ? "text-red-400" : 
                  passwordStrength.score <= 4 ? "text-yellow-400" :
                  passwordStrength.score <= 6 ? "text-blue-400" : "text-green-400"
                )}>
                  {passwordStrength.feedback}
                </span>
              </div>
              <div className="h-2 bg-[var(--neutral-700)] rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-500", passwordStrength.color)}
                  style={{ width: `${(passwordStrength.score / 8) * 100}%` }}
                />
              </div>
              {passwordStrength.suggestions.length > 0 && (
                <div className="text-xs text-[var(--neutral-400)]">
                  <p className="font-medium mb-1">Suggestions:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {passwordStrength.suggestions.slice(0, 3).map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {errors.password && (
            <p className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-left-1">
              <AlertCircle className="w-3 h-3" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Behavioral Security Indicator */}
        {biometricData.riskScore > 0 && (
          <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg">
            <MousePointer className="w-4 h-4 text-blue-400" />
            <div className="flex-1">
              <p className="text-xs text-blue-300">
                Behavioral Auth: {biometricData.riskScore < 0.3 ? 'Verified ✓' : 'Analyzing...'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="text-xs text-[var(--neutral-400)]">
                  Typing: {Math.round(biometricData.typingSpeed)} WPM
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remember Me & Additional Options */}
        {isLogin && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                className="border-[var(--neutral-600)] data-[state=checked]:bg-[var(--neon-green)]"
              />
              <Label htmlFor="rememberMe" className="text-sm text-[var(--neutral-400)] cursor-pointer">
                Remember me
              </Label>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-sm text-[var(--neon-green)] hover:text-[var(--neon-green)]/80 p-0 h-auto"
            >
              Forgot password?
            </Button>
          </div>
        )}

        {/* Enhanced Submit Button */}
        <Button 
          type="submit" 
          disabled={isLoading}
          className={cn(
            "w-full h-12 font-semibold text-black transition-all duration-300",
            "bg-gradient-to-r from-[var(--neon-green)] to-green-400",
            "hover:from-green-400 hover:to-[var(--neon-green)] hover:scale-[1.02]",
            "active:scale-[0.98] shadow-lg hover:shadow-xl",
            isLoading && "cursor-not-allowed opacity-75"
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isLogin ? 'Signing In...' : 'Creating Account...'}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {isLogin ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Sign In Instantly
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Join the Corn Revolution
                </>
              )}
            </div>
          )}
        </Button>
      </form>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-md mx-4 rounded-3xl overflow-hidden",
        "backdrop-blur-xl shadow-2xl",
        open && "animate-in fade-in-0 zoom-in-95 duration-300"
      )}>
        {/* Animated Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--neon-green)]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000" />
        </div>
        
        {/* Glass Morphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.02] backdrop-blur-sm" />
        
        <div className="relative">
          {/* Header with Social Proof */}
          <DialogHeader className="text-center space-y-3">
            {/* Brand Logo with Animation */}
            <div className="flex items-center justify-center mb-2">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                "bg-gradient-to-br from-[var(--neon-green)] to-green-400",
                "animate-in zoom-in-75 duration-500 delay-150",
                "shadow-lg shadow-[var(--neon-green)]/25"
              )}>
                <Sparkles className="w-8 h-8 text-black animate-pulse" />
              </div>
            </div>

            <div>
              <DialogTitle className="text-white text-2xl font-bold animate-in slide-in-from-bottom-3 duration-300 delay-200">
                {authMode === 'traditional' 
                  ? (isLogin ? 'Welcome Back!' : 'Join CRNMN') 
                  : getAuthModeTitle()
                }
              </DialogTitle>
              <DialogDescription className="text-[var(--neutral-400)] animate-in slide-in-from-bottom-3 duration-300 delay-300">
                {authMode === 'traditional'
                  ? (isLogin 
                      ? 'Sign in to access your premium corn experience' 
                      : 'Create your account and start your corn journey'
                    )
                  : getAuthModeDescription()
                }
              </DialogDescription>
            </div>

            {/* Social Proof Bar */}
            <div className="flex items-center justify-center gap-4 text-xs text-[var(--neutral-500)] bg-[var(--neutral-800)]/30 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{socialProof.recentSignups} joined today</span>
              </div>
              <Separator orientation="vertical" className="h-3 bg-[var(--neutral-600)]" />
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>{socialProof.avgRating}/5 rating</span>
              </div>
              <Separator orientation="vertical" className="h-3 bg-[var(--neutral-600)]" />
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span>{socialProof.todayOrders} orders today</span>
              </div>
            </div>
          </DialogHeader>

          {/* Authentication Mode Tabs */}
          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as any)} className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-5 bg-[var(--neutral-800)]/50 rounded-xl">
              <TabsTrigger value="traditional" className="text-xs data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
                Email
              </TabsTrigger>
              {passkeySupported && (
                <TabsTrigger value="passkey" className="text-xs data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
                  <Fingerprint className="w-3 h-3" />
                </TabsTrigger>
              )}
              <TabsTrigger value="voice" className="text-xs data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
                <Mic className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="qr" className="text-xs data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
                <QrCode className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="wallet" className="text-xs data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
                <Wallet className="w-3 h-3" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="traditional" className="mt-6">
              {renderAuthModeContent()}
            </TabsContent>
            
            <TabsContent value="passkey" className="mt-6">
              {renderAuthModeContent()}
            </TabsContent>
            
            <TabsContent value="voice" className="mt-6">
              {renderAuthModeContent()}
            </TabsContent>
            
            <TabsContent value="qr" className="mt-6">
              {renderAuthModeContent()}
            </TabsContent>
            
            <TabsContent value="wallet" className="mt-6">
              {renderAuthModeContent()}
            </TabsContent>
          </Tabs>

          {/* Social Login Options (Traditional Mode Only) */}
          {authMode === 'traditional' && (
            <>
              <div className="relative my-6">
                <Separator className="bg-[var(--neutral-700)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-[var(--neutral-900)] px-3 text-sm text-[var(--neutral-400)]">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  className={cn(
                    "bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                    "hover:border-[var(--neutral-600)] hover:bg-[var(--neutral-700)]",
                    "transition-all duration-200 hover:scale-105 active:scale-95"
                  )}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  className={cn(
                    "bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                    "hover:border-[var(--neutral-600)] hover:bg-[var(--neutral-700)]",
                    "transition-all duration-200 hover:scale-105 active:scale-95"
                  )}
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </>
          )}

          {/* Mode Toggle (Traditional Mode Only) */}
          {authMode === 'traditional' && (
            <div className="text-center border-t border-[var(--neutral-800)] pt-6 mt-6">
              <p className="text-sm text-[var(--neutral-400)] mb-3">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                disabled={isLoading}
                className="text-[var(--neon-green)] hover:text-[var(--neon-green)]/80 font-semibold p-0 h-auto transition-all duration-200"
              >
                {isLogin ? (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Create account & get 500 bonus points
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Sign in to your premium account
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Terms & Privacy (Sign Up Only) */}
          {!isLogin && authMode === 'traditional' && (
            <p className="text-xs text-[var(--neutral-500)] text-center mt-4">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-[var(--neon-green)] hover:underline">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-[var(--neon-green)] hover:underline">Privacy Policy</a>
            </p>
          )}

          {/* Quick Access Alternative Modes */}
          {authMode === 'traditional' && (
            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--neutral-800)]/50 to-[var(--neutral-700)]/30 rounded-2xl">
              <p className="text-xs text-[var(--neutral-400)] mb-3 text-center">Quick Access Options</p>
              <div className="grid grid-cols-3 gap-2">
                {passkeySupported && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAuthMode('passkey')}
                    className="flex flex-col gap-1 h-auto py-2 text-[var(--neutral-400)] hover:text-[var(--neon-green)]"
                  >
                    <Fingerprint className="w-5 h-5" />
                    <span className="text-xs">Biometric</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthMode('voice')}
                  className="flex flex-col gap-1 h-auto py-2 text-[var(--neutral-400)] hover:text-[var(--neon-green)]"
                >
                  <Mic className="w-5 h-5" />
                  <span className="text-xs">Voice</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthMode('wallet')}
                  className="flex flex-col gap-1 h-auto py-2 text-[var(--neutral-400)] hover:text-[var(--neon-green)]"
                >
                  <Wallet className="w-5 h-5" />
                  <span className="text-xs">Web3</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  function getAuthModeTitle() {
    switch (authMode) {
      case 'passkey': return 'Biometric Login';
      case 'voice': return 'Voice Authentication';
      case 'qr': return 'QR Code Access';
      case 'wallet': return 'Web3 Wallet';
      default: return 'Welcome';
    }
  }

  function getAuthModeDescription() {
    switch (authMode) {
      case 'passkey': return 'Use your fingerprint, face, or device PIN for secure access';
      case 'voice': return 'Authenticate using your voice - hands-free and secure';
      case 'qr': return 'Scan with your mobile app for instant authentication';
      case 'wallet': return 'Connect your Web3 wallet for premium features and NFT access';
      default: return 'Choose your preferred authentication method';
    }
  }
}