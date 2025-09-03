import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { 
  Plus, 
  ShoppingCart, 
  Heart, 
  Bell, 
  Bot,
  Package,
  Phone,
  MessageSquare,
  X,
  Zap,
  Star,
  Gift,
  ArrowUp
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface FloatingActionMenuProps {
  user?: any;
  cartCount: number;
  activeOrder?: any;
  onShowCart: () => void;
  onShowAuth: () => void;
  onNavigate: (section: string) => void;
}

export function FloatingActionMenu({ 
  user, 
  cartCount, 
  activeOrder, 
  onShowCart, 
  onShowAuth, 
  onNavigate 
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top when user scrolls down
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickActions = [
    {
      id: 'cart',
      label: 'View Cart',
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'bg-[var(--neon-green)] text-black',
      action: onShowCart,
      badge: cartCount > 0 ? cartCount : undefined,
      priority: 1
    },
    {
      id: 'ai',
      label: 'AI Helper',
      icon: <Bot className="w-5 h-5" />,
      color: 'bg-blue-500 text-white',
      action: () => onNavigate('ai'),
      badge: 'NEW',
      priority: 2
    },
    {
      id: 'tracking',
      label: 'Track Order',
      icon: <Package className="w-5 h-5" />,
      color: 'bg-purple-500 text-white',
      action: () => user ? onNavigate('tracking') : onShowAuth(),
      badge: activeOrder ? 'LIVE' : undefined,
      priority: 3,
      requiresAuth: true
    },
    {
      id: 'support',
      label: 'Get Help',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-orange-500 text-white',
      action: () => onNavigate('ai'),
      priority: 4
    }
  ];

  const visibleActions = quickActions
    .filter(action => !action.requiresAuth || user)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={scrollToTop}
                className="w-12 h-12 rounded-full bg-[var(--neutral-800)] hover:bg-[var(--neutral-700)] border border-[var(--neutral-700)] shadow-lg"
                size="sm"
              >
                <ArrowUp className="w-5 h-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Back to top</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Quick Action Buttons */}
        {isOpen && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-2 duration-200">
            {visibleActions.map((action, index) => (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={action.action}
                    className={cn(
                      "relative w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110",
                      action.color
                    )}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {action.icon}
                    {action.badge && (
                      <Badge className={cn(
                        "absolute -top-2 -right-2 min-w-[20px] h-5 p-0 flex items-center justify-center text-xs",
                        typeof action.badge === 'number' 
                          ? "bg-red-500 text-white animate-bounce"
                          : "bg-blue-500 text-white"
                      )}>
                        {action.badge}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{action.label}</p>
                  {action.requiresAuth && !user && (
                    <p className="text-xs text-[var(--neutral-400)]">Sign in required</p>
                  )}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300",
                "bg-gradient-to-br from-[var(--neon-green)] to-green-400 text-black",
                "hover:from-[var(--neon-green)]/90 hover:to-green-400/90 hover:scale-110",
                isOpen && "rotate-45"
              )}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isOpen ? 'Close menu' : 'Quick actions'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Notification Dots */}
        {!isOpen && (
          <div className="absolute top-0 right-0 flex gap-1">
            {cartCount > 0 && (
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
            {activeOrder && (
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
