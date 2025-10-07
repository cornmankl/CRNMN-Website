import { SEOHead } from '../components/SEO/SEOHead';
import { useCart, CartItemCard, CartSummary, EmptyCart } from '../features/cart';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, summary, isEmpty } = useCart();

  return (
    <>
      <SEOHead 
        title="Shopping Cart | CRNMN"
        description="Review your cart and proceed to checkout for delicious corn dishes."
      />
      
      <div className="container mx-auto px-4 py-8">
        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link to="/menu">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
                    <p className="text-muted-foreground mt-2">
                      {summary.itemCount} item{summary.itemCount !== 1 ? 's' : ''} in your cart
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearCart}
                  >
                    Clear All
                  </Button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <CartSummary 
                    summary={summary}
                    onCheckout={() => {
                      // TODO: Implement checkout
                      console.log('Proceeding to checkout...');
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
