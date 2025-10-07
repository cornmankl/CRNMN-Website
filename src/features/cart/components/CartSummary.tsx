import { CartSummary as CartSummaryType } from '../types/cart.types';
import { formatPrice, FREE_DELIVERY_THRESHOLD } from '../utils/cartHelpers';
import { Button } from '../../../components/ui/button';
import { ShoppingBag, Truck } from 'lucide-react';

interface CartSummaryProps {
  summary: CartSummaryType;
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

export const CartSummary = ({ 
  summary, 
  onCheckout,
  showCheckoutButton = true 
}: CartSummaryProps) => {
  const needsForFreeDelivery = FREE_DELIVERY_THRESHOLD - summary.subtotal;
  const hasFreeDelivery = needsForFreeDelivery <= 0;

  return (
    <div className="card-elevated space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Order Summary</h2>
      </div>

      {/* Free Delivery Progress */}
      {!hasFreeDelivery && summary.deliveryFee > 0 && (
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              Add {formatPrice(needsForFreeDelivery)} more for free delivery!
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-gold h-full transition-all duration-500"
              style={{ 
                width: `${Math.min((summary.subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      {hasFreeDelivery && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Truck className="w-4 h-4" />
            <span className="font-medium">Free delivery applied! 🎉</span>
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal ({summary.itemCount} items)</span>
          <span className="font-medium">{formatPrice(summary.subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-muted-foreground">
          <span>Delivery Fee</span>
          <span className={`font-medium ${hasFreeDelivery ? 'text-green-600 dark:text-green-400 line-through' : ''}`}>
            {formatPrice(summary.deliveryFee)}
          </span>
        </div>
        
        <div className="flex justify-between text-muted-foreground">
          <span>Tax (6%)</span>
          <span className="font-medium">{formatPrice(summary.tax)}</span>
        </div>

        <div className="border-t border-border pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-gradient">
              {formatPrice(summary.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <Button 
          size="lg" 
          className="w-full gap-2"
          onClick={onCheckout}
        >
          <ShoppingBag className="w-5 h-5" />
          Proceed to Checkout
        </Button>
      )}

      {/* Additional Info */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>Secure checkout powered by Stripe</p>
        <p>30-day money-back guarantee</p>
      </div>
    </div>
  );
};
