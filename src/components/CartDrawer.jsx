import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Check, Copy, ExternalLink, Loader2, ShieldCheck } from 'lucide-react';
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

  // Checkout flow state: 'idle' | 'securing' | 'ready'
  const [checkoutState, setCheckoutState] = useState('idle');
  const [completedOrderId, setCompletedOrderId] = useState('');
  const [formattedMessage, setFormattedMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (!isCartOpen) return null;

  /**
   * The Checkout Handoff Sequence
   */
  const handleConfirmOrder = async () => {
    if (cart.length === 0 || checkoutState !== 'idle') return;

    // Step 1: Loading State & Generate short alphanumeric Order ID
    setCheckoutState('securing');
    const orderId = generateOrderId();
    const currentCartSnapshot = [...cart];
    const totalSnapshot = subtotal;

    // Step 2: Format the exact WhatsApp Order String
    // Order Request:\nOrder ID: [ID]\n1x Item A (GH₵ 200.00)\n2x Item B (GH₵ 100.00)\nTotal: GH₵ 400.00
    const orderText = formatOrderString(orderId, currentCartSnapshot, totalSnapshot);
    setCompletedOrderId(orderId);
    setFormattedMessage(orderText);

    // Step 3: Log the Order (Free Database Webhook) with mode: 'no-cors'
    const payload = {
      orderId,
      orderText,
      items: currentCartSnapshot.map((item) => ({
        id: item.id,
        name: item.name,
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
      console.warn('Webhook logging error caught gracefully:', err);
    }

    // Record order into local Order History
    saveOrder({
      id: orderId,
      items: currentCartSnapshot,
      total: totalSnapshot,
      createdAt: new Date().toISOString(),
      rawText: orderText,
    });

    // Step 4: Handoff UI & Redirect
    setCheckoutState('ready');

    // Build the final WhatsApp URL
    const targetUrl = buildWhatsAppUrl(CONFIG.WHATSAPP_PHONE, orderText);

    // Clear cart from state & localStorage
    clearCart();

    // Trigger redirection smoothly after a brief pause so user can perceive the Order ID
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 1200);
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={checkoutState === 'securing' ? undefined : closeCart}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6">
        <aside className="w-screen max-w-md bg-white border-l border-neutral-200 flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-widest text-sm text-black">
                YOUR SELECTION
              </span>
              <span className="text-xs text-neutral-500">[{totalItems}]</span>
            </div>

            <button
              onClick={closeCart}
              disabled={checkoutState === 'securing'}
              className="p-1.5 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {checkoutState === 'ready' ? (
              /* Step 4 Handoff UI State */
              <div className="py-8 text-center space-y-6 font-mono">
                <div className="w-14 h-14 mx-auto border-2 border-black flex items-center justify-center bg-black text-white">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-black">
                    ORDER SECURED
                  </h3>
                  <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                    Connecting to the WhatsApp concierge. If the WhatsApp client does not open automatically,
                    use the button below.
                  </p>
                </div>

                {/* Order ID display box with Copy button */}
                <div className="p-4 border border-black bg-neutral-50 text-left space-y-3">
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                    OFFICIAL ORDER ID:
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl font-bold tracking-wider text-black">
                      {completedOrderId}
                    </span>
                    <button
                      onClick={handleCopyOrderId}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-black bg-white hover:bg-black hover:text-white text-xs uppercase tracking-wider transition-colors"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                </div>

                {/* Direct WhatsApp button fallback */}
                <button
                  onClick={handleManualWhatsAppRedirect}
                  className="w-full py-3 bg-black text-white hover:bg-white hover:text-black border border-black text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <span>Open WhatsApp Directly</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setCheckoutState('idle');
                    closeCart();
                  }}
                  className="text-xs text-neutral-500 hover:text-black underline uppercase tracking-wider"
                >
                  Back to Store
                </button>
              </div>
            ) : cart.length === 0 ? (
              /* Empty Cart State */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 font-mono">
                <div className="w-16 h-16 border border-neutral-300 flex items-center justify-center text-neutral-400">
                  <X className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-widest font-bold text-black">
                    BAG IS EMPTY
                  </p>
                  <p className="text-xs text-neutral-500 font-sans">
                    Browse the ready-to-wear pieces and add items to begin.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-black text-white hover:bg-white hover:text-black border border-black text-xs uppercase tracking-widest transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              /* Cart Items List */
              <div className="space-y-4 divide-y divide-neutral-100">
                {cart.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-24 bg-neutral-100 flex-shrink-0 border border-neutral-200 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between font-mono">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs uppercase font-medium text-black line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-400 hover:text-black p-0.5 transition-colors"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-widest">
                          {formatGHS(item.price)} each
                        </div>
                      </div>

                      {/* Quantity & Line Total */}
                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-neutral-300">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-black min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-xs font-semibold text-black">
                          {formatGHS(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && checkoutState !== 'ready' && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50 font-mono space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span className="uppercase tracking-widest">Subtotal</span>
                  <span className="font-semibold text-black">{formatGHS(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-[11px]">
                  <span className="uppercase tracking-wider">Concierge Handoff</span>
                  <span className="text-black font-semibold">FREE (WhatsApp)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-black">
                  <span className="uppercase tracking-widest">Grand Total</span>
                  <span>{formatGHS(subtotal)}</span>
                </div>
              </div>

              {/* Confirm Order Button with Loading State */}
              <button
                onClick={handleConfirmOrder}
                disabled={checkoutState === 'securing'}
                className={`w-full py-3.5 text-xs uppercase tracking-widest font-bold border transition-all duration-150 flex items-center justify-center gap-2 ${
                  checkoutState === 'securing'
                    ? 'bg-neutral-800 text-neutral-300 border-neutral-800 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-white hover:text-black border-black shadow-none'
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

              <p className="text-[10px] text-neutral-500 text-center font-sans">
                Encrypted handoff to private WhatsApp concierge. Payment via MTN MoMo / Telecel / Card
                finalized directly on WhatsApp.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
