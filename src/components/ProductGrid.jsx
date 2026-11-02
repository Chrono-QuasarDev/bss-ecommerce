import React from 'react';
import { ProductCard } from './ProductCard';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ProductGrid = ({
  products,
  loading,
  error,
  onRetry,
  activeCategory,
}) => {
  // Skeleton loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="border border-neutral-200 bg-white animate-pulse"
            >
              <div className="aspect-[3/4] bg-neutral-200 border-b border-neutral-200" />
              <div className="p-4 space-y-3">
                <div className="h-2.5 bg-neutral-200 w-1/3" />
                <div className="h-4 bg-neutral-200 w-3/4" />
                <div className="h-3 bg-neutral-200 w-1/2" />
                <div className="pt-3 border-t border-neutral-100 flex justify-between items-center">
                  <div className="h-5 bg-neutral-200 w-24" />
                  <div className="h-8 bg-neutral-200 w-28" />
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
      <div className="max-w-xl mx-auto my-16 px-4">
        <div className="p-8 border border-neutral-300 bg-neutral-50 text-center space-y-4 font-mono">
          <AlertCircle className="w-8 h-8 text-neutral-800 mx-auto" />
          <h3 className="text-base font-bold uppercase tracking-wider text-black">
            Google Sheets CMS Offline
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed font-sans">
            Could not fetch dynamic catalog from the provided Google Sheet CSV URL.
            Verify the sheet is published to the web as CSV and permits public read access.
          </p>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-white hover:text-black border border-black text-xs font-mono uppercase tracking-widest transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  // Empty filtered state
  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto border border-neutral-200 p-8 space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            NO PIECES FOUND IN CATEGORY:
          </p>
          <p className="font-mono text-lg font-bold uppercase text-black">
            "{activeCategory}"
          </p>
          <p className="text-xs text-neutral-500 font-sans">
            Try switching to "All" or another category in the horizontal filter above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200 mb-8 font-mono text-xs">
        <div className="uppercase tracking-widest text-neutral-500">
          SHOWING: <span className="text-black font-bold">{activeCategory}</span> ({products.length} PIECES)
        </div>
        <div className="text-neutral-400 hidden sm:block">
          PRICES IN GH₵ (GHS) • ACCRA CURATED
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
