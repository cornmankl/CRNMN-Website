import { MenuItem } from '../types/menu.types';
import { supabase } from '../../../shared/services/supabase';

class MenuService {
  private useSupabase = !!import.meta.env.VITE_SUPABASE_URL;

  async getMenuItems(): Promise<MenuItem[]> {
    try {
      // Use REAL Supabase if configured
      if (this.useSupabase) {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('in_stock', true)
          .order('featured', { ascending: false })
          .order('rating', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        // Transform Supabase data to MenuItem type
        return (data || []).map(item => this.transformSupabaseItem(item));
      }

      // Fallback to mock data if Supabase not configured
      console.warn('Supabase not configured, using mock data');
      return this.getMockMenuItems();
    } catch (error) {
      console.error('Error fetching menu:', error);
      // Fallback to mock on error
      return this.getMockMenuItems();
    }
  }

  async getMenuItem(id: string): Promise<MenuItem> {
    try {
      if (this.useSupabase) {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Menu item not found');

        return this.transformSupabaseItem(data);
      }

      // Fallback to mock
      const items = await this.getMenuItems();
      const item = items.find(i => i.id === id);
      if (!item) throw new Error('Menu item not found');
      return item;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  }

  async getFeaturedItems(): Promise<MenuItem[]> {
    try {
      if (this.useSupabase) {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('featured', true)
          .eq('in_stock', true)
          .order('rating', { ascending: false })
          .limit(6);

        if (error) throw error;

        return (data || []).map(item => this.transformSupabaseItem(item));
      }

      // Fallback
      const items = await this.getMenuItems();
      return items.filter(item => item.rating && item.rating >= 4.5).slice(0, 6);
    } catch (error) {
      console.error('Error fetching featured items:', error);
      throw error;
    }
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      if (this.useSupabase) {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('category', category)
          .eq('in_stock', true)
          .order('rating', { ascending: false });

        if (error) throw error;

        return (data || []).map(item => this.transformSupabaseItem(item));
      }

      // Fallback
      const items = await this.getMenuItems();
      return items.filter(item => item.category === category);
    } catch (error) {
      console.error('Error fetching items by category:', error);
      throw error;
    }
  }

  async searchMenuItems(query: string): Promise<MenuItem[]> {
    try {
      if (this.useSupabase) {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .eq('in_stock', true)
          .order('rating', { ascending: false });

        if (error) throw error;

        return (data || []).map(item => this.transformSupabaseItem(item));
      }

      // Fallback
      const items = await this.getMenuItems();
      const lowerQuery = query.toLowerCase();
      return items.filter(item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching menu items:', error);
      throw error;
    }
  }

  // Transform Supabase snake_case to camelCase
  private transformSupabaseItem(item: any): MenuItem {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      image: item.image,
      category: item.category,
      tags: item.tags || [],
      inStock: item.in_stock,
      rating: item.rating ? parseFloat(item.rating) : undefined,
      reviewCount: item.review_count,
      allergens: item.allergens || [],
      calories: item.calories,
      prepTime: item.prep_time,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    };
  }

  // Mock data for development/fallback
  private getMockMenuItems(): MenuItem[] {
    return [
      {
        id: '1',
        name: 'Sweet Corn Delight',
        description: 'Fresh sweet corn kernels with butter, herbs, and a hint of lime',
        price: 8.50,
        image: '/images/sweet-corn.jpg',
        category: 'appetizers',
        tags: ['vegetarian', 'gluten-free', 'popular'],
        inStock: true,
        rating: 4.8,
        reviewCount: 124,
        allergens: ['dairy'],
        calories: 180,
        prepTime: 10,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        name: 'Spicy Corn Fritters',
        description: 'Crispy golden fritters with jalapeños and sweet corn',
        price: 12.00,
        image: '/images/corn-fritters.jpg',
        category: 'appetizers',
        tags: ['spicy', 'vegetarian', 'bestseller'],
        inStock: true,
        rating: 4.9,
        reviewCount: 89,
        allergens: ['gluten', 'eggs'],
        calories: 250,
        prepTime: 15,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        name: 'Corn & Cheese Bowl',
        description: 'Creamy corn topped with melted cheese and crispy bacon bits',
        price: 15.50,
        image: '/images/corn-cheese.jpg',
        category: 'mains',
        tags: ['bestseller', 'comfort-food'],
        inStock: true,
        rating: 4.7,
        reviewCount: 156,
        allergens: ['dairy'],
        calories: 320,
        prepTime: 12,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        id: '4',
        name: 'Grilled Corn Salad',
        description: 'Charred corn with mixed greens, cherry tomatoes, and lime dressing',
        price: 11.00,
        image: '/images/corn-salad.jpg',
        category: 'sides',
        tags: ['healthy', 'vegetarian', 'gluten-free'],
        inStock: true,
        rating: 4.6,
        reviewCount: 78,
        allergens: [],
        calories: 150,
        prepTime: 8,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      {
        id: '5',
        name: 'Corn Ice Cream',
        description: 'Unique sweet corn ice cream with caramel swirl',
        price: 7.50,
        image: '/images/corn-icecream.jpg',
        category: 'desserts',
        tags: ['unique', 'popular'],
        inStock: true,
        rating: 4.5,
        reviewCount: 92,
        allergens: ['dairy'],
        calories: 220,
        prepTime: 5,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
      {
        id: '6',
        name: 'Corn Lemonade',
        description: 'Refreshing lemonade with a hint of sweet corn',
        price: 6.00,
        image: '/images/corn-lemonade.jpg',
        category: 'beverages',
        tags: ['refreshing', 'unique'],
        inStock: true,
        rating: 4.4,
        reviewCount: 67,
        allergens: [],
        calories: 120,
        prepTime: 3,
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      },
    ];
  }
}

export const menuService = new MenuService();
export default menuService;
