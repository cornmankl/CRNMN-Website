import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// User Store
interface UserState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: any) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        clearUser: () => set({ user: null, isAuthenticated: false }),
        setLoading: (isLoading) => set({ isLoading }),
      }),
      {
        name: 'user-storage',
      }
    ),
    { name: 'user-store' }
  )
);

// Cart Store
interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  description?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        isOpen: false,
        
        addItem: (item) => set((state) => {
          const existingItem = state.items.find(i => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map(i => 
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              )
            };
          } else {
            return { items: [...state.items, { ...item, quantity: 1 }] };
          }
        }),
        
        removeItem: (id) => set((state) => ({
          items: state.items.filter(item => item.id !== id)
        })),
        
        updateQuantity: (id, quantity) => set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter(i => i.id !== id) };
          }
          return {
            items: state.items.map(i => 
              i.id === id ? { ...i, quantity } : i
            )
          };
        }),
        
        clearCart: () => set({ items: [] }),
        
        toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        
        setCartOpen: (isOpen) => set({ isOpen }),
        
        getTotal: () => {
          const { items } = get();
          return items.reduce((total, item) => {
            // Handle both string and number prices
            const price = typeof item.price === 'string' 
              ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
              : item.price;
            return total + (price * item.quantity);
          }, 0);
        },
        
        getItemCount: () => {
          const { items } = get();
          return items.reduce((count, item) => count + item.quantity, 0);
        },
      }),
      {
        name: 'cart-storage',
      }
    ),
    { name: 'cart-store' }
  )
);

// UI Store
interface UIState {
  activeSection: string;
  theme: 'light' | 'dark';
  isMobileMenuOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>;
  setActiveSection: (section: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleMobileMenu: () => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        activeSection: 'home',
        theme: 'dark',
        isMobileMenuOpen: false,
        notifications: [],
        
        setActiveSection: (activeSection) => set({ activeSection }),
        
        setTheme: (theme) => set({ theme }),
        
        toggleMobileMenu: () => set((state) => ({ 
          isMobileMenuOpen: !state.isMobileMenuOpen 
        })),
        
        addNotification: (notification) => set((state) => ({
          notifications: [...state.notifications, {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date(),
          }]
        })),
        
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),
        
        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({ 
          theme: state.theme,
          activeSection: state.activeSection 
        }),
      }
    ),
    { name: 'ui-store' }
  )
);

// Orders Store
interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
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

interface OrdersState {
  orders: Order[];
  activeOrder: Order | null;
  isLoading: boolean;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  setActiveOrder: (order: Order | null) => void;
  setLoading: (loading: boolean) => void;
  clearOrders: () => void;
}

export const useOrdersStore = create<OrdersState>()(
  devtools(
    (set) => ({
      orders: [],
      activeOrder: null,
      isLoading: false,
      
      setOrders: (orders) => set({ orders }),
      
      addOrder: (order) => set((state) => ({
        orders: [...state.orders, order],
        activeOrder: state.activeOrder || order
      })),
      
      updateOrderStatus: (orderId, status) => set((state) => {
        const updatedOrders = state.orders.map(o => 
          o.id === orderId ? { ...o, status, updatedAt: new Date() } : o
        );
        const updatedOrder = updatedOrders.find(o => o.id === orderId);
        return {
          orders: updatedOrders,
          activeOrder: state.activeOrder?.id === orderId ? updatedOrder : state.activeOrder
        };
      }),
      
      setActiveOrder: (activeOrder) => set({ activeOrder }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      clearOrders: () => set({ orders: [], activeOrder: null }),
    }),
    { name: 'orders-store' }
  )
);

// Products Store
interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  categories: string[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  setProducts: (products: Product[]) => void;
  setFeaturedProducts: (products: Product[]) => void;
  setCategories: (categories: string[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  getFilteredProducts: () => Product[];
}

export const useProductsStore = create<ProductsState>()(
  devtools(
    (set, get) => ({
      products: [],
      featuredProducts: [],
      categories: [],
      isLoading: false,
      searchQuery: '',
      selectedCategory: null,
      
      setProducts: (products) => set({ products }),
      
      setFeaturedProducts: (featuredProducts) => set({ featuredProducts }),
      
      setCategories: (categories) => set({ categories }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      
      getFilteredProducts: () => {
        const { products, searchQuery, selectedCategory } = get();
        return products.filter(product => {
          const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = !selectedCategory || product.category === selectedCategory;
          return matchesSearch && matchesCategory;
        });
      },
    }),
    { name: 'products-store' }
  )
);

// AI Store for recommendations and features
interface AIState {
  recommendations: Product[];
  userPreferences: {
    categories: string[];
    priceRange: [number, number];
    tags: string[];
  };
  chatHistory: Array<{
    id: string;
    message: string;
    response: string;
    timestamp: Date;
    type: 'user' | 'bot';
  }>;
  isAILoading: boolean;
  setRecommendations: (recommendations: Product[]) => void;
  updateUserPreferences: (preferences: Partial<AIState['userPreferences']>) => void;
  addChatMessage: (message: string, response: string, type: 'user' | 'bot') => void;
  setAILoading: (loading: boolean) => void;
  clearChatHistory: () => void;
}

export const useAIStore = create<AIState>()(
  devtools(
    persist(
      (set) => ({
        recommendations: [],
        userPreferences: {
          categories: [],
          priceRange: [0, 1000],
          tags: [],
        },
        chatHistory: [],
        isAILoading: false,
        
        setRecommendations: (recommendations) => set({ recommendations }),
        
        updateUserPreferences: (preferences) => set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences }
        })),
        
        addChatMessage: (message, response, type) => set((state) => ({
          chatHistory: [...state.chatHistory, {
            id: Date.now().toString(),
            message,
            response,
            timestamp: new Date(),
            type,
          }]
        })),
        
        setAILoading: (isAILoading) => set({ isAILoading }),
        
        clearChatHistory: () => set({ chatHistory: [] }),
      }),
      {
        name: 'ai-storage',
        partialize: (state) => ({ 
          userPreferences: state.userPreferences 
        }),
      }
    ),
    { name: 'ai-store' }
  )
);
