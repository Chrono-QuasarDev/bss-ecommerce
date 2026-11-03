import React from 'react';
import { ShoppingBag, Clock, Sparkles, Search, Compass, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CONFIG } from '../config';

export const Navbar = ({ onOpenSheetConfig, onOpenSearch }) => {
  const { totalItems, openCart, orderHistory, openOrderHistory } = useCart();

  return (
    <>
      {/* Editorial Announcement Bar (Scrolls naturally with page so mobile viewport is never clipped) */}
      <div className="bg-[#050507] text-neutral-300 text-xs uppercase tracking-[0.18em] py-2.5 px-4 text-center font-mono flex items-center justify-center gap-3 sm:gap-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white font-medium">ACCRA ATELIER DIRECT</span>
        </div>
        <span className="hidden sm:inline text-neutral-600">✦</span>
        <span className="hidden sm:inline text-neutral-300">FREE SAME-DAY DISPATCH WITHIN GREATER ACCRA</span>
        <span className="hidden md:inline text-neutral-600">✦</span>
        <span className="hidden md:inline text-amber-300">WHATSAPP DIRECT CONCIERGE</span>
      </div>

      {/* Main Glass Navigation Bar (Sticky top-0: h-16 on mobile, h-20 on desktop) */}
      <header className="sticky top-0 z-40 w-full bg-[#09090c]/90 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="group flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-amber-300/70 rounded-lg p-1 -m-1"
              aria-label={`${CONFIG.STORE_NAME} - Home`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-[0.24em] uppercase text-white font-heading group-hover:text-amber-200 transition-colors duration-300">
                  {CONFIG.STORE_NAME}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 border border-white/20 text-neutral-200 bg-white/[0.06] rounded-sm hidden sm:inline">
                  {CONFIG.STORE_CITY.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-[0.28em] text-neutral-400 uppercase -mt-0.5">
                HAUTE MINIMALISM • {CONFIG.CURRENCY_CODE}
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs tracking-wider" aria-label="Main Navigation">
            <a
              href="#catalog-section"
              className="px-4 py-2 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 hover:bg-white/[0.06] rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300/70"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>COLLECTION</span>
            </a>

            <a
              href="#mockups-section"
              className="px-4 py-2 text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5 hover:bg-amber-400/[0.1] rounded-full border border-amber-400/25 focus:outline-none focus:ring-2 focus:ring-amber-300/70"
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
                className="p-2.5 text-neutral-300 hover:text-white hover:bg-white/[0.08] rounded-full border border-transparent hover:border-white/15 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300/70"
                title="Search garments"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* My Orders History Button */}
            <button
              onClick={openOrderHistory}
              aria-label={`Order History (${orderHistory.length} orders)`}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 text-xs font-mono tracking-widest text-neutral-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300/70"
              title="Track previous orders"
            >
              <Clock className="w-3.5 h-3.5 text-amber-300" />
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
              aria-label="Configure Google Sheets CMS"
              className="hidden md:flex p-2.5 text-neutral-400 hover:text-white hover:bg-white/[0.08] rounded-full border border-transparent hover:border-white/15 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300/70"
              title="Configure Google Sheet CMS"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Slide-out Cart Trigger Button */}
            <button
              onClick={openCart}
              aria-label={`Shopping Bag (${totalItems} items)`}
              className="group relative flex items-center gap-2 sm:gap-2.5 bg-gradient-to-r from-neutral-100 to-white text-black hover:from-amber-200 hover:to-amber-100 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-mono uppercase tracking-[0.16em] font-bold rounded-full transition-all duration-300 shadow-glow-sm hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-300/70"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline">BAG</span>
              <span className="inline-flex items-center justify-center bg-black text-white px-2 py-0.5 rounded-full text-[10px] font-mono tracking-tight font-bold">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
