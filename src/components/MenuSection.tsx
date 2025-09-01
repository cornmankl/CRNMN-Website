import { useState } from 'react';

interface MenuSectionProps {
  addToCart: (item: any) => void;
}

export function MenuSection({ addToCart }: MenuSectionProps) {
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    priceRange: 25,
    sortBy: 'popularity'
  });

  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Items', icon: '🌽' },
    { id: 'classic', name: 'Classic', icon: '⭐' },
    { id: 'dessert', name: 'Sweet & Dessert', icon: '🍭' },
    { id: 'cheese', name: 'Cheese Lovers', icon: '🧀' },
    { id: 'traditional', name: 'Malaysian Traditional', icon: '🇲🇾' },
    { id: 'premium', name: 'Premium', icon: '👑' },
    { id: 'spicy', name: 'Spicy', icon: '🌶️' }
  ];

  const menuItems = [
    {
      id: 1,
      name: 'CORNMAN Classic Cup',
      description: 'Sweet corn + butter + cheese',
      price: 'RM 7.90',
      badge: 'Top Pick',
      category: 'classic',
      image: null
    },
    {
      id: 2,
      name: 'Spicy Jalapeño Corn',
      description: 'Corn with a spicy jalapeño kick',
      price: 'RM 8.90',
      badge: null,
      category: 'spicy',
      image: null
    },
    {
      id: 3,
      name: 'Truffle Parmesan Corn',
      description: 'Premium corn with truffle oil and parmesan',
      price: 'RM 12.90',
      badge: 'Premium',
      category: 'premium',
      image: null
    },
    {
      id: 4,
      name: 'Mexican Street Corn',
      description: 'Authentic elote with chili powder and lime',
      price: 'RM 9.90',
      badge: null,
      category: 'international',
      image: null
    },
    {
      id: 5,
      name: 'Chocolate Corn Delight',
      description: 'Sweet corn kernels drizzled with rich Belgian chocolate sauce',
      price: 'RM 9.50',
      badge: 'Sweet Treat',
      category: 'dessert',
      image: null
    },
    {
      id: 6,
      name: 'Cheddar Cheese Explosion',
      description: 'Premium corn loaded with aged Australian cheddar cheese',
      price: 'RM 10.90',
      badge: 'Ultra Cheesy',
      category: 'cheese',
      image: null
    },
    {
      id: 7,
      name: 'Susu Pekat Classic',
      description: 'Authentic Malaysian corn with sweet condensed milk drizzle',
      price: 'RM 8.50',
      badge: 'Warisan Malaysia',
      category: 'traditional',
      image: null
    },
    {
      id: 8,
      name: 'Caramel Corn Supreme',
      description: 'Sweet corn kernels glazed with smooth golden caramel',
      price: 'RM 9.90',
      badge: 'Signature Dessert',
      category: 'dessert',
      image: null
    }
  ];

  const filteredItems = menuItems.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    const price = parseFloat(item.price.replace('RM ', ''));
    if (price > filters.priceRange) return false;
    return true;
  });

  return (
    <section className="mb-16" id="menu">
      <h1 className="text-3xl md:text-4xl font-extrabold neon-text mb-8">Our Gourmet Corn Menu</h1>
      
      {/* Category Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? 'neon-bg text-black'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="card p-6 sticky top-28">
            <h3 className="text-xl font-bold mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-sm">Dietary</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input
                      className="form-checkbox bg-[var(--neutral-700)] border-[var(--neutral-600)] text-[var(--neon-green)] focus:ring-[var(--neon-green)] rounded-sm"
                      type="checkbox"
                      checked={filters.vegetarian}
                      onChange={(e) => setFilters({...filters, vegetarian: e.target.checked})}
                    />
                    <span className="ml-2 text-sm">Vegetarian</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      className="form-checkbox bg-[var(--neutral-700)] border-[var(--neutral-600)] text-[var(--neon-green)] focus:ring-[var(--neon-green)] rounded-sm"
                      type="checkbox"
                      checked={filters.vegan}
                      onChange={(e) => setFilters({...filters, vegan: e.target.checked})}
                    />
                    <span className="ml-2 text-sm">Vegan</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      className="form-checkbox bg-[var(--neutral-700)] border-[var(--neutral-600)] text-[var(--neon-green)] focus:ring-[var(--neon-green)] rounded-sm"
                      type="checkbox"
                      checked={filters.glutenFree}
                      onChange={(e) => setFilters({...filters, glutenFree: e.target.checked})}
                    />
                    <span className="ml-2 text-sm">Gluten-Free</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="font-semibold text-sm" htmlFor="price">Price Range</label>
                <input
                  className="w-full h-2 bg-[var(--neutral-700)] rounded-lg appearance-none cursor-pointer accent-[var(--neon-green)] mt-2"
                  id="price"
                  max="50"
                  min="5"
                  type="range"
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="font-semibold text-sm">Sort By</label>
                <select
                  className="mt-2 w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-2 focus:ring-[var(--neon-green)] focus:border-[var(--neon-green)]"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 grid sm:grid-cols-2 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <span className="material-icons text-6xl text-neutral-600 mb-4">search_off</span>
              <h3 className="text-xl font-bold mb-2">No items found</h3>
              <p className="text-neutral-400">Try adjusting your filters or browse different categories</p>
            </div>
          ) : (
            filteredItems.map((item) => (
            <div key={item.id} className="card">
              <div className="aspect-video bg-[#0a0a0a] grid place-items-center">
                <p className="text-[var(--neutral-500)] text-sm">Product Image</p>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  {item.badge && (
                    <span className="text-xs px-2 py-1 rounded-full bg-opacity-20 neon-bg neon-text">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[var(--neutral-400)] text-sm mt-2">{item.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold neon-text">{item.price}</span>
                  <button 
                    className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 neon-bg text-black transition-transform transform hover:scale-105"
                    onClick={() => addToCart(item)}
                  >
                    <span className="material-icons text-base">shopping_cart</span>
                    Add
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}