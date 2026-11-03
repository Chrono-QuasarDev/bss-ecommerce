import { ArrowDownRight, ArrowRight, Shield, Sparkles } from "lucide-react";
import { CONFIG } from "../config";
import { formatGHS } from "../utils/formatters";

export const Hero = ({ productCount, sheetStatus, featuredProduct, onFeaturedClick }) => {
  const featuredPiece = featuredProduct || null;

  return (
    <section className="relative overflow-hidden bg-mesh-dark border-b border-white/[0.08] pt-8 pb-14 sm:py-20">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-white/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Brand Manifesto */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Editorial Capsule Metadata */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-xs tracking-[0.18em] text-neutral-200 uppercase">
                CAPSULE IV // MONOLITH SERIES
              </span>
              <span className="text-neutral-500">•</span>
              <span className="font-mono text-xs text-amber-300 font-semibold tracking-wider uppercase">
                {productCount} PIECES
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase font-heading text-white leading-[1.05]">
                {CONFIG.STORE_TAGLINE.split(", ")[0]}, <br />
                <span className="text-metallic italic font-display font-normal">
                  {CONFIG.STORE_TAGLINE.split(", ")[1]}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 font-sans max-w-xl leading-relaxed pt-1">
                Streetwear for a generation with its own point of view. This is{" "}
                {CONFIG.STORE_SUBTITLE}.
              </p>
            </div>

            {/* Quick Actions & Highlights */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#catalog-section"
                className="group flex items-center gap-3 px-6 sm:px-7 py-3.5 sm:py-4 bg-white text-black hover:bg-amber-200 rounded-full font-mono text-xs font-bold tracking-[0.16em] uppercase transition-all duration-300 shadow-glow hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <span>EXPLORE CAPSULE</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#mockups-section"
                className="group flex items-center gap-2.5 px-5 sm:px-6 py-3.5 sm:py-4 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/20 hover:border-amber-400/50 rounded-full font-mono text-xs font-medium tracking-[0.14em] uppercase transition-all duration-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>ENTER VIP VAULT</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-neutral-300">
              <div className="flex flex-col space-y-0.5">
                <span className="text-white font-bold tracking-wider">
                  B.S.S
                </span>
                <span className="text-xs text-neutral-400 font-sans">
                  Bofoo Style Spectrum
                </span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-white font-bold tracking-wider">
                  YOUTH STREETWEAR
                </span>
                <span className="text-xs text-neutral-400 font-sans">
                  Style your own way
                </span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-white font-bold tracking-wider">
                  {CONFIG.STORE_TAGLINE.toUpperCase()}
                </span>
                <span className="text-xs text-neutral-400 font-sans">
                  Local Soul. Global Vision.
                </span>
              </div>
            </div>
          </div>

          {/* Featured card uses only live catalog data when the Apps Script API is configured. */}
          {featuredPiece && (
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] lg:max-w-[480px]">
              {/* Glowing backplate */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-amber-500/10 to-transparent rounded-3xl blur-2xl -z-10" />

              {/* Glass Hero Card */}
              <div
                onClick={onFeaturedClick}
                className="glass-panel rounded-3xl p-4 sm:p-5 border border-white/15 shadow-2xl relative overflow-hidden group cursor-pointer transition-all duration-300 hover:border-white/30 hover:shadow-glow"
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && onFeaturedClick && onFeaturedClick()
                }
                aria-label={`Featured piece: ${featuredPiece.name}`}
              >
                {/* Image showcase */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900">
                  <img
                    src={featuredPiece.image}
                    alt={featuredPiece.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] tracking-wider uppercase rounded-full">
                      FEATURED ARCHIVE
                    </span>
                    {featuredPiece.stock && (
                      <span className="px-3 py-1 bg-amber-400 text-black font-mono text-[10px] font-bold tracking-wider uppercase rounded-full shadow-lg">
                        {featuredPiece.stock} AVAILABLE
                      </span>
                    )}
                  </div>

                  {/* Bottom glass metadata strip */}
                  <div className="absolute inset-x-3 bottom-3 p-4 rounded-xl bg-black/85 backdrop-blur-xl border border-white/15 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs tracking-wider text-amber-300 uppercase">
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
                      <div className="text-[10px] font-mono text-neutral-400 uppercase">
                        {CONFIG.CURRENCY_CODE}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-card ticker info */}
                <div className="mt-4 flex items-center justify-between px-2 text-xs font-mono text-neutral-300">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>CURATED SPECIFICATION</span>
                  </div>
                  <div className="text-white group-hover:text-amber-300 transition-colors flex items-center gap-1 uppercase tracking-wider text-xs font-bold">
                    <span>Inspect</span>
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
};
