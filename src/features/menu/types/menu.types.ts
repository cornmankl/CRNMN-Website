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
