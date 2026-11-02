import React from 'react';
import { ShoppingBag, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CONFIG } from '../config';

export const Navbar = ({ onOpenSheetConfig }) => {
  const { totalItems, openCart, orderHistory, openOrderHistory } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      {/* Top micro-bar */}
      <div className="bg-black text-white text-[11px] uppercase tracking-widest py-1.5 px-4 text-center font-mono flex items-center justify-center gap-4 border-b border-neutral-900">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          ACCRA STUDIO • FREE SAME-DAY DISPATCH WITHIN GREATER ACCRA
        </span>
        <span className="hidden md:inline text-neutral-500">|</span>
        <span className="hidden md:inline text-neutral-300">
          STRICT CONCIERGE VIA WHATSAPP
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="group flex flex-col items-start focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-ultra uppercase text-black font-mono">
              {CONFIG.STORE_NAME}
            </span>
            <span className="text-[9px] tracking-widest text-neutral-500 uppercase -mt-1 font-mono">
              DIRECT ATELIER • {CONFIG.STORE_CITY}
            </span>
          </a>

          {/* Currency indicator pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 border border-neutral-300 text-[11px] font-mono text-neutral-700 uppercase">
            <span className="font-semibold text-black">GH₵</span>
            <span className="text-neutral-400">/</span>
            <span>GHS</span>
          </div>
        </div>

        {/* Navigation links & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="#mockups-section"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-widest text-neutral-700 hover:text-black border border-transparent hover:border-black transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Pass</span>
          </a>

          {/* Past Orders button */}
          <button
            onClick={openOrderHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-widest text-neutral-700 hover:text-black border border-neutral-200 hover:border-black transition-colors relative"
            title="View Order History"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden md:inline">My Orders</span>
            {orderHistory.length > 0 && (
              <span className="inline-flex items-center justify-center bg-black text-white text-[10px] w-4 h-4 font-mono font-bold">
                {orderHistory.length}
              </span>
            )}
          </button>

          {/* Google Sheets CMS Config (for store owner / testing) */}
          <button
            onClick={onOpenSheetConfig}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-black border border-neutral-200 hover:border-black transition-colors"
            title="Configure Google Sheets CSV"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CMS Sheet</span>
          </button>

          {/* Slide-out Cart Trigger */}
          <button
            onClick={openCart}
            aria-label="Open Shopping Bag"
            className="flex items-center gap-2 bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-150"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-bold border-l border-neutral-700 pl-2">
              [{totalItems}]
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
