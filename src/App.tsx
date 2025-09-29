import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ImprovedHeroSection } from './components/Home/ImprovedHeroSection';
import { ImprovedMenuSection } from './components/Menu/ImprovedMenuSection';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { LocationsSection } from './components/LocationsSection';
import { ProfileSection } from './components/ProfileSection';
import { CartSheet } from './components/CartSheet';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import PWARegistration from './components/PWARegistration';
import { FloatingAIButton } from './components/AIToggle';
import { AIDashboard } from './components/AI/AIDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { FeedbackSystem } from './components/ui/FeedbackSystem';

// New enhanced components
import { SEOHead } from './components/SEO/SEOHead';
import { SocialMediaIntegration } from './components/Marketing/SocialMediaIntegration';
import { EnhancedAIAssistant } from './components/AI/EnhancedAIAssistant';
import { LiveOrderTracking } from './components/RealTime/LiveOrderTracking';
import { PaymentOptions } from './components/Payment/PaymentOptions';


// Analytics and utilities
import { analytics } from './utils/analytics';
import { performanceMonitor } from './utils/analytics';

import { realTimeManager } from './utils/realTime';
import { lazyLoadImages } from './utils/imageOptimization';

// Import Zustand stores
import { useCartStore } from './store';
import { useUserStore } from './store';
import { useOrdersStore } from './store';
import { useUIStore } from './store';

// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  description?: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  deliveryAddress?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

export default function App() {
  // Zustand stores
  const { items, isOpen, addItem, removeItem, updateQuantity, clearCart, setCartOpen, getTotal, getItemCount } = useCartStore();
  const { user, setUser, clearUser } = useUserStore();
  const { activeOrder, setActiveOrder } = useOrdersStore();
  const { activeSection, setActiveSection, addNotification } = useUIStore();

  // Local state (can be migrated to Zustand if needed)
  const [showAuth, setShowAuth] = useState(false);
  const [showEnhancedAI, setShowEnhancedAI] = useState(false);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Initialize analytics and real-time features
  useEffect(() => {
    try {
      // Initialize analytics
      analytics.trackPageView('home', 'CRNMN - Premium Corn Restaurant');
      
      // Initialize real-time manager
      realTimeManager.connect();
      
      // Initialize lazy loading
      lazyLoadImages();
      
      // Track performance
      performanceMonitor.measurePageLoad();
    } catch (error) {
      console.warn('Failed to initialize app features:', error);
    }
    
    // Cleanup on unmount
    return () => {
      try {
        realTimeManager.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect real-time manager:', error);
      }
    };
  }, []);

  // Cart functions using Zustand
  const handleAddToCart = (item: Omit<CartItem, 'quantity'>) => {
    addItem(item);
    addNotification({
      type: 'success',
      message: `${item.name} added to cart!`
    });
    
    // Track analytics safely
    try {
      analytics.trackAddToCart(item);
    } catch (error) {
      console.warn('Failed to track add to cart:', error);
    }
  };

  const handleUpdateCartItem = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveFromCart = (id: string) => {
    removeItem(id);
    addNotification({
      type: 'info',
      message: 'Item removed from cart'
    });
  };

  const handleClearCart = () => {
    clearCart();
    addNotification({
      type: 'info',
      message: 'Cart cleared'
    });
  };

  // Auth functions
  const handleSetUser = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
    addNotification({
      type: 'success',
      message: `Welcome back, ${userData?.name || 'User'}!`
    });
  };

  const handleLogout = () => {
    clearUser();
    addNotification({
      type: 'info',
      message: 'Logged out successfully'
    });
  };

  // Order functions
  const handleSetActiveOrder = (order: Order | null) => {
    setActiveOrder(order);
    if (order) {
      addNotification({
        type: 'success',
        message: 'Order status updated'
      });
    }
  };

  // Cart totals
  const cartTotal = getTotal();
  const cartCount = getItemCount();

  // Enhanced navigation with analytics
  const handleNavigate = (section: string) => {
    setActiveSection(section);
    try {
      analytics.trackPageView(section, `CRNMN - ${section.charAt(0).toUpperCase() + section.slice(1)}`);
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <ImprovedHeroSection 
          setActiveSection={handleNavigate} 
          addToCart={handleAddToCart} 
          user={user}
          onShowAuth={() => setShowAuth(true)}
        />;
      case 'menu':
        return <ImprovedMenuSection 
          addToCart={handleAddToCart} 
          user={user}
          onShowAuth={() => setShowAuth(true)}
        />;
      case 'tracking':
        return <OrderTrackingSection activeOrder={activeOrder} user={user} />;
      case 'locations':
        return <LocationsSection />;
      case 'profile':
        return <ProfileSection user={user} onLogout={handleLogout} />;
              case 'social':
          return <SocialMediaIntegration onShare={(platform) => {
            try {
              analytics.trackEvent('social_share', { platform });
            } catch (error) {
              console.warn('Failed to track social share:', error);
            }
          }} />;
      case 'ai':
        return <AIDashboard />;
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminDashboard user={user} onClose={() => setActiveSection('home')} />
        ) : (
          <HeroSection setActiveSection={setActiveSection} addToCart={handleAddToCart} />
        );
      default:
        return <ImprovedHeroSection 
          setActiveSection={setActiveSection} 
          addToCart={handleAddToCart}
          user={user}
          onShowAuth={() => setShowAuth(true)}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-black)] text-[var(--brand-white)]">
      {/* SEO Head */}
      <SEOHead 
        title="CRNMN - Premium Corn Restaurant | Fresh Corn Dishes & More"
        description="Discover the finest corn dishes at CRNMN. From sweet corn delights to spicy fritters, we serve fresh, delicious corn-based meals. Order online for delivery or dine-in."
        keywords="corn restaurant, corn dishes, sweet corn, corn fritters, corn soup, vegetarian food, Malaysian corn, fresh corn, corn delivery, corn menu"
      />
      
      {/* PWA Registration (invisible component) */}
      <PWARegistration />
      
      <Header 
        activeSection={activeSection} 
        setActiveSection={handleNavigate}
        cartCount={cartCount}
        setShowCart={setCartOpen}
        user={user}
        setShowAuth={setShowAuth}
        activeOrder={activeOrder}
        onLogout={handleLogout}
        onAddToCart={handleAddToCart}
      />
      
      <main>
        {renderSection()}
      </main>
      
      <Footer />
      
      <CartSheet 
        open={isOpen}
        onOpenChange={setCartOpen}
        items={items}
        updateItem={handleUpdateCartItem}
        removeItem={handleRemoveFromCart}
        total={cartTotal}
        clearCart={handleClearCart}
        setActiveOrder={handleSetActiveOrder}
      />

      <AuthModal 
        open={showAuth}
        onOpenChange={setShowAuth}
        setUser={handleSetUser}
      />
      
      {/* Enhanced AI Assistant */}
      {showEnhancedAI && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <EnhancedAIAssistant 
            onClose={() => setShowEnhancedAI(false)}
            onAddToCart={handleAddToCart}
          />
        </div>
      )}
      
      {/* Live Order Tracking */}
      {showLiveTracking && activeOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <LiveOrderTracking 
            orderId={activeOrder.id}
            onClose={() => setShowLiveTracking(false)}
          />
        </div>
      )}
      
      {/* Payment Options */}
      {showPaymentOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--neutral-900)] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                          <PaymentOptions
                onSelectPayment={(method) => {
                  try {
                    analytics.trackEvent('payment_method_selected', { method: method.name });
                  } catch (error) {
                    console.warn('Failed to track payment method selection:', error);
                  }
                  setShowPaymentOptions(false);
                }}
                totalAmount={cartTotal}
              />
          </div>
        </div>
      )}
      
      {/* Floating AI Button for Mobile */}
      <FloatingAIButton />
      
      {/* Feedback System */}
      <FeedbackSystem 
        onNavigate={setActiveSection}
        onShowCart={() => setCartOpen(true)}
        user={user}
      />
    </div>
  );
}
