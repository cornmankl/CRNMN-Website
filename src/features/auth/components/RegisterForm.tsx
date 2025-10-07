import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2, Check } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;
  const passwordStrength = formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordStrength) {
      setError('Password must be at least 8 characters with uppercase and number');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      await register(formData);
      onSuccess?.();
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Create Account</h2>
        <p className="text-muted-foreground">
          Join us and start ordering delicious corn dishes
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="+60 12-345 6789"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="pl-10 pr-10"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {formData.password && (
          <div className="flex items-center gap-2 text-xs">
            <div className={`flex items-center gap-1 ${passwordStrength ? 'text-green-600' : 'text-muted-foreground'}`}>
              {passwordStrength && <Check className="w-3 h-3" />}
              8+ chars, uppercase, number
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="pl-10 pr-10"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {formData.confirmPassword && (
          <div className="flex items-center gap-2 text-xs">
            <div className={`flex items-center gap-1 ${passwordsMatch ? 'text-green-600' : 'text-destructive'}`}>
              {passwordsMatch && <Check className="w-3 h-3" />}
              {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
            </div>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="acceptTerms"
          checked={formData.acceptTerms}
          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
          className="mt-1 rounded border-border"
          disabled={isLoading}
          required
        />
        <Label htmlFor="acceptTerms" className="text-sm font-normal cursor-pointer">
          I agree to the{' '}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" size="lg" disabled={isLoading || !formData.acceptTerms}>
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* Switch to Login */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary hover:underline font-medium"
        >
          Sign in instead
        </button>
      </p>
    </form>
  );
};
