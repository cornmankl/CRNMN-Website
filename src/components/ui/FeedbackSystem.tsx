import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  CheckCircle, 
  X, 
  Star, 
  Gift, 
  ShoppingCart,
  Heart,
  Bell,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface FeedbackMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'achievement';
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoHide?: boolean;
  duration?: number;
}

interface FeedbackSystemProps {
  onNavigate: (section: string) => void;
  onShowCart: () => void;
  user?: any;
}

export function FeedbackSystem({ onNavigate, onShowCart, user }: FeedbackSystemProps) {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);

  // Add message function
  const addMessage = (message: Omit<FeedbackMessage, 'id'>) => {
    const newMessage: FeedbackMessage = {
      ...message,
      id: Date.now().toString()
    };
    
    setMessages(prev => [newMessage, ...prev.slice(0, 2)]); // Keep max 3 messages
    
    if (message.autoHide !== false) {
      setTimeout(() => {
        removeMessage(newMessage.id);
      }, message.duration || 4000);
    }
  };

  // Remove message function
  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  // Example usage - you can call these from other components
  const showAddToCartSuccess = (itemName: string) => {
    addMessage({
      type: 'success',
      title: 'Added to Cart!',
      message: `${itemName} has been added to your cart`,
      icon: <ShoppingCart className="w-5 h-5" />,
      action: {
        label: 'View Cart',
        onClick: onShowCart
      }
    });
  };

  const showWishlistSuccess = (itemName: string) => {
    addMessage({
      type: 'success',
      title: 'Added to Wishlist!',
      message: `${itemName} saved to your favorites`,
      icon: <Heart className="w-5 h-5" />,
      action: {
        label: 'View Wishlist',
        onClick: () => onNavigate('profile')
      }
    });
  };

  const showLoyaltyAchievement = (points: number, tier?: string) => {
    addMessage({
      type: 'achievement',
      title: tier ? `${tier} Tier Unlocked!` : 'Points Earned!',
      message: `You earned ${points} loyalty points`,
      icon: <Star className="w-5 h-5" />,
      action: {
        label: 'View Rewards',
        onClick: () => onNavigate('profile')
      },
      autoHide: false
    });
  };

  const showWelcomeMessage = () => {
    addMessage({
      type: 'info',
      title: 'Welcome to CRNMN!',
      message: 'Discover our premium corn dishes and earn loyalty rewards',
      icon: <Sparkles className="w-5 h-5" />,
      action: {
        label: 'Start Shopping',
        onClick: () => onNavigate('menu')
      },
      duration: 6000
    });
  };

  // Show welcome message for new users
  useEffect(() => {
    if (user && !localStorage.getItem('welcome_shown')) {
      setTimeout(() => {
        showWelcomeMessage();
        localStorage.setItem('welcome_shown', 'true');
      }, 1000);
    }
  }, [user]);

  const getMessageColors = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10 border-green-500/20',
          text: 'text-green-400',
          button: 'bg-green-500 hover:bg-green-600 text-white'
        };
      case 'achievement':
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/20',
          text: 'text-yellow-400',
          button: 'bg-yellow-500 hover:bg-yellow-600 text-black'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20',
          text: 'text-blue-400',
          button: 'bg-blue-500 hover:bg-blue-600 text-white'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/10 border-orange-500/20',
          text: 'text-orange-400',
          button: 'bg-orange-500 hover:bg-orange-600 text-white'
        };
      default:
        return {
          bg: 'bg-[var(--neutral-800)] border-[var(--neutral-700)]',
          text: 'text-[var(--neutral-300)]',
          button: 'bg-[var(--neon-green)] hover:bg-[var(--neon-green)]/90 text-black'
        };
    }
  };

  // Expose functions for use by other components
  React.useEffect(() => {
    // Make functions available globally for easy access
    (window as any).crnmnFeedback = {
      addToCart: showAddToCartSuccess,
      addToWishlist: showWishlistSuccess,
      loyaltyAchievement: showLoyaltyAchievement,
      welcome: showWelcomeMessage,
      custom: addMessage
    };
  }, []);

  return (
    <div className="fixed top-20 right-6 z-40 space-y-3 w-80 max-w-[calc(100vw-3rem)]">
      {messages.map((message) => {
        const colors = getMessageColors(message.type);
        
        return (
          <Card 
            key={message.id}
            className={cn(
              "animate-in slide-in-from-right-2 duration-300",
              colors.bg
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn("flex-shrink-0", colors.text)}>
                  {message.icon || <CheckCircle className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={cn("font-semibold mb-1", colors.text)}>
                    {message.title}
                  </h4>
                  <p className="text-sm text-[var(--neutral-300)]">
                    {message.message}
                  </p>
                  
                  {message.action && (
                    <Button
                      onClick={message.action.onClick}
                      size="sm"
                      className={cn("mt-3", colors.button)}
                    >
                      {message.action.label}
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMessage(message.id)}
                  className="p-1 text-[var(--neutral-400)] hover:text-white flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Hook for using feedback system
export function useFeedback() {
  const addFeedback = (message: Omit<FeedbackMessage, 'id'>) => {
    if ((window as any).crnmnFeedback) {
      (window as any).crnmnFeedback.custom(message);
    }
  };

  const showSuccess = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addFeedback({
      type: 'success',
      title,
      message,
      action,
      icon: <CheckCircle className="w-5 h-5" />
    });
  };

  const showAchievement = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addFeedback({
      type: 'achievement',
      title,
      message,
      action,
      icon: <Star className="w-5 h-5" />,
      autoHide: false
    });
  };

  const showInfo = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addFeedback({
      type: 'info',
      title,
      message,
      action,
      icon: <Gift className="w-5 h-5" />
    });
  };

  return {
    addFeedback,
    showSuccess,
    showAchievement,
    showInfo
  };
}
