import { Check, ShoppingBag, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { formatGHS } from "../utils/formatters";
import { PRODUCT_IMAGE_FALLBACK } from "../utils/imageFallback";

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  if (!isOpen || !product) return null;

  const hasVariants = Array.isArray(product.variants);
  const variants = product.variants || [];
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ||
    variants.find((variant) => variant.available) ||
    variants[0] ||
    null;
  const variantAvailable = !hasVariants || Boolean(selectedVariant?.available);
  const sizes = ["S", "M", "L", "XL"];
  const sizeOptions = [...new Set(variants.map((variant) => variant.size).filter(Boolean))];
  const colorOptions = [...new Set(variants.map((variant) => variant.color).filter(Boolean))];
  const chooseVariant = (predicate) => {
    const match = variants.find((variant) => predicate(variant) && variant.available) || variants.find(predicate);
    if (match) setSelectedVariantId(match.id);
  };
  const gallery = [product.image, product.secondaryImage].filter(Boolean);

  const handleAdd = () => {
    if (!variantAvailable) return;
    addToCart({
      ...product,
      selectedSize: selectedVariant?.size || selectedSize,
      selectedColor: selectedVariant?.color || "",
      selectedVariantId: selectedVariant?.id || "",
    });
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 700);
  };

  const handleBuyNow = () => {
    if (!variantAvailable) return;
    addToCart({
      ...product,
      selectedSize: selectedVariant?.size || selectedSize,
      selectedColor: selectedVariant?.color || "",
      selectedVariantId: selectedVariant?.id || "",
    });
    onClose();
    openCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-white/15 shadow-2xl overflow-hidden text-white my-8">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-black/70 hover:bg-white text-neutral-300 hover:text-black border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left Column */}
            <div className="p-6 sm:p-8 bg-black/40 flex flex-col justify-between space-y-4">
              <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 relative">
                <img
                  src={activeImage || product.image || PRODUCT_IMAGE_FALLBACK}
                  alt={product.imageAlt || product.name}
                  onError={() => setActiveImage(PRODUCT_IMAGE_FALLBACK)}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-black font-mono text-[10px] font-bold uppercase tracking-wider shadow-lg">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Thumbnail Selector */}
              {gallery.length > 1 && (
                <div className="flex gap-3">
                  {gallery.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      aria-label={`View image angle ${i + 1}`}
                      className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                        activeImage === imgUrl
                          ? "border-amber-300 scale-105"
                          : "border-white/15 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt="Thumbnail view"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Right Column */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  CATEGORY // {product.category}
                </div>

                <h2
                  id="quickview-title"
                  className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading"
                >
                  {product.name}
                </h2>

                <div className="font-mono text-2xl font-bold text-white">
                  {formatGHS(product.price)}
                </div>

                <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                  {product.description}
                </p>

                {/* Fabric & Origin Specs */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>B.S.S DETAILS:</span>
                  </div>
                  <div className="text-neutral-200">
                    <span className="text-neutral-400">Fabric:</span>{" "}
                    {product.fabric || "Heavyweight Combed Cotton"}
                  </div>
                </div>

                {hasVariants ? (
                  <div className="space-y-3 font-mono">
                    {sizeOptions.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs uppercase tracking-widest text-neutral-400">SELECT SIZE</div>
                        <div className="flex flex-wrap gap-2">
                          {sizeOptions.map((size) => {
                            const available = variants.some((variant) => variant.size === size && variant.available);
                            return (
                              <button key={size} type="button" disabled={!available}
                                onClick={() => chooseVariant((variant) => variant.size === size && (!selectedVariant?.color || variant.color === selectedVariant.color))}
                                aria-label={`Select size ${size}`} aria-pressed={selectedVariant?.size === size}
                                className={`min-h-10 min-w-10 px-3 rounded-xl border text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-35 disabled:line-through ${selectedVariant?.size === size ? "border-white bg-white text-black shadow-glow-sm" : "border-white/15 text-neutral-200 hover:border-white/35 bg-white/[0.03]"}`}>
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {colorOptions.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs uppercase tracking-widest text-neutral-400">COLOR</div>
                        <p className="text-sm font-sans text-neutral-200">
                          {selectedVariant?.color || colorOptions.join(', ')}
                        </p>
                      </div>
                    )}
                    {!variantAvailable && <p className="text-xs uppercase text-rose-300">Sold out</p>}
                  </div>
                ) : (
                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-neutral-400">
                      <span>SELECT SIZE</span>
                      <span className="text-white font-bold">{selectedSize}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          aria-label={`Select size ${size}`}
                          aria-pressed={selectedSize === size}
                          className={`min-h-[40px] py-2.5 rounded-xl border text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                            selectedSize === size
                              ? "border-white bg-white text-black shadow-glow-sm"
                              : "border-white/15 text-neutral-200 hover:border-white/35 bg-white/[0.03]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!variantAvailable}
                  className={`w-full py-4 rounded-full disabled:opacity-45 disabled:cursor-not-allowed text-xs uppercase tracking-[0.16em] font-extrabold border transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                    justAdded
                      ? "bg-emerald-400 text-black border-emerald-400 shadow-glow"
                      : "bg-white hover:bg-amber-200 text-black border-white hover:border-amber-200 shadow-glow hover:scale-[1.02]"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO BAG ({formatGHS(product.price)})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/20 text-xs uppercase tracking-[0.14em] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  Review Bag & Proceed to WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
