'use client';

import React from 'react';
import { useDeferredValue, useMemo, useState } from 'react';
import { Sliders } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    categories: [],
    roomTypes: [],
    colors: [],
    sortBy: 'newest'
  });
  const deferredQuery = useDeferredValue(query);

  React.useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .select('*');
        if (error) {
          setError(error.message || 'Failed to fetch products');
          setProducts([]);
        } else {
          setProducts(data || []);
          if (typeof window !== 'undefined') {
            console.log('Fetched products:', data);
          }
        }
        setLoading(false);
    }
    fetchProducts();
  }, []);

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
      if (typeof p.mrp === 'number') {
        min = Math.min(min, p.mrp);
        max = Math.max(max, p.mrp);
      }
    });
      // (Removed redundant useEffect that was resetting filters)
    if (min === Infinity || max === -Infinity) return [0, 100000];
    return [Math.floor(min), Math.ceil(max)] as [number, number];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    return products
      .filter((p) => {
        const matchQuery = !q || 
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q);
        const matchCategories = filters.categories.length === 0 || 
          (p.category && filters.categories.includes(p.category));
        // No roomType in schema, skip
        // Show product if price is missing, or if price is in range
        const hasPrice = typeof p.mrp === 'number' && !isNaN(p.mrp);
        const matchPrice = !hasPrice || (p.mrp >= filters.priceRange[0] && p.mrp <= filters.priceRange[1]);
        // No color filter for now
        return matchQuery && matchCategories && matchPrice;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return ((a.selling_price as number) ?? 0) - ((b.selling_price as number) ?? 0);
          case 'price-high':
            return ((b.selling_price as number) ?? 0) - ((a.selling_price as number) ?? 0);
          case 'newest':
          default:
            return (b.created_at || '').localeCompare(a.created_at || '');
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

  // Debug output: show products at the top of the page
  // (Make sure there are no stray curly braces or misplaced code above this line)
  return (
    <div className="min-h-screen bg-white">
      {/* Removed pale yellow loading/error bar */}
      {/* Debug output removed */}
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
              {loading ? (
                <div className="text-center py-12">Loading products...</div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => {
                      // Handle multiple images: split by comma, JSON, or fallback
                      let images: string[] = [];
                      if (product.image_url) {
                        try {
                          let urlString = product.image_url;
                          // Remove stray 'd' at the start if present
                          if (urlString.startsWith('d ')) urlString = urlString.slice(2);
                          if (urlString.startsWith('d')) urlString = urlString.slice(1);
                          // Replace low-res thumbnail with higher-res
                          urlString = urlString.replace(/-100x100(\\.jpg|\\.jpeg|\\.png)/gi, '-800x800$1');
                          if (urlString.trim().startsWith('[')) {
                            images = JSON.parse(urlString);
                          } else if (urlString.includes('\n')) {
                            images = urlString.split('\n').map((s: string) => s.trim()).filter(Boolean);
                          } else if (urlString.includes(',')) {
                            images = urlString.split(',').map((s: string) => s.trim()).filter(Boolean);
                          } else {
                            images = [urlString];
                          }
                        } catch {
                          images = [product.image_url];
                        }
                      }
                      // Only show one rupee symbol if not already present
                      // Pass only numeric price to ProductCard, let it handle rupee symbol
                      return (
                        <ProductCard key={product.id} product={{
                          id: product.id,
                          title: product.name,
                          imageUrl: images[0] || '',
                          price: typeof product.selling_price === 'number' ? product.selling_price : undefined,
                          category: product.category,
                          brand: product.brand,
                          mrp: typeof product.mrp === 'number' ? product.mrp : undefined
                        }} />
                      );
                    })}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}