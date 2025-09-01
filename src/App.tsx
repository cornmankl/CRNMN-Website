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

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartItem = (id, quantity) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace('RM ', ''));
    return total + (price * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HeroSection setActiveSection={setActiveSection} addToCart={addToCart} />;
      case 'menu':
        return <MenuSection addToCart={addToCart} />;
      case 'tracking':
        return <OrderTrackingSection activeOrder={activeOrder} />;
      case 'locations':
        return <LocationsSection />;
      case 'profile':
        return <ProfileSection user={user} />;
      default:
        return <HeroSection setActiveSection={setActiveSection} addToCart={addToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-black)] text-[var(--brand-white)]">
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        cartCount={cartCount}
        setShowCart={setShowCart}
        user={user}
        setShowAuth={setShowAuth}
        activeOrder={activeOrder}
      />
      
      <main>
        {renderSection()}
      </main>
      
      <Footer />
      
      <CartSheet 
        open={showCart}
        onOpenChange={setShowCart}
        items={cartItems}
        updateItem={updateCartItem}
        total={cartTotal}
        clearCart={clearCart}
        setActiveOrder={setActiveOrder}
      />

      <AuthModal 
        open={showAuth}
        onOpenChange={setShowAuth}
        setUser={setUser}
      />
    </div>
  );
}