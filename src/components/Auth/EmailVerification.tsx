import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Shield,
  Clock,
  Send
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface EmailVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationComplete: () => void;
}

export function EmailVerification({ 
  isOpen, 
  onClose, 
  email, 
  onVerificationComplete 
}: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && isOpen) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setVerificationCode('');
      setError('');
      setSuccess(false);
      setTimeLeft(300);
      setCanResend(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification (in real app, call your verification API)
      if (verificationCode === '123456') {
        setSuccess(true);
        setTimeout(() => {
          onVerificationComplete();
          onClose();
        }, 1500);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTimeLeft(300);
      setCanResend(false);
      setVerificationCode('');
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const cleanValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(cleanValue);
    setError('');
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-[var(--neutral-400)]">
              Your email has been successfully verified. You can now access all features.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-white text-xl font-bold text-center">
            Verify Your Email
          </DialogTitle>
          <DialogDescription className="text-[var(--neutral-400)] text-center">
            We've sent a 6-digit verification code to
            <br />
            <span className="text-white font-medium">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Verification Code Input */}
          <div className="space-y-2">
            <label className="text-[var(--neutral-300)]">Verification Code</label>
            <div className="flex justify-center">
              <Input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className={cn(
                  "text-center text-2xl font-mono tracking-widest bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white h-14 w-48",
                  error && "border-red-500"
                )}
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-[var(--neutral-400)]">
              <Clock className="w-4 h-4" />
              <span>Code expires in {formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleVerify}
              disabled={isVerifying || verificationCode.length !== 6}
              className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 h-12"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Email
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-[var(--neutral-400)]">Didn't receive the code?</span>
              <Button
                variant="ghost"
                onClick={handleResendCode}
                disabled={!canResend || isResending}
                className={cn(
                  "p-0 h-auto font-semibold",
                  canResend ? "text-[var(--neon-green)] hover:text-[var(--neon-green)]/80" : "text-[var(--neutral-500)]"
                )}
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-[var(--neutral-800)] rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Having trouble?</h4>
            <ul className="text-sm text-[var(--neutral-400)] space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Wait a few minutes for the email to arrive</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
