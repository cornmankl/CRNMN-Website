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
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
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
      filters.tags.some((tag) => item.tags.includes(tag))
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

export const getCategoryIcon = (category: MenuItem['category']): string => {
  const icons = {
    appetizers: '🥗',
    mains: '🌽',
    sides: '🥔',
    desserts: '🍰',
    beverages: '🥤',
  };
  return icons[category] || '🍽️';
};
