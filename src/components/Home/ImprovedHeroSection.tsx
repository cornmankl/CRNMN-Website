import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { OnboardingFlow, useOnboarding } from '../ui/OnboardingFlow';
import {
  ArrowRight,
  Star,
  Clock,
  Truck,
  Shield,
  Play,
  ChevronRight,
  Sparkles,
  Gift,
  MapPin,
  Phone,
  Heart,
  Award,
  Zap,
  Users,
  TrendingUp,
  Search,
  Bot
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ImprovedHeroSectionProps {
  setActiveSection: (section: string) => void;
  addToCart: (item: any) => void;
  user?: any;
  onShowAuth: () => void;
}

export function ImprovedHeroSection({
  setActiveSection,
  addToCart,
  user,
  onShowAuth
}: ImprovedHeroSectionProps) {
  const { showOnboarding, startOnboarding, completeOnboarding, setShowOnboarding } = useOnboarding();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const featuredItems = [
    {
      id: 'featured-1',
      name: 'Sweet Corn Delight',
      description: 'Fresh sweet corn with butter and herbs',
      price: 'RM 8.50',
      originalPrice: 'RM 10.00',
      rating: 4.8,
      reviews: 124,
      prepTime: '5-8 min',
      isPopular: true,
      badge: 'Best Seller'
    },
    {
      id: 'featured-2',
      name: 'Spicy Corn Fritters',
      description: 'Crispy corn fritters with jalapeño',
      price: 'RM 12.00',
      rating: 4.6,
      reviews: 89,
      prepTime: '10-12 min',
      isNew: true,
      badge: 'New!'
    },
    {
      id: 'featured-3',
      name: 'Grilled Corn Special',
      description: 'Grilled corn with garlic mayo',
      price: 'RM 15.50',
      rating: 4.9,
      reviews: 156,
      prepTime: '8-10 min',
      isPopular: true,
      badge: 'Premium'
    }
  ];

  const quickActions = [
    {
      id: 'browse',
      title: 'Browse Menu',
      description: 'Explore our full menu with smart filters',
      icon: <Search className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      section: 'menu',
      primary: true
    },
    {
      id: 'track',
      title: 'Track Order',
      description: 'Monitor your delivery in real-time',
      icon: <Truck className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      section: 'tracking',
      requiresAuth: true
    },
    {
      id: 'locations',
      title: 'Find Stores',
      description: 'Locate nearby stores and delivery areas',
      icon: <MapPin className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      section: 'locations'
    },
    {
      id: 'rewards',
      title: 'Loyalty Rewards',
      description: 'Earn points and unlock exclusive benefits',
      icon: <Gift className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      section: 'profile',
      requiresAuth: true
    }
  ];

  const stats = [
    { label: 'Happy Customers', value: '10,000+', icon: <Users className="w-5 h-5" /> },
    { label: 'Orders Delivered', value: '50,000+', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Average Rating', value: '4.8/5', icon: <Star className="w-5 h-5" /> },
    { label: 'Delivery Time', value: '15-30 min', icon: <Clock className="w-5 h-5" /> }
  ];

  const handleQuickAction = (action: any) => {
    if (action.requiresAuth && !user) {
      onShowAuth();
      return;
    }
    setActiveSection(action.section);
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);
    // Show success feedback
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[var(--neutral-900)] to-black">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 via-transparent to-blue-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--neon-green)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">

            {/* Main Headline */}
            <div className="space-y-4">
              <Badge className="bg-[var(--neon-green)] text-black px-4 py-2 text-sm font-semibold">
                🌽 Premium Corn Delivery Experience
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Fresh Corn Delivered
                <br />
                <span className="bg-gradient-to-r from-[var(--neon-green)] to-green-400 bg-clip-text text-transparent">
                  In 15 Minutes
                </span>
              </h1>

              <p className="text-xl text-[var(--neutral-400)] max-w-2xl mx-auto leading-relaxed">
                Experience the finest corn dishes crafted with premium ingredients and delivered fresh to your doorstep
              </p>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => setActiveSection('menu')}
                className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 text-lg px-8 py-4 h-14 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Search className="w-5 h-5 mr-3" />
                Order Now
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>

              <Button
                variant="outline"
                onClick={startOnboarding}
                className="border-[var(--neutral-600)] hover:border-[var(--neon-green)] text-white text-lg px-8 py-4 h-14 font-semibold hover:bg-[var(--neutral-800)]"
              >
                <Play className="w-5 h-5 mr-3" />
                Take a Tour
              </Button>

              {!user && (
                <Button
                  variant="ghost"
                  onClick={onShowAuth}
                  className="text-[var(--neutral-400)] hover:text-[var(--neon-green)] text-lg px-6 py-4 h-14"
                >
                  <Gift className="w-5 h-5 mr-2" />
                  Sign Up for Rewards
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="flex items-center justify-center text-[var(--neon-green)]">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-[var(--neutral-400)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-[var(--neutral-900)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What would you like to do?</h2>
            <p className="text-[var(--neutral-400)] text-lg">Choose your path to corn perfection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Card
                key={action.id}
                className={cn(
                  "bg-[var(--neutral-800)] border-[var(--neutral-700)] hover:border-[var(--neon-green)] transition-all duration-300 cursor-pointer group",
                  "hover:shadow-xl hover:shadow-[var(--neon-green)]/10 hover:-translate-y-1",
                  action.primary && "ring-1 ring-[var(--neon-green)]/30"
                )}
                onMouseEnter={() => setHoveredCard(action.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleQuickAction(action)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg transition-transform duration-200",
                      action.color,
                      hoveredCard === action.id && "scale-110"
                    )}>
                      {action.icon}
                    </div>
                    {action.primary && (
                      <Badge className="bg-[var(--neon-green)] text-black text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <h3 className="font-semibold text-white mb-2 group-hover:text-[var(--neon-green)] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-[var(--neutral-400)] mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center text-[var(--neon-green)] text-sm font-medium">
                    <span>Get Started</span>
                    <ChevronRight className={cn(
                      "w-4 h-4 ml-1 transition-transform duration-200",
                      hoveredCard === action.id && "translate-x-1"
                    )} />
                  </div>
                  {action.requiresAuth && !user && (
                    <p className="text-xs text-[var(--neutral-500)] mt-2">
                      Sign in required
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Dishes</h2>
              <p className="text-[var(--neutral-400)]">Our most loved corn creations</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setActiveSection('menu')}
              className="border-[var(--neutral-600)] hover:border-[var(--neon-green)] hidden sm:flex"
            >
              View Full Menu
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <Card
                key={item.id}
                className="bg-[var(--neutral-800)] border-[var(--neutral-700)] hover:border-[var(--neon-green)] transition-all duration-300 group hover:shadow-xl overflow-hidden"
              >
                {/* Item Image */}
                <div className="relative h-48 bg-gradient-to-br from-[var(--neutral-700)] to-[var(--neutral-600)] flex items-center justify-center">
                  <span className="text-6xl">🌽</span>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.isPopular && (
                      <Badge className="bg-[var(--neon-green)] text-black text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {item.isNew && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {item.originalPrice && (
                      <Badge className="bg-red-500 text-white text-xs">
                        SALE
                      </Badge>
                    )}
                  </div>

                  {/* Quick Add Button */}
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="absolute bottom-3 right-3 bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    size="sm"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Item Info */}
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-[var(--neon-green)] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[var(--neutral-400)] text-sm">
                        {item.description}
                      </p>
                    </div>

                    {/* Rating & Prep Time */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-medium">{item.rating}</span>
                        <span className="text-[var(--neutral-500)]">({item.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--neutral-400)]">
                        <Clock className="w-4 h-4" />
                        <span>{item.prepTime}</span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {item.originalPrice && (
                          <span className="text-sm text-[var(--neutral-500)] line-through">
                            {item.originalPrice}
                          </span>
                        )}
                        <span className="text-xl font-bold text-[var(--neon-green)]">
                          {item.price}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 font-semibold"
                        size="sm"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View Full Menu CTA */}
          <div className="text-center mt-12">
            <Button
              onClick={() => setActiveSection('menu')}
              className="bg-gradient-to-r from-[var(--neon-green)] to-green-400 text-black hover:from-[var(--neon-green)]/90 hover:to-green-400/90 text-lg px-8 py-4 h-14 font-semibold shadow-lg"
            >
              <Search className="w-5 h-5 mr-3" />
              Explore Full Menu
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-[var(--neutral-900)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose CRNMN?</h2>
            <p className="text-[var(--neutral-400)] text-lg">The premium corn delivery experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--neon-green)] to-green-400 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white">Lightning Fast</h3>
              <p className="text-[var(--neutral-400)]">
                Fresh corn delivered to your door in just 15-30 minutes with our optimized delivery network
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Premium Quality</h3>
              <p className="text-[var(--neutral-400)]">
                Only the finest corn and freshest ingredients, prepared by our expert chefs with love and care
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Loyalty Rewards</h3>
              <p className="text-[var(--neutral-400)]">
                Earn points with every order and unlock exclusive discounts, free delivery, and special perks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[var(--neutral-900)] via-[var(--neutral-800)] to-[var(--neutral-900)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-[var(--neon-green)]" />
              <h2 className="text-3xl font-bold text-white">Ready to Start?</h2>
              <Sparkles className="w-6 h-6 text-[var(--neon-green)]" />
            </div>

            <p className="text-xl text-[var(--neutral-400)] mb-8">
              Join thousands of satisfied customers and experience the best corn delivery in Malaysia
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!user ? (
                <>
                  <Button
                    onClick={onShowAuth}
                    className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 text-lg px-8 py-4 h-14 font-semibold shadow-lg"
                  >
                    <Gift className="w-5 h-5 mr-3" />
                    Sign Up & Get 100 Bonus Points
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection('menu')}
                    className="border-[var(--neutral-600)] hover:border-[var(--neon-green)] text-white text-lg px-8 py-4 h-14"
                  >
                    Browse as Guest
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setActiveSection('menu')}
                    className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 text-lg px-8 py-4 h-14 font-semibold shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Start Ordering
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection('profile')}
                    className="border-[var(--neutral-600)] hover:border-[var(--neon-green)] text-white text-lg px-6 py-4 h-14"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    View Rewards ({user.loyaltyPoints} pts)
                  </Button>
                </>
              )}
            </div>

            {/* Contact Info */}
            <div className="pt-8 border-t border-[var(--neutral-800)] mt-12">
              <p className="text-sm text-[var(--neutral-500)] mb-4">
                Need help? Our team is here for you
              </p>
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--neutral-400)] hover:text-[var(--neon-green)]"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +601121112919
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSection('ai')}
                  className="text-[var(--neutral-400)] hover:text-[var(--neon-green)]"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Flow */}
      <OnboardingFlow
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onNavigate={(section) => {
          setActiveSection(section);
          completeOnboarding();
        }}
        user={user}
      />
    </div>
  );
}
