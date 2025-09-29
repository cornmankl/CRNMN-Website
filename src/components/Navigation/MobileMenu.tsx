import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Menu, 
  Home, 
  ShoppingBag, 
  Package, 
  MapPin, 
  User, 
  Bot,
  Star,
  Gift,
  Settings,
  LogOut,
  X,
  ChevronRight,
  Crown,
  Bell,
  Heart,
  History,
  CreditCard,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface MobileMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  user?: any;
  onAuthClick: () => void;
  onLogout: () => void;
  cartCount?: number;
  activeOrder?: any;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  section: string;
  description?: string;
}

export function MobileMenu({ 
  activeSection, 
  setActiveSection, 
  user, 
  onAuthClick, 
  onLogout,
  cartCount = 0,
  activeOrder
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      section: 'home',
      description: 'Featured items and promotions'
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: <ShoppingBag className="w-5 h-5" />,
      section: 'menu',
      description: 'Browse our full menu'
    },
    {
      id: 'tracking',
      label: 'Order Tracking',
      icon: <Package className="w-5 h-5" />,
      section: 'tracking',
      badge: activeOrder ? '1' : undefined,
      description: 'Track your current orders'
    },
    {
      id: 'locations',
      label: 'Locations',
      icon: <MapPin className="w-5 h-5" />,
      section: 'locations',
      description: 'Find stores near you'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
      section: 'profile',
      description: 'Account settings and history'
    },
    {
      id: 'ai',
      label: 'AI Assistant',
      icon: <Bot className="w-5 h-5" />,
      section: 'ai',
      description: 'Get help from our AI'
    }
  ];

  const handleMenuItemClick = (section: string) => {
    setActiveSection(section);
    setIsOpen(false);
  };

  const loyaltyTier = user?.loyaltyPoints >= 2000 ? 'Gold' : user?.loyaltyPoints >= 1000 ? 'Silver' : 'Bronze';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden p-2 hover:bg-[var(--neutral-800)]"
        >
          <Menu className="w-6 h-6 text-white" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className="w-full sm:max-w-sm bg-[var(--neutral-900)] border-[var(--neutral-800)] p-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b border-[var(--neutral-800)]">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white text-xl font-bold">CRNMN</SheetTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1"
              >
                <X className="w-5 h-5 text-[var(--neutral-400)]" />
              </Button>
            </div>
          </SheetHeader>

          {/* User Section */}
          <div className="p-6 pb-4">
            {user ? (
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-[var(--neon-green)] text-black font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <p className="text-sm text-[var(--neutral-400)]">{user.email}</p>
                  </div>
                  <Badge className={cn(
                    "text-xs",
                    loyaltyTier === 'Gold' ? 'bg-yellow-500 text-black' :
                    loyaltyTier === 'Silver' ? 'bg-gray-300 text-black' :
                    'bg-amber-600 text-white'
                  )}>
                    {loyaltyTier}
                  </Badge>
                </div>

                {/* Loyalty Points */}
                <div className="bg-gradient-to-r from-[var(--neutral-800)] to-[var(--neutral-700)] rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[var(--neon-green)]" />
                      <span className="text-sm text-[var(--neutral-300)]">Loyalty Points</span>
                    </div>
                    <span className="font-bold text-[var(--neon-green)]">
                      {user.loyaltyPoints?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--neutral-800)] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">12</div>
                    <div className="text-xs text-[var(--neutral-400)]">Total Orders</div>
                  </div>
                  <div className="bg-[var(--neutral-800)] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-[var(--neon-green)]">RM 240</div>
                    <div className="text-xs text-[var(--neutral-400)]">Total Spent</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[var(--neutral-800)] rounded-full flex items-center justify-center mx-auto">
                  <User className="w-8 h-8 text-[var(--neutral-400)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Welcome to CRNMN</h3>
                  <p className="text-sm text-[var(--neutral-400)]">Sign in to access your account</p>
                </div>
                <Button 
                  onClick={() => { onAuthClick(); setIsOpen(false); }}
                  className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                >
                  Sign In / Sign Up
                </Button>
              </div>
            )}
          </div>

          <Separator className="bg-[var(--neutral-800)]" />

          {/* Navigation Menu */}
          <div className="flex-1 p-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.section)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group",
                  activeSection === item.section
                    ? "bg-[var(--neon-green)] text-black"
                    : "hover:bg-[var(--neutral-800)] text-[var(--neutral-300)]"
                )}
              >
                <div className={cn(
                  "flex-shrink-0",
                  activeSection === item.section 
                    ? "text-black" 
                    : "text-[var(--neutral-400)] group-hover:text-white"
                )}>
                  {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge 
                          className={cn(
                            "text-xs h-5 px-1.5",
                            activeSection === item.section
                              ? "bg-black text-[var(--neon-green)]"
                              : "bg-[var(--neon-green)] text-black"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-transform group-hover:translate-x-0.5",
                        activeSection === item.section 
                          ? "text-black" 
                          : "text-[var(--neutral-500)]"
                      )} />
                    </div>
                  </div>
                  <p className={cn(
                    "text-xs mt-0.5",
                    activeSection === item.section 
                      ? "text-black/70" 
                      : "text-[var(--neutral-500)]"
                  )}>
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <Separator className="bg-[var(--neutral-800)]" />

          {/* Quick Actions */}
          {user && (
            <div className="p-6 space-y-3">
              <h4 className="font-semibold text-white text-sm">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-[var(--neutral-700)] hover:border-[var(--neon-green)] text-xs"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Favorites
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-[var(--neutral-700)] hover:border-[var(--neon-green)] text-xs"
                >
                  <History className="w-4 h-4 mr-1" />
                  History
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-[var(--neutral-700)] hover:border-[var(--neon-green)] text-xs"
                >
                  <CreditCard className="w-4 h-4 mr-1" />
                  Payment
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-[var(--neutral-700)] hover:border-[var(--neon-green)] text-xs"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Settings
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 pt-0 border-t border-[var(--neutral-800)]">
            {user ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[var(--neutral-700)] text-xs"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[var(--neutral-700)] text-xs"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[var(--neutral-700)] text-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-[var(--neutral-500)] mb-3">
                  Need help? Contact our support team
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-[var(--neutral-700)] text-xs"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-[var(--neutral-700)] text-xs"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </div>
            )}
            
            <div className="text-center mt-4 pt-3 border-t border-[var(--neutral-800)]">
              <p className="text-xs text-[var(--neutral-500)]">
                CRNMN v2.0 • Made with 🌽
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
