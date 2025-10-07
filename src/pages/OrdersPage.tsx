import { SEOHead } from '../components/SEO/SEOHead';
import { useOrders, OrderCard } from '../features/order';
import { useAuth } from '../features/auth';
import { Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function OrdersPage() {
  const { orders, isLoading } = useOrders();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <SEOHead title="My Orders | CRNMN" noindex={true} />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <Package className="w-24 h-24 mx-auto text-muted-foreground/50" />
            <h1 className="text-3xl font-bold">Sign in to view orders</h1>
            <p className="text-muted-foreground">
              Please sign in to see your order history
            </p>
            <Link to="/profile">
              <Button size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="My Orders | CRNMN" noindex={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              View and track your order history
            </p>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 space-y-6">
              <Package className="w-24 h-24 mx-auto text-muted-foreground/50" />
              <div>
                <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start ordering some delicious corn dishes!
                </p>
                <Link to="/menu">
                  <Button size="lg">Browse Menu</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
