import { MenuItem } from '../types/menu.types';

class MenuService {
  private baseUrl = import.meta.env.VITE_API_URL || '/api';

  async getMenuItems(): Promise<MenuItem[]> {
    try {
      // For now, return mock data until API is ready
      return this.getMockMenuItems();
      
      // Uncomment when API is ready:
      // const response = await fetch(`${this.baseUrl}/menu`);
      // if (!response.ok) throw new Error('Failed to fetch menu items');
      // return response.json();
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  }

  async getMenuItem(id: string): Promise<MenuItem> {
    try {
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
      const items = await this.getMenuItems();
      return items.filter(item => item.rating && item.rating >= 4.5).slice(0, 6);
    } catch (error) {
      console.error('Error fetching featured items:', error);
      throw error;
    }
  }

  // Mock data for development
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
        name: 'Corn Chowder Supreme',
        description: 'Creamy corn soup with bacon bits and fresh herbs',
        price: 15.50,
        image: '/images/corn-chowder.jpg',
        category: 'mains',
        tags: ['comfort food', 'hot', 'popular'],
        inStock: true,
        rating: 4.7,
        reviewCount: 156,
        allergens: ['dairy', 'pork'],
        calories: 320,
        prepTime: 20,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        id: '4',
        name: 'Grilled Corn Salad',
        description: 'Chargrilled corn with mixed greens, feta, and balsamic',
        price: 14.00,
        image: '/images/corn-salad.jpg',
        category: 'sides',
        tags: ['healthy', 'vegetarian', 'gluten-free'],
        inStock: true,
        rating: 4.6,
        reviewCount: 78,
        allergens: ['dairy'],
        calories: 220,
        prepTime: 12,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      {
        id: '5',
        name: 'Corn Ice Cream',
        description: 'Sweet corn ice cream with caramel drizzle',
        price: 9.00,
        image: '/images/corn-icecream.jpg',
        category: 'desserts',
        tags: ['sweet', 'unique', 'cold'],
        inStock: true,
        rating: 4.5,
        reviewCount: 93,
        allergens: ['dairy', 'eggs'],
        calories: 280,
        prepTime: 5,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
      {
        id: '6',
        name: 'Corn Smoothie',
        description: 'Refreshing sweet corn smoothie with coconut milk',
        price: 7.50,
        image: '/images/corn-smoothie.jpg',
        category: 'beverages',
        tags: ['cold', 'healthy', 'vegan'],
        inStock: true,
        rating: 4.4,
        reviewCount: 67,
        allergens: [],
        calories: 150,
        prepTime: 5,
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      },
    ];
  }
}

export const menuService = new MenuService();
