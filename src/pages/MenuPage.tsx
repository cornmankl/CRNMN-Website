import { SEOHead } from '../components/SEO/SEOHead';
import { MenuCard, MenuFilters, CategoryTabs, MenuGrid } from '../features/menu';
import { useMenuData, useMenuFilters } from '../features/menu';
import { useCartStore } from '../store';
import { MenuItem } from '../features/menu/types/menu.types';

export default function MenuPage() {
  const { isLoading, error } = useMenuData();
  const { filteredItems } = useMenuFilters();
  const { addItem } = useCartStore();

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price.toString(),
      quantity: 1,
      image: item.image,
      description: item.description,
    });
  };

  return (
    <>
      <SEOHead
        title="Our Menu - Fresh Corn Dishes | CRNMN"
        description="Explore our delicious menu of corn-based dishes. From appetizers to desserts, discover premium quality corn meals."
        keywords="corn menu, corn dishes, corn appetizers, corn mains, corn desserts"
      />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient">
            Our Menu
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our delicious corn-based dishes, crafted with love and the freshest ingredients
          </p>
        </div>

        {/* Category Tabs */}
        <CategoryTabs />

        {/* Filters */}
        <MenuFilters />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading menu...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
            <p className="text-destructive font-medium">Error loading menu: {error.message}</p>
          </div>
        )}

        {/* Menu Grid */}
        {!isLoading && !error && (
          <MenuGrid items={filteredItems} onAddToCart={handleAddToCart} />
        )}

        {/* Stats */}
        {!isLoading && !error && filteredItems.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </>
  );
}
