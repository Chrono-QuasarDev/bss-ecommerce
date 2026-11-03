import React from 'react';
import { ProductCard } from './ProductCard';
import { AlertCircle, RefreshCw, Sparkles, FilterX, Loader2, RotateCcw } from 'lucide-react';

export const ProductGrid = ({
  products,
  loading,
  error,
  onRetry,
  activeCategory,
  searchQuery,
  onClearSearch,
  onResetFilters,
  onQuickView,
}) => {
  // 1. Deliberate, high-contrast loading state
  if (loading) {
    return (
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Visible deliberate loading status banner */}
        <div className="glass-panel rounded-2xl p-6 border border-white/15 bg-white/[0.04] mb-8 text-center flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-white">
            SYNCING COLLECTION WITH ATELIER GOOGLE SHEETS...
          </span>
        </div>

        {/* High-contrast skeleton cards with visible borders and structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="glass-panel rounded-2xl overflow-hidden border border-white/20 bg-white/[0.04] animate-pulse"
            >
              <div className="aspect-[3/4] bg-white/[0.08] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <div className="p-5 space-y-3">
                <div className="h-3 bg-white/20 rounded-full w-1/3" />
                <div className="h-5 bg-white/25 rounded-full w-3/4" />
                <div className="h-3 bg-white/15 rounded-full w-1/2" />
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <div className="h-6 bg-white/25 rounded-full w-24" />
                  <div className="h-9 bg-white/30 rounded-full w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-14 sm:pt-8 sm:pb-20">
      
      {/* Non-blocking sync error banner if Google Sheets sync failed but cached catalog is shown */}
      {error && (
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-amber-500/[0.08] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <div className="font-heading font-bold text-white text-xs sm:text-sm tracking-wide">
                GOOGLE SHEETS CMS SYNC NOTICE
              </div>
              <div className="text-xs text-neutral-300 font-sans leading-relaxed">
                Could not connect to live sheet. Displaying the atelier's cached local catalog.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-amber-200 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-glow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Sync</span>
          </button>
        </div>
      )}

      {/* 2. Empty Filter / Search State with Clear Actionable Recovery */}
      {products.length === 0 ? (
        <div className="py-16 sm:py-24 text-center">
          <div className="max-w-md mx-auto glass-panel rounded-3xl p-8 sm:p-10 border border-white/15 space-y-5 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-white/10 flex items-center justify-center text-amber-300 border border-white/15">
              <FilterX className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-heading text-xl font-bold uppercase text-white tracking-wide">
                NO GARMENTS FOUND
              </h3>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {searchQuery
                  ? `No pieces found matching "${searchQuery}" in ${activeCategory}.`
                  : `No pieces currently found under category "${activeCategory}".`}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-amber-200 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-glow hover:scale-105"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters & Show All</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Products Grid with Accurate Count Agreement */
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] mb-6 sm:mb-8 font-mono text-xs gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="uppercase tracking-[0.16em] text-neutral-300">
                SHOWING: <span className="text-white font-bold">{activeCategory}</span>
                {searchQuery && (
                  <span className="text-amber-300"> (MATCHING "{searchQuery}")</span>
                )}
                {' '}— <span className="text-white font-bold">{products.length}</span> {products.length === 1 ? 'PIECE' : 'PIECES'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-neutral-400 text-xs">
              {searchQuery && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="text-amber-300 hover:text-white underline text-xs font-mono transition-colors"
                >
                  Clear search
                </button>
              )}
              <span className="hidden md:inline uppercase tracking-widest text-[11px] text-neutral-400">
                CEDIS DIRECT VIA WHATSAPP
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
};
