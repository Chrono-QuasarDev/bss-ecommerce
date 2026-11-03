import React, { useState } from 'react';
import { Plus, Check, Eye } from 'lucide-react';
import { formatGHS } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { CONFIG } from '../config';

export const ProductCard = ({ product, onQuickView }) => {
  const { cart, addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasVariants = Array.isArray(product.variants);
  const variants = product.variants || [];
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ||
    variants.find((variant) => variant.available) ||
    variants[0] ||
    null;
  const variantAvailable = !hasVariants || Boolean(selectedVariant?.available);

  const cartItem = cart.find((item) => {
    if (item.id !== product.id) return false;
    if (selectedVariant) return item.selectedVariantId === selectedVariant.id;
    return item.selectedSize === selectedSize;
  });
  const totalInBag = cart
    .filter((item) => item.id === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!variantAvailable) return;
    addToCart({
      ...product,
      selectedSize: selectedVariant?.size || selectedSize,
      selectedColor: selectedVariant?.color || '',
      selectedVariantId: selectedVariant?.id || '',
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85';
  const primaryImg = product.image || fallbackImage;
  const secondaryImg = product.secondaryImage || primaryImg;
  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <article
      className="group glass-panel rounded-2xl overflow-hidden flex flex-col justify-between border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full bg-[#0d0d12] overflow-hidden">
        <img
          src={imgError ? fallbackImage : primaryImg}
          alt={product.imageAlt || product.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
            isHovered && product.secondaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />
        {product.secondaryImage && (
          <img
            src={secondaryImg}
            alt={`${product.name} alternate view`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        <div className="absolute top-3 inset-x-3 flex items-start justify-between pointer-events-none">
          <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/15 text-neutral-200 font-mono text-[10px] tracking-wider uppercase rounded-full">
            {product.category || 'Collection'}
          </span>
          {totalInBag > 0 ? (
            <span className="px-2.5 py-1 bg-white text-black font-mono text-[11px] font-bold tracking-wider uppercase rounded-full shadow-lg">
              IN BAG [{totalInBag}]
            </span>
          ) : product.badge ? (
            <span className="px-2.5 py-1 bg-amber-400 text-black font-mono text-[10px] font-bold tracking-wider uppercase rounded-full shadow-lg">
              {product.badge}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          aria-label={`Quick view ${product.name}`}
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 min-h-[38px] px-4 py-2 bg-black/90 backdrop-blur-xl border border-white/25 hover:border-white text-white rounded-full font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-amber-300" />
          <span>Quick View</span>
        </button>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase tracking-wider">
            <span>REF // {product.id}</span>
            {product.inStock === false && (
              <span className="text-rose-300 font-medium">SOLD OUT</span>
            )}
          </div>
          <h3
            onClick={() => onQuickView(product)}
            className="text-base font-bold uppercase tracking-tight text-white font-heading hover:text-amber-200 transition-colors cursor-pointer line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-xs text-neutral-300 font-sans line-clamp-2 leading-relaxed">
            {product.fabric || product.description}
          </p>
        </div>

        {hasVariants ? (
          <label className="block pt-2 border-t border-white/[0.08] space-y-1.5">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">SIZE / COLOR</span>
            <select
              value={selectedVariant?.id || ''}
              onChange={(event) => setSelectedVariantId(event.target.value)}
              aria-label={`Choose an option for ${product.name}`}
              className="w-full min-h-[38px] px-3 rounded-lg border border-white/20 bg-[#101014] text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              {!variants.length && <option value="">Unavailable</option>}
              {variants.map((variant) => {
                const label = [variant.size, variant.color].filter(Boolean).join(' · ') || 'One size';
                return (
                  <option key={variant.id} value={variant.id} disabled={!variant.available}>
                    {label}{variant.available ? '' : ' — Sold out'}
                  </option>
                );
              })}
            </select>
          </label>
        ) : (
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-medium">SIZE:</span>
            <div className="flex gap-1.5 font-mono text-xs">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  aria-label={`Select size ${size}`}
                  aria-pressed={selectedSize === size}
                  className={`w-8 h-8 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border transition-all focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                    selectedSize === size
                      ? 'border-white bg-white text-black font-bold shadow-glow-sm'
                      : 'border-white/20 text-neutral-300 hover:border-white/40 hover:text-white bg-white/[0.03]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-medium">PRICE ({CONFIG.CURRENCY_CODE})</div>
            <div className="font-mono text-base sm:text-lg font-extrabold text-white tracking-tight">
              {formatGHS(product.price)}
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!variantAvailable}
            aria-label={`Add ${product.name} to bag`}
            className={`min-h-[42px] px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.12em] font-bold border transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-45 disabled:cursor-not-allowed ${
              justAdded
                ? 'bg-emerald-400 text-black border-emerald-400 shadow-glow'
                : 'bg-white hover:bg-amber-200 text-black border-white hover:border-amber-200 shadow-glow-sm hover:scale-105 active:scale-95'
            }`}
          >
            {justAdded ? <><Check className="w-3.5 h-3.5" /><span>ADDED</span></> : <><Plus className="w-3.5 h-3.5" /><span>{variantAvailable ? 'BAG' : 'SOLD OUT'}</span></>}
          </button>
        </div>
      </div>
    </article>
  );
};
