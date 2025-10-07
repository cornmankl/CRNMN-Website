import { memo } from 'react';
import { MenuItem } from '../types/menu.types';
import { formatPrice, getCategoryColor } from '../utils/menuHelpers';
import { Button } from '../../../components/ui/button';
import { ShoppingCart, Star, Clock, Flame } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuCard = memo(({ item, onAddToCart }: MenuCardProps) => {
  return (
    <div className="card-interactive group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4 bg-neutral-200 dark:bg-neutral-800">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-medium group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=400&fit=crop';
          }}
        />
        
        {/* Category Badge */}
        <div className={`absolute top-2 left-2 ${getCategoryColor(item.category)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
          {item.category}
        </div>
        
        {/* Stock Status */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-lg line-clamp-2 flex-1">
            {item.name}
          </h3>
          {item.rating && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
              <span className="font-medium">{item.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2">
          {item.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {item.prepTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{item.prepTime} min</span>
            </div>
          )}
          {item.calories && (
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>{item.calories} cal</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="inline-flex items-center px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-2xl font-bold text-gradient">
            {formatPrice(item.price)}
          </span>
          
          <Button
            onClick={() => onAddToCart(item)}
            disabled={!item.inStock}
            size="sm"
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.price === nextProps.item.price &&
    prevProps.item.inStock === nextProps.item.inStock
  );
});

MenuCard.displayName = 'MenuCard';
