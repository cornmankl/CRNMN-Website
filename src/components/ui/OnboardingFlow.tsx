import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './dialog';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { Progress } from './progress';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Star,
  Gift,
  Truck,
  Bell,
  Heart,
  Search,
  ShoppingCart,
  Crown,
  MapPin,
  Clock,
  Shield
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  user?: any;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  action?: {
    label: string;
    section: string;
  };
}

export function OnboardingFlow({ isOpen, onClose, onNavigate, user }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to CRNMN!',
      description: 'Your premium corn delivery experience starts here',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-[var(--neon-green)] to-green-400',
      features: [
        'Fresh corn dishes delivered in 15-30 minutes',
        'Loyalty rewards with every order',
        'Real-time order tracking',
        'Premium quality guaranteed'
      ]
    },
    {
      id: 'browse',
      title: 'Discover Amazing Flavors',
      description: 'Browse our menu with smart search and filters',
      icon: <Search className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Advanced search and filtering',
        'Category browsing',
        'Dietary preferences (Vegetarian, Spicy)',
        'Customer ratings and reviews'
      ],
      action: {
        label: 'Browse Menu',
        section: 'menu'
      }
    },
    {
      id: 'order',
      title: 'Easy Ordering Process',
      description: 'Simple checkout with multiple payment options',
      icon: <ShoppingCart className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      features: [
        'Multiple payment methods',
        'Delivery scheduling',
        'Promo codes and discounts',
        'Order customization'
      ]
    },
    {
      id: 'track',
      title: 'Track Your Order',
      description: 'Real-time updates from kitchen to your door',
      icon: <Truck className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Live order status updates',
        'Driver information and contact',
        'Delivery time estimates',
        'Order history and receipts'
      ],
      action: {
        label: 'View Tracking',
        section: 'tracking'
      }
    },
    {
      id: 'rewards',
      title: 'Earn Loyalty Rewards',
      description: 'Get points with every order and unlock exclusive benefits',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-yellow-500 to-yellow-600',
      features: [
        'Earn 1 point per RM spent',
        'Bronze, Silver, and Gold tiers',
        'Exclusive discounts and free delivery',
        'Birthday rewards and special offers'
      ],
      action: {
        label: 'View Profile',
        section: 'profile'
      }
    }
  ];

  // Check if user has seen onboarding
  useEffect(() => {
    const seen = localStorage.getItem('crnmn_onboarding_seen');
    setHasSeenOnboarding(!!seen);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('crnmn_onboarding_seen', 'true');
    setHasSeenOnboarding(true);
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('crnmn_onboarding_seen', 'true');
    setHasSeenOnboarding(true);
    onClose();
  };

  const handleActionClick = (action?: { label: string; section: string }) => {
    if (action) {
      onNavigate(action.section);
      handleComplete();
    } else {
      handleNext();
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-2xl mx-4 p-0 overflow-hidden">
        {/* Background Gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-10",
          currentStepData.color
        )} />

        <div className="relative p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--neutral-400)]">
                Step {currentStep + 1} of {steps.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-[var(--neutral-400)] hover:text-white p-0 h-auto"
              >
                Skip tour
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className={cn(
              "w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-gradient-to-br text-white shadow-xl",
              currentStepData.color
            )}>
              {currentStepData.icon}
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white">
                {currentStepData.title}
              </h2>
              <p className="text-[var(--neutral-400)] text-lg max-w-md mx-auto">
                {currentStepData.description}
              </p>
            </div>

            {/* Features List */}
            <Card className="bg-[var(--neutral-800)] border-[var(--neutral-700)] text-left">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {currentStepData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br",
                        currentStepData.color
                      )}>
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[var(--neutral-300)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="border-[var(--neutral-600)] hover:border-[var(--neutral-500)]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStepData.action ? (
                <Button
                  onClick={() => handleActionClick(currentStepData.action)}
                  className={cn(
                    "bg-gradient-to-r text-white font-semibold px-6",
                    currentStepData.color
                  )}
                >
                  {currentStepData.action.label}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className={cn(
                    "bg-gradient-to-r text-white font-semibold px-6",
                    currentStepData.color
                  )}
                >
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    index === currentStep 
                      ? "bg-[var(--neon-green)] scale-125" 
                      : index < currentStep 
                        ? "bg-[var(--neon-green)]/60" 
                        : "bg-[var(--neutral-600)]"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem('crnmn_onboarding_seen');
    const hasSeenBefore = !!seen;
    setHasSeenOnboarding(hasSeenBefore);
    
    // Show onboarding for new users after a short delay
    if (!hasSeenBefore) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  const completeOnboarding = () => {
    localStorage.setItem('crnmn_onboarding_seen', 'true');
    setHasSeenOnboarding(true);
    setShowOnboarding(false);
  };

  return {
    showOnboarding,
    hasSeenOnboarding,
    startOnboarding,
    completeOnboarding,
    setShowOnboarding
  };
}
