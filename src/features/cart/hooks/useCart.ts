import { useCartStore } from '../../../store';
import { CartItem } from '../types/cart.types';
import { getCartSummary } from '../utils/cartHelpers';

export const useCart = () => {
  const store = useCartStore();

  const summary = getCartSummary(store.items);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    store.addItem(item);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      store.removeItem(id);
    } else {
      store.updateQuantity(id, quantity);
    }
  };

  const incrementQuantity = (id: string) => {
    const item = store.items.find(i => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const decrementQuantity = (id: string) => {
    const item = store.items.find(i => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const removeFromCart = (id: string) => {
    store.removeItem(id);
  };

  const clearCart = () => {
    store.clearCart();
  };

  const openCart = () => {
    store.setCartOpen(true);
  };

  const closeCart = () => {
    store.setCartOpen(false);
  };

  const toggleCart = () => {
    store.toggleCart();
  };

  const isInCart = (id: string): boolean => {
    return store.items.some(item => item.id === id);
  };

  const getItemQuantity = (id: string): number => {
    const item = store.items.find(i => i.id === id);
    return item?.quantity || 0;
  };

  return {
    // State
    items: store.items,
    isOpen: store.isOpen,
    summary,
    
    // Actions
    addToCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    
    // Helpers
    isInCart,
    getItemQuantity,
    isEmpty: store.items.length === 0,
  };
};
