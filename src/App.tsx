import { useState } from 'react';
import { Button } from './components/ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from './utils/cn';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { LocationsSection } from './components/LocationsSection';
import { ProfileSection } from './components/ProfileSection';
import { CartSheet } from './components/CartSheet';
import { Auth2025Modal } from './components/Auth2025Modal';
import { AuthPreview2025 } from './components/AuthPreview2025';
import { Footer } from './components/Footer';
import PWARegistration from './components/PWARegistration';
import { FloatingAIButton } from './components/AIToggle';
import { AIDashboard } from './components/AI/AIDashboard';

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
  const [showAuthDemo, setShowAuthDemo] = useState(() => {
    // Check URL parameters for demo mode
    return window.location.search.includes('auth2025') || 
           window.location.search.includes('demo') ||
           window.location.hash.includes('auth2025');
  });

  // Cart functions using Zustand
  const handleAddToCart = (item: Omit<CartItem, 'quantity'>) => {
    addItem(item);
    addNotification({
      type: 'success',
      message: `${item.name} added to cart!`
    });
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

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HeroSection setActiveSection={setActiveSection} addToCart={handleAddToCart} />;
      case 'menu':
        return <MenuSection addToCart={handleAddToCart} isAdmin={user?.role === 'admin'} />;
      case 'tracking':
        return <OrderTrackingSection />;
      case 'locations':
        return <LocationsSection />;
      case 'profile':
        return <ProfileSection user={user} onLogout={handleLogout} />;
      case 'ai':
        return <AIDashboard />;
      default:
        return <HeroSection setActiveSection={setActiveSection} addToCart={handleAddToCart} />;
    }
  };

  // Show Auth 2025 Demo if enabled
  if (showAuthDemo) {
    return (
      <div className="min-h-screen bg-[var(--brand-black)] text-[var(--brand-white)]">
        {/* Back to Main App Button */}
        <div className="fixed top-4 left-4 z-50">
          <Button
            onClick={() => setShowAuthDemo(false)}
            variant="outline"
            className="bg-[var(--neutral-800)]/80 border-[var(--neutral-700)] text-white backdrop-blur-sm"
          >
            ← Back to CRNMN
          </Button>
        </div>
        
        <AuthPreview2025 />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-black)] text-[var(--brand-white)]">
      {/* PWA Registration (invisible component) */}
      <PWARegistration />
      
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        cartCount={cartCount}
        setShowCart={setCartOpen}
        user={user}
        setShowAuth={setShowAuth}
        activeOrder={activeOrder}
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

      <Auth2025Modal 
        open={showAuth}
        onOpenChange={setShowAuth}
        setUser={handleSetUser}
      />
      
      {/* Floating AI Button for Mobile */}
      <FloatingAIButton />
      
      {/* Auth 2025 Demo Access Button */}
      <div className="fixed bottom-4 left-4 z-40">
        <Button
          onClick={() => setShowAuthDemo(true)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg",
            "bg-gradient-to-r from-[var(--neon-green)] to-green-400",
            "hover:from-green-400 hover:to-[var(--neon-green)]",
            "transition-all duration-300 hover:scale-110",
            "text-black font-bold"
          )}
          title="Preview Auth 2025 Features"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
