import {
  ArrowUp,
  Clock,
  MessageSquare,
  Send,
  Shield,
  Sparkles,
} from "lucide-react";
import { CONFIG } from "../config";
import { useCart } from "../context/CartContext";

export const Footer = () => {
  const { openOrderHistory } = useCart();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#050508] text-white font-mono relative overflow-hidden">
      {/* Editorial Value Pillars */}
      <div className="border-b border-white/[0.08] py-14 bg-white/[0.01]">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              B.S.S / BOFOO STYLE SPECTRUM
            </h4>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Explore streetwear built around self-expression and your own point
              of view.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              FIND YOUR STYLE
            </h4>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Browse the collection and make each look your own.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              LOCAL SOUL, GLOBAL VISION
            </h4>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Bofoo Style Spectrum. Streetwear with a point of view.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="text-2xl font-black tracking-[0.25em] uppercase text-white font-heading">
              {CONFIG.STORE_NAME}
            </div>
            <div className="text-xs text-neutral-300 font-mono">
              {CONFIG.STORE_SUBTITLE}
            </div>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              {CONFIG.STORE_TAGLINE}.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 text-xs">
            <div className="font-bold uppercase tracking-widest text-white font-heading">
              THE COLLECTION
            </div>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <a
                  href="#catalog-section"
                  className="hover:text-white transition-colors"
                >
                  Monolith Ready-to-Wear
                </a>
              </li>
              <li>
                <a
                  href="#mockups-section"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>VIP Vault & Prototypes</span>
                </a>
              </li>
              <li>
                <button
                  onClick={openOrderHistory}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>My Local Order History</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge & Support */}
          <div className="space-y-3 text-xs">
            <div className="font-bold uppercase tracking-widest text-white font-heading">
              CONTACT
            </div>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <a
                  href={`https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(
                    "Hello B.S.S, I would like to get in touch.",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp: +{CONFIG.WHATSAPP_PHONE}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} {CONFIG.STORE_NAME}. ALL RIGHTS
            RESERVED.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors uppercase tracking-wider font-bold"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
