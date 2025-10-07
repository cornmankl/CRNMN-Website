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
