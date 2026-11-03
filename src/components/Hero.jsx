import React from 'react';
import { ArrowDownRight, Sparkles, Shield, Send, ArrowRight } from 'lucide-react';
import { CONFIG } from '../config';
import { formatGHS } from '../utils/formatters';

export const Hero = ({ productCount, sheetStatus, onFeaturedClick }) => {
  const featuredPiece = CONFIG.FALLBACK_PRODUCTS[1]; // Obsidian Hooded Parka

  return (
    <section className="relative overflow-hidden bg-mesh-dark border-b border-white/[0.08] pt-8 pb-16 sm:py-24">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-white/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Haute Couture Manifesto */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Editorial Capsule Metadata */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-neutral-300 uppercase">
                CAPSULE IV // MONOLITH SERIES
              </span>
              <span className="text-neutral-600">•</span>
              <span className="font-mono text-[10px] sm:text-xs text-amber-300/90 tracking-widest uppercase">
                {productCount} MASTERWORKS
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase font-heading text-white leading-[1.02]">
                SCULPTED FOR <br />
                <span className="text-metallic italic font-display font-normal">THE DISCERNING</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 font-sans max-w-xl leading-relaxed pt-2">
                Haute-couture silhouettes and tactical streetwear engineered in Accra, Ghana.
                Zero corporate markups. Zero checkout friction. Real-time Google Sheets inventory
                curated directly to your WhatsApp concierge.
              </p>
            </div>

            {/* Quick Actions & Highlights */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalog-section"
                className="group flex items-center gap-3 px-7 py-4 bg-white text-black hover:bg-amber-200 rounded-full font-mono text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 shadow-glow hover:scale-105 active:scale-95"
              >
                <span>EXPLORE CAPSULE</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#mockups-section"
                className="group flex items-center gap-2.5 px-6 py-4 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/15 hover:border-amber-400/50 rounded-full font-mono text-xs font-medium tracking-[0.16em] uppercase transition-all duration-300 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>ENTER VIP VAULT</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-white/[0.08] grid grid-cols-3 gap-4 font-mono text-[11px] text-neutral-400">
              <div className="flex flex-col space-y-1">
                <span className="text-white font-bold tracking-wider">LOCAL ACCRA ATELIER</span>
                <span className="text-[10px] text-neutral-500">Hand-finished in Osu</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-white font-bold tracking-wider">GHANAIAN CEDIS (GH₵)</span>
                <span className="text-[10px] text-neutral-500">MoMo / Card / Cash</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-white font-bold tracking-wider">CONCIERGE DIRECT</span>
                <span className="text-[10px] text-neutral-500">WhatsApp 1-on-1 support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Haute Editorial Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glowing backplate */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-amber-500/10 to-transparent rounded-3xl blur-2xl -z-10" />

              {/* Glass Hero Card */}
              <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-white/15 shadow-2xl relative overflow-hidden group">
                
                {/* Image showcase */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900">
                  <img
                    src={featuredPiece.image}
                    alt={featuredPiece.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-black/75 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] tracking-widest uppercase rounded-full">
                      FEATURED ARCHIVE
                    </span>
                    <span className="px-3 py-1 bg-amber-400 text-black font-mono text-[10px] font-bold tracking-wider uppercase rounded-full shadow-lg">
                      ONLY {featuredPiece.stock} PIECES LEFT
                    </span>
                  </div>

                  {/* Bottom glass metadata strip */}
                  <div className="absolute inset-x-3 bottom-3 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-[10px] tracking-widest text-amber-300 uppercase">
                        {featuredPiece.category}
                      </div>
                      <div className="font-heading text-sm sm:text-base font-bold text-white uppercase line-clamp-1">
                        {featuredPiece.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm sm:text-base font-bold text-white">
                        {formatGHS(featuredPiece.price)}
                      </div>
                      <div className="text-[9px] font-mono text-neutral-400 uppercase">
                        GH₵ CEDIS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-card ticker info */}
                <div className="mt-4 flex items-center justify-between px-2 text-[11px] font-mono text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>VERIFIED ATELIER SPEC</span>
                  </div>
                  <a
                    href="#catalog-section"
                    className="text-white hover:text-amber-300 transition-colors flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>View in Capsule</span>
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
