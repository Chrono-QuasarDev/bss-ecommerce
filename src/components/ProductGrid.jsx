import React from 'react';
import { ProductCard } from './ProductCard';
import { AlertCircle, RefreshCw, Sparkles, FilterX } from 'lucide-react';

export const ProductGrid = ({
  products,
  loading,
  error,
  onRetry,
  activeCategory,
  onQuickView,
}) => {
  // Skeleton loading cards
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="glass-panel rounded-2xl overflow-hidden border border-white/5 animate-pulse"
            >
              <div className="aspect-[3/4] bg-white/[0.03]" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-white/[0.05] rounded-full w-1/3" />
                <div className="h-5 bg-white/[0.08] rounded-full w-3/4" />
                <div className="h-3 bg-white/[0.04] rounded-full w-1/2" />
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="h-6 bg-white/[0.08] rounded-full w-24" />
                  <div className="h-9 bg-white/[0.1] rounded-full w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="max-w-lg mx-auto my-20 px-4">
        <div className="glass-panel rounded-3xl p-8 border border-white/10 text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wide">
              CMS Sync Interrupted
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Could not retrieve dynamic inventory from Google Sheets.
              Ensure the sheet is published to the web as CSV with public read access.
            </p>
          </div>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-amber-200 rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-glow hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  // Empty filtered state
  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-md mx-auto glass-panel rounded-3xl p-10 border border-white/10 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center text-neutral-400">
            <FilterX className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              NO GARMENTS FOUND IN:
            </p>
            <p className="font-heading text-xl font-bold uppercase text-white">
              "{activeCategory}"
            </p>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Try adjusting your search terms or select "All" from the categories above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Capsule Subhead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] mb-8 sm:mb-12 font-mono text-xs gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="uppercase tracking-[0.2em] text-neutral-400">
            SHOWING: <span className="text-white font-bold">{activeCategory}</span> ({products.length} MASTERWORKS)
          </span>
        </div>
        <div className="text-neutral-400 uppercase tracking-widest text-[11px] flex items-center gap-2">
          <span>PRICES SETTLED IN GH₵ (GHS)</span>
          <span className="text-neutral-600">•</span>
          <span className="text-emerald-400">INSTANT DISPATCH</span>
        </div>
      </div>

      {/* Modern High-End Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
};
