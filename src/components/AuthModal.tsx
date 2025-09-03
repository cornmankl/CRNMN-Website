import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
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
  Sparkles
} from 'lucide-react';
import { cn } from '../utils/cn';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setUser: (user: any) => void;
}

interface FormData {
  email: string;
  password: string;
  name: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string;
  color: string;
}

export function AuthModal({ open, onOpenChange, setUser }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: '',
    color: ''
  });

  // Reset form when modal opens/closes or switching between login/signup
  useEffect(() => {
    if (!open) {
      setFormData({ email: '', password: '', name: '', rememberMe: false });
      setErrors({});
      setPasswordStrength({ score: 0, feedback: '', color: '' });
      setShowPassword(false);
    }
  }, [open, isLogin]);

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, feedback: '', color: '' };
    
    let score = 0;
    let feedback = '';
    let color = '';

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very weak';
        color = 'bg-red-500';
        break;
      case 2:
        feedback = 'Weak';
        color = 'bg-orange-500';
        break;
      case 3:
        feedback = 'Fair';
        color = 'bg-yellow-500';
        break;
      case 4:
        feedback = 'Good';
        color = 'bg-blue-500';
        break;
      case 5:
        feedback = 'Strong';
        color = 'bg-green-500';
        break;
    }

    return { score, feedback, color };
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
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Update password strength for password field
    if (field === 'password' && typeof value === 'string') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication
      const mockUser = {
        id: Date.now(),
        name: isLogin ? 'John Doe' : formData.name,
        email: formData.email,
        loyaltyPoints: Math.floor(Math.random() * 2000) + 500,
        joinDate: new Date().toISOString()
      };
      
      setUser(mockUser);
      onOpenChange(false);
      
      // Reset form
      setFormData({ email: '', password: '', name: '', rememberMe: false });
    } catch (error) {
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: Date.now(),
        name: `User via ${provider}`,
        email: `user@${provider}.com`,
        loyaltyPoints: Math.floor(Math.random() * 1500) + 300,
        provider
      };
      
      setUser(mockUser);
      onOpenChange(false);
    } catch (error) {
      setErrors({ general: `${provider} login failed. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-md mx-4 rounded-3xl overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 via-transparent to-blue-500/5 opacity-50" />
        
        <DialogHeader className="relative">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-full neon-bg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
          </div>
          <DialogTitle className="text-white text-2xl font-bold text-center">
            {isLogin ? 'Welcome Back!' : 'Join CRNMN'}
          </DialogTitle>
          <DialogDescription className="text-[var(--neutral-400)] text-center">
            {isLogin 
              ? 'Sign in to access your corn orders and loyalty rewards' 
              : 'Create your account and start ordering premium corn'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="relative space-y-6">
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="bg-[var(--neutral-800)] border-[var(--neutral-700)] hover:border-[var(--neutral-600)] text-white h-11"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="bg-[var(--neutral-800)] border-[var(--neutral-700)] hover:border-[var(--neutral-600)] text-white h-11"
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

          {/* Error Message */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Sign Up Only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[var(--neutral-300)] font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={cn(
                      "pl-10 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                      "focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)]",
                      "transition-all duration-200",
                      errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--neutral-300)] font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={cn(
                    "pl-10 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                    "focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)]",
                    "transition-all duration-200",
                    errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[var(--neutral-300)] font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={cn(
                    "pl-10 pr-12 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                    "focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)]",
                    "transition-all duration-200",
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
              
              {/* Password Strength Indicator (Sign Up Only) */}
              {!isLogin && formData.password && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-[var(--neutral-700)] rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-300", passwordStrength.color)}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={cn("text-xs font-medium", 
                      passwordStrength.score <= 2 ? "text-red-400" : 
                      passwordStrength.score === 3 ? "text-yellow-400" :
                      passwordStrength.score === 4 ? "text-blue-400" : "text-green-400"
                    )}>
                      {passwordStrength.feedback}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password (Login Only) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                    className="border-[var(--neutral-600)] data-[state=checked]:bg-[var(--neon-green)] data-[state=checked]:border-[var(--neon-green)]"
                  />
                  <Label 
                    htmlFor="rememberMe" 
                    className="text-sm text-[var(--neutral-400)] cursor-pointer"
                  >
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

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full text-base py-3 h-12 font-semibold text-black bg-[var(--neon-green)] hover:bg-[var(--neon-green)]/90 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="text-center border-t border-[var(--neutral-800)] pt-4">
            <p className="text-sm text-[var(--neutral-400)] mb-2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
              className="text-[var(--neon-green)] hover:text-[var(--neon-green)]/80 font-semibold p-0 h-auto"
            >
              {isLogin ? 'Create account' : 'Sign in instead'}
            </Button>
          </div>

          {/* Privacy Notice (Sign Up Only) */}
          {!isLogin && (
            <p className="text-xs text-[var(--neutral-500)] text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-[var(--neon-green)] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[var(--neon-green)] hover:underline">Privacy Policy</a>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}