import React, { useState } from 'react';
import { Plus, Check, Eye, Sparkles } from 'lucide-react';
import { formatGHS } from '../utils/formatters';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { cart, addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Check if item is already in cart
  const cartItem = cart.find((item) => item.id === product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart({
      ...product,
      selectedSize,
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
      className="group glass-panel rounded-2xl overflow-hidden flex flex-col justify-between border border-white/[0.08] hover:border-white/25 transition-all duration-500 hover:shadow-glow hover:-translate-y-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Area with Dual-Photo Crossfade */}
      <div className="relative aspect-[3/4] w-full bg-[#0d0d12] overflow-hidden">
        {/* Primary Image */}
        <img
          src={imgError ? fallbackImage : primaryImg}
          alt={product.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered && product.secondaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />

        {/* Secondary Lookbook Image (Cross-fades on hover) */}
        {product.secondaryImage && (
          <img
            src={secondaryImg}
            alt={`${product.name} angle`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between pointer-events-none">
          <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md border border-white/10 text-neutral-200 font-mono text-[9px] tracking-widest uppercase rounded-full">
            {product.category || 'Atelier'}
          </span>

          {cartItem ? (
            <span className="px-2.5 py-1 bg-white text-black font-mono text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg">
              IN BAG [{cartItem.quantity}]
            </span>
          ) : product.badge ? (
            <span className="px-2.5 py-1 bg-amber-400 text-black font-mono text-[9px] font-bold tracking-widest uppercase rounded-full shadow-lg">
              {product.badge}
            </span>
          ) : null}
        </div>

        {/* Floating Quick View Trigger Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/85 backdrop-blur-xl border border-white/20 hover:border-white text-white rounded-full font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-xl transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Information Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Name and Fabric Tag */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            <span>REF // {product.id}</span>
            {product.stock && (
              <span className="text-amber-400/90 font-medium">
                {product.stock} IN STOCK
              </span>
            )}
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="text-base font-bold uppercase tracking-tight text-white font-heading hover:text-amber-200 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed">
            {product.fabric || product.description}
          </p>
        </div>

        {/* Size Selection Pills */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            SIZE:
          </span>
          <div className="flex gap-1.5 font-mono text-[11px]">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                  selectedSize === size
                    ? 'border-white bg-white text-black font-bold shadow-glow-sm'
                    : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white bg-white/[0.02]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add to Bag Trigger */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <div>
            <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
              PRICE (GH₵)
            </div>
            <div className="font-mono text-base font-extrabold text-white tracking-tight">
              {formatGHS(product.price)}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className={`px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.15em] font-bold border transition-all duration-300 flex items-center gap-1.5 ${
              justAdded
                ? 'bg-emerald-400 text-black border-emerald-400 shadow-glow'
                : 'bg-white hover:bg-amber-200 text-black border-white hover:border-amber-200 shadow-glow-sm hover:scale-105 active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>BAG</span>
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
};
