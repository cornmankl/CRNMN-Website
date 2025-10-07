import { memo } from 'react';
import { CartItem } from '../types/cart.types';
import { formatPrice, getItemTotal } from '../utils/cartHelpers';
import { Button } from '../../../components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItemCard = memo(({ item, onUpdateQuantity, onRemove }: CartItemCardProps) => {
  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const itemTotal = getItemTotal(item);

  return (
    <div className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
      {/* Image */}
      <div className="shrink-0">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=200&h=200&fit=crop'}
          alt={item.name}
          className="w-20 h-20 rounded-lg object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=200&h=200&fit=crop';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {item.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Quantity & Price */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center font-medium text-sm">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrement}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {formatPrice(typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price)} × {item.quantity}
            </div>
            <div className="font-bold text-lg text-gradient">
              {formatPrice(itemTotal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.item.price === nextProps.item.price
  );
});

CartItemCard.displayName = 'CartItemCard';
