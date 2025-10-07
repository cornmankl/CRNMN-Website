import { useMenuFilters } from '../hooks/useMenuFilters';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export const MenuFilters = () => {
  const {
    filters,
    setSearchQuery,
    toggleInStockOnly,
    setSortBy,
    resetFilters,
  } = useMenuFilters();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search menu items..."
          value={filters.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="input-primary text-sm px-3 py-2 rounded-lg"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
          <option value="newest">Sort by Newest</option>
        </select>

        {/* In Stock Only */}
        <Button
          variant={filters.inStockOnly ? 'default' : 'outline'}
          size="sm"
          onClick={toggleInStockOnly}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          In Stock Only
        </Button>

        {/* Reset */}
        {(filters.searchQuery || filters.inStockOnly || filters.category !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
          >
            <X className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};
