import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { 
  HelpCircle, 
  X, 
  Lightbulb, 
  ArrowRight,
  CheckCircle,
  Info,
  Play,
  Book,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Gift,
  Zap
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface HelpSystemProps {
  currentSection: string;
  user?: any;
  onNavigate: (section: string) => void;
  onShowAuth: () => void;
}

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  steps: string[];
  tips?: string[];
  relatedSections?: string[];
}

export function HelpSystem({ currentSection, user, onNavigate, onShowAuth }: HelpSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHelp, setActiveHelp] = useState<string | null>(null);

  const helpTopics: Record<string, HelpTopic> = {
    menu: {
      id: 'menu',
      title: 'How to Browse & Order',
      description: 'Find and order your favorite corn dishes',
      steps: [
        'Use the Search tab to find specific items or filter by preferences',
        'Browse by categories in the Browse tab',
        'Click "Add to Cart" on items you want',
        'View your cart by clicking the cart icon',
        'Proceed to checkout when ready'
      ],
      tips: [
        'Use filters to find vegetarian or spicy options',
        'Check ratings and reviews for popular items',
        'Look for "Sale" badges for discounts'
      ],
      relatedSections: ['tracking', 'profile']
    },
    tracking: {
      id: 'tracking',
      title: 'Order Tracking Guide',
      description: 'Monitor your orders and delivery progress',
      steps: [
        'View current orders in the "Current Orders" tab',
        'See detailed tracking timeline with live updates',
        'Contact your driver when order is out for delivery',
        'Rate your order after delivery',
        'Check order history in the "Order History" tab'
      ],
      tips: [
        'Enable notifications for real-time updates',
        'Save driver contact for easy communication',
        'Use "Track by ID" if you have an order number'
      ],
      relatedSections: ['profile', 'menu']
    },
    profile: {
      id: 'profile',
      title: 'Account & Rewards Guide',
      description: 'Manage your profile and loyalty benefits',
      steps: [
        'View your loyalty points and tier status',
        'Edit your profile information in the Profile tab',
        'Check order history and reorder favorites',
        'Redeem rewards in the Rewards tab',
        'Manage notification preferences in Settings'
      ],
      tips: [
        'Earn 1 point per RM spent on orders',
        'Reach Silver (1000 pts) or Gold (2000 pts) for better benefits',
        'Update your address for accurate delivery estimates'
      ],
      relatedSections: ['menu', 'tracking']
    },
    ai: {
      id: 'ai',
      title: 'AI Assistant Help',
      description: 'Get personalized recommendations and support',
      steps: [
        'Ask questions about menu items or ingredients',
        'Get personalized recommendations based on your preferences',
        'Request help with orders or account issues',
        'Use voice commands for hands-free interaction',
        'Access advanced features in different tabs'
      ],
      tips: [
        'Be specific in your questions for better results',
        'Try asking "What\'s popular?" or "What\'s spicy?"',
        'The AI learns from your order history'
      ],
      relatedSections: ['menu', 'profile']
    }
  };

  const generalTips = [
    {
      icon: <Star className="w-4 h-4" />,
      text: 'Sign up to earn loyalty points with every order',
      action: 'Sign Up',
      onClick: onShowAuth
    },
    {
      icon: <Gift className="w-4 h-4" />,
      text: 'Check the Rewards tab for exclusive offers',
      action: 'View Rewards',
      onClick: () => user ? onNavigate('profile') : onShowAuth()
    },
    {
      icon: <Zap className="w-4 h-4" />,
      text: 'Use our AI Assistant for instant help',
      action: 'Try AI',
      onClick: () => onNavigate('ai')
    }
  ];

  const currentHelp = helpTopics[currentSection];

  useEffect(() => {
    if (currentHelp) {
      setActiveHelp(currentSection);
    }
  }, [currentSection, currentHelp]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-24 right-6 z-30">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Need help? Click for guidance!</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-30 w-96 max-w-[calc(100vw-3rem)]">
      <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)] shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-500" />
              Help & Tips
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-1 text-[var(--neutral-400)] hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Current Page Help */}
          {currentHelp && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500 text-white">Current Page</Badge>
                <span className="text-sm font-semibold text-white">{currentHelp.title}</span>
              </div>
              
              <p className="text-sm text-[var(--neutral-400)]">
                {currentHelp.description}
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Quick Steps:</h4>
                <ol className="space-y-1">
                  {currentHelp.steps.slice(0, 3).map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-[var(--neutral-300)]">
                      <span className="text-[var(--neon-green)] font-semibold min-w-[20px]">
                        {index + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {currentHelp.tips && currentHelp.tips.length > 0 && (
                <div className="bg-[var(--neutral-800)] rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    Pro Tips:
                  </h4>
                  <ul className="space-y-1">
                    {currentHelp.tips.slice(0, 2).map((tip, index) => (
                      <li key={index} className="text-xs text-[var(--neutral-400)] flex items-start gap-1">
                        <span className="text-yellow-400 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* General Tips */}
          {!currentHelp && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Getting Started</h3>
              {generalTips.map((tip, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[var(--neutral-800)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-[var(--neon-green)]">{tip.icon}</div>
                    <span className="text-sm text-[var(--neutral-300)]">{tip.text}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={tip.onClick}
                    className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 text-xs"
                  >
                    {tip.action}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Contact Support */}
          <div className="border-t border-[var(--neutral-800)] pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--neutral-400)]">Need more help?</span>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('ai')}
                      className="border-[var(--neutral-600)] p-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Chat with AI</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[var(--neutral-600)] p-2"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Call Support</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
