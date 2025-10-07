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
