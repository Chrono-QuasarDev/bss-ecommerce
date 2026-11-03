import React from 'react';
import { ShoppingBag, Clock, Sparkles, Search, Compass, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CONFIG } from '../config';

export const Navbar = ({ onOpenSheetConfig, onOpenSearch }) => {
  const { totalItems, openCart, orderHistory, openOrderHistory } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Editorial Announcement Bar */}
      <div className="bg-[#050507] text-[#9ca3af] text-[10px] sm:text-[11px] uppercase tracking-[0.22em] py-2 px-4 text-center font-mono flex items-center justify-center gap-3 sm:gap-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white font-medium">ACCRA ATELIER DIRECT</span>
        </div>
        <span className="hidden sm:inline text-neutral-700">✦</span>
        <span className="hidden sm:inline text-neutral-300">SAME-DAY DISPATCH (GREATER ACCRA)</span>
        <span className="hidden md:inline text-neutral-700">✦</span>
        <span className="hidden md:inline text-amber-300/80">WHATSAPP DIRECT CONCIERGE</span>
      </div>

      {/* Main Glass Navigation Bar */}
      <div className="bg-[#09090c]/85 backdrop-blur-2xl border-b border-white/[0.08] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Identity with Haute-Couture Typography */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="group flex flex-col items-start focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-[0.28em] uppercase text-white font-heading group-hover:text-amber-200 transition-colors duration-300">
                  {CONFIG.STORE_NAME}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 border border-white/20 text-neutral-300 bg-white/[0.04] rounded-sm hidden sm:inline">
                  ACCRA
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-[0.3em] text-neutral-400 uppercase -mt-0.5">
                HAUTE MINIMALISM • GH₵
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs tracking-wider">
            <a
              href="#catalog-section"
              className="px-4 py-2 text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 hover:bg-white/[0.04] rounded-full"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>COLLECTION</span>
            </a>

            <a
              href="#mockups-section"
              className="px-4 py-2 text-amber-300/90 hover:text-amber-200 transition-colors flex items-center gap-1.5 hover:bg-amber-400/[0.08] rounded-full border border-amber-400/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>VIP VAULT</span>
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                aria-label="Search Collection"
                className="p-2.5 text-neutral-400 hover:text-white hover:bg-white/[0.06] rounded-full border border-transparent hover:border-white/10 transition-all"
                title="Search garments"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* My Orders History Button */}
            <button
              onClick={openOrderHistory}
              aria-label="Order History"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono tracking-widest text-neutral-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 rounded-full transition-all duration-200"
              title="Track previous orders"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">MY ORDERS</span>
              {orderHistory.length > 0 && (
                <span className="inline-flex items-center justify-center bg-white text-black text-[10px] w-4 h-4 rounded-full font-bold">
                  {orderHistory.length}
                </span>
              )}
            </button>

            {/* CMS Config Button for Client/Testing */}
            <button
              onClick={onOpenSheetConfig}
              aria-label="Google Sheets CMS"
              className="hidden md:flex p-2.5 text-neutral-400 hover:text-white hover:bg-white/[0.06] rounded-full border border-transparent hover:border-white/10 transition-all"
              title="Configure Google Sheet CMS"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Slide-out Cart Trigger Button with Glow Pill */}
            <button
              onClick={openCart}
              aria-label="Open Shopping Cart"
              className="group relative flex items-center gap-2.5 bg-gradient-to-r from-neutral-100 to-white text-black hover:from-amber-200 hover:to-amber-100 px-4 sm:px-5 py-2.5 text-xs font-mono uppercase tracking-[0.18em] font-bold rounded-full transition-all duration-300 shadow-glow-sm hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline">BAG</span>
              <span className="inline-flex items-center justify-center bg-black text-white px-2 py-0.5 rounded-full text-[10px] font-mono tracking-tight font-bold">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
