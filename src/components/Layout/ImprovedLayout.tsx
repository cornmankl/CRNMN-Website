import React, { useState, useEffect } from 'react';
import { ImprovedHeader } from '../Navigation/ImprovedHeader';
import { FloatingActionMenu } from '../UI/FloatingActionMenu';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import {
  ArrowLeft,
  Home,
  Info,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Navigation,
  Zap
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ImprovedLayoutProps {
  children: React.ReactNode;
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

interface BreadcrumbItem {
  label: string;
  section?: string;
  current?: boolean;
}

export function ImprovedLayout({
  children,
  activeSection,
  setActiveSection,
  cartCount,
  setShowCart,
  user,
  setShowAuth,
  activeOrder,
  onLogout,
  onAddToCart
}: ImprovedLayoutProps) {
  const [showHelp, setShowHelp] = useState(false);

  const sectionConfig = {
    home: {
      title: 'Home',
      subtitle: 'Welcome to CRNMN',
      showBackButton: false,
      helpText: 'This is your starting point. Browse featured items or use quick actions to navigate.'
    },
    menu: {
      title: 'Menu',
      subtitle: 'Browse our delicious corn dishes',
      showBackButton: true,
      helpText: 'Use the search and filters to find exactly what you\'re craving. Switch between Browse and Search tabs.'
    },
    tracking: {
      title: 'Order Tracking',
      subtitle: 'Monitor your delivery progress',
      showBackButton: true,
      helpText: 'Track your current orders in real-time. View order history and manage deliveries.',
      requiresAuth: true
    },
    locations: {
      title: 'Store Locations',
      subtitle: 'Find stores near you',
      showBackButton: true,
      helpText: 'Discover nearby CRNMN stores and check delivery coverage areas.'
    },
    profile: {
      title: 'My Account',
      subtitle: 'Manage your profile and rewards',
      showBackButton: true,
      helpText: 'View your profile, order history, loyalty rewards, and account settings.',
      requiresAuth: true
    },
    ai: {
      title: 'AI Assistant',
      subtitle: 'Get personalized help and recommendations',
      showBackButton: true,
      helpText: 'Chat with our AI for menu recommendations, order help, and general assistance.'
    },
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'Manage inventory and orders',
      showBackButton: true,
      helpText: 'Administrative interface for managing products, orders, and analytics.',
      requiresAdmin: true
    }
  };

  const currentConfig = sectionConfig[activeSection as keyof typeof sectionConfig] || sectionConfig.home;

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', section: 'home' }
    ];

    if (activeSection !== 'home') {
      breadcrumbs.push({
        label: currentConfig.title,
        section: activeSection,
        current: true
      });
    }

    return breadcrumbs;
  };

  // Show help automatically for complex sections
  useEffect(() => {
    const complexSections = ['tracking', 'profile', 'admin'];
    if (complexSections.includes(activeSection) && user) {
      const helpShown = localStorage.getItem(`help_shown_${activeSection}`);
      if (!helpShown) {
        setShowHelp(true);
        localStorage.setItem(`help_shown_${activeSection}`, 'true');
      }
    }
  }, [activeSection, user]);

  const handleBackNavigation = () => {
    if (activeSection === 'admin') {
      setActiveSection('profile');
    } else {
      setActiveSection('home');
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[var(--brand-black)] text-[var(--brand-white)]">

        {/* Improved Header */}
        <ImprovedHeader
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          cartCount={cartCount}
          setShowCart={setShowCart}
          user={user}
          setShowAuth={setShowAuth}
          activeOrder={activeOrder}
          onLogout={onLogout}
          onAddToCart={onAddToCart}
        />

        {/* Page Header with Breadcrumbs */}
        {activeSection !== 'home' && (
          <div className="bg-[var(--neutral-900)] border-b border-[var(--neutral-800)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Back Button */}
                  {currentConfig.showBackButton && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBackNavigation}
                          className="text-[var(--neutral-400)] hover:text-white"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Go back to {activeSection === 'admin' ? 'Profile' : 'Home'}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* Breadcrumbs */}
                  <nav className="flex items-center gap-2 text-sm">
                    {getBreadcrumbs().map((item, index) => (
                      <React.Fragment key={item.label}>
                        {index > 0 && (
                          <span className="text-[var(--neutral-600)]">/</span>
                        )}
                        <button
                          onClick={() => item.section && setActiveSection(item.section)}
                          className={cn(
                            "hover:text-[var(--neon-green)] transition-colors",
                            item.current
                              ? "text-[var(--neon-green)] font-semibold"
                              : "text-[var(--neutral-400)]"
                          )}
                          disabled={item.current}
                        >
                          {item.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </nav>
                </div>

                {/* Page Actions */}
                <div className="flex items-center gap-3">
                  {/* Help Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHelp(!showHelp)}
                        className={cn(
                          "text-[var(--neutral-400)] hover:text-[var(--neon-green)]",
                          showHelp && "text-[var(--neon-green)]"
                        )}
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Show page help</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Section-specific actions */}
                  {activeSection === 'menu' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onShowCart}
                      className="border-[var(--neutral-600)] hover:border-[var(--neon-green)]"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart ({cartCount})
                    </Button>
                  )}

                  {activeSection === 'profile' && user?.role === 'admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSection('admin')}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  )}
                </div>
              </div>

              {/* Page Title */}
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-white">{currentConfig.title}</h1>
                <p className="text-[var(--neutral-400)] mt-1">{currentConfig.subtitle}</p>
              </div>
            </div>
          </div>
        )}

        {/* Help Panel */}
        {showHelp && (
          <div className="bg-blue-500/10 border-b border-blue-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Card className="bg-blue-500/10 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-400 mb-1">Page Guide</h3>
                      <p className="text-sm text-[var(--neutral-300)]">
                        {currentConfig.helpText}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHelp(false)}
                      className="p-1 text-blue-400 hover:text-blue-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Auth Required Message */}
        {(currentConfig.requiresAuth && !user) && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Card className="bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      <div>
                        <h3 className="font-semibold text-yellow-400">Sign In Required</h3>
                        <p className="text-sm text-[var(--neutral-400)]">
                          Please sign in to access {currentConfig.title.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={setShowAuth}
                      className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                    >
                      Sign In
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Admin Required Message */}
        {(currentConfig.requiresAdmin && user?.role !== 'admin') && (
          <div className="bg-red-500/10 border-b border-red-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Card className="bg-red-500/10 border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <div>
                        <h3 className="font-semibold text-red-400">Admin Access Required</h3>
                        <p className="text-sm text-[var(--neutral-400)]">
                          You need admin privileges to access this section
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setActiveSection('home')}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      Go Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="relative">
          {children}
        </main>

        {/* Floating Action Menu */}
        <FloatingActionMenu
          user={user}
          cartCount={cartCount}
          activeOrder={activeOrder}
          onShowCart={setShowCart}
          onShowAuth={setShowAuth}
          onNavigate={setActiveSection}
        />

        {/* Footer - Only show on home */}
        {activeSection === 'home' && (
          <footer className="bg-[var(--neutral-900)] border-t border-[var(--neutral-800)] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--neon-green)] flex items-center justify-center">
                      <span className="text-black font-bold text-sm">C</span>
                    </div>
                    <span className="text-[var(--neon-green)] font-bold text-lg">CRNMN</span>
                  </div>
                  <p className="text-[var(--neutral-400)] text-sm">
                    Premium corn delivery experience in Malaysia. Fresh, fast, and delicious.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Quick Links</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveSection('menu')}
                      className="block text-[var(--neutral-400)] hover:text-[var(--neon-green)] text-sm transition-colors"
                    >
                      Browse Menu
                    </button>
                    <button
                      onClick={() => user ? setActiveSection('tracking') : setShowAuth()}
                      className="block text-[var(--neutral-400)] hover:text-[var(--neon-green)] text-sm transition-colors"
                    >
                      Track Orders
                    </button>
                    <button
                      onClick={() => setActiveSection('locations')}
                      className="block text-[var(--neutral-400)] hover:text-[var(--neon-green)] text-sm transition-colors"
                    >
                      Store Locations
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Support</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveSection('ai')}
                      className="block text-[var(--neutral-400)] hover:text-[var(--neon-green)] text-sm transition-colors"
                    >
                      AI Assistant
                    </button>
                    <a
                      href="tel:+601121112919"
                      className="block text-[var(--neutral-400)] hover:text-[var(--neon-green)] text-sm transition-colors"
                    >
                      Call Support
                    </a>
                    <a
                      href="mailto:crnmnwtf@gmail.com"
                      className="block text-[var(--neutral-400)] hover:text-[var(--neon-green)] text-sm transition-colors"
                    >
                      Email Us
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Company</h3>
                  <div className="space-y-2">
                    <a href="#" className="block text-[var(--neutral-400)] hover:text-[var(--neon-green)] text-sm transition-colors">
                      About Us
                    </a>
                    <a href="#" className="block text-[var(--neutral-400)] hover:text-[var(--neon-green)] text-sm transition-colors">
                      Privacy Policy
                    </a>
                    <a href="#" className="block text-[var(--neutral-400)] hover:text-[var(--neon-green)] text-sm transition-colors">
                      Terms of Service
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--neutral-800)] pt-8 mt-8 text-center">
                <p className="text-[var(--neutral-500)] text-sm">
                  © 2024 CRNMN. Made with 🌽 in Malaysia. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        )}

        {/* Success Messages */}
        <div className="fixed bottom-20 left-6 z-30 space-y-2">
          {/* You can add toast notifications here */}
        </div>
      </div>
    </TooltipProvider>
  );
}
