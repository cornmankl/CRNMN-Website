# 📁 Feature-Based Structure Example

## Example: Menu Feature Module

This shows the recommended structure for the Menu feature. Apply the same pattern to all features.

### Directory Structure

```
src/features/menu/
├── components/
│   ├── MenuCard.tsx
│   ├── MenuFilters.tsx
│   ├── MenuGrid.tsx
│   ├── MenuHeader.tsx
│   ├── CategoryTabs.tsx
│   └── index.ts
├── hooks/
│   ├── useMenuData.ts
│   ├── useMenuFilters.ts
│   └── index.ts
├── store/
│   └── menuStore.ts
├── services/
│   └── menuService.ts
├── types/
│   └── menu.types.ts
├── utils/
│   └── menuHelpers.ts
└── index.ts
```

---

## File Examples

### `src/features/menu/types/menu.types.ts`

```typescript
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  tags: string[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  allergens?: string[];
  calories?: number;
  prepTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type MenuCategory = 
  | 'appetizers'
  | 'mains'
  | 'sides'
  | 'desserts'
  | 'beverages';

export interface MenuFilters {
  category: MenuCategory | 'all';
  searchQuery: string;
  priceRange: [number, number];
  tags: string[];
  inStockOnly: boolean;
  sortBy: 'name' | 'price' | 'rating' | 'newest';
}

export interface MenuState {
  items: MenuItem[];
  filteredItems: MenuItem[];
  filters: MenuFilters;
  isLoading: boolean;
  error: string | null;
}
```

---

### `src/features/menu/store/menuStore.ts`

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { MenuItem, MenuFilters, MenuState } from '../types/menu.types';
import { filterMenuItems } from '../utils/menuHelpers';

interface MenuActions {
  setItems: (items: MenuItem[]) => void;
  updateFilters: (filters: Partial<MenuFilters>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  applyFilters: () => void;
}

const initialFilters: MenuFilters = {
  category: 'all',
  searchQuery: '',
  priceRange: [0, 100],
  tags: [],
  inStockOnly: false,
  sortBy: 'name',
};

export const useMenuStore = create<MenuState & MenuActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        items: [],
        filteredItems: [],
        filters: initialFilters,
        isLoading: false,
        error: null,

        // Actions
        setItems: (items) => {
          set((state) => {
            state.items = items;
            state.filteredItems = items;
          });
          get().applyFilters();
        },

        updateFilters: (newFilters) => {
          set((state) => {
            state.filters = { ...state.filters, ...newFilters };
          });
          get().applyFilters();
        },

        resetFilters: () => {
          set((state) => {
            state.filters = initialFilters;
          });
          get().applyFilters();
        },

        applyFilters: () => {
          const { items, filters } = get();
          const filtered = filterMenuItems(items, filters);
          set({ filteredItems: filtered });
        },

        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
      })),
      {
        name: 'menu-storage',
        partialize: (state) => ({ 
          filters: state.filters 
        }),
      }
    ),
    { name: 'menu-store' }
  )
);
```

---

### `src/features/menu/services/menuService.ts`

```typescript
import { MenuItem } from '../types/menu.types';

class MenuService {
  private baseUrl = import.meta.env.VITE_API_URL || '/api';

  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/menu`);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      return response.json();
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  }

  async getMenuItem(id: string): Promise<MenuItem> {
    try {
      const response = await fetch(`${this.baseUrl}/menu/${id}`);
      if (!response.ok) throw new Error('Failed to fetch menu item');
      return response.json();
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  }

  async getFeaturedItems(): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/menu/featured`);
      if (!response.ok) throw new Error('Failed to fetch featured items');
      return response.json();
    } catch (error) {
      console.error('Error fetching featured items:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
```

---

### `src/features/menu/hooks/useMenuData.ts`

```typescript
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMenuStore } from '../store/menuStore';
import { menuService } from '../services/menuService';

export const useMenuData = () => {
  const { setItems, setLoading, setError } = useMenuStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => menuService.getMenuItems(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (error) {
      setError(error.message);
    } else {
      setError(null);
    }
  }, [error, setError]);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data, setItems]);

  return {
    items: data || [],
    isLoading,
    error,
  };
};
```

---

### `src/features/menu/hooks/useMenuFilters.ts`

```typescript
import { useMenuStore } from '../store/menuStore';
import { MenuFilters } from '../types/menu.types';

export const useMenuFilters = () => {
  const { filters, filteredItems, updateFilters, resetFilters } = useMenuStore();

  const setCategory = (category: MenuFilters['category']) => {
    updateFilters({ category });
  };

  const setSearchQuery = (searchQuery: string) => {
    updateFilters({ searchQuery });
  };

  const setPriceRange = (priceRange: [number, number]) => {
    updateFilters({ priceRange });
  };

  const toggleTag = (tag: string) => {
    const tags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    updateFilters({ tags });
  };

  const toggleInStockOnly = () => {
    updateFilters({ inStockOnly: !filters.inStockOnly });
  };

  const setSortBy = (sortBy: MenuFilters['sortBy']) => {
    updateFilters({ sortBy });
  };

  return {
    filters,
    filteredItems,
    setCategory,
    setSearchQuery,
    setPriceRange,
    toggleTag,
    toggleInStockOnly,
    setSortBy,
    resetFilters,
  };
};
```

---

### `src/features/menu/utils/menuHelpers.ts`

```typescript
import { MenuItem, MenuFilters } from '../types/menu.types';

export const filterMenuItems = (
  items: MenuItem[],
  filters: MenuFilters
): MenuItem[] => {
  let filtered = [...items];

  // Filter by category
  if (filters.category !== 'all') {
    filtered = filtered.filter((item) => item.category === filters.category);
  }

  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }

  // Filter by price range
  filtered = filtered.filter(
    (item) =>
      item.price >= filters.priceRange[0] &&
      item.price <= filters.priceRange[1]
  );

  // Filter by tags
  if (filters.tags.length > 0) {
    filtered = filtered.filter((item) =>
      filters.tags.every((tag) => item.tags.includes(tag))
    );
  }

  // Filter by stock status
  if (filters.inStockOnly) {
    filtered = filtered.filter((item) => item.inStock);
  }

  // Sort items
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime();
      default:
        return 0;
    }
  });

  return filtered;
};

export const formatPrice = (price: number): string => {
  return `RM ${price.toFixed(2)}`;
};

export const getAvailabilityText = (item: MenuItem): string => {
  return item.inStock ? 'In Stock' : 'Out of Stock';
};

export const getCategoryColor = (category: MenuItem['category']): string => {
  const colors = {
    appetizers: 'bg-green-500',
    mains: 'bg-gold-500',
    sides: 'bg-orange-500',
    desserts: 'bg-purple-500',
    beverages: 'bg-blue-500',
  };
  return colors[category] || 'bg-neutral-500';
};
```

---

### `src/features/menu/components/MenuCard.tsx`

```typescript
import { memo } from 'react';
import { MenuItem } from '../types/menu.types';
import { formatPrice, getCategoryColor } from '../utils/menuHelpers';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuCard = memo(({ item, onAddToCart }: MenuCardProps) => {
  return (
    <div className="card-interactive group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-medium group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <Badge className={`absolute top-2 left-2 ${getCategoryColor(item.category)}`}>
          {item.category}
        </Badge>
        
        {/* Stock Status */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-lg line-clamp-2">
            {item.name}
          </h3>
          {item.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
              <span className="font-medium">{item.rating}</span>
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-gradient">
            {formatPrice(item.price)}
          </span>
          
          <Button
            onClick={() => onAddToCart(item)}
            disabled={!item.inStock}
            size="sm"
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.price === nextProps.item.price &&
    prevProps.item.inStock === nextProps.item.inStock
  );
});

MenuCard.displayName = 'MenuCard';
```

---

### `src/features/menu/components/MenuFilters.tsx`

```typescript
import { useMenuFilters } from '../hooks/useMenuFilters';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export const MenuFilters = () => {
  const {
    filters,
    setSearchQuery,
    toggleInStockOnly,
    setSortBy,
    resetFilters,
  } = useMenuFilters();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search menu items..."
          value={filters.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="input-primary text-sm"
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest</option>
        </select>

        {/* In Stock Only */}
        <Button
          variant={filters.inStockOnly ? 'default' : 'outline'}
          size="sm"
          onClick={toggleInStockOnly}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          In Stock Only
        </Button>

        {/* Reset */}
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
```

---

### `src/features/menu/components/index.ts`

```typescript
export { MenuCard } from './MenuCard';
export { MenuFilters } from './MenuFilters';
export { MenuGrid } from './MenuGrid';
export { MenuHeader } from './MenuHeader';
export { CategoryTabs } from './CategoryTabs';
```

---

### `src/features/menu/index.ts`

```typescript
// Components
export * from './components';

// Hooks
export { useMenuData } from './hooks/useMenuData';
export { useMenuFilters } from './hooks/useMenuFilters';

// Store
export { useMenuStore } from './store/menuStore';

// Types
export type { MenuItem, MenuCategory, MenuFilters } from './types/menu.types';

// Services
export { menuService } from './services/menuService';

// Utils
export { formatPrice, getCategoryColor } from './utils/menuHelpers';
```

---

## Usage in Pages

### `src/pages/MenuPage.tsx`

```typescript
import { MenuCard, MenuFilters, CategoryTabs } from '@/features/menu';
import { useMenuData, useMenuFilters } from '@/features/menu';
import { useCartStore } from '@/store';

export default function MenuPage() {
  const { isLoading, error } = useMenuData();
  const { filteredItems } = useMenuFilters();
  const { addItem } = useCartStore();

  if (isLoading) {
    return <div>Loading menu...</div>;
  }

  if (error) {
    return <div>Error loading menu: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-display font-bold text-gradient mb-4">
          Our Menu
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover our delicious corn-based dishes
        </p>
      </div>

      <CategoryTabs />
      <MenuFilters />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={addItem}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No items found matching your filters
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## Benefits of This Structure

1. **Colocation**: Everything related to menu is in one place
2. **Scalability**: Easy to add new features without affecting others
3. **Maintainability**: Clear separation of concerns
4. **Testability**: Each part can be tested independently
5. **Reusability**: Components and hooks can be easily reused
6. **Type Safety**: Strong TypeScript typing throughout
7. **Performance**: Easy to optimize individual features

---

## Apply This Pattern To:

- ✅ Menu Feature (shown above)
- [ ] Cart Feature
- [ ] Orders Feature
- [ ] Auth Feature
- [ ] Profile Feature
- [ ] AI Assistant Feature
- [ ] Payment Feature
- [ ] Loyalty Feature
- [ ] Notifications Feature

Each feature should follow the same structure for consistency!
