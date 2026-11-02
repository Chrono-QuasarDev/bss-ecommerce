import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { formatGHS } from '../utils/formatters';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { cart, addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Check if item is already in cart to display quantity badge
  const cartItem = cart.find((item) => item.id === product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80';

  return (
    <article
      className="group flex flex-col bg-white border border-neutral-200 hover:border-black transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden border-b border-neutral-200">
        <img
          src={imgError ? fallbackImage : product.image || fallbackImage}
          alt={product.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* Top-left category tag */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-neutral-300 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-black">
          {product.category || 'Atelier'}
        </div>

        {/* Existing in cart quantity pill */}
        {cartItem && (
          <div className="absolute top-3 right-3 bg-black text-white px-2 py-0.5 text-[10px] font-mono tracking-widest">
            IN BAG [{cartItem.quantity}]
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            REF: {product.id}
          </div>
          <h3 className="text-sm font-medium uppercase tracking-tight text-black line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div className="font-mono text-sm sm:text-base font-semibold text-black tracking-tight">
            {formatGHS(product.price)}
          </div>

          <button
            onClick={handleAdd}
            className={`px-3 py-2 text-xs font-mono uppercase tracking-widest border transition-all duration-150 flex items-center gap-1.5 ${
              justAdded
                ? 'bg-black text-white border-black'
                : 'bg-black text-white hover:bg-white hover:text-black border-black'
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
                <span>ADD TO BAG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
