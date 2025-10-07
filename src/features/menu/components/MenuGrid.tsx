import { MenuItem } from '../types/menu.types';
import { MenuCard } from './MenuCard';

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export const MenuGrid = ({ items, onAddToCart }: MenuGridProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🌽</div>
        <h3 className="text-xl font-semibold mb-2">No items found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
