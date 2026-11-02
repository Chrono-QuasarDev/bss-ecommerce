import React from 'react';
import { MessageSquare, Shield, Sparkles, Clock, ArrowUp } from 'lucide-react';
import { CONFIG } from '../config';
import { useCart } from '../context/CartContext';

export const Footer = ({ onOpenSheetConfig }) => {
  const { openOrderHistory } = useCart();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200 bg-white text-black font-mono">
      {/* Top Banner */}
      <div className="border-b border-neutral-200 py-10 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black">
              <MessageSquare className="w-4 h-4" />
              <span>WHATSAPP-DRIVEN COMMERCE</span>
            </div>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              Order directly to the brand's private WhatsApp line. No passwords, no registration hurdles,
              zero checkout friction.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black">
              <Shield className="w-4 h-4" />
              <span>ZERO-DATABASE SERVERLESS</span>
            </div>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              Real-time inventory driven entirely by published Google Sheets. Order tracking dispatched to free
              webhooks. Deployed with zero hosting costs.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black">
              <Sparkles className="w-4 h-4" />
              <span>GHANAIAN CEDIS (GH₵)</span>
            </div>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              Formatted with native Ghanaian currency standards (`en-GH / GHS`). Direct settlement via MTN
              Mobile Money, Telecel Cash, or Bank Transfer.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="text-lg font-bold tracking-ultra uppercase text-black">
              {CONFIG.STORE_NAME}
            </div>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              Monochromatic design studio based in {CONFIG.STORE_CITY}, {CONFIG.STORE_COUNTRY}. Engineered for
              discerning aesthetics and serverless efficiency.
            </p>
            <div className="text-[10px] text-neutral-400">
              BUILD: VITE • REACT • TAILWIND CSS
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-2.5 text-xs">
            <div className="font-bold uppercase tracking-widest text-black">
              NAVIGATION
            </div>
            <ul className="space-y-2 text-neutral-600">
              <li>
                <a href="#catalog-section" className="hover:text-black transition-colors">
                  Full Ready-to-Wear Catalog
                </a>
              </li>
              <li>
                <a href="#mockups-section" className="hover:text-black transition-colors">
                  VIP Pending Slots & Prototypes
                </a>
              </li>
              <li>
                <button
                  onClick={openOrderHistory}
                  className="hover:text-black transition-colors flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  <span>My Local Order History</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge & Support */}
          <div className="space-y-2.5 text-xs">
            <div className="font-bold uppercase tracking-widest text-black">
              CONCIERGE
            </div>
            <ul className="space-y-2 text-neutral-600">
              <li>
                <a
                  href={`https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(
                    'Hello Atelier Noir, I have a general inquiry about your collection.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                >
                  WhatsApp: +{CONFIG.WHATSAPP_PHONE}
                </a>
              </li>
              <li>Accra Studio: Mon - Sat (09:00 - 18:00 GMT)</li>
              <li>Express Dispatch across Ghana</li>
            </ul>
          </div>

          {/* Configuration & Controls */}
          <div className="space-y-2.5 text-xs">
            <div className="font-bold uppercase tracking-widest text-black">
              MERCHANT CMS
            </div>
            <ul className="space-y-2 text-neutral-600">
              <li>
                <button
                  onClick={onOpenSheetConfig}
                  className="hover:text-black underline transition-colors"
                >
                  Connect Custom Google Sheet
                </button>
              </li>
              <li>Free Database: Webhook POST</li>
              <li>Static Host Ready (Vercel / Netlify)</li>
            </ul>
          </div>
        </div>

        {/* Bottom microbar */}
        <div className="pt-8 mt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} {CONFIG.STORE_NAME} ({CONFIG.STORE_CITY}, {CONFIG.STORE_COUNTRY}). ALL RIGHTS RESERVED.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-neutral-700 hover:text-black transition-colors uppercase tracking-wider"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
