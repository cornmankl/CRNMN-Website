// CORNMAN Database Schema - Complete Malaysian Corn Delivery Platform
// Based on the comprehensive development guide provided

// Core Business Models
export const CornmanModels = {
  // Users and Authentication
  User: {
    id: 'ObjectId',
    email: 'String (unique)',
    phone: 'String (Malaysian format)',
    firstName: 'String',
    lastName: 'String',
    dateOfBirth: 'Date',
    gender: 'String (enum)',
    profileImage: 'String',
    isVerified: 'Boolean',
    isActive: 'Boolean',
    preferredLanguage: 'String (en/ms)',
    marketingConsent: 'Boolean',
    createdAt: 'Date',
    updatedAt: 'Date'
  },

  // Customer Addresses (Malaysian specific)
  Address: {
    id: 'ObjectId',
    userId: 'ObjectId (ref: User)',
    type: 'String (home/office/other)',
    label: 'String (Rumah, Pejabat, etc)',
    street: 'String',
    city: 'String',
    state: 'String (enum: Malaysian states)',
    postcode: 'String (5 digits)',
    country: 'String (default: Malaysia)',
    coordinates: {
      lat: 'Number',
      lng: 'Number'
    },
    deliveryInstructions: 'String',
    isDefault: 'Boolean',
    isActive: 'Boolean'
  },

  // Corn Products (15+ varieties)
  Product: {
    id: 'ObjectId',
    name: 'String',
    nameMs: 'String (Bahasa Malaysia)',
    description: 'String',
    descriptionMs: 'String',
    category: 'String (enum: sweet/chocolate/cheese/savory/special)',
    subcategory: 'String',
    images: ['String'],
    basePrice: 'Number (MYR)',
    isHalal: 'Boolean',
    halalCertNumber: 'String',
    nutritionalInfo: {
      calories: 'Number',
      protein: 'Number',
      carbs: 'Number',
      fat: 'Number',
      fiber: 'Number',
      sugar: 'Number'
    },
    ingredients: ['String'],
    allergens: ['String'],
    isAvailable: 'Boolean',
    stockQuantity: 'Number',
    minOrderQuantity: 'Number',
    maxOrderQuantity: 'Number',
    preparationTime: 'Number (minutes)',
    isPopular: 'Boolean',
    isNew: 'Boolean',
    isSeasonal: 'Boolean',
    tags: ['String'],
    createdAt: 'Date',
    updatedAt: 'Date'
  },

  // Product Variants (Sizes, Add-ons)
  ProductVariant: {
    id: 'ObjectId',
    productId: 'ObjectId (ref: Product)',
    name: 'String (Small/Medium/Large)',
    nameMs: 'String',
    priceModifier: 'Number (additional cost)',
    size: 'String',
    weight: 'Number (grams)',
    isAvailable: 'Boolean',
    stockQuantity: 'Number',
    image: 'String'
  },

  // Add-ons and Extras
  AddOn: {
    id: 'ObjectId',
    name: 'String',
    nameMs: 'String',
    price: 'Number',
    category: 'String (sauce/seasoning/extra)',
    isAvailable: 'Boolean',
    stockQuantity: 'Number',
    image: 'String'
  },

  // Orders
  Order: {
    id: 'ObjectId',
    orderNumber: 'String (unique)',
    userId: 'ObjectId (ref: User)',
    status: 'String (enum: pending/confirmed/preparing/out_for_delivery/delivered/cancelled)',
    paymentStatus: 'String (enum: pending/paid/failed/refunded)',
    paymentMethod: 'String (enum: stripe/fpx/touchngo/grabpay/cash)',
    items: [{
      productId: 'ObjectId (ref: Product)',
      variantId: 'ObjectId (ref: ProductVariant)',
      addOns: ['ObjectId (ref: AddOn)'],
      quantity: 'Number',
      unitPrice: 'Number',
      totalPrice: 'Number'
    }],
    subtotal: 'Number',
    deliveryFee: 'Number',
    tax: 'Number',
    discount: 'Number',
    total: 'Number',
    deliveryAddress: 'Object (Address)',
    deliveryTime: 'Date',
    estimatedDelivery: 'Date',
    actualDelivery: 'Date',
    specialInstructions: 'String',
    manyChatFlowId: 'String',
    manyChatSubscriberId: 'String',
    createdAt: 'Date',
    updatedAt: 'Date'
  },

  // Shopping Cart
  Cart: {
    id: 'ObjectId',
    userId: 'ObjectId (ref: User)',
    sessionId: 'String',
    items: [{
      productId: 'ObjectId (ref: Product)',
      variantId: 'ObjectId (ref: ProductVariant)',
      addOns: ['ObjectId (ref: AddOn)'],
      quantity: 'Number',
      addedAt: 'Date'
    }],
    expiresAt: 'Date',
    createdAt: 'Date',
    updatedAt: 'Date'
  },

  // Customer Reviews
  Review: {
    id: 'ObjectId',
    userId: 'ObjectId (ref: User)',
    productId: 'ObjectId (ref: Product)',
    orderId: 'ObjectId (ref: Order)',
    rating: 'Number (1-5)',
    title: 'String',
    comment: 'String',
    images: ['String'],
    isVerified: 'Boolean',
    isPublic: 'Boolean',
    helpful: 'Number',
    createdAt: 'Date'
  },

  // Loyalty Program
  LoyaltyPoints: {
    id: 'ObjectId',
    userId: 'ObjectId (ref: User)',
    points: 'Number',
    tier: 'String (enum: bronze/silver/gold/vip)',
    totalEarned: 'Number',
    totalRedeemed: 'Number',
    lastActivity: 'Date',
    createdAt: 'Date',
    updatedAt: 'Date'
  },

  // Promotions and Discounts
  Promotion: {
    id: 'ObjectId',
    code: 'String (unique)',
    name: 'String',
    description: 'String',
    type: 'String (enum: percentage/fixed_amount/free_delivery/buy_one_get_one)',
    value: 'Number',
    minOrderAmount: 'Number',
    maxDiscount: 'Number',
    usageLimit: 'Number',
    usedCount: 'Number',
    validFrom: 'Date',
    validUntil: 'Date',
    isActive: 'Boolean',
    applicableProducts: ['ObjectId (ref: Product)'],
    applicableUsers: ['ObjectId (ref: User)'],
    createdAt: 'Date'
  },

  // Delivery Zones (Malaysian specific)
  DeliveryZone: {
    id: 'ObjectId',
    name: 'String',
    state: 'String',
    cities: ['String'],
    postcodes: ['String'],
    deliveryFee: 'Number',
    minOrderAmount: 'Number',
    estimatedDeliveryTime: 'Number (minutes)',
    isActive: 'Boolean',
    coordinates: {
      center: { lat: 'Number', lng: 'Number' },
      boundaries: [{ lat: 'Number', lng: 'Number' }]
    }
  },

  // ManyChat Integration
  ManyChatFlow: {
    id: 'ObjectId',
    flowId: 'String (ManyChat flow ID)',
    name: 'String',
    type: 'String (enum: welcome/abandoned_cart/order_confirmation/review_request)',
    isActive: 'Boolean',
    triggerConditions: 'Object',
    lastUpdated: 'Date'
  },

  // ManyChat Subscribers
  ManyChatSubscriber: {
    id: 'ObjectId',
    subscriberId: 'String (ManyChat subscriber ID)',
    userId: 'ObjectId (ref: User)',
    phone: 'String',
    firstName: 'String',
    lastName: 'String',
    tags: ['String'],
    customFields: 'Object',
    lastInteraction: 'Date',
    isActive: 'Boolean',
    createdAt: 'Date'
  },

  // Blog and Recipes
  BlogPost: {
    id: 'ObjectId',
    title: 'String',
    titleMs: 'String',
    slug: 'String (unique)',
    content: 'String',
    contentMs: 'String',
    excerpt: 'String',
    excerptMs: 'String',
    featuredImage: 'String',
    images: ['String'],
    category: 'String',
    tags: ['String'],
    author: 'String',
    isPublished: 'Boolean',
    publishedAt: 'Date',
    views: 'Number',
    likes: 'Number',
    createdAt: 'Date',
    updatedAt: 'Date'
  },

  // Recipe System
  Recipe: {
    id: 'ObjectId',
    title: 'String',
    titleMs: 'String',
    slug: 'String (unique)',
    description: 'String',
    descriptionMs: 'String',
    ingredients: [{
      name: 'String',
      nameMs: 'String',
      amount: 'String',
      unit: 'String'
    }],
    instructions: ['String'],
    instructionsMs: ['String'],
    prepTime: 'Number (minutes)',
    cookTime: 'Number (minutes)',
    servings: 'Number',
    difficulty: 'String (enum: easy/medium/hard)',
    images: ['String'],
    videoUrl: 'String',
    nutritionalInfo: 'Object',
    relatedProducts: ['ObjectId (ref: Product)'],
    isPublished: 'Boolean',
    views: 'Number',
    rating: 'Number',
    createdAt: 'Date',
    updatedAt: 'Date'
  },

  // Newsletter Subscriptions
  Newsletter: {
    id: 'ObjectId',
    email: 'String (unique)',
    firstName: 'String',
    lastName: 'String',
    preferences: ['String'],
    isActive: 'Boolean',
    subscribedAt: 'Date',
    unsubscribedAt: 'Date'
  },

  // Analytics and Tracking
  Analytics: {
    id: 'ObjectId',
    event: 'String',
    userId: 'ObjectId (ref: User)',
    sessionId: 'String',
    properties: 'Object',
    timestamp: 'Date',
    source: 'String (web/mobile/manychat)',
    ipAddress: 'String',
    userAgent: 'String'
  }
};

// Malaysian States Enum
export const MalaysianStates = [
  'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Malacca',
  'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya',
  'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
];

// Corn Categories
export const CornCategories = {
  SWEET: 'sweet',
  CHOCOLATE: 'chocolate', 
  CHEESE: 'cheese',
  SAVORY: 'savory',
  SPECIAL: 'special',
  SEASONAL: 'seasonal'
};

// Order Status
export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Payment Methods
export const PaymentMethods = {
  STRIPE: 'stripe',
  FPX: 'fpx',
  TOUCH_N_GO: 'touchngo',
  GRABPAY: 'grabpay',
  CASH: 'cash'
};

// Loyalty Tiers
export const LoyaltyTiers = {
  BRONZE: 'bronze',
  SILVER: 'silver', 
  GOLD: 'gold',
  VIP: 'vip'
};
