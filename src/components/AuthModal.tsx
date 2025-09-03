import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { EmailVerification } from './Auth/EmailVerification';
import { PasswordReset } from './Auth/PasswordReset';
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

export function AuthModal({ open, onOpenChange, setUser }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({ email: '', password: '', name: '', rememberMe: false });
      setErrors({});
      setShowPassword(false);
    }
  }, [open, isLogin]);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!isLogin) {
        // For signup, show email verification
        setShowEmailVerification(true);
        setIsLoading(false);
        return;
      }
      
      // Mock authentication for login
      const mockUser = {
        id: Date.now(),
        name: 'John Doe',
        email: formData.email,
        loyaltyPoints: Math.floor(Math.random() * 2000) + 500,
        role: formData.email === 'admin@crnmn.com' ? 'admin' : 'user',
        joinDate: new Date().toISOString()
      };
      
      setUser(mockUser);
      onOpenChange(false);
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

  const handleVerificationComplete = () => {
    // Complete signup after email verification
    const mockUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      loyaltyPoints: 100, // Welcome bonus
      isEmailVerified: true,
      joinDate: new Date().toISOString()
    };
    
    setUser(mockUser);
    setShowEmailVerification(false);
    onOpenChange(false);
    setFormData({ email: '', password: '', name: '', rememberMe: false });
  };

  const handleForgotPassword = () => {
    setShowPasswordReset(true);
  };

  const handlePasswordResetComplete = () => {
    setShowPasswordReset(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-md mx-4 rounded-3xl overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 via-transparent to-blue-500/5 opacity-50" />
        
        <DialogHeader className="relative">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-[var(--neon-green)] flex items-center justify-center">
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
                <label className="text-[var(--neutral-300)] font-medium text-sm">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                  <Input
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
              <label className="text-[var(--neutral-300)] font-medium text-sm">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                <Input
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
              <label className="text-[var(--neutral-300)] font-medium text-sm">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                <Input
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
              
              {errors.password && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me (Login Only) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                    className="border-[var(--neutral-600)] data-[state=checked]:bg-[var(--neon-green)] data-[state=checked]:border-[var(--neon-green)]"
                  />
                  <label 
                    htmlFor="rememberMe" 
                    className="text-sm text-[var(--neutral-400)] cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleForgotPassword}
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
              className="w-full text-base py-3 h-12 font-semibold text-black bg-[var(--neon-green)] hover:bg-[var(--neon-green)]/90 transition-all duration-200"
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
      
      {/* Email Verification Modal */}
      <EmailVerification
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
        email={formData.email}
        onVerificationComplete={handleVerificationComplete}
      />
      
      {/* Password Reset Modal */}
      <PasswordReset
        isOpen={showPasswordReset}
        onClose={() => setShowPasswordReset(false)}
        onBackToLogin={handlePasswordResetComplete}
      />
    </Dialog>
  );
}