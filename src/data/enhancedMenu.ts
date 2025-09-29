// Enhanced menu data with more items and categories
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  tags: string[];
  rating: number;
  reviews: number;
  prepTime: string;
  calories?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  isPremium?: boolean;
  isFavorite?: boolean;
  availability: 'available' | 'limited' | 'out-of-stock';
  ingredients: string[];
  allergens: string[];
  nutritionInfo?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  spiceLevel?: 1 | 2 | 3 | 4 | 5;
  servingSize: string;
  chefRecommendation?: boolean;
  seasonal?: boolean;
}

export const enhancedMenuItems: MenuItem[] = [
  // Appetizers
  {
    id: 'app-1',
    name: 'Sweet Corn Delight',
    description: 'Fresh sweet corn kernels with butter and herbs - our signature dish',
    price: 8.50,
    originalPrice: 10.00,
    image: '🌽',
    category: 'Appetizers',
    subcategory: 'Classic',
    tags: ['bestseller', 'classic', 'buttery', 'signature'],
    rating: 4.8,
    reviews: 124,
    prepTime: '5-8 min',
    calories: 180,
    isVegetarian: true,
    isPopular: true,
    chefRecommendation: true,
    availability: 'available',
    ingredients: ['Fresh corn', 'Butter', 'Herbs', 'Salt', 'Pepper'],
    allergens: ['Dairy'],
    nutritionInfo: { protein: 4, carbs: 28, fat: 6, fiber: 3 },
    servingSize: '1 cup',
    spiceLevel: 1
  },
  {
    id: 'app-2',
    name: 'Spicy Corn Fritters',
    description: 'Crispy corn fritters with jalapeño and spices - perfect for spice lovers',
    price: 12.00,
    image: '🌶️',
    category: 'Appetizers',
    subcategory: 'Spicy',
    tags: ['new', 'spicy', 'crispy', 'jalapeño'],
    rating: 4.6,
    reviews: 89,
    prepTime: '10-12 min',
    calories: 320,
    isVegetarian: true,
    isSpicy: true,
    isNew: true,
    availability: 'available',
    ingredients: ['Corn kernels', 'Jalapeño', 'Flour', 'Eggs', 'Spices'],
    allergens: ['Gluten', 'Eggs'],
    nutritionInfo: { protein: 8, carbs: 35, fat: 12, fiber: 4 },
    servingSize: '6 pieces',
    spiceLevel: 4
  },
  {
    id: 'app-3',
    name: 'Corn & Cheese Balls',
    description: 'Golden fried corn and cheese balls with a crispy coating',
    price: 10.50,
    image: '🧀',
    category: 'Appetizers',
    subcategory: 'Cheesy',
    tags: ['cheesy', 'fried', 'golden', 'comfort'],
    rating: 4.5,
    reviews: 67,
    prepTime: '8-10 min',
    calories: 280,
    isVegetarian: true,
    availability: 'available',
    ingredients: ['Corn', 'Cheese', 'Breadcrumbs', 'Eggs', 'Herbs'],
    allergens: ['Dairy', 'Gluten', 'Eggs'],
    nutritionInfo: { protein: 12, carbs: 22, fat: 16, fiber: 2 },
    servingSize: '8 pieces',
    spiceLevel: 1
  },

  // Main Dishes
  {
    id: 'main-1',
    name: 'Grilled Corn Special',
    description: 'Perfectly grilled corn with garlic mayo and parmesan cheese',
    price: 15.50,
    image: '🔥',
    category: 'Main Dishes',
    subcategory: 'Grilled',
    tags: ['premium', 'grilled', 'gourmet', 'garlic'],
    rating: 4.9,
    reviews: 156,
    prepTime: '8-10 min',
    calories: 280,
    isVegetarian: true,
    isPremium: true,
    chefRecommendation: true,
    availability: 'available',
    ingredients: ['Fresh corn', 'Garlic mayo', 'Parmesan', 'Herbs', 'Olive oil'],
    allergens: ['Dairy', 'Eggs'],
    nutritionInfo: { protein: 8, carbs: 32, fat: 14, fiber: 4 },
    servingSize: '2 ears',
    spiceLevel: 2
  },
  {
    id: 'main-2',
    name: 'Corn & Mushroom Risotto',
    description: 'Creamy risotto with sweet corn and wild mushrooms',
    price: 18.00,
    image: '🍄',
    category: 'Main Dishes',
    subcategory: 'Gourmet',
    tags: ['gourmet', 'creamy', 'mushroom', 'risotto'],
    rating: 4.7,
    reviews: 92,
    prepTime: '15-20 min',
    calories: 420,
    isVegetarian: true,
    isPremium: true,
    availability: 'available',
    ingredients: ['Arborio rice', 'Corn', 'Mushrooms', 'Parmesan', 'White wine'],
    allergens: ['Dairy', 'Gluten'],
    nutritionInfo: { protein: 14, carbs: 58, fat: 12, fiber: 6 },
    servingSize: '1 bowl',
    spiceLevel: 1
  },
  {
    id: 'main-3',
    name: 'Corn & Black Bean Tacos',
    description: 'Soft tacos filled with corn, black beans, and fresh vegetables',
    price: 13.50,
    image: '🌮',
    category: 'Main Dishes',
    subcategory: 'Mexican',
    tags: ['mexican', 'healthy', 'fresh', 'colorful'],
    rating: 4.4,
    reviews: 78,
    prepTime: '6-8 min',
    calories: 320,
    isVegetarian: true,
    isVegan: true,
    availability: 'available',
    ingredients: ['Corn', 'Black beans', 'Tortillas', 'Lettuce', 'Tomatoes', 'Avocado'],
    allergens: ['Gluten'],
    nutritionInfo: { protein: 12, carbs: 45, fat: 8, fiber: 12 },
    servingSize: '3 tacos',
    spiceLevel: 2
  },

  // Soups
  {
    id: 'soup-1',
    name: 'Corn Soup Bowl',
    description: 'Creamy corn soup with fresh herbs and a touch of cream',
    price: 9.50,
    image: '🍲',
    category: 'Soups',
    subcategory: 'Creamy',
    tags: ['creamy', 'warm', 'comfort', 'herbs'],
    rating: 4.4,
    reviews: 67,
    prepTime: '6-8 min',
    calories: 220,
    isVegetarian: true,
    availability: 'limited',
    ingredients: ['Corn', 'Cream', 'Herbs', 'Onion', 'Garlic'],
    allergens: ['Dairy'],
    nutritionInfo: { protein: 6, carbs: 28, fat: 8, fiber: 3 },
    servingSize: '1 bowl',
    spiceLevel: 1
  },
  {
    id: 'soup-2',
    name: 'Spicy Corn Chowder',
    description: 'Hearty corn chowder with a spicy kick and crispy bacon bits',
    price: 11.50,
    image: '🌶️',
    category: 'Soups',
    subcategory: 'Spicy',
    tags: ['spicy', 'hearty', 'chowder', 'bacon'],
    rating: 4.6,
    reviews: 89,
    prepTime: '8-10 min',
    calories: 350,
    isSpicy: true,
    availability: 'available',
    ingredients: ['Corn', 'Potatoes', 'Bacon', 'Cream', 'Spices'],
    allergens: ['Dairy', 'Pork'],
    nutritionInfo: { protein: 12, carbs: 35, fat: 16, fiber: 4 },
    servingSize: '1 bowl',
    spiceLevel: 3
  },
  {
    id: 'soup-3',
    name: 'Corn & Vegetable Soup',
    description: 'Light and healthy soup with corn and seasonal vegetables',
    price: 10.00,
    image: '🥣',
    category: 'Soups',
    subcategory: 'Healthy',
    tags: ['healthy', 'light', 'vegetables', 'seasonal'],
    rating: 4.3,
    reviews: 54,
    prepTime: '5-7 min',
    calories: 180,
    isVegetarian: true,
    isVegan: true,
    seasonal: true,
    availability: 'available',
    ingredients: ['Corn', 'Carrots', 'Celery', 'Tomatoes', 'Herbs'],
    allergens: [],
    nutritionInfo: { protein: 5, carbs: 32, fat: 3, fiber: 6 },
    servingSize: '1 bowl',
    spiceLevel: 1
  },

  // Salads
  {
    id: 'salad-1',
    name: 'Corn Salad Supreme',
    description: 'Fresh corn salad with mixed vegetables and tangy vinaigrette',
    price: 11.00,
    image: '🥗',
    category: 'Salads',
    subcategory: 'Fresh',
    tags: ['fresh', 'healthy', 'light', 'vinaigrette'],
    rating: 4.7,
    reviews: 93,
    prepTime: '3-5 min',
    calories: 160,
    isVegetarian: true,
    isVegan: true,
    isNew: true,
    availability: 'available',
    ingredients: ['Corn', 'Lettuce', 'Tomatoes', 'Cucumber', 'Vinaigrette'],
    allergens: [],
    nutritionInfo: { protein: 4, carbs: 22, fat: 6, fiber: 5 },
    servingSize: '1 bowl',
    spiceLevel: 1
  },
  {
    id: 'salad-2',
    name: 'Corn & Quinoa Power Bowl',
    description: 'Nutritious bowl with corn, quinoa, and superfoods',
    price: 14.50,
    image: '🥙',
    category: 'Salads',
    subcategory: 'Power Bowl',
    tags: ['superfood', 'quinoa', 'nutritious', 'power'],
    rating: 4.8,
    reviews: 76,
    prepTime: '4-6 min',
    calories: 280,
    isVegetarian: true,
    isVegan: true,
    availability: 'available',
    ingredients: ['Corn', 'Quinoa', 'Kale', 'Avocado', 'Chia seeds'],
    allergens: [],
    nutritionInfo: { protein: 12, carbs: 38, fat: 10, fiber: 8 },
    servingSize: '1 bowl',
    spiceLevel: 1
  },

  // Desserts
  {
    id: 'dessert-1',
    name: 'Corn Ice Cream',
    description: 'Unique sweet corn flavored ice cream with a hint of vanilla',
    price: 7.50,
    image: '🍦',
    category: 'Desserts',
    subcategory: 'Ice Cream',
    tags: ['sweet', 'cold', 'unique', 'vanilla'],
    rating: 4.2,
    reviews: 45,
    prepTime: '2-3 min',
    calories: 240,
    isVegetarian: true,
    isNew: true,
    availability: 'out-of-stock',
    ingredients: ['Corn', 'Cream', 'Sugar', 'Vanilla', 'Eggs'],
    allergens: ['Dairy', 'Eggs'],
    nutritionInfo: { protein: 4, carbs: 32, fat: 12, fiber: 1 },
    servingSize: '1 scoop',
    spiceLevel: 1
  },
  {
    id: 'dessert-2',
    name: 'Corn Bread Pudding',
    description: 'Warm corn bread pudding with caramel sauce',
    price: 9.00,
    image: '🍮',
    category: 'Desserts',
    subcategory: 'Warm',
    tags: ['warm', 'bread pudding', 'caramel', 'comfort'],
    rating: 4.5,
    reviews: 38,
    prepTime: '5-7 min',
    calories: 320,
    isVegetarian: true,
    availability: 'available',
    ingredients: ['Corn bread', 'Eggs', 'Milk', 'Caramel', 'Cinnamon'],
    allergens: ['Dairy', 'Eggs', 'Gluten'],
    nutritionInfo: { protein: 8, carbs: 45, fat: 12, fiber: 2 },
    servingSize: '1 slice',
    spiceLevel: 1
  },

  // Beverages
  {
    id: 'drink-1',
    name: 'Sweet Corn Smoothie',
    description: 'Refreshing smoothie made with fresh corn and tropical fruits',
    price: 8.00,
    image: '🥤',
    category: 'Beverages',
    subcategory: 'Smoothies',
    tags: ['refreshing', 'smoothie', 'tropical', 'healthy'],
    rating: 4.3,
    reviews: 62,
    prepTime: '2-3 min',
    calories: 180,
    isVegetarian: true,
    isVegan: true,
    availability: 'available',
    ingredients: ['Corn', 'Mango', 'Banana', 'Coconut milk', 'Honey'],
    allergens: [],
    nutritionInfo: { protein: 3, carbs: 35, fat: 4, fiber: 4 },
    servingSize: '1 glass',
    spiceLevel: 1
  },
  {
    id: 'drink-2',
    name: 'Corn & Ginger Tea',
    description: 'Warming tea made with corn silk and fresh ginger',
    price: 6.50,
    image: '🍵',
    category: 'Beverages',
    subcategory: 'Tea',
    tags: ['warming', 'ginger', 'tea', 'herbal'],
    rating: 4.1,
    reviews: 29,
    prepTime: '1-2 min',
    calories: 15,
    isVegetarian: true,
    isVegan: true,
    availability: 'available',
    ingredients: ['Corn silk', 'Ginger', 'Honey', 'Lemon'],
    allergens: [],
    nutritionInfo: { protein: 0, carbs: 4, fat: 0, fiber: 0 },
    servingSize: '1 cup',
    spiceLevel: 2
  }
];

export const menuCategories = [
  { id: 'all', name: 'All Items', icon: '🌽', count: enhancedMenuItems.length },
  { id: 'Appetizers', name: 'Appetizers', icon: '🥗', count: enhancedMenuItems.filter(item => item.category === 'Appetizers').length },
  { id: 'Main Dishes', name: 'Main Dishes', icon: '🍽️', count: enhancedMenuItems.filter(item => item.category === 'Main Dishes').length },
  { id: 'Soups', name: 'Soups', icon: '🍲', count: enhancedMenuItems.filter(item => item.category === 'Soups').length },
  { id: 'Salads', name: 'Salads', icon: '🥗', count: enhancedMenuItems.filter(item => item.category === 'Salads').length },
  { id: 'Desserts', name: 'Desserts', icon: '🍰', count: enhancedMenuItems.filter(item => item.category === 'Desserts').length },
  { id: 'Beverages', name: 'Beverages', icon: '🥤', count: enhancedMenuItems.filter(item => item.category === 'Beverages').length }
];

export const popularItems = enhancedMenuItems.filter(item => item.isPopular);
export const newItems = enhancedMenuItems.filter(item => item.isNew);
export const chefRecommendations = enhancedMenuItems.filter(item => item.chefRecommendation);
export const vegetarianItems = enhancedMenuItems.filter(item => item.isVegetarian);
export const veganItems = enhancedMenuItems.filter(item => item.isVegan);
export const spicyItems = enhancedMenuItems.filter(item => item.isSpicy);
