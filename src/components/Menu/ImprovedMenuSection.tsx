import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ProductSearch } from '../Search/ProductSearch';
import { 
  Search, 
  Filter, 
  Grid,
  List,
  Star,
  Clock,
  ShoppingCart,
  Heart,
  TrendingUp,
  Award,
  Flame,
  Leaf,
  Crown,
  Gift,
  Info,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ImprovedMenuSectionProps {
  addToCart: (item: any) => void;
  user?: any;
  onShowAuth: () => void;
}

export function ImprovedMenuSection({ addToCart, user, onShowAuth }: ImprovedMenuSectionProps) {
  const [activeTab, setActiveTab] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Items', icon: '🌽', count: 24 },
    { id: 'popular', name: 'Popular', icon: '🔥', count: 8 },
    { id: 'new', name: 'New Arrivals', icon: '✨', count: 5 },
    { id: 'classic', name: 'Classic', icon: '⭐', count: 6 },
    { id: 'premium', name: 'Premium', icon: '👑', count: 4 },
    { id: 'spicy', name: 'Spicy', icon: '🌶️', count: 7 },
    { id: 'sweet', name: 'Sweet', icon: '🍭', count: 6 }
  ];

  const featuredItems = [
    {
      id: '1',
      name: 'Sweet Corn Delight',
      description: 'Fresh sweet corn kernels with butter and herbs - our signature dish',
      price: 8.50,
      originalPrice: 10.00,
      image: '🌽',
      category: 'Classic',
      rating: 4.8,
      reviews: 124,
      prepTime: '5-8 min',
      calories: 180,
      isVegetarian: true,
      isPopular: true,
      tags: ['bestseller', 'classic', 'buttery']
    },
    {
      id: '2',
      name: 'Spicy Corn Fritters',
      description: 'Crispy corn fritters with jalapeño and spices - perfect for spice lovers',
      price: 12.00,
      image: '🌶️',
      category: 'Spicy',
      rating: 4.6,
      reviews: 89,
      prepTime: '10-12 min',
      calories: 320,
      isVegetarian: true,
      isSpicy: true,
      isNew: true,
      tags: ['new', 'spicy', 'crispy']
    },
    {
      id: '3',
      name: 'Grilled Corn Special',
      description: 'Perfectly grilled corn with garlic mayo and parmesan cheese',
      price: 15.50,
      image: '🔥',
      category: 'Premium',
      rating: 4.9,
      reviews: 156,
      prepTime: '8-10 min',
      calories: 280,
      isVegetarian: true,
      isPremium: true,
      tags: ['premium', 'grilled', 'gourmet']
    }
  ];

  const handleAddToCart = (item: any) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: `RM ${item.price.toFixed(2)}`,
      category: item.category
    };
    addToCart(cartItem);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // You could filter items here based on category
  };

  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Welcome Message */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl">🌽</span>
            <h1 className="text-3xl font-bold text-white">Our Gourmet Menu</h1>
            <span className="text-4xl">🌽</span>
          </div>
          <p className="text-[var(--neutral-400)] text-lg max-w-2xl mx-auto">
            Discover our carefully crafted corn dishes made with premium ingredients and authentic flavors
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--neutral-400)]">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>4.8 Average Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-green-400" />
              <span>5-15 min Prep Time</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-[var(--neon-green)]" />
              <span>24 Unique Dishes</span>
            </div>
          </div>
        </div>

        {/* Category Quick Filter */}
        <div className="bg-[var(--neutral-900)] rounded-2xl p-6 border border-[var(--neutral-800)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Browse by Category</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-[var(--neutral-400)] hover:text-white"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={cn(
                "w-4 h-4 ml-1 transition-transform",
                showFilters && "rotate-180"
              )} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((category) => (
              <Tooltip key={category.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 h-20 text-center",
                      selectedCategory === category.id
                        ? "bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                        : "border-[var(--neutral-700)] hover:border-[var(--neon-green)] hover:bg-[var(--neutral-800)]"
                    )}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <div className="text-xs font-semibold">{category.name}</div>
                      <div className="text-xs opacity-70">{category.count} items</div>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{category.count} {category.name.toLowerCase()} dishes available</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Main Menu Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-[var(--neutral-800)] border border-[var(--neutral-700)]">
              <TabsTrigger 
                value="featured" 
                className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Featured
              </TabsTrigger>
              <TabsTrigger 
                value="search" 
                className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black"
              >
                <Search className="w-4 h-4 mr-2" />
                Search & Filter
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="data-[state=active]:bg-[var(--neon-green)] data-[state=active]:text-black"
              >
                <Grid className="w-4 h-4 mr-2" />
                Categories
              </TabsTrigger>
            </TabsList>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-[var(--neutral-700)] rounded-lg p-1">
                <Tooltip>
                  <TooltipTrigger asChild>
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
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Grid view</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
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
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>List view</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Featured Tab */}
          <TabsContent value="featured" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Chef's Recommendations</h2>
              <p className="text-[var(--neutral-400)]">
                Our most popular and highest-rated corn dishes
              </p>
            </div>

            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}>
              {featuredItems.map((item) => (
                <Card 
                  key={item.id}
                  className="bg-[var(--neutral-800)] border-[var(--neutral-700)] hover:border-[var(--neon-green)] transition-all duration-200 group overflow-hidden"
                >
                  <div className="relative">
                    {/* Item Image */}
                    <div className={cn(
                      "bg-gradient-to-br from-[var(--neutral-700)] to-[var(--neutral-600)] flex items-center justify-center",
                      viewMode === 'grid' ? "h-48" : "h-32 w-32"
                    )}>
                      <span className="text-6xl">{item.image}</span>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.isPopular && (
                        <Badge className="bg-[var(--neon-green)] text-black text-xs">
                          POPULAR
                        </Badge>
                      )}
                      {item.isNew && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          NEW
                        </Badge>
                      )}
                      {item.isPremium && (
                        <Badge className="bg-purple-500 text-white text-xs">
                          PREMIUM
                        </Badge>
                      )}
                      {item.originalPrice && (
                        <Badge className="bg-red-500 text-white text-xs">
                          SALE
                        </Badge>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70 rounded-full"
                          >
                            <Heart className="w-4 h-4 text-white" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add to wishlist</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-4">
                    {/* Item Info */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white group-hover:text-[var(--neon-green)] transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white">{item.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-[var(--neutral-400)] line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Details Row */}
                    <div className="flex items-center justify-between text-xs text-[var(--neutral-500)]">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.prepTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{item.calories} cal</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{item.reviews} reviews</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      {item.isVegetarian && (
                        <Badge className="bg-green-600 text-white text-xs flex items-center gap-1">
                          <Leaf className="w-2 h-2" />
                          Vegetarian
                        </Badge>
                      )}
                      {item.isSpicy && (
                        <Badge className="bg-red-600 text-white text-xs flex items-center gap-1">
                          <Flame className="w-2 h-2" />
                          Spicy
                        </Badge>
                      )}
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {item.originalPrice && (
                          <span className="text-sm text-[var(--neutral-500)] line-through">
                            RM {item.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-xl font-bold text-[var(--neon-green)]">
                          RM {item.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleAddToCart(item)}
                            className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 font-semibold"
                            size="sm"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add {item.name} to cart</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Button
                onClick={() => setActiveTab('search')}
                variant="outline"
                className="border-[var(--neutral-600)] hover:border-[var(--neon-green)] px-8"
              >
                <Search className="w-4 h-4 mr-2" />
                View All Menu Items
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Find Your Perfect Dish</h2>
              <p className="text-[var(--neutral-400)]">
                Use our advanced search and filtering to discover exactly what you're craving
              </p>
            </div>
            
            <ProductSearch 
              onAddToCart={handleAddToCart}
              onToggleFavorite={(productId) => console.log('Toggle favorite:', productId)}
            />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Explore by Category</h2>
              <p className="text-[var(--neutral-400)]">
                Browse our organized menu categories to find your favorites
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.filter(c => c.id !== 'all').map((category) => (
                <Card 
                  key={category.id}
                  className="bg-[var(--neutral-800)] border-[var(--neutral-700)] hover:border-[var(--neon-green)] transition-all duration-200 cursor-pointer group"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setActiveTab('search');
                  }}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-6xl">{category.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-[var(--neon-green)] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-[var(--neutral-400)]">
                        {category.count} delicious options
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 w-full"
                    >
                      Explore {category.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="bg-[var(--neutral-900)] border-[var(--neutral-800)]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">Need Help Choosing?</h3>
                <p className="text-sm text-[var(--neutral-400)] mb-4">
                  Our AI assistant can recommend dishes based on your preferences, dietary needs, or mood!
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => onNavigate('ai')}
                    className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                    size="sm"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Get AI Recommendations
                  </Button>
                  {!user && (
                    <Button
                      variant="outline"
                      onClick={onShowAuth}
                      className="border-[var(--neutral-600)] hover:border-[var(--neon-green)]"
                      size="sm"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Sign Up for Personalized Suggestions
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
