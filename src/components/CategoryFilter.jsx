import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div
      id="catalog-section"
      className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3 transition-shadow"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Scroll left button (visible on larger screens or desktop) */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex items-center justify-center p-1.5 border border-neutral-200 hover:border-black text-neutral-500 hover:text-black transition-colors"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Horizontal scrollbar with category pills */}
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
                  className={`flex-shrink-0 px-4 py-2 text-xs font-mono uppercase tracking-widest border transition-all duration-150 flex items-center gap-2 ${
                    isActive
                      ? 'bg-black text-white border-black shadow-none'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-black hover:text-black'
                  }`}
                >
                  <span>{category}</span>
                  {typeof count === 'number' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 border ${
                        isActive
                          ? 'border-neutral-700 text-neutral-300'
                          : 'border-neutral-200 text-neutral-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll right button */}
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex items-center justify-center p-1.5 border border-neutral-200 hover:border-black text-neutral-500 hover:text-black transition-colors"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
