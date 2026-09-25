import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active filter states from URL or defaults
  const activeCategory = searchParams.get('category') || '';
  const activeColor = searchParams.get('color') || '';
  const activeSize = searchParams.get('size') || '';
  const activeSort = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('search') || '';
  const isNew = searchParams.get('isNew') || '';

  const colorOptions = [
    { name: 'Sage Green', hex: '#8A9A86' },
    { name: 'Warm Sand', hex: '#E5D9C5' },
    { name: 'Terracotta', hex: '#C88A75' },
    { name: 'Cream', hex: '#FAF8F5' },
    { name: 'Deep Charcoal', hex: '#2B2D2F' },
  ];

  const sizeOptions = ['S', 'M', 'L', 'XL'];

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [catData, prodData] = await Promise.all([
          api.getCategories(),
          api.getProducts({
            category: activeCategory,
            color: activeColor,
            size: activeSize,
            sort: activeSort,
            search: searchQuery,
            isNew: isNew,
          }),
        ]);
        setCategories(catData);
        setProducts(prodData.products);
      } catch (err) {
        console.error('Failed to load shop data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [activeCategory, activeColor, activeSize, activeSort, searchQuery, isNew]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = activeCategory || activeColor || activeSize || searchQuery || isNew;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-terracotta font-medium">
          The Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
          {activeCategory
            ? categories.find((c) => c.slug === activeCategory)?.name || 'Wardrobe'
            : 'All Pieces'}
        </h1>
        <p className="text-sm text-charcoal/70 font-sans leading-relaxed">
          {activeCategory
            ? categories.find((c) => c.slug === activeCategory)?.description
            : 'Explore mindful silhouettes, breathable fabrics, and effortless essentials made for comfort that looks good on you.'}
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-sand/40 mb-8">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-white border border-sand text-xs font-semibold uppercase tracking-wider"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-charcoal/60 font-medium">
            Showing <strong>{products.length}</strong> styles
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal/60 uppercase tracking-wider font-medium hidden sm:inline">
            Sort by:
          </span>
          <select
            value={activeSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-white border border-sand text-xs px-3 py-2 text-charcoal focus:outline-none focus:border-sage rounded-none"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Popularity & Rating</option>
          </select>
        </div>
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-charcoal/50 font-medium">Active filters:</span>
          {activeCategory && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-sand rounded-full">
              Category: {categories.find((c) => c.slug === activeCategory)?.name || activeCategory}
              <button onClick={() => updateFilter('category', '')}><X className="w-3 h-3 text-charcoal/50 hover:text-charcoal" /></button>
            </span>
          )}
          {activeColor && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-sand rounded-full">
              Color: {activeColor}
              <button onClick={() => updateFilter('color', '')}><X className="w-3 h-3 text-charcoal/50 hover:text-charcoal" /></button>
            </span>
          )}
          {activeSize && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-sand rounded-full">
              Size: {activeSize}
              <button onClick={() => updateFilter('size', '')}><X className="w-3 h-3 text-charcoal/50 hover:text-charcoal" /></button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-sand rounded-full">
              &quot;{searchQuery}&quot;
              <button onClick={() => updateFilter('search', '')}><X className="w-3 h-3 text-charcoal/50 hover:text-charcoal" /></button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-terracotta underline font-medium hover:text-charcoal pl-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-8 pr-4">
          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-charcoal uppercase">
              Categories
            </h4>
            <div className="space-y-1.5 text-sm">
              <button
                onClick={() => updateFilter('category', '')}
                className={`block text-left w-full transition-colors ${
                  !activeCategory ? 'font-semibold text-sage-dark' : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                All Pieces
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateFilter('category', c.slug)}
                  className={`block text-left w-full transition-colors flex items-center justify-between ${
                    activeCategory === c.slug
                      ? 'font-semibold text-sage-dark'
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  <span>{c.name}</span>
                  {c.product_count !== undefined && (
                    <span className="text-xs text-charcoal/40">({c.product_count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Filter */}
          <div className="space-y-3 border-t border-sand/40 pt-6">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-charcoal uppercase">
              Color Palette
            </h4>
            <div className="space-y-2">
              {colorOptions.map((col) => (
                <button
                  key={col.name}
                  onClick={() => updateFilter('color', activeColor === col.name ? '' : col.name)}
                  className={`flex items-center gap-2.5 w-full text-xs text-left p-1 rounded transition-colors ${
                    activeColor === col.name ? 'font-semibold text-charcoal' : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border ${
                      activeColor === col.name ? 'ring-2 ring-sage ring-offset-1' : 'border-sand'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sizes Filter */}
          <div className="space-y-3 border-t border-sand/40 pt-6">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-charcoal uppercase">
              Size
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {sizeOptions.map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateFilter('size', activeSize === sz ? '' : sz)}
                  className={`py-2 text-xs font-semibold text-center border transition-all ${
                    activeSize === sz
                      ? 'bg-charcoal text-cream border-charcoal'
                      : 'bg-white text-charcoal border-sand hover:border-charcoal'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="py-20 text-center text-charcoal/50 font-serif">
              Curating your wardrobe...
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white/60 p-8 border border-sand/40">
              <h3 className="font-serif text-2xl text-charcoal">No styles match your selection</h3>
              <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                Try loosening your filters or explore our complete seasonal catalogue.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-sage text-cream text-xs uppercase tracking-widest font-semibold hover:bg-sage-dark transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-Up Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-charcoal/40 backdrop-blur-sm md:hidden">
          <div className="w-full bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-sand/40 pb-4">
              <h3 className="font-serif text-lg font-medium text-charcoal">Filter Catalogue</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-charcoal/70" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-semibold text-charcoal/60 block">Category</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`px-3 py-1.5 text-xs rounded-full border ${!activeCategory ? 'bg-sage text-cream border-sage' : 'border-sand'}`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateFilter('category', c.slug)}
                    className={`px-3 py-1.5 text-xs rounded-full border ${activeCategory === c.slug ? 'bg-sage text-cream border-sage' : 'border-sand'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-semibold text-charcoal/60 block">Color</span>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => updateFilter('color', activeColor === c.name ? '' : c.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border ${activeColor === c.name ? 'border-charcoal font-semibold' : 'border-sand'}`}
                  >
                    <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-semibold text-charcoal/60 block">Size</span>
              <div className="grid grid-cols-4 gap-2">
                {sizeOptions.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateFilter('size', activeSize === sz ? '' : sz)}
                    className={`py-2 text-xs font-semibold text-center border ${activeSize === sz ? 'bg-charcoal text-cream' : 'border-sand'}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-sand/40 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 text-xs uppercase tracking-wider font-semibold border border-sand"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-sage text-cream text-xs uppercase tracking-wider font-semibold hover:bg-sage-dark"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
