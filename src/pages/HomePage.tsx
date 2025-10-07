import { ImprovedHeroSection } from '../components/Home/ImprovedHeroSection';
import { useCartStore } from '../store';
import { useState } from 'react';
import { AuthModal } from '../components/AuthModal';

export default function HomePage() {
  const { addItem } = useCartStore();
  const [showAuth, setShowAuth] = useState(false);

  const handleAddToCart = (item: any) => {
    addItem(item);
  };

  return (
    <>
      <ImprovedHeroSection
        setActiveSection={(section) => {
          // Navigation will be handled by React Router
          window.location.href = `/${section}`;
        }}
        addToCart={handleAddToCart}
        user={null}
        onShowAuth={() => setShowAuth(true)}
      />
      
      <AuthModal
        open={showAuth}
        onOpenChange={setShowAuth}
        setUser={() => {}}
      />
    </>
  );
}
