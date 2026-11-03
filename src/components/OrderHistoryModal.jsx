import React, { useState } from 'react';
import { X, Clock, Copy, Check, ExternalLink, Trash2, Receipt } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatGHS, formatDateTime } from '../utils/formatters';
import { CONFIG } from '../config';

export const OrderHistoryModal = () => {
  const { isOrderHistoryOpen, closeOrderHistory, orderHistory, clearOrderHistory } = useCart();
  const [copiedId, setCopiedId] = useState(null);

  if (!isOrderHistoryOpen) return null;

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInquire = (orderId) => {
    const text = `Hello Atelier Noir, I am following up on my previous Order ID: ${orderId}`;
    const url = `https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Order History">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={closeOrderHistory}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-white/15 p-6 sm:p-8 font-mono text-white shadow-2xl my-8">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-amber-300">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white font-heading">
                  LOCAL ORDER REQUESTS
                </h2>
                <div className="text-xs text-neutral-400">
                  {orderHistory.length} {orderHistory.length === 1 ? 'REQUEST RECORDED' : 'REQUESTS RECORDED ON THIS DEVICE'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={closeOrderHistory}
              className="p-2 rounded-full border border-white/15 hover:border-white/35 text-neutral-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Orders Scrollable Content */}
          <div className="py-6 max-h-[60vh] overflow-y-auto space-y-4">
            {orderHistory.length === 0 ? (
              <div className="text-center py-14 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-400">
                  <Clock className="w-7 h-7 text-amber-300/70" />
                </div>
                <div className="space-y-1">
                  <p className="font-heading text-base uppercase tracking-wider font-bold text-white">
                    NO SAVED ORDER REQUESTS
                  </p>
                  <p className="text-xs text-neutral-300 font-sans max-w-xs mx-auto leading-relaxed">
                    When you send an order request via WhatsApp, a copy is automatically saved on this device for your reference.
                  </p>
                </div>
              </div>
            ) : (
              orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/15 p-5 space-y-4 bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                        REF: {order.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.id)}
                        className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20 hover:border-white bg-white/5 hover:bg-white hover:text-black flex items-center gap-1 transition-all focus:outline-none focus:ring-1 focus:ring-white"
                        title="Copy Reference ID"
                      >
                        {copiedId === order.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>COPY</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-neutral-400">
                      {formatDateTime(order.createdAt)}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-neutral-200">
                        <span className="line-clamp-1">
                          {item.quantity}x {item.name} {item.selectedSize ? `(${item.selectedSize})` : ''}
                        </span>
                        <span className="font-bold text-white flex-shrink-0">
                          {formatGHS(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-neutral-400 uppercase tracking-widest text-xs">
                        TOTAL:
                      </span>
                      <span className="font-bold text-base text-gold-metallic">
                        {formatGHS(order.total)}
                      </span>
                      <span className="px-2.5 py-1 rounded-full border border-white/20 bg-white/5 text-[11px] text-neutral-300 uppercase tracking-wider flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-amber-300" />
                        <span>REQUEST LOGGED</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInquire(order.id)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-amber-200 rounded-full font-bold uppercase text-xs tracking-wider transition-all shadow-glow-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      <span>Inquire via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            {orderHistory.length > 0 && (
              <button
                type="button"
                onClick={clearOrderHistory}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-red-400 uppercase text-xs tracking-wider transition-colors p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Local History</span>
              </button>
            )}

            <button
              type="button"
              onClick={closeOrderHistory}
              className="ml-auto px-6 py-2.5 rounded-full bg-white text-black hover:bg-amber-200 uppercase text-xs tracking-widest font-bold transition-all shadow-glow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
