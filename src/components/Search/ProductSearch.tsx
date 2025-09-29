import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Star, 
  Clock, 
  TrendingUp,
  X,
  ChevronDown,
  Grid,
  List,
  MapPin,
  Leaf,
  Flame,
  Award,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  prepTime: string;
  calories?: number;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  isFavorite?: boolean;
  availability: 'available' | 'limited' | 'out-of-stock';
}

interface ProductSearchProps {
  onAddToCart: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  dietary: string[];
  rating: number;
  availability: string[];
  tags: string[];
}

export function ProductSearch({ onAddToCart, onToggleFavorite }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [activeCategory, setActiveCategory] = useState('all');

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 50],
    dietary: [],
    rating: 0,
    availability: ['available', 'limited'],
    tags: []
  });

  // Mock product data
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Sweet Corn Delight',
      description: 'Fresh sweet corn kernels with butter and herbs',
      price: 8.50,
      originalPrice: 10.00,
      image: '/corn-1.jpg',
      category: 'Appetizers',
      tags: ['sweet', 'buttery', 'classic'],
      rating: 4.8,
      reviews: 124,
      prepTime: '5-8 min',
      calories: 180,
      isVegetarian: true,
      isSpicy: false,
      isNew: false,
      isPopular: true,
      isFavorite: false,
      availability: 'available'
    },
    {
      id: '2',
      name: 'Spicy Corn Fritters',
      description: 'Crispy corn fritters with jalapeño and spices',
      price: 12.00,
      image: '/corn-2.jpg',
      category: 'Main Dishes',
      tags: ['crispy', 'spicy', 'fried'],
      rating: 4.6,
      reviews: 89,
      prepTime: '10-12 min',
      calories: 320,
      isVegetarian: true,
      isSpicy: true,
      isNew: true,
      isPopular: false,
      isFavorite: true,
      availability: 'available'
    },
    {
      id: '3',
      name: 'Grilled Corn Special',
      description: 'Perfectly grilled corn with garlic mayo and parmesan',
      price: 15.50,
      image: '/corn-3.jpg',
      category: 'Main Dishes',
      tags: ['grilled', 'smoky', 'premium'],
      rating: 4.9,
      reviews: 156,
      prepTime: '8-10 min',
      calories: 280,
      isVegetarian: true,
      isSpicy: false,
      isNew: false,
      isPopular: true,
      isFavorite: false,
      availability: 'available'
    },
    {
      id: '4',
      name: 'Corn Soup Bowl',
      description: 'Creamy corn soup with fresh herbs',
      price: 9.50,
      image: '/corn-4.jpg',
      category: 'Soups',
      tags: ['creamy', 'warm', 'comfort'],
      rating: 4.4,
      reviews: 67,
      prepTime: '6-8 min',
      calories: 220,
      isVegetarian: true,
      isSpicy: false,
      isNew: false,
      isPopular: false,
      isFavorite: false,
      availability: 'limited'
    },
    {
      id: '5',
      name: 'Corn Salad Supreme',
      description: 'Fresh corn salad with mixed vegetables and vinaigrette',
      price: 11.00,
      image: '/corn-5.jpg',
      category: 'Salads',
      tags: ['fresh', 'healthy', 'light'],
      rating: 4.7,
      reviews: 93,
      prepTime: '3-5 min',
      calories: 160,
      isVegetarian: true,
      isSpicy: false,
      isNew: true,
      isPopular: false,
      isFavorite: true,
      availability: 'available'
    },
    {
      id: '6',
      name: 'Corn Ice Cream',
      description: 'Unique sweet corn flavored ice cream',
      price: 7.50,
      image: '/corn-6.jpg',
      category: 'Desserts',
      tags: ['sweet', 'cold', 'unique'],
      rating: 4.2,
      reviews: 45,
      prepTime: '2-3 min',
      calories: 240,
      isVegetarian: true,
      isSpicy: false,
      isNew: true,
      isPopular: false,
      isFavorite: false,
      availability: 'out-of-stock'
    }
  ]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!product.name.toLowerCase().includes(query) &&
            !product.description.toLowerCase().includes(query) &&
            !product.tags.some(tag => tag.toLowerCase().includes(query))) {
          return false;
        }
      }

      // Category filter
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // Price range
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Dietary filters
      if (filters.dietary.includes('vegetarian') && !product.isVegetarian) {
        return false;
      }
      if (filters.dietary.includes('spicy') && !product.isSpicy) {
        return false;
      }

      // Rating filter
      if (product.rating < filters.rating) {
        return false;
      }

      // Availability filter
      if (!filters.availability.includes(product.availability)) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b.rating - a.rating;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchQuery, activeCategory, filters, sortBy]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 50],
      dietary: [],
      rating: 0,
      availability: ['available', 'limited'],
      tags: []
    });
    setActiveCategory('all');
    setSearchQuery('');
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500';
      case 'limited': return 'bg-yellow-500';
      case 'out-of-stock': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'limited': return 'Limited Stock';
      case 'out-of-stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--neutral-400)]" />
          <Input
            placeholder="Search for corn dishes, ingredients, or flavors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 h-12 bg-[var(--neutral-800)] border-[var(--neutral-700)] text-white text-lg"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Quick Filters & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "capitalize",
                    activeCategory === category 
                      ? "bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                      : "border-[var(--neutral-600)] hover:border-[var(--neon-green)]"
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Quick Filter Tags */}
            <div className="flex items-center gap-2">
              <Button
                variant={filters.dietary.includes('vegetarian') ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const dietary = filters.dietary.includes('vegetarian')
                    ? filters.dietary.filter(d => d !== 'vegetarian')
                    : [...filters.dietary, 'vegetarian'];
                  handleFilterChange('dietary', dietary);
                }}
                className={cn(
                  filters.dietary.includes('vegetarian')
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "border-[var(--neutral-600)]"
                )}
              >
                <Leaf className="w-4 h-4 mr-1" />
                Vegetarian
              </Button>
              <Button
                variant={filters.dietary.includes('spicy') ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const dietary = filters.dietary.includes('spicy')
                    ? filters.dietary.filter(d => d !== 'spicy')
                    : [...filters.dietary, 'spicy'];
                  handleFilterChange('dietary', dietary);
                }}
                className={cn(
                  filters.dietary.includes('spicy')
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border-[var(--neutral-600)]"
                )}
              >
                <Flame className="w-4 h-4 mr-1" />
                Spicy
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-[var(--neutral-700)] rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2",
                  viewMode === 'grid' ? "bg-[var(--neon-green)] text-black" : ""
                )}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2",
                  viewMode === 'list' ? "bg-[var(--neon-green)] text-black" : ""
                )}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-[var(--neutral-600)]"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={cn(
                "w-4 h-4 ml-2 transition-transform",
                showFilters && "rotate-180"
              )} />
            </Button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-[var(--neutral-400)]">
                      <span>RM {filters.priceRange[0]}</span>
                      <span>RM {filters.priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Minimum Rating</h3>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleFilterChange('rating', rating === filters.rating ? 0 : rating)}
                        className="p-1"
                      >
                        <Star
                          className={cn(
                            "w-5 h-5",
                            rating <= filters.rating 
                              ? "text-yellow-400 fill-current" 
                              : "text-[var(--neutral-600)]"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Availability</h3>
                  <div className="space-y-2">
                    {['available', 'limited'].map((status) => (
                      <label key={status} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.availability.includes(status)}
                          onChange={(e) => {
                            const availability = e.target.checked
                              ? [...filters.availability, status]
                              : filters.availability.filter(s => s !== status);
                            handleFilterChange('availability', availability);
                          }}
                          className="rounded"
                        />
                        <span className="text-[var(--neutral-300)] capitalize">
                          {getAvailabilityText(status)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full border-[var(--neutral-600)]"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-[var(--neutral-400)]">
          <span>
            {filteredProducts.length} of {products.length} products
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          {(searchQuery || activeCategory !== 'all' || filters.dietary.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-[var(--neon-green)] hover:text-[var(--neon-green)]/80"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      )}>
        {filteredProducts.map((product) => (
          <Card 
            key={product.id} 
            className={cn(
              "bg-[var(--neutral-900)] border-[var(--neutral-800)] overflow-hidden hover:border-[var(--neon-green)] transition-all duration-200 group",
              viewMode === 'list' && "flex"
            )}
          >
            <div className={cn(
              "relative",
              viewMode === 'list' ? "w-48 flex-shrink-0" : "aspect-square"
            )}>
              <div className="w-full h-full bg-[var(--neutral-700)] flex items-center justify-center">
                <span className="text-4xl">🌽</span>
              </div>
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <Badge className="bg-blue-500 text-white text-xs">NEW</Badge>
                )}
                {product.isPopular && (
                  <Badge className="bg-[var(--neon-green)] text-black text-xs">POPULAR</Badge>
                )}
                {product.originalPrice && (
                  <Badge className="bg-red-500 text-white text-xs">SALE</Badge>
                )}
              </div>

              {/* Availability Status */}
              <div className="absolute top-2 right-2">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  getAvailabilityColor(product.availability)
                )} />
              </div>

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite?.(product.id)}
                className="absolute bottom-2 right-2 p-1 bg-black/50 hover:bg-black/70"
              >
                <Heart className={cn(
                  "w-4 h-4",
                  product.isFavorite ? "text-red-500 fill-current" : "text-white"
                )} />
              </Button>
            </div>

            <CardContent className={cn(
              "p-4",
              viewMode === 'list' && "flex-1"
            )}>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-white group-hover:text-[var(--neon-green)] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-[var(--neutral-300)]">{product.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-[var(--neutral-400)] line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-[var(--neutral-500)]">
                  <Clock className="w-3 h-3" />
                  <span>{product.prepTime}</span>
                  {product.calories && (
                    <>
                      <span>•</span>
                      <span>{product.calories} cal</span>
                    </>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs border-[var(--neutral-600)] text-[var(--neutral-400)]"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {product.isVegetarian && (
                    <Badge className="bg-green-600 text-white text-xs">
                      <Leaf className="w-3 h-3 mr-1" />
                      Veg
                    </Badge>
                  )}
                  {product.isSpicy && (
                    <Badge className="bg-red-600 text-white text-xs">
                      <Flame className="w-3 h-3 mr-1" />
                      Spicy
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {product.originalPrice && (
                      <span className="text-sm text-[var(--neutral-500)] line-through">
                        RM {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-lg font-bold text-[var(--neon-green)]">
                      RM {product.price.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={() => onAddToCart(product)}
                    disabled={product.availability === 'out-of-stock'}
                    className={cn(
                      "bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90",
                      product.availability === 'out-of-stock' && "opacity-50 cursor-not-allowed"
                    )}
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {product.availability === 'out-of-stock' ? 'Sold Out' : 'Add'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-[var(--neutral-600)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-[var(--neutral-400)] mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button 
              onClick={clearFilters}
              className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
            >
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
