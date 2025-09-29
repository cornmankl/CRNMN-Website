import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Star, 
  Gift, 
  Crown, 
  Sparkles, 
  Trophy, 
  Zap,
  ArrowRight,
  Plus,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoyaltyWidgetProps {
  user?: any;
  compact?: boolean;
  onPointsEarned?: (points: number) => void;
}

export function LoyaltyWidget({ user, compact = false, onPointsEarned }: LoyaltyWidgetProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const loyaltyPoints = user?.loyaltyPoints || 0;
  const loyaltyTier = loyaltyPoints >= 2000 ? 'Gold' : loyaltyPoints >= 1000 ? 'Silver' : 'Bronze';
  const nextTierPoints = loyaltyPoints >= 2000 ? 0 : loyaltyPoints >= 1000 ? 2000 - loyaltyPoints : 1000 - loyaltyPoints;
  const currentTierMax = loyaltyTier === 'Bronze' ? 1000 : loyaltyTier === 'Silver' ? 2000 : 2000;

  const tierBenefits = {
    Bronze: ['Earn 1 point per RM spent', 'Birthday discount 5%'],
    Silver: ['Earn 1 point per RM spent', 'Birthday discount 10%', 'Free delivery on orders >RM 30'],
    Gold: ['Earn 1.5 points per RM spent', 'Birthday discount 15%', 'Free delivery on all orders', 'Priority support']
  };

  const simulatePointsEarned = (points: number) => {
    setEarnedPoints(points);
    setShowAnimation(true);
    onPointsEarned?.(points);
    
    setTimeout(() => {
      setShowAnimation(false);
      setEarnedPoints(0);
    }, 3000);
  };

  if (compact) {
    return (
      <Card className="bg-gradient-to-r from-[var(--neutral-900)] to-[var(--neutral-800)] border-[var(--neutral-700)] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 via-transparent to-yellow-500/5" />
        
        <CardContent className="p-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                loyaltyTier === 'Gold' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                loyaltyTier === 'Silver' ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                'bg-gradient-to-r from-amber-600 to-amber-800'
              )}>
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--neon-green)] text-lg">
                    {loyaltyPoints.toLocaleString()}
                  </span>
                  <Badge className={cn(
                    "text-xs",
                    loyaltyTier === 'Gold' ? 'bg-yellow-500 text-black' :
                    loyaltyTier === 'Silver' ? 'bg-gray-300 text-black' :
                    'bg-amber-600 text-white'
                  )}>
                    {loyaltyTier}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--neutral-400)]">Loyalty Points</p>
              </div>
            </div>
            
            {nextTierPoints > 0 && (
              <div className="text-right">
                <p className="text-xs text-[var(--neutral-400)]">
                  {nextTierPoints} to {loyaltyTier === 'Bronze' ? 'Silver' : 'Gold'}
                </p>
                <div className="w-16 bg-[var(--neutral-700)] rounded-full h-1 mt-1">
                  <div 
                    className="bg-[var(--neon-green)] h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(loyaltyPoints / currentTierMax) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Points earned animation */}
          {showAnimation && (
            <div className="absolute top-2 right-2 animate-bounce">
              <div className="bg-[var(--neon-green)] text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Plus className="w-3 h-3" />
                {earnedPoints}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[var(--neutral-900)] via-[var(--neutral-800)] to-[var(--neutral-900)] border-[var(--neutral-700)] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/10 via-transparent to-yellow-500/10" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--neon-green)]/20 to-transparent rounded-bl-full" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--neon-green)]" />
            Loyalty Rewards
          </CardTitle>
          <Badge className={cn(
            "text-sm font-semibold px-3 py-1",
            loyaltyTier === 'Gold' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' :
            loyaltyTier === 'Silver' ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-black' :
            'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
          )}>
            {loyaltyTier} Member
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Points Display */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-6 h-6 text-[var(--neon-green)]" />
            <span className="text-4xl font-bold text-white">
              {loyaltyPoints.toLocaleString()}
            </span>
            <Sparkles className="w-6 h-6 text-[var(--neon-green)]" />
          </div>
          <p className="text-[var(--neutral-400)]">Total Loyalty Points</p>
        </div>

        {/* Progress to Next Tier */}
        {nextTierPoints > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--neutral-300)]">
                Progress to {loyaltyTier === 'Bronze' ? 'Silver' : 'Gold'}
              </span>
              <span className="text-sm font-semibold text-[var(--neon-green)]">
                {nextTierPoints} points to go
              </span>
            </div>
            <Progress 
              value={(loyaltyPoints / currentTierMax) * 100} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-[var(--neutral-400)]">
              <span>{loyaltyPoints}</span>
              <span>{currentTierMax}</span>
            </div>
          </div>
        )}

        {/* Tier Benefits */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Your {loyaltyTier} Benefits
          </h3>
          <div className="space-y-2">
            {tierBenefits[loyaltyTier as keyof typeof tierBenefits].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-[var(--neutral-300)]">
                <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="border-[var(--neutral-600)] hover:border-[var(--neon-green)] group"
            onClick={() => simulatePointsEarned(25)}
          >
            <Zap className="w-4 h-4 mr-2 group-hover:text-[var(--neon-green)]" />
            Earn Points
          </Button>
          <Button 
            variant="outline" 
            className="border-[var(--neutral-600)] hover:border-[var(--neon-green)] group"
          >
            <Gift className="w-4 h-4 mr-2 group-hover:text-[var(--neon-green)]" />
            Redeem Rewards
          </Button>
        </div>

        {/* Tier Upgrade Preview */}
        {nextTierPoints > 0 && (
          <div className="bg-[var(--neutral-800)] rounded-lg p-4 border border-[var(--neutral-700)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">
                Unlock {loyaltyTier === 'Bronze' ? 'Silver' : 'Gold'} Tier
              </span>
              <TrendingUp className="w-4 h-4 text-[var(--neon-green)]" />
            </div>
            <p className="text-sm text-[var(--neutral-400)] mb-3">
              Get {nextTierPoints} more points to unlock exclusive benefits!
            </p>
            <Button 
              size="sm" 
              className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
            >
              View Next Tier Benefits
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Points earned animation */}
        {showAnimation && (
          <div className="absolute top-4 right-4 animate-bounce">
            <div className="bg-[var(--neon-green)] text-black px-3 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              +{earnedPoints} Points!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
