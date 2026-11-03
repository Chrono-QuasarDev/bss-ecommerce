import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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
      className="sticky top-20 z-30 bg-[#09090c]/90 backdrop-blur-2xl border-b border-white/[0.08] py-4 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Top Controls Bar: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Quick Real-Time Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search garments, fabrics, categories..."
              className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-[#131317] border border-white/10 focus:border-white/30 text-white placeholder-neutral-500 rounded-full pl-10 pr-4 py-2 text-xs font-mono tracking-wide focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto font-mono text-xs">
            <span className="text-neutral-500 hidden sm:inline flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <ArrowUpDown className="w-3 h-3" />
              SORT:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white/[0.04] border border-white/10 hover:border-white/25 text-neutral-300 rounded-full px-3.5 py-2 text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-white/40 cursor-pointer"
            >
              <option value="featured" className="bg-[#101014] text-white">Featured</option>
              <option value="price-asc" className="bg-[#101014] text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-[#101014] text-white">Price: High to Low</option>
              <option value="name-asc" className="bg-[#101014] text-white">Title: A-Z</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex items-center justify-center p-2 rounded-full border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] transition-all"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              const count = categoryCounts[category];

              return (
                <button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.16em] border transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-black border-white shadow-glow-sm font-bold scale-[1.02]'
                      : 'bg-white/[0.03] text-neutral-400 border-white/10 hover:border-white/25 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{category}</span>
                  {typeof count === 'number' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-black text-white font-bold'
                          : 'bg-white/10 text-neutral-400'
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
            onClick={() => scroll('right')}
            className="hidden sm:flex items-center justify-center p-2 rounded-full border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] transition-all"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
