'use client';

import { X } from 'lucide-react';

export type FilterState = {
  priceRange: [number, number];
  categories: string[];
  roomTypes: string[];
  colors: string[];
  sortBy: string;
};

interface FilterSidebarProps {
  isOpen?: boolean;
  isMobile?: boolean;
  filters: FilterState;
  onClose?: () => void;
  onUpdateFilters: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  minPrice: number;
  maxPrice: number;
  categories: string[];
  colors: Array<{ name: string; value: string; border?: boolean }>;
  roomTypes: string[];
}

const ROOM_TYPES = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Outdoor'];

export default function FilterSidebar({
  isOpen,
  isMobile,
  filters,
  onClose,
  onUpdateFilters,
  onClearFilters,
  minPrice,
  maxPrice,
  categories,
  colors,
  roomTypes,
}: FilterSidebarProps) {
  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.roomTypes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] !== minPrice ||
    filters.priceRange[1] !== maxPrice;

  const filterContent = (
    <div className="space-y-6">
      {/* Sort By */}
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-[#2e2e2e] mb-3">Sort By</h3>
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => onUpdateFilters({ sortBy: e.target.value })}
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 pr-8 bg-white text-sm text-[#2e2e2e] focus:outline-none focus:border-[#d96857] transition-colors cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#2e2e2e]/50">
            ▼
          </div>
        </div>
      </div>

      {/* Room Types */}
      <div>
        <h3 className="font-medium text-sm text-[#2e2e2e] mb-3">Room Type</h3>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map(room => (
            <button
              key={room}
              onClick={() => {
                onUpdateFilters({
                  roomTypes: filters.roomTypes.includes(room)
                    ? filters.roomTypes.filter(r => r !== room)
                    : [...filters.roomTypes, room]
                });
              }}
              className={`px-3 py-1.5 rounded-full text-sm ${
                filters.roomTypes.includes(room)
                  ? 'bg-[#d96857] text-white'
                  : 'bg-[#f2f0ed] text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {room}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium text-sm text-[#2e2e2e] mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={(e) => {
                  onUpdateFilters({
                    categories: e.target.checked
                      ? [...filters.categories, cat]
                      : filters.categories.filter(c => c !== cat)
                  });
                }}
                className="w-4 h-4 rounded border-zinc-300 text-[#d96857] focus:ring-[#d96857]"
              />
              <span className="ml-2 text-sm text-zinc-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-medium text-sm text-[#2e2e2e] mb-3">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <button
              key={color.value}
              onClick={() => {
                onUpdateFilters({
                  colors: filters.colors.includes(color.value)
                    ? filters.colors.filter(c => c !== color.value)
                    : [...filters.colors, color.value]
                });
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                color.border ? 'border border-zinc-200' : ''
              } ${
                filters.colors.includes(color.value)
                  ? 'ring-2 ring-[#d96857] ring-offset-2'
                  : ''
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {filters.colors.includes(color.value) && (
                <span className={`text-xs ${
                  ['#FFFFFF', '#F5F5DC'].includes(color.value) 
                    ? 'text-black' 
                    : 'text-white'
                }`}>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-sm text-[#2e2e2e] mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-1 block">Min Price</label>
              <input
                type="number"
                min={minPrice}
                max={filters.priceRange[1]}
                value={filters.priceRange[0]}
                onChange={(e) => {
                  const value = Math.max(minPrice, parseInt(e.target.value));
                  onUpdateFilters({
                    priceRange: [value, Math.max(value, filters.priceRange[1])]
                  });
                }}
                className="w-full border border-zinc-200 rounded-lg px-3 py-1.5 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-1 block">Max Price</label>
              <input
                type="number"
                min={filters.priceRange[0]}
                max={maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) => {
                  const value = Math.min(maxPrice, parseInt(e.target.value));
                  onUpdateFilters({
                    priceRange: [filters.priceRange[0], value]
                  });
                }}
                className="w-full border border-zinc-200 rounded-lg px-3 py-1.5 text-sm"
              />
            </div>
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={filters.priceRange[1]}
            onChange={(e) => {
              onUpdateFilters({
                priceRange: [filters.priceRange[0], parseInt(e.target.value)]
              });
            }}
            className="w-full accent-[#d96857]"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-[#d96857] hover:text-[#c85745] text-sm font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  if (isMobile) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden">
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-[#2e2e2e]">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {filterContent}
              </div>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={onClose}
                className="w-full bg-[#d96857] text-white py-2.5 rounded-lg font-medium hover:bg-[#c85745] transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 shrink-0 border-r min-h-[calc(100vh-61px)] bg-white">
      <div className="p-4 sticky top-[61px]">
        {filterContent}
      </div>
    </div>
  );
}