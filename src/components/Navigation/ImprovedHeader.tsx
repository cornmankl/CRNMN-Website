import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { AIToggle } from '../AIToggle';
import { NotificationSystem } from '../Notifications/NotificationSystem';
import { WishlistManager } from '../Cart/WishlistManager';
import { 
  Home, 
  ShoppingBag, 
  Package, 
  MapPin, 
  User, 
  Bot,
  Bell,
  Heart,
  ShoppingCart,
  Menu,
  Search,
  Star,
  Gift,
  Sparkles,
  Crown
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ImprovedHeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  cartCount: number;
  setShowCart: (show: boolean) => void;
  user: any;
  setShowAuth: (show: boolean) => void;
  activeOrder: any;
  onLogout: () => void;
  onAddToCart: (item: any) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  section: string;
  description: string;
  badge?: string | number;
  isNew?: boolean;
  requiresAuth?: boolean;
}

export function ImprovedHeader({ 
  activeSection, 
  setActiveSection, 
  cartCount, 
  setShowCart, 
  user, 
  setShowAuth,
  activeOrder,
  onLogout,
  onAddToCart
}: ImprovedHeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-4 h-4" />,
      section: 'home',
      description: 'Featured items and promotions'
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: <ShoppingBag className="w-4 h-4" />,
      section: 'menu',
      description: 'Browse our delicious corn dishes'
    },
    {
      id: 'tracking',
      label: 'Track Order',
      icon: <Package className="w-4 h-4" />,
      section: 'tracking',
      description: 'Monitor your delivery in real-time',
      badge: activeOrder ? 'Live' : undefined,
      requiresAuth: true
    },
    {
      id: 'locations',
      label: 'Locations',
      icon: <MapPin className="w-4 h-4" />,
      section: 'locations',
      description: 'Find stores and delivery areas'
    }
  ];

  const userNavItems: NavItem[] = [
    {
      id: 'profile',
      label: 'My Account',
      icon: <User className="w-4 h-4" />,
      section: 'profile',
      description: 'Profile, orders, and loyalty rewards',
      requiresAuth: true
    },
    {
      id: 'ai',
      label: 'AI Helper',
      icon: <Bot className="w-4 h-4" />,
      section: 'ai',
      description: 'Get personalized recommendations',
      isNew: true
    }
  ];

  const loyaltyTier = user?.loyaltyPoints >= 2000 ? 'Gold' : user?.loyaltyPoints >= 1000 ? 'Silver' : 'Bronze';

  const handleNavClick = (section: string, requiresAuth?: boolean) => {
    if (requiresAuth && !user) {
      setShowAuth(true);
      return;
    }
    setActiveSection(section);
    setShowMobileMenu(false);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Gold': return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'Silver': return <Star className="w-3 h-3 text-gray-400" />;
      default: return <Gift className="w-3 h-3 text-amber-600" />;
    }
  };

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/95 border-b border-[var(--neutral-800)] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section - More Prominent */}
            <div className="flex items-center gap-4">
              <button 
                className="flex items-center gap-3 group hover:scale-105 transition-transform duration-200" 
                onClick={() => setActiveSection('home')}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--neon-green)] to-green-400 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-lg font-bold text-[var(--neon-green)] tracking-wider">CRNMN</p>
                  <p className="text-xs text-[var(--neutral-400)] -mt-1">Premium Corn Experience</p>
                </div>
              </button>
              
              {/* Quick Status Indicator */}
              {user && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[var(--neutral-800)] rounded-full">
                  {getTierIcon(loyaltyTier)}
                  <span className="text-xs text-[var(--neutral-300)]">{loyaltyTier}</span>
                  <div className="w-1 h-1 bg-[var(--neutral-600)] rounded-full" />
                  <span className="text-xs text-[var(--neon-green)] font-semibold">
                    {user.loyaltyPoints} pts
                  </span>
                </div>
              )}
            </div>

            {/* Main Navigation - Better Organized */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => handleNavClick(item.section, item.requiresAuth)}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 h-10 text-sm font-medium transition-all duration-200",
                        activeSection === item.section
                          ? "bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                          : "text-[var(--neutral-300)] hover:text-white hover:bg-[var(--neutral-800)]"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge className={cn(
                          "ml-1 text-xs h-5 px-1.5",
                          activeSection === item.section 
                            ? "bg-black text-[var(--neon-green)]"
                            : "bg-red-500 text-white animate-pulse"
                        )}>
                          {item.badge}
                        </Badge>
                      )}
                      {item.isNew && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{item.description}</p>
                    {item.requiresAuth && !user && (
                      <p className="text-xs text-[var(--neutral-400)] mt-1">Sign in required</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>

            {/* Action Buttons - Better Grouped */}
            <div className="flex items-center gap-2">
              
              {/* User Actions */}
              {user && (
                <div className="hidden sm:flex items-center gap-2">
                  {/* AI Assistant */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveSection('ai')}
                        className={cn(
                          "relative p-2 rounded-lg",
                          activeSection === 'ai' ? "bg-[var(--neon-green)] text-black" : "hover:bg-[var(--neutral-800)]"
                        )}
                      >
                        <Bot className="w-5 h-5" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI Assistant - Get personalized recommendations!</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Notifications */}
                  <NotificationSystem user={user} activeOrder={activeOrder} />
                  
                  {/* Wishlist */}
                  <WishlistManager user={user} onAddToCart={onAddToCart} />
                </div>
              )}
              
              {/* Cart Button - More Prominent */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowCart(true)}
                    className={cn(
                      "relative bg-[var(--neutral-800)] hover:bg-[var(--neutral-700)] border border-[var(--neutral-700)] hover:border-[var(--neon-green)] transition-all duration-200",
                      cartCount > 0 && "ring-1 ring-[var(--neon-green)]/30"
                    )}
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Cart</span>
                    {cartCount > 0 && (
                      <Badge className="ml-2 bg-[var(--neon-green)] text-black animate-bounce">
                        {cartCount > 9 ? '9+' : cartCount}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{cartCount > 0 ? `${cartCount} items in cart` : 'Your cart is empty'}</p>
                </TooltipContent>
              </Tooltip>

              {/* User Menu or Sign In */}
              {user ? (
                <div className="flex items-center gap-3">
                  {/* User Profile Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setActiveSection('profile')}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 h-10",
                          activeSection === 'profile' ? "bg-[var(--neon-green)] text-black" : "hover:bg-[var(--neutral-800)]"
                        )}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--neon-green)] to-green-400 flex items-center justify-center text-black font-bold shadow-md">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="hidden md:block text-left">
                          <p className="text-sm font-medium text-white">
                            Hi, {user.name?.split(' ')[0] || 'User'}!
                          </p>
                          <div className="flex items-center gap-1 -mt-0.5">
                            {getTierIcon(loyaltyTier)}
                            <span className="text-xs text-[var(--neutral-400)]">{loyaltyTier}</span>
                          </div>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-[var(--neutral-400)]">{user.email}</p>
                        <p className="text-xs text-[var(--neon-green)] mt-1">
                          {user.loyaltyPoints} loyalty points
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuth(true)}
                  className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 font-semibold px-6"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-[var(--neutral-800)] bg-[var(--neutral-900)]/95 backdrop-blur-xl">
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleNavClick(item.section, item.requiresAuth)}
                    className={cn(
                      "w-full justify-start gap-3 h-12 text-left",
                      activeSection === item.section
                        ? "bg-[var(--neon-green)] text-black"
                        : "text-[var(--neutral-300)] hover:bg-[var(--neutral-800)]"
                    )}
                  >
                    {item.icon}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge className={cn(
                            "text-xs",
                            activeSection === item.section 
                              ? "bg-black text-[var(--neon-green)]"
                              : "bg-red-500 text-white"
                          )}>
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs opacity-70">{item.description}</p>
                    </div>
                  </Button>
                ))}
                
                {/* User Actions in Mobile */}
                {user && (
                  <>
                    <div className="border-t border-[var(--neutral-800)] pt-2 mt-2">
                      {userNavItems.map((item) => (
                        <Button
                          key={item.id}
                          variant="ghost"
                          onClick={() => handleNavClick(item.section)}
                          className={cn(
                            "w-full justify-start gap-3 h-12 text-left",
                            activeSection === item.section
                              ? "bg-[var(--neon-green)] text-black"
                              : "text-[var(--neutral-300)] hover:bg-[var(--neutral-800)]"
                          )}
                        >
                          {item.icon}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.label}</span>
                              {item.isNew && (
                                <Badge className="bg-blue-500 text-white text-xs">NEW</Badge>
                              )}
                            </div>
                            <p className="text-xs opacity-70">{item.description}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Quick Action Bar - Below Header */}
          {activeSection === 'home' && (
            <div className="border-t border-[var(--neutral-800)] bg-[var(--neutral-900)]/50 backdrop-blur-sm">
              <div className="px-4 py-3">
                <div className="flex items-center justify-center gap-4 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveSection('menu')}
                    className="flex items-center gap-2 text-[var(--neutral-400)] hover:text-[var(--neon-green)]"
                  >
                    <Search className="w-4 h-4" />
                    Browse Menu
                  </Button>
                  <div className="w-1 h-4 bg-[var(--neutral-700)]" />
                  {user ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveSection('tracking')}
                      className="flex items-center gap-2 text-[var(--neutral-400)] hover:text-[var(--neon-green)]"
                    >
                      <Package className="w-4 h-4" />
                      Track Orders
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAuth(true)}
                      className="flex items-center gap-2 text-[var(--neutral-400)] hover:text-[var(--neon-green)]"
                    >
                      <User className="w-4 h-4" />
                      Sign Up for Rewards
                    </Button>
                  )}
                  <div className="w-1 h-4 bg-[var(--neutral-700)]" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveSection('locations')}
                    className="flex items-center gap-2 text-[var(--neutral-400)] hover:text-[var(--neon-green)]"
                  >
                    <MapPin className="w-4 h-4" />
                    Find Stores
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
}
