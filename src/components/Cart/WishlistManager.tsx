import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { 
  Heart, 
  ShoppingCart, 
  X, 
  Share2, 
  Download,
  Star,
  Clock,
  Leaf,
  Flame,
  Gift,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface WishlistItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category: string;
  rating: number;
  reviews: number;
  prepTime: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isAvailable: boolean;
  dateAdded: string;
  tags: string[];
}

interface WishlistManagerProps {
  user?: any;
  onAddToCart: (item: WishlistItem) => void;
}

export function WishlistManager({ user, onAddToCart }: WishlistManagerProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch (error) {
          console.error('Error loading wishlist:', error);
        }
      }
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user && wishlistItems.length >= 0) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  // Mock initial wishlist items for demo
  useEffect(() => {
    if (user && wishlistItems.length === 0) {
      const mockWishlistItems: WishlistItem[] = [
        {
          id: '1',
          name: 'Sweet Corn Delight',
          description: 'Fresh sweet corn kernels with butter and herbs',
          price: 8.50,
          originalPrice: 10.00,
          category: 'Appetizers',
          rating: 4.8,
          reviews: 124,
          prepTime: '5-8 min',
          isVegetarian: true,
          isSpicy: false,
          isAvailable: true,
          dateAdded: '2024-01-15',
          tags: ['sweet', 'buttery', 'classic']
        },
        {
          id: '2',
          name: 'Spicy Corn Fritters',
          description: 'Crispy corn fritters with jalapeño and spices',
          price: 12.00,
          category: 'Main Dishes',
          rating: 4.6,
          reviews: 89,
          prepTime: '10-12 min',
          isVegetarian: true,
          isSpicy: true,
          isAvailable: false,
          dateAdded: '2024-01-10',
          tags: ['crispy', 'spicy', 'fried']
        },
        {
          id: '3',
          name: 'Corn Ice Cream',
          description: 'Unique sweet corn flavored ice cream',
          price: 7.50,
          category: 'Desserts',
          rating: 4.2,
          reviews: 45,
          prepTime: '2-3 min',
          isVegetarian: true,
          isSpicy: false,
          isAvailable: true,
          dateAdded: '2024-01-08',
          tags: ['sweet', 'cold', 'unique']
        }
      ];
      setWishlistItems(mockWishlistItems);
    }
  }, [user, wishlistItems.length]);

  const addToWishlist = (item: WishlistItem) => {
    if (!user) return;
    
    const exists = wishlistItems.find(w => w.id === item.id);
    if (!exists) {
      const newItem = {
        ...item,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setWishlistItems(prev => [newItem, ...prev]);
    }
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const isInWishlist = (itemId: string) => {
    return wishlistItems.some(item => item.id === itemId);
  };

  const moveToCart = (item: WishlistItem) => {
    onAddToCart(item);
    removeFromWishlist(item.id);
  };

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'oldest':
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const shareWishlist = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My CRNMN Wishlist',
          text: `Check out my wishlist of ${wishlistItems.length} corn dishes!`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copying link
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const exportWishlist = () => {
    const data = {
      user: user?.name,
      exportDate: new Date().toISOString(),
      items: wishlistItems
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crnmn-wishlist-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Wishlist Toggle Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative p-2 hover:bg-[var(--neutral-800)]"
          >
            <Heart className={cn(
              "w-5 h-5",
              wishlistItems.length > 0 ? "text-red-500 fill-current" : "text-[var(--neutral-400)]"
            )} />
            {wishlistItems.length > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent 
          side="right" 
          className="w-full sm:max-w-lg bg-[var(--neutral-900)] border-[var(--neutral-800)] p-0"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="p-6 pb-4 border-b border-[var(--neutral-800)]">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-white text-lg font-bold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  My Wishlist
                  {wishlistItems.length > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </SheetTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={shareWishlist}
                    className="p-2"
                  >
                    <Share2 className="w-4 h-4 text-[var(--neutral-400)]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportWishlist}
                    className="p-2"
                  >
                    <Download className="w-4 h-4 text-[var(--neutral-400)]" />
                  </Button>
                </div>
              </div>
            </SheetHeader>

            {wishlistItems.length === 0 ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Heart className="w-16 h-16 text-[var(--neutral-600)] mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
                <p className="text-[var(--neutral-400)] mb-6">
                  Save your favorite corn dishes to order them later!
                </p>
                <Button 
                  className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                  onClick={() => setIsOpen(false)}
                >
                  Browse Menu
                </Button>
              </div>
            ) : (
              <>
                {/* Controls */}
                <div className="p-4 border-b border-[var(--neutral-800)]">
                  <div className="flex items-center justify-between">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg px-3 py-2 text-white text-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="name">Name A-Z</option>
                    </select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearWishlist}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                </div>

                {/* Wishlist Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {sortedItems.map((item) => (
                    <Card key={item.id} className="bg-[var(--neutral-800)] border-[var(--neutral-700)] overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Item Image */}
                          <div className="w-20 h-20 bg-[var(--neutral-700)] rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🌽</span>
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromWishlist(item.id)}
                                className="p-1 h-auto text-[var(--neutral-400)] hover:text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            <p className="text-xs text-[var(--neutral-400)] mb-2 line-clamp-2">
                              {item.description}
                            </p>

                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-[var(--neutral-300)]">{item.rating}</span>
                              </div>
                              <span className="text-xs text-[var(--neutral-500)]">•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[var(--neutral-400)]" />
                                <span className="text-xs text-[var(--neutral-400)]">{item.prepTime}</span>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex items-center gap-1 mb-3">
                              {item.isVegetarian && (
                                <Badge className="bg-green-600 text-white text-xs px-1 py-0">
                                  <Leaf className="w-2 h-2 mr-0.5" />
                                  Veg
                                </Badge>
                              )}
                              {item.isSpicy && (
                                <Badge className="bg-red-600 text-white text-xs px-1 py-0">
                                  <Flame className="w-2 h-2 mr-0.5" />
                                  Spicy
                                </Badge>
                              )}
                              {item.originalPrice && (
                                <Badge className="bg-orange-600 text-white text-xs px-1 py-0">
                                  Sale
                                </Badge>
                              )}
                            </div>

                            {/* Price and Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {item.originalPrice && (
                                  <span className="text-xs text-[var(--neutral-500)] line-through">
                                    RM {item.originalPrice.toFixed(2)}
                                  </span>
                                )}
                                <span className="font-bold text-[var(--neon-green)]">
                                  RM {item.price.toFixed(2)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {!item.isAvailable && (
                                  <Badge variant="outline" className="border-red-600 text-red-400 text-xs">
                                    Out of Stock
                                  </Badge>
                                )}
                                <Button
                                  onClick={() => moveToCart(item)}
                                  disabled={!item.isAvailable}
                                  className={cn(
                                    "bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90",
                                    !item.isAvailable && "opacity-50 cursor-not-allowed"
                                  )}
                                  size="sm"
                                >
                                  <ShoppingCart className="w-3 h-3 mr-1" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-[var(--neutral-800)]">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Add all available items to cart
                        sortedItems.filter(item => item.isAvailable).forEach(item => {
                          moveToCart(item);
                        });
                      }}
                      className="border-[var(--neutral-600)]"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add All to Cart
                    </Button>
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// Hook for managing wishlist from other components
export const useWishlist = (userId?: string) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (userId) {
      const savedWishlist = localStorage.getItem(`wishlist_${userId}`);
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch (error) {
          console.error('Error loading wishlist:', error);
        }
      }
    }
  }, [userId]);

  const addToWishlist = (item: WishlistItem) => {
    if (!userId) return;
    
    const exists = wishlistItems.find(w => w.id === item.id);
    if (!exists) {
      const newItem = {
        ...item,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      const updatedItems = [newItem, ...wishlistItems];
      setWishlistItems(updatedItems);
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(updatedItems));
    }
  };

  const removeFromWishlist = (itemId: string) => {
    if (!userId) return;
    
    const updatedItems = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedItems);
    localStorage.setItem(`wishlist_${userId}`, JSON.stringify(updatedItems));
  };

  const isInWishlist = (itemId: string) => {
    return wishlistItems.some(item => item.id === itemId);
  };

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount: wishlistItems.length
  };
};
