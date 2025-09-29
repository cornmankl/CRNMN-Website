// CORNMAN Corn Products Database
// 15+ varieties of gourmet corn for Malaysian market

export const CornProducts = [
  // SWEET CORN VARIETIES
  {
    id: 'sweet-classic',
    name: 'Classic Sweet Corn',
    nameMs: 'Jagung Manis Klasik',
    description: 'Fresh, naturally sweet corn with a perfect crunch',
    descriptionMs: 'Jagung manis segar dengan rasa manis semula jadi dan rangup yang sempurna',
    category: 'sweet',
    subcategory: 'classic',
    basePrice: 8.90,
    images: [
      '/images/corn/sweet-classic-1.jpg',
      '/images/corn/sweet-classic-2.jpg',
      '/images/corn/sweet-classic-3.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-001',
    nutritionalInfo: {
      calories: 96,
      protein: 3.4,
      carbs: 21,
      fat: 1.2,
      fiber: 2.4,
      sugar: 6.2
    },
    ingredients: ['Fresh Corn', 'Sea Salt', 'Natural Sweetener'],
    allergens: [],
    isAvailable: true,
    stockQuantity: 100,
    minOrderQuantity: 1,
    maxOrderQuantity: 20,
    preparationTime: 15,
    isPopular: true,
    isNew: false,
    isSeasonal: false,
    tags: ['halal', 'fresh', 'natural', 'sweet'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 3.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 6.90, size: 'L', weight: 400 }
    ]
  },

  {
    id: 'sweet-honey',
    name: 'Honey Glazed Sweet Corn',
    nameMs: 'Jagung Manis Madu',
    description: 'Sweet corn glazed with premium Malaysian honey',
    descriptionMs: 'Jagung manis yang disalut dengan madu Malaysia premium',
    category: 'sweet',
    subcategory: 'honey',
    basePrice: 12.90,
    images: [
      '/images/corn/sweet-honey-1.jpg',
      '/images/corn/sweet-honey-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-002',
    nutritionalInfo: {
      calories: 118,
      protein: 3.6,
      carbs: 26,
      fat: 1.8,
      fiber: 2.6,
      sugar: 12.4
    },
    ingredients: ['Fresh Corn', 'Malaysian Honey', 'Sea Salt', 'Butter'],
    allergens: ['Dairy'],
    isAvailable: true,
    stockQuantity: 75,
    minOrderQuantity: 1,
    maxOrderQuantity: 15,
    preparationTime: 20,
    isPopular: true,
    isNew: false,
    isSeasonal: false,
    tags: ['halal', 'honey', 'premium', 'sweet'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 4.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 8.90, size: 'L', weight: 400 }
    ]
  },

  // CHOCOLATE CORN VARIETIES
  {
    id: 'chocolate-dark',
    name: 'Dark Chocolate Corn',
    nameMs: 'Jagung Coklat Gelap',
    description: 'Rich dark chocolate coating on premium sweet corn',
    descriptionMs: 'Salutan coklat gelap yang kaya pada jagung manis premium',
    category: 'chocolate',
    subcategory: 'dark',
    basePrice: 15.90,
    images: [
      '/images/corn/chocolate-dark-1.jpg',
      '/images/corn/chocolate-dark-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-003',
    nutritionalInfo: {
      calories: 145,
      protein: 4.2,
      carbs: 28,
      fat: 4.8,
      fiber: 3.2,
      sugar: 18.6
    },
    ingredients: ['Fresh Corn', 'Dark Chocolate (70% Cocoa)', 'Cocoa Butter', 'Sugar'],
    allergens: ['Dairy', 'Soy'],
    isAvailable: true,
    stockQuantity: 60,
    minOrderQuantity: 1,
    maxOrderQuantity: 12,
    preparationTime: 25,
    isPopular: true,
    isNew: false,
    isSeasonal: false,
    tags: ['halal', 'chocolate', 'premium', 'dark'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 5.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 10.90, size: 'L', weight: 400 }
    ]
  },

  {
    id: 'chocolate-milk',
    name: 'Milk Chocolate Corn',
    nameMs: 'Jagung Coklat Susu',
    description: 'Creamy milk chocolate coating for a sweet treat',
    descriptionMs: 'Salutan coklat susu berkrim untuk hidangan manis',
    category: 'chocolate',
    subcategory: 'milk',
    basePrice: 14.90,
    images: [
      '/images/corn/chocolate-milk-1.jpg',
      '/images/corn/chocolate-milk-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-004',
    nutritionalInfo: {
      calories: 138,
      protein: 4.0,
      carbs: 26,
      fat: 4.2,
      fiber: 2.8,
      sugar: 16.8
    },
    ingredients: ['Fresh Corn', 'Milk Chocolate', 'Cocoa Butter', 'Milk Powder', 'Sugar'],
    allergens: ['Dairy', 'Soy'],
    isAvailable: true,
    stockQuantity: 80,
    minOrderQuantity: 1,
    maxOrderQuantity: 15,
    preparationTime: 22,
    isPopular: true,
    isNew: false,
    isSeasonal: false,
    tags: ['halal', 'chocolate', 'milk', 'sweet'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 4.90, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 9.90, size: 'L', weight: 400 }
    ]
  },

  // CHEESE CORN VARIETIES
  {
    id: 'cheese-cheddar',
    name: 'Cheddar Cheese Corn',
    nameMs: 'Jagung Keju Cheddar',
    description: 'Melted cheddar cheese on perfectly grilled corn',
    descriptionMs: 'Keju cheddar cair pada jagung panggang yang sempurna',
    category: 'cheese',
    subcategory: 'cheddar',
    basePrice: 13.90,
    images: [
      '/images/corn/cheese-cheddar-1.jpg',
      '/images/corn/cheese-cheddar-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-005',
    nutritionalInfo: {
      calories: 156,
      protein: 6.8,
      carbs: 22,
      fat: 5.4,
      fiber: 2.6,
      sugar: 6.8
    },
    ingredients: ['Fresh Corn', 'Cheddar Cheese', 'Butter', 'Sea Salt', 'Black Pepper'],
    allergens: ['Dairy'],
    isAvailable: true,
    stockQuantity: 90,
    minOrderQuantity: 1,
    maxOrderQuantity: 18,
    preparationTime: 18,
    isPopular: true,
    isNew: false,
    isSeasonal: false,
    tags: ['halal', 'cheese', 'savory', 'grilled'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 4.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 8.90, size: 'L', weight: 400 }
    ]
  },

  {
    id: 'cheese-parmesan',
    name: 'Parmesan Cheese Corn',
    nameMs: 'Jagung Keju Parmesan',
    description: 'Premium parmesan cheese with herbs and spices',
    descriptionMs: 'Keju parmesan premium dengan herba dan rempah',
    category: 'cheese',
    subcategory: 'parmesan',
    basePrice: 16.90,
    images: [
      '/images/corn/cheese-parmesan-1.jpg',
      '/images/corn/cheese-parmesan-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-006',
    nutritionalInfo: {
      calories: 162,
      protein: 7.2,
      carbs: 23,
      fat: 5.8,
      fiber: 2.8,
      sugar: 7.2
    },
    ingredients: ['Fresh Corn', 'Parmesan Cheese', 'Herbs', 'Garlic', 'Olive Oil', 'Sea Salt'],
    allergens: ['Dairy'],
    isAvailable: true,
    stockQuantity: 50,
    minOrderQuantity: 1,
    maxOrderQuantity: 12,
    preparationTime: 20,
    isPopular: false,
    isNew: true,
    isSeasonal: false,
    tags: ['halal', 'cheese', 'premium', 'herbs'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 5.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 10.90, size: 'L', weight: 400 }
    ]
  },

  // SAVORY CORN VARIETIES
  {
    id: 'savory-spicy',
    name: 'Spicy Chili Corn',
    nameMs: 'Jagung Pedas Cili',
    description: 'Fiery chili seasoning with a Malaysian kick',
    descriptionMs: 'Perasa cili pedas dengan sentuhan Malaysia',
    category: 'savory',
    subcategory: 'spicy',
    basePrice: 11.90,
    images: [
      '/images/corn/savory-spicy-1.jpg',
      '/images/corn/savory-spicy-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-007',
    nutritionalInfo: {
      calories: 108,
      protein: 3.8,
      carbs: 22,
      fat: 1.6,
      fiber: 2.8,
      sugar: 6.8
    },
    ingredients: ['Fresh Corn', 'Chili Powder', 'Cumin', 'Paprika', 'Garlic Powder', 'Sea Salt'],
    allergens: [],
    isAvailable: true,
    stockQuantity: 85,
    minOrderQuantity: 1,
    maxOrderQuantity: 20,
    preparationTime: 16,
    isPopular: true,
    isNew: false,
    isSeasonal: false,
    tags: ['halal', 'spicy', 'chili', 'savory'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 3.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 6.90, size: 'L', weight: 400 }
    ]
  },

  {
    id: 'savory-bbq',
    name: 'BBQ Smoked Corn',
    nameMs: 'Jagung Asap BBQ',
    description: 'Smoky BBQ flavor with a hint of sweetness',
    descriptionMs: 'Rasa BBQ berasap dengan sentuhan manis',
    category: 'savory',
    subcategory: 'bbq',
    basePrice: 12.90,
    images: [
      '/images/corn/savory-bbq-1.jpg',
      '/images/corn/savory-bbq-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-008',
    nutritionalInfo: {
      calories: 115,
      protein: 4.0,
      carbs: 23,
      fat: 2.2,
      fiber: 2.6,
      sugar: 7.4
    },
    ingredients: ['Fresh Corn', 'BBQ Sauce', 'Smoked Paprika', 'Brown Sugar', 'Garlic', 'Sea Salt'],
    allergens: ['Soy'],
    isAvailable: true,
    stockQuantity: 70,
    minOrderQuantity: 1,
    maxOrderQuantity: 18,
    preparationTime: 22,
    isPopular: true,
    isNew: false,
    isSeasonal: false,
    tags: ['halal', 'bbq', 'smoky', 'savory'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 4.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 8.90, size: 'L', weight: 400 }
    ]
  },

  // SPECIAL FLAVORS
  {
    id: 'special-truffle',
    name: 'Truffle Infused Corn',
    nameMs: 'Jagung Truffle',
    description: 'Luxurious truffle oil with premium corn',
    descriptionMs: 'Minyak truffle mewah dengan jagung premium',
    category: 'special',
    subcategory: 'truffle',
    basePrice: 24.90,
    images: [
      '/images/corn/special-truffle-1.jpg',
      '/images/corn/special-truffle-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-009',
    nutritionalInfo: {
      calories: 142,
      protein: 4.2,
      carbs: 24,
      fat: 4.8,
      fiber: 3.0,
      sugar: 8.2
    },
    ingredients: ['Fresh Corn', 'Truffle Oil', 'Sea Salt', 'Black Pepper', 'Herbs'],
    allergens: [],
    isAvailable: true,
    stockQuantity: 25,
    minOrderQuantity: 1,
    maxOrderQuantity: 8,
    preparationTime: 25,
    isPopular: false,
    isNew: true,
    isSeasonal: false,
    tags: ['halal', 'truffle', 'premium', 'luxury'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 8.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 16.90, size: 'L', weight: 400 }
    ]
  },

  {
    id: 'special-sriracha',
    name: 'Sriracha Mayo Corn',
    nameMs: 'Jagung Sriracha Mayo',
    description: 'Creamy sriracha mayo with a perfect heat level',
    descriptionMs: 'Mayo sriracha berkrim dengan tahap kepedasan yang sempurna',
    category: 'special',
    subcategory: 'sriracha',
    basePrice: 14.90,
    images: [
      '/images/corn/special-sriracha-1.jpg',
      '/images/corn/special-sriracha-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-010',
    nutritionalInfo: {
      calories: 128,
      protein: 4.4,
      carbs: 24,
      fat: 3.8,
      fiber: 2.8,
      sugar: 7.8
    },
    ingredients: ['Fresh Corn', 'Sriracha Sauce', 'Mayonnaise', 'Lime Juice', 'Garlic', 'Sea Salt'],
    allergens: ['Eggs', 'Soy'],
    isAvailable: true,
    stockQuantity: 65,
    minOrderQuantity: 1,
    maxOrderQuantity: 15,
    preparationTime: 18,
    isPopular: true,
    isNew: false,
    isSeasonal: false,
    tags: ['halal', 'sriracha', 'spicy', 'creamy'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 4.90, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 9.90, size: 'L', weight: 400 }
    ]
  },

  // SEASONAL SPECIALS
  {
    id: 'seasonal-ramadan',
    name: 'Ramadan Special Corn',
    nameMs: 'Jagung Khas Ramadan',
    description: 'Special blend of spices for Ramadan season',
    descriptionMs: 'Campuran rempah khas untuk musim Ramadan',
    category: 'seasonal',
    subcategory: 'ramadan',
    basePrice: 13.90,
    images: [
      '/images/corn/seasonal-ramadan-1.jpg',
      '/images/corn/seasonal-ramadan-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-011',
    nutritionalInfo: {
      calories: 112,
      protein: 3.6,
      carbs: 22,
      fat: 1.8,
      fiber: 2.6,
      sugar: 7.2
    },
    ingredients: ['Fresh Corn', 'Cumin', 'Coriander', 'Cardamom', 'Cinnamon', 'Sea Salt'],
    allergens: [],
    isAvailable: false, // Only available during Ramadan
    stockQuantity: 0,
    minOrderQuantity: 1,
    maxOrderQuantity: 20,
    preparationTime: 20,
    isPopular: false,
    isNew: false,
    isSeasonal: true,
    tags: ['halal', 'ramadan', 'seasonal', 'spices'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 4.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 8.90, size: 'L', weight: 400 }
    ]
  },

  {
    id: 'seasonal-christmas',
    name: 'Christmas Spiced Corn',
    nameMs: 'Jagung Rempah Krismas',
    description: 'Warm Christmas spices with a festive touch',
    descriptionMs: 'Rempah Krismas hangat dengan sentuhan perayaan',
    category: 'seasonal',
    subcategory: 'christmas',
    basePrice: 15.90,
    images: [
      '/images/corn/seasonal-christmas-1.jpg',
      '/images/corn/seasonal-christmas-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-012',
    nutritionalInfo: {
      calories: 125,
      protein: 3.8,
      carbs: 24,
      fat: 2.4,
      fiber: 2.8,
      sugar: 8.6
    },
    ingredients: ['Fresh Corn', 'Cinnamon', 'Nutmeg', 'Cloves', 'Allspice', 'Brown Sugar'],
    allergens: [],
    isAvailable: false, // Only available during Christmas
    stockQuantity: 0,
    minOrderQuantity: 1,
    maxOrderQuantity: 15,
    preparationTime: 22,
    isPopular: false,
    isNew: false,
    isSeasonal: true,
    tags: ['halal', 'christmas', 'seasonal', 'spices'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 5.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 10.90, size: 'L', weight: 400 }
    ]
  },

  // ADDITIONAL VARIETIES
  {
    id: 'sweet-coconut',
    name: 'Coconut Glazed Corn',
    nameMs: 'Jagung Glaz Kelapa',
    description: 'Tropical coconut glaze with a hint of pandan',
    descriptionMs: 'Glaz kelapa tropika dengan sentuhan pandan',
    category: 'sweet',
    subcategory: 'coconut',
    basePrice: 11.90,
    images: [
      '/images/corn/sweet-coconut-1.jpg',
      '/images/corn/sweet-coconut-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-013',
    nutritionalInfo: {
      calories: 122,
      protein: 3.4,
      carbs: 25,
      fat: 2.8,
      fiber: 2.6,
      sugar: 9.4
    },
    ingredients: ['Fresh Corn', 'Coconut Milk', 'Pandan Leaves', 'Palm Sugar', 'Sea Salt'],
    allergens: [],
    isAvailable: true,
    stockQuantity: 55,
    minOrderQuantity: 1,
    maxOrderQuantity: 18,
    preparationTime: 20,
    isPopular: false,
    isNew: true,
    isSeasonal: false,
    tags: ['halal', 'coconut', 'tropical', 'pandan'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 3.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 6.90, size: 'L', weight: 400 }
    ]
  },

  {
    id: 'savory-curry',
    name: 'Curry Spiced Corn',
    nameMs: 'Jagung Rempah Kari',
    description: 'Aromatic curry spices with Malaysian flavors',
    descriptionMs: 'Rempah kari wangi dengan rasa Malaysia',
    category: 'savory',
    subcategory: 'curry',
    basePrice: 12.90,
    images: [
      '/images/corn/savory-curry-1.jpg',
      '/images/corn/savory-curry-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-014',
    nutritionalInfo: {
      calories: 118,
      protein: 4.0,
      carbs: 23,
      fat: 2.2,
      fiber: 2.8,
      sugar: 7.0
    },
    ingredients: ['Fresh Corn', 'Curry Powder', 'Turmeric', 'Cumin', 'Coriander', 'Garam Masala'],
    allergens: [],
    isAvailable: true,
    stockQuantity: 70,
    minOrderQuantity: 1,
    maxOrderQuantity: 20,
    preparationTime: 19,
    isPopular: true,
    isNew: false,
    isSeasonal: false,
    tags: ['halal', 'curry', 'spices', 'malaysian'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 4.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 8.90, size: 'L', weight: 400 }
    ]
  },

  {
    id: 'special-garlic',
    name: 'Garlic Butter Corn',
    nameMs: 'Jagung Mentega Bawang Putih',
    description: 'Rich garlic butter with fresh herbs',
    descriptionMs: 'Mentega bawang putih kaya dengan herba segar',
    category: 'special',
    subcategory: 'garlic',
    basePrice: 13.90,
    images: [
      '/images/corn/special-garlic-1.jpg',
      '/images/corn/special-garlic-2.jpg'
    ],
    isHalal: true,
    halalCertNumber: 'JAKIM-HAL-2024-015',
    nutritionalInfo: {
      calories: 134,
      protein: 4.2,
      carbs: 23,
      fat: 4.6,
      fiber: 2.6,
      sugar: 7.4
    },
    ingredients: ['Fresh Corn', 'Garlic', 'Butter', 'Parsley', 'Sea Salt', 'Black Pepper'],
    allergens: ['Dairy'],
    isAvailable: true,
    stockQuantity: 80,
    minOrderQuantity: 1,
    maxOrderQuantity: 18,
    preparationTime: 17,
    isPopular: true,
    isNew: false,
    isSeasonal: false,
    tags: ['halal', 'garlic', 'butter', 'herbs'],
    variants: [
      { name: 'Small (3 pieces)', priceModifier: 0, size: 'S', weight: 150 },
      { name: 'Medium (5 pieces)', priceModifier: 4.50, size: 'M', weight: 250 },
      { name: 'Large (8 pieces)', priceModifier: 8.90, size: 'L', weight: 400 }
    ]
  }
];

// Add-ons and Extras
export const AddOns = [
  {
    id: 'extra-butter',
    name: 'Extra Butter',
    nameMs: 'Mentega Tambahan',
    price: 2.50,
    category: 'sauce',
    isAvailable: true,
    stockQuantity: 100,
    image: '/images/addons/extra-butter.jpg'
  },
  {
    id: 'extra-cheese',
    name: 'Extra Cheese',
    nameMs: 'Keju Tambahan',
    price: 3.50,
    category: 'topping',
    isAvailable: true,
    stockQuantity: 80,
    image: '/images/addons/extra-cheese.jpg'
  },
  {
    id: 'chili-sauce',
    name: 'Chili Sauce',
    nameMs: 'Sos Cili',
    price: 1.50,
    category: 'sauce',
    isAvailable: true,
    stockQuantity: 120,
    image: '/images/addons/chili-sauce.jpg'
  },
  {
    id: 'mayo-sauce',
    name: 'Mayonnaise',
    nameMs: 'Mayonis',
    price: 2.00,
    category: 'sauce',
    isAvailable: true,
    stockQuantity: 90,
    image: '/images/addons/mayo-sauce.jpg'
  },
  {
    id: 'herbs-mix',
    name: 'Mixed Herbs',
    nameMs: 'Campuran Herba',
    price: 2.50,
    category: 'seasoning',
    isAvailable: true,
    stockQuantity: 60,
    image: '/images/addons/herbs-mix.jpg'
  }
];

// Product Categories
export const ProductCategories = {
  sweet: {
    name: 'Sweet Corn',
    nameMs: 'Jagung Manis',
    description: 'Naturally sweet corn varieties',
    descriptionMs: 'Varieti jagung manis semula jadi',
    icon: '🌽',
    color: '#FFD700'
  },
  chocolate: {
    name: 'Chocolate Corn',
    nameMs: 'Jagung Coklat',
    description: 'Rich chocolate coated corn',
    descriptionMs: 'Jagung bersalut coklat kaya',
    icon: '🍫',
    color: '#8B4513'
  },
  cheese: {
    name: 'Cheese Corn',
    nameMs: 'Jagung Keju',
    description: 'Creamy cheese varieties',
    descriptionMs: 'Varieti keju berkrim',
    icon: '🧀',
    color: '#FFA500'
  },
  savory: {
    name: 'Savory Corn',
    nameMs: 'Jagung Sedap',
    description: 'Spiced and seasoned corn',
    descriptionMs: 'Jagung berempah dan bersedap',
    icon: '🌶️',
    color: '#FF6347'
  },
  special: {
    name: 'Special Flavors',
    nameMs: 'Rasa Khas',
    description: 'Unique and premium varieties',
    descriptionMs: 'Varieti unik dan premium',
    icon: '⭐',
    color: '#9370DB'
  },
  seasonal: {
    name: 'Seasonal Specials',
    nameMs: 'Khas Musim',
    description: 'Limited time seasonal flavors',
    descriptionMs: 'Rasa musim terhad',
    icon: '🎄',
    color: '#32CD32'
  }
};

export default CornProducts;
