import React, { useState } from 'react';
import { X, Clock, Copy, Check, ExternalLink, Trash2, ShieldCheck, ShoppingBag } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeOrderHistory}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white border border-black shadow-2xl p-6 sm:p-8 font-mono">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-black" />
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-widest text-black">
                MY ORDERS ({orderHistory.length})
              </h2>
            </div>
            <button
              onClick={closeOrderHistory}
              className="p-1 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors"
              aria-label="Close Order History"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Orders Content */}
          <div className="py-6 max-h-[60vh] overflow-y-auto space-y-6">
            {orderHistory.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 mx-auto border border-neutral-300 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm uppercase tracking-widest font-bold text-black">
                  NO ORDERS RECORDED
                </p>
                <p className="text-xs text-neutral-500 font-sans max-w-xs mx-auto">
                  Orders placed on this device are automatically saved to your browser's localStorage for quick tracking.
                </p>
              </div>
            ) : (
              orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="border border-neutral-200 p-5 space-y-4 bg-neutral-50"
                >
                  {/* Top Bar of Order Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-black">
                        ORDER: {order.id}
                      </span>
                      <button
                        onClick={() => handleCopy(order.id)}
                        className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-neutral-300 hover:border-black bg-white flex items-center gap-1 transition-colors"
                        title="Copy Order ID"
                      >
                        {copiedId === order.id ? (
                          <>
                            <Check className="w-3 h-3 text-black" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>COPY</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-neutral-500">
                      {formatDateTime(order.createdAt)}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-neutral-700">
                        <span className="line-clamp-1">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-semibold text-black flex-shrink-0">
                          {formatGHS(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 uppercase tracking-widest text-[11px]">
                        TOTAL:
                      </span>
                      <span className="font-bold text-base text-black">
                        {formatGHS(order.total)}
                      </span>
                      <span className="px-2 py-0.5 border border-neutral-300 bg-white text-[10px] text-neutral-600 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        WHATSAPP VERIFIED
                      </span>
                    </div>

                    <button
                      onClick={() => handleInquire(order.id)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-white hover:text-black border border-black uppercase text-[11px] tracking-wider transition-colors"
                    >
                      <span>Inquire Status</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs">
            {orderHistory.length > 0 && (
              <button
                onClick={clearOrderHistory}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-black uppercase text-[11px] tracking-wider transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Local History</span>
              </button>
            )}

            <button
              onClick={closeOrderHistory}
              className="ml-auto px-5 py-2 bg-black text-white hover:bg-white hover:text-black border border-black uppercase text-xs tracking-widest transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
