import { useState } from 'react';
import { AIToggle } from './AIToggle';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  cartCount: number;
  setShowCart: (show: boolean) => void;
  user: any;
  setShowAuth: (show: boolean) => void;
  activeOrder: any;
}

export function Header({ 
  activeSection, 
  setActiveSection, 
  cartCount, 
  setShowCart, 
  user, 
  setShowAuth,
  activeOrder 
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/90 border-b border-[var(--neutral-800)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button 
          className="flex items-center gap-3" 
          onClick={() => setActiveSection('home')}
        >
          <div className="h-10 w-10 rounded-full neon-bg"></div>
          <div>
            <p className="text-sm tracking-[0.3em] neon-text font-semibold">THEFMSMKT</p>
            <p className="text-xs text-[var(--neutral-400)]">CMNTYPLX · CORNMAN</p>
          </div>
        </button>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <button
            className={`hover:text-[var(--neutral-300)] transition-colors ${
              activeSection === 'home' ? 'neon-text font-semibold' : ''
            }`}
            onClick={() => setActiveSection('home')}
          >
            Home
          </button>
          <button
            className={`hover:text-[var(--neutral-300)] transition-colors ${
              activeSection === 'menu' ? 'neon-text font-semibold' : ''
            }`}
            onClick={() => setActiveSection('menu')}
          >
            Menu
          </button>
          <button
            className={`hover:text-[var(--neutral-300)] transition-colors ${
              activeSection === 'locations' ? 'neon-text font-semibold' : ''
            }`}
            onClick={() => setActiveSection('locations')}
          >
            Locations
          </button>
          <button
            className={`hover:text-[var(--neutral-300)] transition-colors ${
              activeSection === 'ai' ? 'neon-text font-semibold' : ''
            }`}
            onClick={() => setActiveSection('ai')}
          >
            AI Assistant
          </button>
          {activeOrder && (
            <button
              className={`hover:text-[var(--neutral-300)] transition-colors flex items-center gap-1 ${
                activeSection === 'tracking' ? 'neon-text font-semibold' : ''
              }`}
              onClick={() => setActiveSection('tracking')}
            >
              <span className="material-icons text-sm">delivery_dining</span>
              Track Order
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* AI Assistant Toggle */}
          <AIToggle />
          
          {/* Cart Button */}
          <button 
            className="p-2 rounded-full hover:bg-[var(--neutral-800)] relative transition-colors"
            onClick={() => setShowCart(true)}
          >
            <span className="material-icons">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--neon-green)] text-black text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                className={`hover:text-[var(--neutral-300)] transition-colors ${
                  activeSection === 'profile' ? 'neon-text' : ''
                }`}
                onClick={() => setActiveSection('profile')}
              >
                <div className="h-8 w-8 rounded-full bg-[var(--neutral-700)] flex items-center justify-center font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
              </button>
            </div>
          ) : (
            <button 
              className="btn-secondary text-sm py-2 px-4 hidden sm:block"
              onClick={() => setShowAuth(true)}
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-icons">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden pb-4 border-t border-[var(--neutral-800)] px-4 bg-black/95">
          <div className="flex flex-col gap-3 pt-3">
            <button
              className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                activeSection === 'home' ? 'neon-text font-semibold' : ''
              }`}
              onClick={() => {
                setActiveSection('home');
                setIsMenuOpen(false);
              }}
            >
              Home
            </button>
            <button
              className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                activeSection === 'menu' ? 'neon-text font-semibold' : ''
              }`}
              onClick={() => {
                setActiveSection('menu');
                setIsMenuOpen(false);
              }}
            >
              Menu
            </button>
            <button
              className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                activeSection === 'locations' ? 'neon-text font-semibold' : ''
              }`}
              onClick={() => {
                setActiveSection('locations');
                setIsMenuOpen(false);
              }}
            >
              Locations
            </button>
            <button
              className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                activeSection === 'ai' ? 'neon-text font-semibold' : ''
              }`}
              onClick={() => {
                setActiveSection('ai');
                setIsMenuOpen(false);
              }}
            >
              AI Assistant
            </button>
            {activeOrder && (
              <button
                className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                  activeSection === 'tracking' ? 'neon-text font-semibold' : ''
                }`}
                onClick={() => {
                  setActiveSection('tracking');
                  setIsMenuOpen(false);
                }}
              >
                Track Order
              </button>
            )}
            {user && (
              <button
                className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                  activeSection === 'profile' ? 'neon-text font-semibold' : ''
                }`}
                onClick={() => {
                  setActiveSection('profile');
                  setIsMenuOpen(false);
                }}
              >
                Profile
              </button>
            )}
            {!user && (
              <button 
                className="btn-secondary text-sm py-2 px-4 w-fit mt-2"
                onClick={() => {
                  setShowAuth(true);
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}