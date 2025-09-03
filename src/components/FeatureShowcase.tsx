import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sparkles,
  User,
  CreditCard,
  Package,
  Star,
  Smartphone,
  Search,
  Bell,
  Heart,
  Shield,
  Settings,
  Zap,
  Crown,
  Gift,
  Truck,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '../utils/cn';

interface FeatureShowcaseProps {
  onNavigate: (section: string) => void;
}

export function FeatureShowcase({ onNavigate }: FeatureShowcaseProps) {
  const [activeDemo, setActiveDemo] = useState('profile');

  const features = [
    {
      id: 'profile',
      title: 'Enhanced User Profile',
      description: 'Complete account management with loyalty tracking',
      icon: <User className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      highlights: ['Profile editing', 'Order history', 'Loyalty tiers', 'Settings management']
    },
    {
      id: 'checkout',
      title: 'Advanced Checkout',
      description: 'Multi-step checkout with payment options',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      highlights: ['Multiple payment methods', 'Delivery scheduling', 'Promo codes', 'Order summary']
    },
    {
      id: 'tracking',
      title: 'Real-time Order Tracking',
      description: 'Live updates on your order status',
      icon: <Package className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      highlights: ['Live tracking', 'Driver info', 'Timeline view', 'Delivery estimates']
    },
    {
      id: 'loyalty',
      title: 'Loyalty Rewards System',
      description: 'Earn points and unlock exclusive benefits',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      highlights: ['Points earning', 'Tier benefits', 'Reward redemption', 'Progress tracking']
    },
    {
      id: 'mobile',
      title: 'Mobile-First Navigation',
      description: 'Responsive design for all devices',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-indigo-500 to-indigo-600',
      highlights: ['Mobile menu', 'Touch-friendly', 'Quick actions', 'User stats']
    },
    {
      id: 'search',
      title: 'Advanced Product Search',
      description: 'Find exactly what you\'re craving',
      icon: <Search className="w-6 h-6" />,
      color: 'from-teal-500 to-teal-600',
      highlights: ['Smart filtering', 'Category browsing', 'Sort options', 'Grid/list views']
    },
    {
      id: 'notifications',
      title: 'Smart Notifications',
      description: 'Stay updated with real-time alerts',
      icon: <Bell className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      highlights: ['Order updates', 'Push notifications', 'Sound alerts', 'Custom preferences']
    },
    {
      id: 'wishlist',
      title: 'Wishlist & Cart Persistence',
      description: 'Save favorites and never lose your cart',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-500 to-pink-600',
      highlights: ['Save favorites', 'Cart persistence', 'Quick reorder', 'Share wishlist']
    },
    {
      id: 'admin',
      title: 'Admin Dashboard',
      description: 'Complete inventory and order management',
      icon: <Settings className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      highlights: ['Inventory management', 'Order processing', 'Analytics', 'Stock alerts']
    },
    {
      id: 'auth',
      title: 'Secure Authentication',
      description: 'Email verification and password reset',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-gray-500 to-gray-600',
      highlights: ['Email verification', 'Password reset', 'Social login', 'Security features']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-[var(--neon-green)]" />
          <h1 className="text-4xl font-bold text-white">CRNMN 2.0 Features</h1>
          <Sparkles className="w-8 h-8 text-[var(--neon-green)]" />
        </div>
        <p className="text-xl text-[var(--neutral-400)] max-w-3xl mx-auto">
          Experience our completely redesigned platform with advanced features for the ultimate corn ordering experience
        </p>
        <Badge className="bg-[var(--neon-green)] text-black text-lg px-4 py-2">
          ✨ All Features Implemented ✨
        </Badge>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card 
            key={feature.id} 
            className={cn(
              "bg-[var(--neutral-900)] border-[var(--neutral-800)] hover:border-[var(--neon-green)] transition-all duration-300 cursor-pointer group",
              activeDemo === feature.id && "border-[var(--neon-green)] ring-1 ring-[var(--neon-green)]/20"
            )}
            onClick={() => setActiveDemo(feature.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white",
                  feature.color
                )}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-white text-lg group-hover:text-[var(--neon-green)] transition-colors">
                    {feature.title}
                  </CardTitle>
                  <p className="text-sm text-[var(--neutral-400)]">{feature.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {feature.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-[var(--neon-green)] flex-shrink-0" />
                    <span className="text-[var(--neutral-300)]">{highlight}</span>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full mt-4 bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                onClick={(e) => {
                  e.stopPropagation();
                  // Navigate to relevant section
                  switch (feature.id) {
                    case 'profile':
                    case 'loyalty':
                      onNavigate('profile');
                      break;
                    case 'checkout':
                    case 'wishlist':
                      onNavigate('menu');
                      break;
                    case 'tracking':
                      onNavigate('tracking');
                      break;
                    case 'search':
                      onNavigate('menu');
                      break;
                    case 'admin':
                      onNavigate('admin');
                      break;
                    default:
                      onNavigate('home');
                  }
                }}
              >
                Try Feature
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-gradient-to-r from-[var(--neutral-900)] to-[var(--neutral-800)] border-[var(--neutral-700)]">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-2">
            <Zap className="w-6 h-6 text-[var(--neon-green)]" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-[var(--neon-green)] rounded-full flex items-center justify-center text-black font-bold">
                1
              </div>
              <h3 className="font-semibold text-white">Sign Up</h3>
              <p className="text-sm text-[var(--neutral-400)]">
                Create your account with email verification
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-[var(--neon-green)] rounded-full flex items-center justify-center text-black font-bold">
                2
              </div>
              <h3 className="font-semibold text-white">Browse & Search</h3>
              <p className="text-sm text-[var(--neutral-400)]">
                Use advanced search and filters to find your favorites
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-[var(--neon-green)] rounded-full flex items-center justify-center text-black font-bold">
                3
              </div>
              <h3 className="font-semibold text-white">Order & Track</h3>
              <p className="text-sm text-[var(--neutral-400)]">
                Enhanced checkout with real-time order tracking
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-[var(--neon-green)] rounded-full flex items-center justify-center text-black font-bold">
                4
              </div>
              <h3 className="font-semibold text-white">Earn Rewards</h3>
              <p className="text-sm text-[var(--neutral-400)]">
                Collect loyalty points and unlock exclusive benefits
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Demo */}
      <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-500" />
            Admin Demo Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[var(--neutral-400)]">
            Want to see the admin dashboard? Sign in with admin credentials:
          </p>
          <div className="bg-[var(--neutral-800)] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[var(--neutral-300)] font-semibold">Admin Email:</p>
                <p className="text-[var(--neon-green)] font-mono">admin@crnmn.com</p>
              </div>
              <div>
                <p className="text-[var(--neutral-300)] font-semibold">Password:</p>
                <p className="text-[var(--neon-green)] font-mono">admin123</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-[var(--neutral-500)]">
            * Admin dashboard includes inventory management, order processing, analytics, and more
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
