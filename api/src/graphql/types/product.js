export const productTypeDefs = `
  type Product implements Node {
    id: ID!
    name: String!
    description: String
    price: Float!
    currentPrice: Float!
    discountAmount: Float!
    category: ProductCategory!
    subcategory: String
    availability: ProductAvailability!
    nutrition: ProductNutrition
    images: [ProductImage!]!
    primaryImage: ProductImage
    tags: [String!]!
    allergens: [Allergen!]!
    dietary: [Dietary!]!
    preparationTime: Int
    servingSize: String
    ingredients: [Ingredient!]!
    variants: [ProductVariant!]!
    pricing: ProductPricing!
    ratings: ProductRatings!
    isActive: Boolean!
    isFeatured: Boolean!
    isOnSale: Boolean!
    sortOrder: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  type ProductImage {
    url: String!
    alt: String
    isPrimary: Boolean!
  }

  type ProductAvailability {
    inStock: Boolean!
    quantity: Int!
    lastUpdated: Date!
  }

  type ProductNutrition {
    calories: Int
    protein: Float
    carbs: Float
    fat: Float
    fiber: Float
    sugar: Float
    sodium: Float
  }

  type Ingredient {
    name: String!
    quantity: String
    isOptional: Boolean!
  }

  type ProductVariant {
    name: String!
    priceModifier: Float!
    isAvailable: Boolean!
  }

  type ProductPricing {
    basePrice: Float!
    discountPrice: Float
    discountPercentage: Int
    discountValidUntil: Date
  }

  type ProductRatings {
    average: Float!
    count: Int!
  }

  type ProductConnection implements Connection {
    edges: [ProductEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ProductEdge {
    node: Product!
    cursor: String!
  }

  enum ProductCategory {
    APPETIZER
    MAIN
    DESSERT
    BEVERAGE
    COMBO
  }

  enum Allergen {
    GLUTEN
    DAIRY
    EGGS
    NUTS
    PEANUTS
    SOY
    FISH
    SHELLFISH
    SESAME
  }

  enum Dietary {
    VEGETARIAN
    VEGAN
    GLUTEN_FREE
    DAIRY_FREE
    KETO
    PALEO
    HALAL
    KOSHER
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    category: ProductCategory!
    subcategory: String
    availability: ProductAvailabilityInput
    nutrition: ProductNutritionInput
    images: [ProductImageInput!]
    tags: [String!]
    allergens: [Allergen!]
    dietary: [Dietary!]
    preparationTime: Int
    servingSize: String
    ingredients: [IngredientInput!]
    variants: [ProductVariantInput!]
    pricing: ProductPricingInput
    isFeatured: Boolean
    sortOrder: Int
  }

  input ProductAvailabilityInput {
    inStock: Boolean!
    quantity: Int!
  }

  input ProductNutritionInput {
    calories: Int
    protein: Float
    carbs: Float
    fat: Float
    fiber: Float
    sugar: Float
    sodium: Float
  }

  input ProductImageInput {
    url: String!
    alt: String
    isPrimary: Boolean
  }

  input IngredientInput {
    name: String!
    quantity: String
    isOptional: Boolean
  }

  input ProductVariantInput {
    name: String!
    priceModifier: Float
    isAvailable: Boolean
  }

  input ProductPricingInput {
    basePrice: Float!
    discountPrice: Float
    discountValidUntil: Date
  }

  input ProductFilter {
    category: ProductCategory
    subcategory: String
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
    isFeatured: Boolean
    isOnSale: Boolean
    tags: [String!]
    allergens: [Allergen!]
    dietary: [Dietary!]
    search: String
  }

  input ProductSort {
    field: ProductSortField!
    direction: SortDirection!
  }

  enum ProductSortField {
    NAME
    PRICE
    CREATED_AT
    UPDATED_AT
    RATING
    PREPARATION_TIME
  }

  extend type Query {
    products(
      filter: ProductFilter
      sort: ProductSort
      pagination: PaginationInput
    ): ProductConnection!
    
    product(id: ID!): Product
    
    productsByCategory(
      category: ProductCategory!
      pagination: PaginationInput
    ): ProductConnection!
    
    featuredProducts(
      pagination: PaginationInput
    ): ProductConnection!
    
    productsOnSale(
      pagination: PaginationInput
    ): ProductConnection!
    
    searchProducts(
      query: String!
      filter: ProductFilter
      pagination: PaginationInput
    ): ProductConnection!
  }

  extend type Mutation {
    createProduct(input: ProductInput!): ProductMutationResult!
    updateProduct(id: ID!, input: ProductInput!): ProductMutationResult!
    deleteProduct(id: ID!): ProductMutationResult!
    updateProductStock(id: ID!, quantity: Int!): ProductMutationResult!
    addProductStock(id: ID!, quantity: Int!): ProductMutationResult!
    removeProductStock(id: ID!, quantity: Int!): ProductMutationResult!
    updateProductRating(id: ID!, rating: Float!): ProductMutationResult!
  }

  type ProductMutationResult implements MutationResult {
    success: Boolean!
    errors: [Error!]
    product: Product
  }
`;
