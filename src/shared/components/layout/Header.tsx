import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useCartStore, useUserStore } from '../../../store';
import { Button } from '../../../components/ui/button';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getItemCount, setCartOpen } = useCartStore();
  const { user } = useUserStore();
  
  const cartCount = getItemCount();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/orders', label: 'Orders' },
    { path: '/profile', label: 'Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold">
              C
            </div>
            <div>
              <p className="text-sm tracking-[0.3em] font-bold text-gradient">CRNMN</p>
              <p className="text-xs text-muted-foreground">Premium Corn</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  text-sm font-medium transition-colors hover:text-primary
                  ${isActive(link.path) ? 'text-primary' : 'text-muted-foreground'}
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCartOpen(true)}
              className="gap-2 relative"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* User Button */}
            {user ? (
              <Link to="/profile">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
              </Link>
            ) : (
              <Link to="/profile">
                <Button size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-in-down">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive(link.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
