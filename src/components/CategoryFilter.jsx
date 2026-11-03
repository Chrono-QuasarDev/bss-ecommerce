import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, X } from 'lucide-react';

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div
      id="catalog-section"
      className="sticky top-16 sm:top-20 z-30 bg-[#09090c]/95 backdrop-blur-2xl border-b border-white/[0.08] py-3.5 sm:py-4 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Top Controls Bar: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Quick Real-Time Search */}
          <div className="relative flex-1 max-w-md">
            <label htmlFor="catalog-search" className="sr-only">
              Search garments, fabrics, categories
            </label>
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="catalog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search garments, fabrics, categories..."
              aria-label="Search garments by name, category, or fabric"
              className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-[#131317] border border-white/15 focus:border-amber-300 text-white placeholder-neutral-400 rounded-full pl-10 pr-9 py-2 text-xs font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-amber-300/70 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search input"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-between sm:justify-end gap-2 font-mono text-xs">
            <label htmlFor="catalog-sort" className="text-neutral-400 flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-300" />
              <span>SORT:</span>
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort products by"
              className="bg-[#121216] border border-white/15 hover:border-white/30 text-neutral-200 rounded-full px-3.5 py-2 text-xs font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-300/70 focus:border-transparent cursor-pointer transition-all"
            >
              <option value="featured" className="bg-[#101014] text-white">Featured</option>
              <option value="price-asc" className="bg-[#101014] text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-[#101014] text-white">Price: High to Low</option>
              <option value="name-asc" className="bg-[#101014] text-white">Title: A-Z</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="flex items-center justify-between gap-2.5 pt-0.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden sm:flex items-center justify-center p-2 rounded-full border border-white/15 hover:border-white/35 text-neutral-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] transition-all focus:outline-none focus:ring-2 focus:ring-amber-300/70"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1 px-0.5"
            role="tablist"
            aria-label="Filter by category"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              const count = categoryCounts[category];

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectCategory(category)}
                  className={`flex-shrink-0 min-h-[36px] px-3.5 sm:px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.14em] border transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-300/70 ${
                    isActive
                      ? 'bg-white text-black border-white shadow-glow-sm font-bold scale-[1.02]'
                      : 'bg-white/[0.04] text-neutral-300 border-white/15 hover:border-white/30 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span>{category}</span>
                  {typeof count === 'number' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-black text-white font-bold'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden sm:flex items-center justify-center p-2 rounded-full border border-white/15 hover:border-white/35 text-neutral-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] transition-all focus:outline-none focus:ring-2 focus:ring-amber-300/70"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
