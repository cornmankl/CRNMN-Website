import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { LocationsSection } from './components/LocationsSection';
import { ProfileSection } from './components/ProfileSection';
import { CartSheet } from './components/CartSheet';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import PWARegistration from './components/PWARegistration';

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
  const { items, isOpen, addItem, removeItem, updateQuantity, clearCart, toggleCart, setCartOpen, getTotal, getItemCount } = useCartStore();
  const { user, isAuthenticated, setUser, clearUser } = useUserStore();
  const { activeOrder, setActiveOrder } = useOrdersStore();
  const { activeSection, setActiveSection, addNotification } = useUIStore();

  // Local state (can be migrated to Zustand if needed)
  const [showAuth, setShowAuth] = useState(false);

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
        return <MenuSection addToCart={handleAddToCart} />;
      case 'tracking':
        return <OrderTrackingSection />;
      case 'locations':
        return <LocationsSection />;
      case 'profile':
        return <ProfileSection user={user} onLogout={handleLogout} />;
      default:
        return <HeroSection setActiveSection={setActiveSection} addToCart={handleAddToCart} />;
    }
  };

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

      <AuthModal 
        open={showAuth}
        onOpenChange={setShowAuth}
        setUser={handleSetUser}
      />
    </div>
  );
}
