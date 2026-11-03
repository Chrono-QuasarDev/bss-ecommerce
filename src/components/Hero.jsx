import { ArrowDownRight, ArrowRight, Shield, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { formatGHS } from "../utils/formatters";

export const Hero = ({ productCount, featuredProduct, onFeaturedClick }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const featuredPiece = featuredProduct || null;

  useEffect(() => {
    setImageFailed(false);
  }, [featuredPiece?.id, featuredPiece?.image]);

  return (
    <section className="relative flex min-h-[calc(100svh-101px)] items-center overflow-hidden bg-mesh-dark border-b border-white/[0.08] py-10 sm:min-h-[calc(100svh-117px)] sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(212,175,55,0.08),transparent_42%)]" />
      <div className="relative mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] gap-8 lg:gap-12 xl:gap-16 items-center">
          <div className="min-w-0 space-y-6 sm:space-y-8">
            <div className="inline-flex max-w-full items-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md">
              <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
              <span className="truncate font-mono text-[10px] sm:text-xs tracking-[0.14em] text-neutral-200 uppercase">
                B.S.S COLLECTION
              </span>
              <span className="text-neutral-500">•</span>
              <span className="shrink-0 font-mono text-[10px] sm:text-xs text-amber-300 font-semibold tracking-wider uppercase">
                {productCount} {productCount === 1 ? "PIECE" : "PIECES"}
              </span>
            </div>

            <div className="space-y-3">
              <p className="font-mono text-xs sm:text-sm tracking-[0.2em] text-neutral-300 uppercase">
                {CONFIG.STORE_NAME} <span className="text-neutral-500">/</span>{" "}
                {CONFIG.STORE_SUBTITLE}
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase font-heading text-white leading-[1.05]">
                <span className="whitespace-nowrap">
                  {CONFIG.STORE_TAGLINE.split(", ")[0]},
                </span>{" "}
                <br />
                <span className="text-metallic italic font-display font-normal">
                  {CONFIG.STORE_TAGLINE.split(", ")[1]}
                </span>
              </h1>
              <p className="max-w-xl text-sm sm:text-base text-neutral-300 font-sans leading-relaxed pt-1">
                Streetwear for a generation with its own point of view.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#catalog-section"
                className="group inline-flex min-h-12 items-center gap-3 px-6 sm:px-7 py-3 bg-white text-black hover:bg-amber-200 rounded-full font-mono text-xs font-bold tracking-[0.14em] uppercase transition-all shadow-glow focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <span>Explore collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#mockups-section"
                className="inline-flex min-h-12 items-center gap-2.5 px-5 sm:px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/20 hover:border-amber-400/50 rounded-full font-mono text-xs tracking-[0.12em] uppercase transition-all focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Explore B.S.S</span>
              </a>
            </div>

            <div className="pt-5 sm:pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 font-mono text-xs">
              <div className="min-w-0">
                <span className="block text-white font-bold tracking-wider">
                  B.S.S
                </span>
                <span className="block text-neutral-400 font-sans">
                  Bofoo Style Spectrum
                </span>
              </div>
              <div className="min-w-0">
                <span className="block text-white font-bold tracking-wider">
                  YOUTH STREETWEAR
                </span>
                <span className="block text-neutral-400 font-sans">
                  Style your own way
                </span>
              </div>
              <div className="min-w-0">
                <span className="block text-white font-bold tracking-wider">
                  LOCAL SOUL
                </span>
                <span className="block text-neutral-400 font-sans">
                  Global vision
                </span>
              </div>
            </div>
          </div>

          {featuredPiece && (
            <div className="w-full min-w-0 flex justify-center lg:justify-end">
              <button
                type="button"
                onClick={onFeaturedClick}
                aria-label={`View featured product: ${featuredPiece.name}`}
                className="group w-full max-w-[380px] xl:max-w-[420px] rounded-3xl p-3 sm:p-4 text-left glass-panel border border-white/15 shadow-2xl transition-colors hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <div className="relative aspect-[4/4.5] overflow-hidden rounded-2xl bg-[#111114]">
                  {!imageFailed && featuredPiece.image ? (
                    <img
                      src={featuredPiece.image}
                      alt={featuredPiece.imageAlt || featuredPiece.name}
                      loading="eager"
                      onError={() => setImageFailed(true)}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.18),transparent_38%),linear-gradient(145deg,#19191f,#09090c)] p-6 text-center">
                      <span className="font-heading text-5xl sm:text-6xl font-extrabold tracking-[0.18em] text-white/90">
                        B.S.S
                      </span>
                      <span className="mt-2 font-mono text-[10px] tracking-[0.24em] text-neutral-400 uppercase">
                        Bofoo Style Spectrum
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/20 bg-black/80 px-3 py-1 font-mono text-[10px] tracking-wider text-white uppercase">
                      Featured
                    </span>
                    {featuredPiece.inStock === false && (
                      <span className="rounded-full bg-neutral-200 px-3 py-1 font-mono text-[10px] font-bold text-black uppercase">
                        Sold out
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 rounded-xl border border-white/15 bg-black/85 p-3 sm:p-4 backdrop-blur-xl">
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] sm:text-xs tracking-wider text-amber-300 uppercase">
                        {featuredPiece.category}
                      </div>
                      <div className="line-clamp-2 font-heading text-sm sm:text-base font-bold text-white uppercase">
                        {featuredPiece.name}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-sm sm:text-base font-bold text-white">
                        {formatGHS(featuredPiece.price)}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 uppercase">
                        {CONFIG.CURRENCY_CODE}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 px-1 pt-3 text-xs font-mono text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-amber-300" />
                    Featured from the collection
                  </span>
                  <span className="flex shrink-0 items-center gap-1 uppercase tracking-wider text-white group-hover:text-amber-300">
                    View <ArrowDownRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
