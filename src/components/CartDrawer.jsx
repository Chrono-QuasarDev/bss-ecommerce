import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Check, Copy, ExternalLink, Loader2, ShieldCheck, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { formatGHS, generateOrderId } from '../utils/formatters';
import { formatOrderString, logOrderToWebhook, buildWhatsAppUrl } from '../utils/checkout';
import { CONFIG } from '../config';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
    saveOrder,
  } = useCart();

  const [checkoutState, setCheckoutState] = useState('idle'); // 'idle' | 'securing' | 'ready'
  const [completedOrderId, setCompletedOrderId] = useState('');
  const [formattedMessage, setFormattedMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (!isCartOpen) return null;

  const handleConfirmOrder = async () => {
    if (cart.length === 0 || checkoutState !== 'idle') return;

    // 1. Loading State & Alphanumeric Order ID
    setCheckoutState('securing');
    const orderId = generateOrderId();
    const currentCartSnapshot = [...cart];
    const totalSnapshot = subtotal;

    // 2. Format Exact WhatsApp Order String
    const orderText = formatOrderString(orderId, currentCartSnapshot, totalSnapshot);
    setCompletedOrderId(orderId);
    setFormattedMessage(orderText);

    // 3. Log to Free Database Webhook (mode: 'no-cors')
    const payload = {
      orderId,
      orderText,
      items: currentCartSnapshot.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.selectedSize || 'Standard',
        quantity: item.quantity,
        price: item.price,
        lineTotal: item.price * item.quantity,
      })),
      totalAmount: totalSnapshot,
      currency: CONFIG.CURRENCY_CODE,
      timestamp: new Date().toISOString(),
    };

    try {
      await logOrderToWebhook(CONFIG.WEBHOOK_URL, payload);
    } catch (err) {
      console.warn('Webhook logging notice:', err);
    }

    // Record order in local storage history
    saveOrder({
      id: orderId,
      items: currentCartSnapshot,
      total: totalSnapshot,
      createdAt: new Date().toISOString(),
      rawText: orderText,
    });

    // Celebration burst
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#d4af37', '#e2e8f0'],
      });
    } catch {}

    // 4. Handoff UI & Automated WhatsApp Redirection
    setCheckoutState('ready');
    const targetUrl = buildWhatsAppUrl(CONFIG.WHATSAPP_PHONE, orderText);

    // 5. Clear Cart
    clearCart();

    // Trigger redirection smoothly after a brief pause
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 1400);
  };

  const handleCopyOrderId = () => {
    if (!completedOrderId) return;
    navigator.clipboard.writeText(completedOrderId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleManualWhatsAppRedirect = () => {
    if (!formattedMessage) return;
    const targetUrl = buildWhatsAppUrl(CONFIG.WHATSAPP_PHONE, formattedMessage);
    window.location.href = targetUrl;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      {/* Blurred Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={checkoutState === 'securing' ? undefined : closeCart}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside className="w-screen max-w-md bg-[#0c0c10] border-l border-white/10 flex flex-col shadow-2xl relative text-white">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between font-mono bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <span className="font-heading text-lg font-bold uppercase tracking-wider text-white">
                YOUR SELECTION
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-200 text-xs font-mono font-bold">
                {totalItems}
              </span>
            </div>

            <button
              type="button"
              onClick={closeCart}
              disabled={checkoutState === 'securing'}
              className="p-2 rounded-full border border-white/15 hover:border-white/35 text-neutral-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300"
              aria-label="Close Bag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {checkoutState === 'ready' ? (
              /* Step 4 Handoff UI: Accurate, verified wording */
              <div className="py-8 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 text-black flex items-center justify-center shadow-glow-gold">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs uppercase tracking-wider font-bold">
                    <span>ORDER REQUEST READY</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold uppercase text-white">
                    CONNECTING TO WHATSAPP
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed max-w-xs mx-auto">
                    Your order details have been prepared. Launching WhatsApp to send your request directly to the merchant...
                  </p>
                </div>

                {/* Glowing Order ID display card */}
                <div className="p-5 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl text-left space-y-3 shadow-xl">
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400">
                    <span>ORDER REFERENCE ID</span>
                    <span className="text-amber-300 font-bold">{CONFIG.CURRENCY_CODE}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-white">
                      {completedOrderId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyOrderId}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-amber-200 text-black text-xs font-mono uppercase font-bold tracking-wider transition-all shadow-glow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                </div>

                {/* Direct Action Trigger */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleManualWhatsAppRedirect}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 text-black hover:from-white hover:to-neutral-100 font-mono text-xs uppercase tracking-[0.14em] font-extrabold flex items-center justify-center gap-2 transition-all shadow-glow hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <span>Open WhatsApp to Send Request</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutState('idle');
                      closeCart();
                    }}
                    className="text-xs font-mono text-neutral-400 hover:text-white underline uppercase tracking-wider transition-colors py-1"
                  >
                    Return to Atelier Store
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              /* Empty Cart State */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-16 h-16 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="font-heading text-lg uppercase tracking-wider font-bold text-white">
                    YOUR BAG IS EMPTY
                  </p>
                  <p className="text-xs text-neutral-300 font-sans max-w-xs">
                    Curate your selection from our ready-to-wear masterworks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="px-7 py-3 rounded-full bg-white text-black hover:bg-amber-200 font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-glow hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              /* Cart Items List */
              <div className="space-y-4 divide-y divide-white/[0.08]">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="pt-4 first:pt-0 flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-24 rounded-xl bg-neutral-900 flex-shrink-0 border border-white/10 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {item.selectedSize && (
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-sm bg-black/85 font-mono text-[10px] text-white font-bold">
                          {item.selectedSize}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between font-mono">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs uppercase font-bold text-white font-heading line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-400 hover:text-white p-1 transition-colors focus:outline-none focus:ring-1 focus:ring-white rounded"
                            aria-label={`Remove ${item.name} from bag`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-neutral-400 uppercase tracking-wider">
                          {formatGHS(item.price)} each
                        </div>
                      </div>

                      {/* Quantity & Line Total */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-white/20 bg-white/[0.04]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 text-neutral-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-white rounded-l-full"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-white min-w-[24px] text-center" aria-label={`Quantity: ${item.quantity}`}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 text-neutral-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-white rounded-r-full"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-xs font-bold text-white">
                          {formatGHS(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout Trigger */}
          {cart.length > 0 && checkoutState !== 'ready' && (
            <div className="p-5 sm:p-6 border-t border-white/10 bg-white/[0.02] font-mono space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span className="uppercase tracking-widest">Subtotal</span>
                  <span className="font-bold text-white">{formatGHS(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-300 text-xs">
                  <span className="uppercase tracking-wider">Accra Concierge Dispatch</span>
                  <span className="text-emerald-400 font-bold">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 text-sm font-bold text-white">
                  <span className="uppercase tracking-widest">Grand Total</span>
                  <span className="text-base text-gold-metallic">{formatGHS(subtotal)}</span>
                </div>
              </div>

              {/* Confirm Order Trigger */}
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={checkoutState === 'securing'}
                className={`w-full py-4 rounded-full text-xs uppercase tracking-[0.16em] font-extrabold border transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                  checkoutState === 'securing'
                    ? 'bg-neutral-800 text-neutral-400 border-neutral-700 cursor-not-allowed'
                    : 'bg-white hover:bg-amber-200 text-black border-white hover:border-amber-200 shadow-glow hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {checkoutState === 'securing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Securing your order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Order ({formatGHS(subtotal)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 text-center font-sans">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Payment and delivery arrangements are confirmed directly with the merchant on WhatsApp.</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
