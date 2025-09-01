import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  description?: string;
}

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  total: number;
  clearCart: () => void;
  setActiveOrder: (order: any) => void;
}

export function CartSheet({ 
  open, 
  onOpenChange, 
  items, 
  updateItem, 
  total, 
  clearCart,
  setActiveOrder 
}: CartSheetProps) {
  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Create a new order
    const newOrder = {
      id: `#${Math.floor(Math.random() * 10000)}`,
      items: [...items],
      total: total,
      status: 'preparing',
      estimatedTime: '15-20 minutes',
      timestamp: new Date()
    };
    
    setActiveOrder(newOrder);
    clearCart();
    onOpenChange(false);
    
    // Show success message (you could add a toast here)
    alert('Order placed successfully! Check tracking for updates.');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg bg-[var(--neutral-900)] border-[var(--neutral-800)]">
        <SheetHeader>
          <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
            <span className="material-icons">shopping_cart</span>
            Your Order
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <span className="material-icons text-6xl text-[var(--neutral-600)] mb-4">
                shopping_cart
              </span>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-[var(--neutral-400)] mb-6">Add some delicious corn items to get started!</p>
              <Button 
                className="btn-primary"
                onClick={() => onOpenChange(false)}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-[var(--neutral-800)] rounded-xl">
                    <div className="w-12 h-12 bg-[var(--neutral-700)] rounded-lg flex items-center justify-center">
                      <span className="material-icons text-[var(--neutral-400)]">restaurant</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-[var(--neutral-400)]">{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded-full bg-[var(--neutral-700)] flex items-center justify-center hover:bg-[var(--neutral-600)]"
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                      >
                        <span className="material-icons text-sm">remove</span>
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        className="w-8 h-8 rounded-full bg-[var(--neon-green)] text-black flex items-center justify-center hover:bg-[var(--neon-green)]/80"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                      >
                        <span className="material-icons text-sm">add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t border-[var(--neutral-800)] pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>RM {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>RM 2.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>RM 1.00</span>
                  </div>
                  <div className="border-t border-[var(--neutral-700)] pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="neon-text">RM {(total + 3.5).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="btn-primary w-full text-base py-3"
                    onClick={handleCheckout}
                  >
                    Place Order • RM {(total + 3.5).toFixed(2)}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-[var(--neutral-700)] hover:bg-[var(--neutral-800)]"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}