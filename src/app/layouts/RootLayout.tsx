import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { Header } from '../../shared/components/layout/Header';
import { Footer } from '../../components/Footer';
import { FloatingAIButton } from '../../components/AIToggle';
import { CartSheet } from '../../components/CartSheet';
import { useCartStore } from '../../store';

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export const RootLayout = () => {
  const { isOpen, setCartOpen, items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      
      <Footer />
      
      {/* Cart Sheet */}
      <CartSheet
        open={isOpen}
        onOpenChange={setCartOpen}
        items={items}
        updateItem={updateQuantity}
        removeItem={removeItem}
        total={getTotal()}
        clearCart={clearCart}
        setActiveOrder={() => {}}
      />
      
      {/* Floating AI Button for Mobile */}
      <FloatingAIButton />
    </div>
  );
};
