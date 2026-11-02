import React from 'react';
import { ArrowDown, Radio, Sparkles } from 'lucide-react';
import { CONFIG } from '../config';

export const Hero = ({ productCount, sheetStatus }) => {
  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Main manifesto */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-neutral-600">
              <span className="flex items-center gap-1.5 px-2 py-0.5 border border-black bg-black text-white">
                EDITION 04
              </span>
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-black animate-pulse" />
                {sheetStatus === 'synced' ? 'LIVE GOOGLE SHEETS CMS' : 'ATELIER RESERVED CACHE'}
              </span>
              <span>•</span>
              <span>{productCount} ACTIVE RELEASES</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-black uppercase font-mono leading-[1.08]">
              MONOCHROMATIC ESSENTIALS.<br />
              <span className="font-bold underline decoration-1 underline-offset-8">ACCRA ATELIER DIRECT.</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl font-sans leading-relaxed pt-2">
              High-end minimalist apparel engineered with unyielding proportions. Zero server overhead,
              zero authentication friction. Published directly from Google Sheets and fulfilled instantly
              via private WhatsApp concierge across Ghana.
            </p>
          </div>

          {/* Quick anchor CTA cards */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 font-mono text-xs">
            <a
              href="#catalog-section"
              className="group flex items-center justify-between p-4 border border-neutral-300 hover:border-black transition-colors bg-neutral-50 hover:bg-black hover:text-white"
            >
              <div className="space-y-0.5">
                <div className="font-bold uppercase tracking-widest text-[11px]">
                  EXPLORE COLLECTION
                </div>
                <div className="text-[10px] text-neutral-500 group-hover:text-neutral-400">
                  Ready-to-wear pieces (GH₵)
                </div>
              </div>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
            </a>

            <a
              href="#mockups-section"
              className="group flex items-center justify-between p-4 border border-neutral-300 hover:border-black transition-colors bg-neutral-50 hover:bg-black hover:text-white"
            >
              <div className="space-y-0.5">
                <div className="font-bold uppercase tracking-widest text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  VIP PENDING SLOTS
                </div>
                <div className="text-[10px] text-neutral-500 group-hover:text-neutral-400">
                  Confidential FW26 CAD schematics
                </div>
              </div>
              <span className="text-[10px] font-bold border border-current px-1.5 py-0.5">
                PIN LOCKED
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
