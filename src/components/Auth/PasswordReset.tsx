import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
// import { label } from '../ui/label'; // Removed to fix import error
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Shield,
  Key,
  Send
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface PasswordResetProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export function PasswordReset({ isOpen, onClose, onBackToLogin }: PasswordResetProps) {
  const [step, setStep] = useState<'email' | 'code' | 'newPassword' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStep('email');
      setEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 && 
           /[a-z]/.test(password) && 
           /[A-Z]/.test(password) && 
           /\d/.test(password);
  };

  const handleSendResetCode = async () => {
    setErrors({});
    
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep('code');
    } catch (error) {
      setErrors({ email: 'Failed to send reset code. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setErrors({});
    
    if (!resetCode || resetCode.length !== 6) {
      setErrors({ code: 'Please enter the 6-digit reset code' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock verification (in real app, verify with your API)
      if (resetCode === '123456') {
        setStep('newPassword');
      } else {
        setErrors({ code: 'Invalid reset code. Please try again.' });
      }
    } catch (error) {
      setErrors({ code: 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setErrors({});
    
    if (!newPassword) {
      setErrors({ password: 'New password is required' });
      return;
    }
    
    if (!validatePassword(newPassword)) {
      setErrors({ 
        password: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('success');
    } catch (error) {
      setErrors({ password: 'Failed to reset password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    onClose();
    onBackToLogin();
  };

  const renderStepContent = () => {
    switch (step) {
      case 'email':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Reset Your Password</h2>
              <p className="text-[var(--neutral-400)]">
                Enter your email address and we'll send you a reset code
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[var(--neutral-300)]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "pl-10 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                    errors.email && "border-red-500"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleSendResetCode}
                disabled={isLoading}
                className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Reset Code...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reset Code
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={handleBackToLogin}
                className="w-full text-[var(--neutral-400)] hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[var(--neon-green)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Enter Reset Code</h2>
              <p className="text-[var(--neutral-400)]">
                We've sent a 6-digit code to
                <br />
                <span className="text-white font-medium">{email}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[var(--neutral-300)]">Reset Code</label>
              <div className="flex justify-center">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setResetCode(value);
                    setErrors({});
                  }}
                  className={cn(
                    "text-center text-2xl font-mono tracking-widest bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-14 w-48",
                    errors.code && "border-red-500"
                  )}
                  placeholder="000000"
                />
              </div>
              {errors.code && (
                <p className="text-red-400 text-sm text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.code}
                </p>
              )}
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-[var(--neutral-400)] text-sm">
                <Clock className="w-4 h-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
              {canResend && (
                <Button
                  variant="ghost"
                  onClick={handleSendResetCode}
                  disabled={isResending}
                  className="mt-2 text-[var(--neon-green)] hover:text-[var(--neon-green)]/80"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Resend Code
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || resetCode.length !== 6}
                className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Code
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setStep('email')}
                className="w-full text-[var(--neutral-400)] hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change Email
              </Button>
            </div>
          </div>
        );

      case 'newPassword':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Create New Password</h2>
              <p className="text-[var(--neutral-400)]">
                Choose a strong password for your account
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[var(--neutral-300)]">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={cn(
                      "pl-10 pr-12 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                      errors.password && "border-red-500"
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
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[var(--neutral-300)]">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      "pl-10 pr-12 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-11",
                      errors.confirmPassword && "border-red-500"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 p-0 text-[var(--neutral-400)] hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-[var(--neutral-800)] rounded-lg p-3">
                <h4 className="font-semibold text-white mb-2 text-sm">Password Requirements:</h4>
                <ul className="text-xs text-[var(--neutral-400)] space-y-1">
                  <li className={cn(
                    "flex items-center gap-2",
                    newPassword.length >= 8 ? "text-green-400" : "text-[var(--neutral-400)]"
                  )}>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      newPassword.length >= 8 ? "bg-green-400" : "bg-[var(--neutral-600)]"
                    )} />
                    At least 8 characters
                  </li>
                  <li className={cn(
                    "flex items-center gap-2",
                    /[A-Z]/.test(newPassword) ? "text-green-400" : "text-[var(--neutral-400)]"
                  )}>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      /[A-Z]/.test(newPassword) ? "bg-green-400" : "bg-[var(--neutral-600)]"
                    )} />
                    One uppercase letter
                  </li>
                  <li className={cn(
                    "flex items-center gap-2",
                    /[a-z]/.test(newPassword) ? "text-green-400" : "text-[var(--neutral-400)]"
                  )}>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      /[a-z]/.test(newPassword) ? "bg-green-400" : "bg-[var(--neutral-600)]"
                    )} />
                    One lowercase letter
                  </li>
                  <li className={cn(
                    "flex items-center gap-2",
                    /\d/.test(newPassword) ? "text-green-400" : "text-[var(--neutral-400)]"
                  )}>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      /\d/.test(newPassword) ? "bg-green-400" : "bg-[var(--neutral-600)]"
                    )} />
                    One number
                  </li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
            <p className="text-[var(--neutral-400)] mb-6">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <Button
              onClick={handleBackToLogin}
              className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
            >
              Back to Sign In
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-md">
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
