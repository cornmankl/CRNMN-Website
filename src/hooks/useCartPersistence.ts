import { useEffect, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: string | number;
  quantity: number;
  description?: string;
  category?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  lastUpdated: string;
}

export function useCartPersistence(userId?: string) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = userId ? `cart_${userId}` : 'cart_guest';

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(storageKey);
      if (savedCart) {
        const cartState: CartState = JSON.parse(savedCart);
        
        // Check if cart is not too old (24 hours)
        const lastUpdated = new Date(cartState.lastUpdated);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setCartItems(cartState.items);
        } else {
          // Clear old cart
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem(storageKey);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        const cartState: CartState = {
          items: cartItems,
          total: calculateTotal(cartItems),
          lastUpdated: new Date().toISOString()
        };
        
        if (cartItems.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(cartState));
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, storageKey, isLoaded]);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getTotal = (): number => {
    return calculateTotal(cartItems);
  };

  const isInCart = (itemId: string): boolean => {
    return cartItems.some(item => item.id === itemId);
  };

  const getItemQuantity = (itemId: string): number => {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  // Merge cart when user logs in
  const mergeGuestCart = (guestItems: CartItem[]) => {
    if (!userId || guestItems.length === 0) return;

    const mergedItems = [...cartItems];
    
    guestItems.forEach(guestItem => {
      const existingItem = mergedItems.find(item => item.id === guestItem.id);
      
      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        mergedItems.push(guestItem);
      }
    });

    setCartItems(mergedItems);
    
    // Clear guest cart
    localStorage.removeItem('cart_guest');
  };

  // Save cart for later (extended persistence)
  const saveForLater = () => {
    try {
      const savedCartState: CartState = {
        items: cartItems,
        total: calculateTotal(cartItems),
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(`${storageKey}_saved`, JSON.stringify(savedCartState));
      return true;
    } catch (error) {
      console.error('Error saving cart for later:', error);
      return false;
    }
  };

  // Restore saved cart
  const restoreSavedCart = () => {
    try {
      const savedCart = localStorage.getItem(`${storageKey}_saved`);
      if (savedCart) {
        const cartState: CartState = JSON.parse(savedCart);
        setCartItems(cartState.items);
        localStorage.removeItem(`${storageKey}_saved`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring saved cart:', error);
      return false;
    }
  };

  // Check if there's a saved cart
  const hasSavedCart = (): boolean => {
    try {
      return localStorage.getItem(`${storageKey}_saved`) !== null;
    } catch {
      return false;
    }
  };

  // Export cart data
  const exportCart = () => {
    const cartData = {
      items: cartItems,
      total: getTotal(),
      itemCount: getItemCount(),
      exportDate: new Date().toISOString(),
      user: userId || 'guest'
    };

    const blob = new Blob([JSON.stringify(cartData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crnmn-cart-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    // State
    items: cartItems,
    total: getTotal(),
    itemCount: getItemCount(),
    isLoaded,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    
    // Utilities
    isInCart,
    getItemQuantity,
    
    // Persistence
    saveForLater,
    restoreSavedCart,
    hasSavedCart,
    mergeGuestCart,
    exportCart
  };
}

// Hook for managing cart recommendations
export function useCartRecommendations(cartItems: CartItem[]) {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Mock recommendation logic based on cart items
    if (cartItems.length > 0) {
      const categories = cartItems.map(item => item.category).filter(Boolean);
      const uniqueCategories = Array.from(new Set(categories));
      
      // Mock recommendations based on categories
      const mockRecommendations = [
        {
          id: 'rec1',
          name: 'Corn Butter Sauce',
          description: 'Perfect complement to your corn dishes',
          price: 3.50,
          category: 'Sauces',
          reason: 'Pairs well with your selection'
        },
        {
          id: 'rec2',
          name: 'Fresh Corn Drink',
          description: 'Refreshing corn-based beverage',
          price: 5.00,
          category: 'Beverages',
          reason: 'Complete your corn experience'
        }
      ];

      setRecommendations(mockRecommendations);
    } else {
      setRecommendations([]);
    }
  }, [cartItems]);

  return recommendations;
}
