import React from 'react';
import { FeatureShowcase } from './FeatureShowcase';

interface HeroSectionProps {
  setActiveSection: (section: string) => void;
  addToCart: (item: any) => void;
}

export function HeroSection({ setActiveSection, addToCart }: HeroSectionProps) {
  const featuredItems = [
    {
      id: 1,
      name: 'CORNMAN Classic Cup',
      description: 'Sweet corn + butter + cheese',
      price: 'RM 7.90',
      badge: 'Most Popular',
      image: null
    },
    {
      id: 7,
      name: 'Susu Pekat Classic',
      description: 'Traditional Malaysian corn with condensed milk',
      price: 'RM 8.50',
      badge: 'Local Favorite',
      image: null
    },
    {
      id: 6,
      name: 'Cheddar Cheese Explosion',
      description: 'Premium corn loaded with aged cheddar cheese',
      price: 'RM 10.90',
      badge: 'Cheesy Goodness',
      image: null
    }
  ];

  return (
    <div className="relative">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-black via-neutral-900 to-black min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="mb-6">
            <span className="text-sm tracking-[0.3em] neon-text font-semibold">THEFMSMKT</span>
            <p className="text-xs text-[var(--neutral-400)] mt-1">CMNTYPLX · CORNMAN</p>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="neon-text">GOURMET CORN</span><br />
            <span className="text-white">DELIVERED FRESH</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--neutral-300)] mb-8 max-w-2xl mx-auto">
            Elevated street food experiences featuring premium corn dishes with exciting new flavors. 
            From traditional Malaysian Susu Pekat to indulgent Chocolate & Caramel varieties.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="btn-primary text-lg px-8 py-4"
              onClick={() => setActiveSection('menu')}
            >
              Order Now
            </button>
            <button 
              className="btn-secondary text-lg px-8 py-4"
              onClick={() => setActiveSection('locations')}
            >
              Find Locations
            </button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-[var(--neutral-900)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-black neon-text mb-2">15min</div>
              <p className="text-[var(--neutral-400)]">Average Delivery Time</p>
            </div>
            <div>
              <div className="text-3xl font-black neon-text mb-2">100%</div>
              <p className="text-[var(--neutral-400)]">Fresh Ingredients</p>
            </div>
            <div>
              <div className="text-3xl font-black neon-text mb-2">4.9★</div>
              <p className="text-[var(--neutral-400)]">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold neon-text mb-4">Featured Items</h2>
          <p className="text-[var(--neutral-400)] text-lg">Our most loved corn creations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <div key={item.id} className="card group hover:scale-105 transition-transform duration-300">
              <div className="aspect-video bg-gradient-to-br from-[var(--neutral-800)] to-[var(--neutral-900)] grid place-items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <span className="material-icons text-6xl text-[var(--neutral-600)]">restaurant</span>
                {item.badge && (
                  <span className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full bg-opacity-90 neon-bg text-black font-semibold">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{item.name}</h3>
                <p className="text-[var(--neutral-400)] text-sm mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg neon-text">{item.price}</span>
                  <button 
                    className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 neon-bg text-black transition-transform transform hover:scale-105"
                    onClick={() => addToCart(item)}
                  >
                    <span className="material-icons text-base">add_shopping_cart</span>
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            className="btn-secondary text-lg px-8 py-3"
            onClick={() => setActiveSection('menu')}
          >
            View Full Menu
          </button>
        </div>
      </section>

      {/* New Flavors Spotlight */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-r from-neutral-900 to-black rounded-3xl mx-4">
        <div className="text-center mb-12">
          <span className="text-sm px-4 py-2 bg-neon-green text-black rounded-full font-semibold mb-4 inline-block">
            🎉 NEW ARRIVALS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold neon-text mb-4">Exciting New Flavors!</h2>
          <p className="text-[var(--neutral-400)] text-lg">Discover our latest corn creations inspired by Malaysian favorites and international desserts</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-neon-green transition-colors">
            <div className="text-4xl mb-3">🍫</div>
            <h3 className="font-bold mb-2">Chocolate</h3>
            <p className="text-sm text-neutral-400">Rich Belgian chocolate drizzle</p>
            <p className="text-neon-green font-semibold mt-2">RM 9.50</p>
          </div>
          
          <div className="text-center p-6 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-neon-green transition-colors">
            <div className="text-4xl mb-3">🧀</div>
            <h3 className="font-bold mb-2">Cheddar Cheese</h3>
            <p className="text-sm text-neutral-400">Aged Australian cheddar</p>
            <p className="text-neon-green font-semibold mt-2">RM 10.90</p>
          </div>
          
          <div className="text-center p-6 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-neon-green transition-colors">
            <div className="text-4xl mb-3">🥛</div>
            <h3 className="font-bold mb-2">Susu Pekat</h3>
            <p className="text-sm text-neutral-400">Traditional condensed milk</p>
            <p className="text-neon-green font-semibold mt-2">RM 8.50</p>
          </div>
          
          <div className="text-center p-6 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-neon-green transition-colors">
            <div className="text-4xl mb-3">🍯</div>
            <h3 className="font-bold mb-2">Caramel</h3>
            <p className="text-sm text-neutral-400">Smooth golden caramel glaze</p>
            <p className="text-neon-green font-semibold mt-2">RM 9.90</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button 
            className="btn-primary text-lg px-8 py-3"
            onClick={() => setActiveSection('menu')}
          >
            Try New Flavors Now!
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[var(--neutral-900)] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold neon-text mb-4">How It Works</h2>
            <p className="text-[var(--neutral-400)] text-lg">Fresh corn delivered in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full neon-bg text-black flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-2xl">restaurant_menu</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Choose Your Corn</h3>
              <p className="text-[var(--neutral-400)]">Browse our gourmet corn selection and customize your order</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full neon-bg text-black flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-2xl">payments</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Easy Payment</h3>
              <p className="text-[var(--neutral-400)]">Secure checkout with multiple payment options</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full neon-bg text-black flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-2xl">delivery_dining</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
              <p className="text-[var(--neutral-400)]">Fresh corn delivered to your door in 15 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <div className="mt-16">
        <FeatureShowcase onNavigate={setActiveSection} />
      </div>
    </div>
  );
}