import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Bot, 
  Sparkles, 
  MessageCircle,
  Zap,
  Loader2
} from 'lucide-react';
import { AIAssistant } from './AI/AIAssistant';
import { useAIAuth } from '../utils/ai/aiAuth';
import { useUserStore } from '../store';

export const AIToggle: React.FC = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { user: aiUser, loading } = useAIAuth();
  const { user } = useUserStore();

  const handleToggleAI = () => {
    setIsAIOpen(!isAIOpen);
  };

  if (loading) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        disabled
      >
        <Loader2 className="w-5 h-5 animate-spin text-[var(--neutral-400)]" />
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleAI}
        className="relative p-2 hover:bg-[var(--neutral-800)] transition-colors"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-[var(--neutral-300)] hover:text-[var(--neon-green)] transition-colors" />
          
          {/* AI Status Indicator */}
          {aiUser && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--neon-green)] animate-pulse" />
          )}
          
          {/* Premium Badge */}
          {aiUser?.role === 'premium' && (
            <div className="absolute -bottom-1 -right-1">
              <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                <Sparkles className="w-2 h-2 mr-1" />
                Pro
              </Badge>
            </div>
          )}
        </div>
      </Button>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        user={user}
      />
    </>
  );
};

// Floating AI Button for mobile
export const FloatingAIButton: React.FC = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { user: aiUser, loading } = useAIAuth();
  const { user } = useUserStore();

  if (loading) return null;

  return (
    <>
      <Button
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full neon-bg text-black shadow-2xl z-40 hover:scale-110 transition-transform"
        size="lg"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          {aiUser && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
      </Button>

      <AIAssistant
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        user={user}
      />
    </>
  );
};

// AI Status Indicator
export const AIStatusIndicator: React.FC = () => {
  const { user: aiUser, loading } = useAIAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--neutral-400)]">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading AI...</span>
      </div>
    );
  }

  if (!aiUser) {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--neutral-400)]">
        <Bot className="w-4 h-4" />
        <span>AI Assistant Available</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse" />
        <span className="text-[var(--neon-green)] font-medium">AI Online</span>
      </div>
      
      <Badge variant="secondary" className="text-xs">
        {aiUser.role === 'user' ? 'Free' : aiUser.role === 'premium' ? 'Pro' : 'Admin'}
      </Badge>
      
      <div className="flex items-center gap-1 text-xs text-[var(--neutral-400)]">
        <MessageCircle className="w-3 h-3" />
        <span>{aiUser.usage.chatMessages}</span>
      </div>
    </div>
  );
};