'use client';

import React from 'react';
import { useDeferredValue, useMemo, useState } from 'react';
import { Sliders } from 'lucide-react';
import { demoProductsAll } from '@/lib/demoData';
import ProductCard from '@/components/ProductCard';
import FilterSidebar, { FilterState } from '@/components/FilterSidebar';

const COLORS = [
  { name: 'White', value: '#FFFFFF', border: true },
  { name: 'Beige', value: '#F5F5DC' },
  { name: 'Gray', value: '#808080' },
  { name: 'Black', value: '#000000' },
  { name: 'Brown', value: '#964B00' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#008000' },
];

const ROOM_TYPES = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Office',
  'Outdoor',
];

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState('');
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    categories: [],
    roomTypes: [],
    colors: [],
    sortBy: 'newest'
  });
  
  const deferredQuery = useDeferredValue(query);
  const products = demoProductsAll;

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [products]);

  // Price range
  const priceRange = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    products.forEach(p => {
      if (typeof p.price === 'number') {
        min = Math.min(min, p.price);
        max = Math.max(max, p.price);
      }
    });
    return [Math.floor(min), Math.ceil(max)] as [number, number];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    return products
      .filter((p) => {
        const matchQuery = !q || 
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q);
        
        const matchCategories = filters.categories.length === 0 || 
          (p.category && filters.categories.includes(p.category));
        
        const matchRoomTypes = filters.roomTypes.length === 0 ||
          (p.roomType && filters.roomTypes.includes(p.roomType));
        
        const matchPrice = typeof p.price === 'number' && 
          p.price >= filters.priceRange[0] && 
          p.price <= filters.priceRange[1];
        
        const matchColors = filters.colors.length === 0 ||
          (typeof p.color === 'string' && filters.colors.includes(p.color));

        return matchQuery && matchCategories && matchRoomTypes && matchPrice && matchColors;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return ((a.price as number) ?? 0) - ((b.price as number) ?? 0);
          case 'price-high':
            return ((b.price as number) ?? 0) - ((a.price as number) ?? 0);
          case 'rating':
            return ((b.rating ?? 0) - (a.rating ?? 0));
          case 'newest':
          default:
            return b.id.localeCompare(a.id);
        }
      });
  }, [products, filters, deferredQuery]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange,
      categories: [],
      roomTypes: [],
      colors: [],
      sortBy: 'newest'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="border-b bg-white sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-[#2e2e2e]">Products</h1>
              
              <div className="flex items-center gap-4">
                <div className="relative flex-1 min-w-[200px] max-w-md hidden md:block">
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-[#f2f0ed] border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d96857]/20"
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2e2e2e] bg-[#f2f0ed] rounded-full hover:bg-[#e8e6e3] transition"
                >
                  <Sliders className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onUpdateFilters={updateFilters}
              onClearFilters={clearFilters}
              minPrice={priceRange[0]}
              maxPrice={priceRange[1]}
              categories={categories}
              colors={COLORS}
              roomTypes={ROOM_TYPES}
            />
          </div>

          {/* Mobile Filter Sidebar */}
          <FilterSidebar
            isMobile
            isOpen={showFilters}
            filters={filters}
            onClose={() => setShowFilters(false)}
            onUpdateFilters={updateFilters}
            onClearFilters={clearFilters}
            minPrice={priceRange[0]}
            maxPrice={priceRange[1]}
            categories={categories}
            colors={COLORS}
            roomTypes={ROOM_TYPES}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Mobile Search */}
              <div className="mb-4 md:hidden">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-[#f2f0ed] border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d96857]/20"
                />
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-zinc-500">No products found matching your filters.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-[#d96857] hover:text-[#c85745] text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}