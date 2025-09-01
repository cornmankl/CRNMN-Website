import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setUser: (user: any) => void;
}

export function AuthModal({ open, onOpenChange, setUser }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    const mockUser = {
      id: 1,
      name: isLogin ? 'John Doe' : formData.name,
      email: formData.email,
      loyaltyPoints: 1250
    };
    
    setUser(mockUser);
    onOpenChange(false);
    setFormData({ email: '', password: '', name: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold text-center">
            {isLogin ? 'Welcome Back' : 'Join THEFMSMKT'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-3 focus:ring-[var(--neon-green)] focus:border-[var(--neon-green)]"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-3 focus:ring-[var(--neon-green)] focus:border-[var(--neon-green)]"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-3 focus:ring-[var(--neon-green)] focus:border-[var(--neon-green)]"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <Button type="submit" className="btn-primary w-full text-base py-3">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-[var(--neutral-400)]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            className="text-[var(--neon-green)] hover:underline font-semibold"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}