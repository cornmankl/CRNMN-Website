import { useState } from 'react';
import { FirebaseImageUpload } from './FirebaseImageUpload';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  badge?: string;
  category: string;
  image: string | null;
}

interface MenuSectionProps {
  addToCart: (item: any) => void;
  isAdmin?: boolean;
}

export function MenuSection({ addToCart, isAdmin = false }: MenuSectionProps) {
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    priceRange: 25,
    sortBy: 'popularity'
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});

  const categories = [
    { id: 'all', name: 'All Items', icon: '🌽' },
    { id: 'classic', name: 'Classic', icon: '⭐' },
    { id: 'dessert', name: 'Sweet & Dessert', icon: '🍭' },
    { id: 'cheese', name: 'Cheese Lovers', icon: '🧀' },
    { id: 'traditional', name: 'Malaysian Traditional', icon: '🇲🇾' },
    { id: 'premium', name: 'Premium', icon: '👑' },
    { id: 'spicy', name: 'Spicy', icon: '🌶️' }
  ];

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'CORNMAN Classic Cup',
      description: 'Sweet corn + butter + cheese',
      price: 'RM 7.90',
      badge: 'Top Pick',
      category: 'classic',
      image: null
    },
    {
      id: '2',
      name: 'Spicy Jalapeño Corn',
      description: 'Corn with a spicy jalapeño kick',
      price: 'RM 8.90',
      category: 'spicy',
      image: null
    },
    {
      id: '3',
      name: 'Truffle Parmesan Corn',
      description: 'Premium corn with truffle oil and parmesan',
      price: 'RM 12.90',
      badge: 'Premium',
      category: 'premium',
      image: null
    },
    {
      id: '4',
      name: 'Mexican Street Corn',
      description: 'Authentic elote with chili powder and lime',
      price: 'RM 9.90',
      category: 'international',
      image: null
    },
    {
      id: '5',
      name: 'Chocolate Corn Delight',
      description: 'Sweet corn kernels drizzled with rich Belgian chocolate sauce',
      price: 'RM 9.50',
      badge: 'Sweet Treat',
      category: 'dessert',
      image: null
    },
    {
      id: '6',
      name: 'Cheddar Cheese Explosion',
      description: 'Premium corn loaded with aged Australian cheddar cheese',
      price: 'RM 10.90',
      badge: 'Ultra Cheesy',
      category: 'cheese',
      image: null
    },
    {
      id: '7',
      name: 'Susu Pekat Classic',
      description: 'Authentic Malaysian corn with sweet condensed milk drizzle',
      price: 'RM 8.50',
      badge: 'Warisan Malaysia',
      category: 'traditional',
      image: null
    },
    {
      id: '8',
      name: 'Caramel Corn Supreme',
      description: 'Sweet corn kernels glazed with smooth golden caramel',
      price: 'RM 9.90',
      badge: 'Signature Dessert',
      category: 'dessert',
      image: null
    }
  ]);

  const filteredItems = menuItems.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    const price = parseFloat(item.price.replace('RM ', ''));
    if (price > filters.priceRange) return false;
    return true;
  });

  const handleImageUpload = (itemId: string, imageUrl: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, image: imageUrl } : item
    ));
  };

  const startEdit = (item: MenuItem) => {
    setEditingItem(item.id);
    setEditForm(item);
  };

  const saveEdit = () => {
    if (editingItem && editForm) {
      setMenuItems(prev => prev.map(item => 
        item.id === editingItem ? { ...item, ...editForm } as MenuItem : item
      ));
      setEditingItem(null);
      setEditForm({});
      
      // Simpan ke database/Firestore di sini
      saveMenuItemToDatabase(editingItem, editForm);
    }
  };

  // Fungsi untuk simpan ke Firestore (optional)
  const saveMenuItemToDatabase = async (itemId: string, updates: Partial<MenuItem>) => {
    // Di sini anda boleh add code untuk simpan ke Firestore
    console.log('Saving to database:', { itemId, updates });
  };

  return (
    <section className="mb-16" id="menu">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold neon-text">
          Our Gourmet Corn Menu
        </h1>
        {isAdmin && (
          <button className="bg-green-400 hover:bg-green-300 text-black px-4 py-2 rounded-lg font-semibold transition-colors">
            <span className="material-icons text-base mr-2">add</span>
            Tambah Item Baru
          </button>
        )}
      </div>
      
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
              {editingItem === item.id ? (
                <div className="p-5">
                  <FirebaseImageUpload
                    onImageUpload={(url: string) => handleImageUpload(item.id, url)}
                    currentImage={editForm.image || undefined}
                    className="mb-4"
                    folder="menu-images"
                  />
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-3 text-white placeholder-gray-500"
                      placeholder="Nama item"
                    />
                    
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-3 text-white placeholder-gray-500"
                      placeholder="Deskripsi"
                      rows={3}
                    />
                    
                    <input
                      type="text"
                      value={editForm.price || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-3 text-white placeholder-gray-500"
                      placeholder="Harga (contoh: RM 7.90)"
                    />
                    
                    <select
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-3 text-white"
                    >
                      <option value="">Pilih kategori</option>
                      <option value="classic">Classic</option>
                      <option value="spicy">Spicy</option>
                      <option value="dessert">Sweet & Dessert</option>
                      <option value="cheese">Cheese Lovers</option>
                      <option value="traditional">Malaysian Traditional</option>
                      <option value="premium">Premium</option>
                    </select>
                    
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={saveEdit}
                        className="flex-1 bg-green-400 hover:bg-green-300 text-black py-3 rounded-lg font-semibold transition-colors"
                      >
                        <span className="material-icons text-base mr-2">save</span>
                        Simpan
                      </button>
                      <button 
                        onClick={() => setEditingItem(null)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                      >
                        <span className="material-icons text-base mr-2">cancel</span>
                        Batal
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="aspect-video bg-[#0a0a0a] grid place-items-center overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center">
                        <span className="material-icons text-4xl text-gray-600 mb-2">image</span>
                        <p className="text-[var(--neutral-500)] text-sm">Tiada Gambar</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-white">{item.name}</h3>
                      {item.badge && (
                        <span className="text-xs px-2 py-1 rounded-full bg-opacity-20 neon-bg neon-text">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[var(--neutral-400)] text-sm mb-4">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-semibold neon-text text-lg">{item.price}</span>
                      
                      <div className="flex gap-2">
                        {isAdmin && (
                          <button 
                            onClick={() => startEdit(item)}
                            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                            title="Edit item"
                          >
                            <span className="material-icons text-base">edit</span>
                          </button>
                        )}
                        
                        <button 
                          className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 neon-bg text-black transition-all transform hover:scale-105"
                          onClick={() => addToCart(item)}
                        >
                          <span className="material-icons text-base">shopping_cart</span>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
