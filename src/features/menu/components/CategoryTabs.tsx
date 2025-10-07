import { useMenuFilters } from '../hooks/useMenuFilters';
import { MenuCategory } from '../types/menu.types';
import { getCategoryIcon } from '../utils/menuHelpers';

const categories: Array<{ value: MenuCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All Items' },
  { value: 'appetizers', label: 'Appetizers' },
  { value: 'mains', label: 'Main Courses' },
  { value: 'sides', label: 'Sides' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'beverages', label: 'Beverages' },
];

export const CategoryTabs = () => {
  const { filters, setCategory } = useMenuFilters();

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = filters.category === category.value;
        return (
          <button
            key={category.value}
            onClick={() => setCategory(category.value)}
            className={`
              px-4 py-2 rounded-xl font-medium transition-all duration-base
              ${isActive
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            {category.value !== 'all' && (
              <span className="mr-2">{getCategoryIcon(category.value as MenuCategory)}</span>
            )}
            {category.label}
          </button>
        );
      })}
    </div>
  );
};
