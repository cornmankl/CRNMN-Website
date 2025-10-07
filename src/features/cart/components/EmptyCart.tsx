import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { ShoppingCart, Sparkles } from 'lucide-react';

interface EmptyCartProps {
  onBrowseMenu?: () => void;
}

export const EmptyCart = ({ onBrowseMenu }: EmptyCartProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <ShoppingCart className="w-24 h-24 text-muted-foreground/50" />
        <Sparkles className="w-8 h-8 text-primary absolute -top-2 -right-2 animate-pulse" />
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold mb-3">
        Your cart is empty
      </h2>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        Start adding some delicious corn dishes to your cart and enjoy our premium selection!
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/menu">
          <Button size="lg" className="gap-2">
            <ShoppingCart className="w-5 h-5" />
            Browse Menu
          </Button>
        </Link>
        
        <Link to="/">
          <Button variant="outline" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="mt-12 grid grid-cols-2 gap-4 max-w-md w-full">
        <Link to="/menu?category=appetizers" className="group">
          <div className="p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <div className="text-3xl mb-2">🥗</div>
            <div className="font-medium text-sm">Appetizers</div>
          </div>
        </Link>
        
        <Link to="/menu?category=mains" className="group">
          <div className="p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <div className="text-3xl mb-2">🌽</div>
            <div className="font-medium text-sm">Main Courses</div>
          </div>
        </Link>
        
        <Link to="/menu?category=desserts" className="group">
          <div className="p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <div className="text-3xl mb-2">🍰</div>
            <div className="font-medium text-sm">Desserts</div>
          </div>
        </Link>
        
        <Link to="/menu?category=beverages" className="group">
          <div className="p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <div className="text-3xl mb-2">🥤</div>
            <div className="font-medium text-sm">Beverages</div>
          </div>
        </Link>
      </div>
    </div>
  );
};
