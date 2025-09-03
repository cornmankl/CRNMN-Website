import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  Users,
  TrendingUp,
  Gift,
  Crown,
  Magic,
  Brain,
  Timer,
  Award,
  Heart
} from 'lucide-react';
import { cn } from '../utils/cn';

// Fix missing Web3AuthUtils import
const Web3AuthUtils = {
  calculateLoyaltyBenefits: (nfts: any[]) => ({
    discountPercentage: nfts.length * 10,
    earlyAccess: nfts.length > 0,
    premiumSupport: nfts.length > 2,
    loyaltyMultiplier: 1 + (nfts.length * 0.5)
  })
};

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

interface AuthCapabilities {
  passkey: boolean;
  voice: boolean;
  web3: boolean;
  biometric: boolean;
}

export function Auth2025Modal({ open, onOpenChange, setUser }: AuthModalProps) {
  // Core state
  const [isLogin, setIsLogin] = useState(true);
  const [authMode, setAuthMode] = useState<'email' | 'passkey' | 'voice' | 'qr' | 'wallet'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form data
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

  // 2025 Features
  const [capabilities, setCapabilities] = useState<AuthCapabilities>({
    passkey: false,
    voice: false,
    web3: false,
    biometric: false
  });
  
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [behaviorScore, setBehaviorScore] = useState(0);
  const [socialStats, setSocialStats] = useState({
    liveUsers: 1247,
    todayJoined: 34,
    rating: 4.9
  });

  // Refs
  const recognitionRef = useRef<any>(null);
  const keystrokeTimings = useRef<number[]>([]);

  // Initialize 2025 features
  useEffect(() => {
    if (!open) return;

    // Check device capabilities
    const checkCapabilities = async () => {
      const caps: AuthCapabilities = {
        passkey: !!(window as any).PublicKeyCredential,
        voice: !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
        web3: !!(window as any).ethereum,
        biometric: false
      };

      // Check biometric availability
      try {
        if (caps.passkey) {
          caps.biometric = await (window as any).PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        }
      } catch (e) {
        caps.biometric = false;
      }

      setCapabilities(caps);
    };

    checkCapabilities();

    // Initialize voice recognition
    if ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }

    // Live social proof updates
    const socialInterval = setInterval(() => {
      setSocialStats(prev => ({
        liveUsers: prev.liveUsers + Math.floor(Math.random() * 6) - 2,
        todayJoined: prev.todayJoined + (Math.random() > 0.85 ? 1 : 0),
        rating: prev.rating
      }));
    }, 8000);

    // Behavioral analysis
    const handleKeyPress = () => {
      keystrokeTimings.current.push(Date.now());
      if (keystrokeTimings.current.length > 20) {
        analyzeTypingBehavior();
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      clearInterval(socialInterval);
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [open]);

  // Reset form
  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', phone: '', rememberMe: false });
    setErrors({});
    setPasswordStrength({ score: 0, feedback: '', color: '', suggestions: [] });
    setAiSuggestions([]);
    setShowPassword(false);
    keystrokeTimings.current = [];
  };

  // AI-powered assistance
  const getAIHelp = async (field: string, value: string) => {
    if (!aiEnabled || value.length < 3) return;

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const suggestions: Record<string, string> = {
        email: value.includes('@') 
          ? '✅ Great! This email will be used for order updates and login recovery.' 
          : '📧 Don\'t forget to include the @ symbol in your email address.',
        password: value.length >= 8 
          ? '🔒 Strong password! Your account will be secure with this choice.' 
          : '💪 Consider adding more characters, numbers, and symbols for better security.',
        name: value.length > 1 
          ? '👋 Perfect! This name will appear on your corn orders and delivery receipts.' 
          : '📝 Please enter your full name as you\'d like it to appear.',
        phone: /\d{10,}/.test(value.replace(/\D/g, ''))
          ? '📱 Excellent! We can send you real-time delivery updates to this number.'
          : '📞 Please include your area code for delivery notifications.'
      };

      const suggestion = suggestions[field] || 'Looking good! 👍';
      setAiSuggestions([suggestion]);

      // Auto-clear after 6 seconds
      setTimeout(() => setAiSuggestions([]), 6000);
    } catch (error) {
      console.error('AI assistance error:', error);
    }
  };

  // Enhanced password strength
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, feedback: '', color: '', suggestions: [] };
    
    let score = 0;
    const suggestions: string[] = [];
    
    // 2025 enhanced scoring
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    else suggestions.push('Use 12+ characters for maximum security');
    
    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push('Add lowercase letters (a-z)');
    
    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push('Add uppercase letters (A-Z)');
    
    if (/\d/.test(password)) score += 1;
    else suggestions.push('Add numbers (0-9)');
    
    if (/[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>?]/.test(password)) score += 1;
    else suggestions.push('Add special characters (!@#$...)');
    
    // Advanced patterns
    if (!/(.)\\1{2,}/.test(password)) score += 1;
    if (!/123|abc|password|qwerty/i.test(password)) score += 1;

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
        feedback = 'Good 😊';
        color = 'bg-gradient-to-r from-yellow-500 to-orange-500';
        break;
      case 6:
        feedback = 'Strong 💪';
        color = 'bg-gradient-to-r from-blue-500 to-purple-500';
        break;
      case 7:
      case 8:
        feedback = 'Excellent 🔒';
        color = 'bg-gradient-to-r from-green-400 to-emerald-500';
        break;
    }

    return { score: Math.min(score, 8), feedback, color, suggestions };
  };

  // Voice command handling
  const handleVoiceCommand = (transcript: string) => {
    setIsListening(false);
    
    if (transcript.includes('login') || transcript.includes('sign in')) {
      setIsLogin(true);
      setAuthMode('email');
    } else if (transcript.includes('sign up') || transcript.includes('register')) {
      setIsLogin(false);
      setAuthMode('email');
    } else if (transcript.includes('wallet')) {
      setAuthMode('wallet');
    } else if (transcript.includes('biometric') || transcript.includes('fingerprint')) {
      setAuthMode('passkey');
    } else if (transcript.includes('help')) {
      setAiSuggestions(['Voice commands: "login", "sign up", "wallet", "biometric", or speak your email address.']);
    } else if (transcript.includes('@')) {
      // Try to extract email
      const emailMatch = transcript.match(/(\S+@\S+\.\S+)/);
      if (emailMatch) {
        handleInputChange('email', emailMatch[1]);
      }
    }
  };

  // Behavioral analysis
  const analyzeTypingBehavior = () => {
    if (keystrokeTimings.current.length < 10) return;
    
    const intervals = [];
    for (let i = 1; i < keystrokeTimings.current.length; i++) {
      intervals.push(keystrokeTimings.current[i] - keystrokeTimings.current[i-1]);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const typingSpeed = 60000 / Math.max(avgInterval, 50);
    
    // Risk scoring (simplified)
    let risk = 0;
    if (typingSpeed < 20 || typingSpeed > 300) risk = 0.7;
    else if (typingSpeed < 30 || typingSpeed > 200) risk = 0.3;
    else risk = 0.1;
    
    setBehaviorScore(1 - risk); // Convert to security score
  };

  // Authentication handlers
  const handlePasskeyAuth = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const user = {
        id: Date.now(),
        name: 'Biometric User',
        email: formData.email || 'secure@crnmn.com',
        authMethod: 'passkey',
        securityLevel: 'maximum',
        premiumMember: true,
        loyaltyPoints: 2500
      };
      
      setUser(user);
      onOpenChange(false);
    } catch (error) {
      setErrors({ general: 'Biometric authentication failed. Please try email login.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeb3Auth = async () => {
    setIsLoading(true);
    try {
      if (!(window as any).ethereum) {
        throw new Error('Please install MetaMask to use Web3 authentication');
      }

      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });

      const user = {
        id: Date.now(),
        name: 'Web3 Pioneer',
        email: 'crypto@crnmn.com',
        walletAddress: accounts[0],
        authMethod: 'web3',
        premiumMember: true,
        nftHolder: true,
        loyaltyPoints: 5000,
        discountLevel: 25
      };
      
      setUser(user);
      onOpenChange(false);
    } catch (error: any) {
      setErrors({ general: error.message || 'Wallet connection failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceAuth = () => {
    if (!recognitionRef.current) return;
    
    setIsListening(true);
    recognitionRef.current.start();
    
    setTimeout(() => {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }, 10000);
  };

  // Enhanced input handling
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    if (typeof value === 'string') {
      keystrokeTimings.current.push(Date.now());
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (field === 'password' && typeof value === 'string') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // AI assistance
    if (aiEnabled && typeof value === 'string' && value.length > 2) {
      getAIHelp(field, value);
    }

    // Behavioral analysis
    if (keystrokeTimings.current.length % 10 === 0) {
      analyzeTypingBehavior();
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    analyzeTypingBehavior();

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const user = {
        id: Date.now(),
        name: isLogin ? 'Enhanced User 2025' : formData.name,
        email: formData.email,
        phone: formData.phone,
        authMethod: 'enhanced-2025',
        securityScore: Math.round(behaviorScore * 100),
        aiAssisted: aiEnabled,
        premiumMember: !isLogin || Math.random() > 0.5,
        loyaltyPoints: Math.floor(Math.random() * 3000) + 1000,
        features: {
          aiAssistant: true,
          advancedSecurity: true,
          prioritySupport: true
        }
      };
      
      setUser(user);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const user = {
        id: Date.now(),
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `user@${provider}.example.com`,
        authMethod: `social-${provider}`,
        socialVerified: true,
        premiumMember: provider === 'github',
        loyaltyPoints: 800
      };
      
      setUser(user);
      onOpenChange(false);
    } catch (error) {
      setErrors({ general: `${provider} login failed. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-md mx-4 rounded-3xl overflow-hidden",
        "backdrop-blur-xl shadow-2xl",
        "animate-in fade-in-0 zoom-in-95 duration-300"
      )}>
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--neon-green)]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] backdrop-blur-sm" />
        
        <div className="relative z-10">
          {/* Enhanced Header */}
          <DialogHeader className="text-center space-y-4">
            {/* Animated Logo */}
            <div className="flex justify-center">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                "bg-gradient-to-br from-[var(--neon-green)] to-green-400 shadow-lg",
                "animate-in zoom-in-75 duration-500"
              )}>
                <Sparkles className="w-8 h-8 text-black animate-pulse" />
              </div>
            </div>

            <div>
              <DialogTitle className="text-white text-3xl font-bold mb-2">
                {getAuthModeTitle()}
              </DialogTitle>
              <DialogDescription className="text-[var(--neutral-400)]">
                {getAuthModeDescription()}
              </DialogDescription>
            </div>

            {/* Live Social Proof */}
            <div className="flex items-center justify-center gap-6 text-xs bg-[var(--neutral-800)]/40 rounded-full px-6 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-[var(--neon-green)]" />
                <span className="text-white font-medium">{socialStats.liveUsers.toLocaleString()}</span>
                <span className="text-[var(--neutral-400)]">online</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="text-white font-medium">{socialStats.rating}</span>
                <span className="text-[var(--neutral-400)]">rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-400" />
                <span className="text-white font-medium">{socialStats.todayJoined}</span>
                <span className="text-[var(--neutral-400)]">joined today</span>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* AI Assistant Status */}
            <div className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-all duration-300",
              aiEnabled 
                ? "bg-gradient-to-r from-[var(--neon-green)]/10 to-blue-500/10 border border-[var(--neon-green)]/30" 
                : "bg-[var(--neutral-800)]/30"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  aiEnabled ? "bg-[var(--neon-green)] text-black" : "bg-[var(--neutral-700)]"
                )}>
                  <Bot className="w-3 h-3" />
                </div>
                <span className="text-sm font-medium text-white">AI Assistant 2025</span>
                <Badge className="text-xs bg-purple-500/20 text-purple-400">
                  Smart
                </Badge>
              </div>
              <Checkbox
                checked={aiEnabled}
                onCheckedChange={setAiEnabled}
                className="border-[var(--neutral-600)] data-[state=checked]:bg-[var(--neon-green)]"
              />
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className={cn(
                "flex items-start gap-3 p-3 rounded-xl animate-in slide-in-from-left-3 duration-300",
                "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
              )}>
                <Brain className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-300">{suggestion}</p>
                <Magic className="w-3 h-3 text-purple-400 animate-bounce" />
              </div>
            ))}

            {/* Behavioral Security Indicator */}
            {behaviorScore > 0 && (
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-xl",
                behaviorScore > 0.8 ? "bg-green-500/10 border border-green-500/20" :
                behaviorScore > 0.5 ? "bg-yellow-500/10 border border-yellow-500/20" :
                "bg-red-500/10 border border-red-500/20"
              )}>
                <Shield className={cn(
                  "w-4 h-4",
                  behaviorScore > 0.8 ? "text-green-400" :
                  behaviorScore > 0.5 ? "text-yellow-400" : "text-red-400"
                )} />
                <div className="flex-1">
                  <div className="text-xs font-medium text-white">
                    Security Score: {Math.round(behaviorScore * 100)}/100
                  </div>
                  <div className="text-xs text-[var(--neutral-400)]">
                    Behavioral pattern {behaviorScore > 0.8 ? 'verified' : 'analyzing'}
                  </div>
                </div>
              </div>
            )}

            {/* Authentication Mode Tabs */}
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as any)}>
              <TabsList className="grid w-full grid-cols-5 bg-[var(--neutral-800)]/50 rounded-xl p-1">
                <TabsTrigger value="email" className="text-xs data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
                  <Mail className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger 
                  value="passkey" 
                  disabled={!capabilities.passkey}
                  className="text-xs data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black disabled:opacity-50"
                >
                  <Fingerprint className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger 
                  value="voice" 
                  disabled={!capabilities.voice}
                  className="text-xs data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black disabled:opacity-50"
                >
                  <Mic className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="qr" className="text-xs data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black">
                  <QrCode className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger 
                  value="wallet" 
                  disabled={!capabilities.web3}
                  className="text-xs data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black disabled:opacity-50"
                >
                  <Wallet className="w-3 h-3" />
                </TabsTrigger>
              </TabsList>

              {/* Email Authentication */}
              <TabsContent value="email" className="mt-6 space-y-4">
                {/* Social Options */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    className="bg-[var(--neutral-800)] border-[var(--neutral-700)] hover:border-[var(--neutral-600)] text-white h-11 transition-all hover:scale-105"
                  >
                    <Chrome className="w-4 h-4 mr-2" />
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('github')}
                    disabled={isLoading}
                    className="bg-[var(--neutral-800)] border-[var(--neutral-700)] hover:border-[var(--neutral-600)] text-white h-11 transition-all hover:scale-105"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </div>

                <div className="relative">
                  <Separator className="bg-[var(--neutral-700)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-[var(--neutral-900)] px-3 text-sm text-[var(--neutral-400)]">or</span>
                  </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name (signup only) */}
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[var(--neutral-300)] font-medium flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Full Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={cn(
                            "bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                            "focus:border-[var(--neon-green)] transition-all duration-300",
                            errors.name && "border-red-500"
                          )}
                          placeholder="Enter your full name"
                        />
                        {formData.name && (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[var(--neutral-300)] font-medium flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={cn(
                          "bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                          "focus:border-[var(--neon-green)] transition-all duration-300",
                          errors.email && "border-red-500"
                        )}
                        placeholder="Enter your email"
                      />
                      {formData.email && /\S+@\S+\.\S+/.test(formData.email) && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone (signup only) */}
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[var(--neutral-300)] font-medium flex items-center gap-2">
                        <Smartphone className="w-3 h-3" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={cn(
                          "bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                          "focus:border-[var(--neon-green)] transition-all duration-300",
                          errors.phone && "border-red-500"
                        )}
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Enhanced Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[var(--neutral-300)] font-medium flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      Password
                      {!isLogin && aiEnabled && (
                        <Badge className="text-xs bg-[var(--neon-green)]/20 text-[var(--neon-green)]">AI</Badge>
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={cn(
                          "pr-12 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                          "focus:border-[var(--neon-green)] transition-all duration-300",
                          errors.password && "border-red-500"
                        )}
                        placeholder={isLogin ? 'Enter password' : 'Create strong password'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 p-0 text-[var(--neutral-400)] hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {!isLogin && formData.password && (
                      <div className="space-y-2 p-3 bg-[var(--neutral-800)]/50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[var(--neutral-400)]">Password Strength</span>\n                          <span className={cn("text-xs font-medium", 
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
                            <p className="font-medium mb-1">💡 Tips:</p>
                            <ul className="space-y-1">
                              {passwordStrength.suggestions.slice(0, 2).map((tip, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <span className="w-1 h-1 bg-[var(--neon-green)] rounded-full" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {errors.password && (
                      <p className="text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Login Options */}
                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                          className="border-[var(--neutral-600)] data-[state=checked]:bg-[var(--neon-green)]"
                        />
                        <Label htmlFor="rememberMe" className="text-sm text-[var(--neutral-400)]">
                          Remember me
                        </Label>
                      </div>
                      <Button variant="ghost" size="sm" className="text-sm text-[var(--neon-green)] p-0">
                        Forgot password?
                      </Button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className={cn(
                      "w-full h-12 font-semibold text-black",
                      "bg-gradient-to-r from-[var(--neon-green)] to-green-400",
                      "hover:from-green-400 hover:to-[var(--neon-green)] hover:scale-[1.02]",
                      "transition-all duration-300 shadow-lg hover:shadow-xl",
                      "disabled:opacity-75"
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </>
                    ) : (
                      <>
                        {isLogin ? (
                          <><Zap className="w-4 h-4 mr-2" />Sign In Instantly</>
                        ) : (
                          <><Sparkles className="w-4 h-4 mr-2" />Join the Corn Revolution</>
                        )}
                      </>
                    )}
                  </Button>
                </form>

                {/* Mode Switch */}
                <div className="text-center border-t border-[var(--neutral-800)] pt-4">
                  <p className="text-sm text-[var(--neutral-400)] mb-3">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[var(--neon-green)] hover:text-[var(--neon-green)]/80 font-semibold"
                  >
                    {isLogin ? (
                      <><Gift className="w-4 h-4 mr-2" />Create account & get 500 points</>
                    ) : (
                      <><Crown className="w-4 h-4 mr-2" />Sign in to your account</>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Passkey Authentication */}
              <TabsContent value="passkey" className="mt-6">
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                    <Fingerprint className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Biometric Login</h3>
                    <p className="text-[var(--neutral-400)] mb-4">
                      {capabilities.biometric ? 'Use Face ID, Touch ID, or Windows Hello' : 'Use your security key'}
                    </p>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      🔒 Maximum Security
                    </Badge>
                  </div>
                  <Button 
                    onClick={handlePasskeyAuth}
                    disabled={isLoading}
                    className="btn-primary mx-auto px-8"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Authenticate
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Voice Authentication */}
              <TabsContent value="voice" className="mt-6">
                <div className="text-center py-8 space-y-6">
                  <div className={cn(
                    "w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-300",
                    isListening 
                      ? "bg-gradient-to-br from-red-500 to-pink-600 animate-pulse scale-110" 
                      : "bg-gradient-to-br from-green-500 to-blue-600"
                  )}>
                    {isListening ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Voice Authentication</h3>
                    <p className="text-[var(--neutral-400)]">
                      {isListening ? '🎤 Listening... Say "login", "sign up", or speak your email' : 'Use your voice for hands-free authentication'}
                    </p>
                  </div>
                  <Button 
                    onClick={isListening ? () => setIsListening(false) : handleVoiceAuth}
                    className={isListening ? "bg-red-500 hover:bg-red-600" : "btn-primary"}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    {isListening ? 'Stop Listening' : 'Start Voice Auth'}
                  </Button>
                  <div className="text-xs text-[var(--neutral-500)]">
                    💬 Try: "login", "sign up", "my email is john@example.com"
                  </div>
                </div>
              </TabsContent>

              {/* QR Authentication */}
              <TabsContent value="qr" className="mt-6">
                <div className="text-center py-8 space-y-6">
                  <div className="w-32 h-32 mx-auto bg-white rounded-2xl p-4 flex items-center justify-center relative">
                    <div className="absolute inset-2 bg-gradient-to-br from-[var(--neon-green)] to-green-600 rounded-lg opacity-10" />
                    <QrCode className="w-20 h-20 text-black z-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">QR Code Access</h3>
                    <p className="text-[var(--neutral-400)] mb-4">
                      Scan with your CRNMN mobile app for instant login
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--neutral-500)]">
                      <Timer className="w-4 h-4" />
                      Expires in 4:32
                    </div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    📱 Requires CRNMN Mobile App
                  </Badge>
                </div>
              </TabsContent>

              {/* Web3 Wallet */}
              <TabsContent value="wallet" className="mt-6">
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <Wallet className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Web3 Wallet</h3>
                    <p className="text-[var(--neutral-400)] mb-4">
                      Connect your wallet for NFT perks and crypto payments
                    </p>
                    <div className="flex justify-center gap-2 mb-4">
                      <Badge className="bg-purple-500/20 text-purple-400">🎨 NFT Benefits</Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-400">💰 Token Rewards</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={handleWeb3Auth}
                      disabled={isLoading || !capabilities.web3}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAzMiAzMiI+CiAgPHBhdGggZmlsbD0iI0Y2ODUxQiIgZD0iTTE2IDMxLjk5MmMtOC44MzcgMC0xNi03LjE2My0xNi0xNlM3LjE2MyAwIDE2IDBDOTI0Ljg0IDAgMzIgNy4xNjMgMzIgMTZzLTcuMTYgMTUuOTkyLTE2IDE1Ljk5MloiLz4KICA8cGF0aCBmaWxsPSIjRTI3NjI1IiBkPSJNMjcgMTZjMC02LjA3NS00LjkyNS0xMS0xMS0xMVM1IDkuOTI1IDUgMTZzNC45MjUgMTEgMTEgMTEgMTEtNC45MjUgMTEtMTFaIi8+CiAgPHBhdGggZmlsbD0iI0Q3MzUyNyIgZD0iTTIxIDIxSDExVjExaDEwdjEwWiIvPgogIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yMC4wNzMgOC45MjUgMTYuMzUgOS44N2wtMi42NDgtOi45NDQtMi42NDggOS44NC0zLjcyMy0uOTQ0djQuMjc1bC40NDcuOTQ0IDMuNzIzLS45NDQgMi42NDggOS44NCAyLjY0OC05Ljg0IDIuMTE5Ljk0NCIvPgo8L3N2Zz4=" className="w-4 h-4 mr-2" alt="" />
                      )}
                      Connect MetaMask
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      disabled
                      className="w-full border-blue-500/50 text-blue-400/50 h-11"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      WalletConnect (Coming Soon)
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Global Error Message */}
            {errors.general && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-400">{errors.general}</p>
                  {aiEnabled && (
                    <button 
                      className="text-xs text-red-300 hover:text-red-200 mt-2 underline"
                      onClick={() => setAiSuggestions(['Try using a different authentication method or contact support for help.'])}
                    >
                      Get AI Help →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Privacy Policy */}
            {!isLogin && authMode === 'email' && (
              <p className="text-xs text-[var(--neutral-500)] text-center">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-[var(--neon-green)] hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[var(--neon-green)] hover:underline">Privacy Policy</a>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Helper functions
  function getAuthModeTitle(): string {
    switch (authMode) {
      case 'email': return isLogin ? 'Welcome Back!' : 'Join CRNMN 2025';
      case 'passkey': return 'Biometric Login';
      case 'voice': return 'Voice Authentication'; 
      case 'qr': return 'QR Code Access';
      case 'wallet': return 'Web3 Wallet';
      default: return 'Authentication';
    }
  }

  function getAuthModeDescription(): string {
    switch (authMode) {
      case 'email': return isLogin 
        ? 'Sign in with AI assistance and behavioral security' 
        : 'Create your account with smart AI guidance';
      case 'passkey': return 'Secure biometric authentication with Face ID, Touch ID, or Windows Hello';
      case 'voice': return 'Hands-free authentication using voice commands and recognition';
      case 'qr': return 'Instant mobile app authentication with QR code scanning';
      case 'wallet': return 'Web3 wallet login with NFT benefits and crypto rewards';
      default: return 'Choose your preferred authentication method';
    }
  }
}