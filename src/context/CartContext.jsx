import React, { createContext, useContext, useState, useEffect } from 'react';
import { CONFIG } from '../config';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Cart state persisted to localStorage
  // Migrate legacy items that may lack a selectedSize property
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.CART);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      // Normalise: ensure every item has a selectedSize (default to empty string)
      return parsed.map((item) => ({
        ...item,
        selectedSize: item.selectedSize || '',
      }));
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
      return [];
    }
  });

  // Order history state persisted to localStorage
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.ORDER_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error reading order history from localStorage', e);
      return [];
    }
  });

  // Modal / Drawer visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // Synchronize cart with localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Error writing cart to localStorage', e);
    }
  }, [cart]);

  // Synchronize order history with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(orderHistory));
    } catch (e) {
      console.error('Error writing order history to localStorage', e);
    }
  }, [orderHistory]);

  /**
   * Generate a unique cart line key from product id + selected size.
   * Products without a size use an empty string, so they still get a unique key.
   */
  const cartLineKey = (id, selectedSize) => `${id}::${selectedSize || ''}`;

  // Cart operations — size-aware: same product in different sizes = distinct lines
  const addToCart = (product) => {
    const key = cartLineKey(product.id, product.selectedSize);
    setCart((prev) => {
      const existing = prev.find(
        (item) => cartLineKey(item.id, item.selectedSize) === key
      );
      if (existing) {
        return prev.map((item) =>
          cartLineKey(item.id, item.selectedSize) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Open cart drawer immediately on add for responsive feedback
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, selectedSize) => {
    const key = cartLineKey(productId, selectedSize);
    setCart((prev) =>
      prev.filter((item) => cartLineKey(item.id, item.selectedSize) !== key)
    );
  };

  const updateQuantity = (productId, selectedSize, delta) => {
    const key = cartLineKey(productId, selectedSize);
    setCart((prev) =>
      prev
        .map((item) => {
          if (cartLineKey(item.id, item.selectedSize) === key) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.CART);
    } catch (e) {
      console.error('Error clearing cart from localStorage', e);
    }
  };

  // Order history operations
  const saveOrder = (order) => {
    setOrderHistory((prev) => [order, ...prev]);
  };

  const clearOrderHistory = () => {
    setOrderHistory([]);
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.ORDER_HISTORY);
    } catch (e) {
      console.error('Error clearing order history from localStorage', e);
    }
  };

  // Derived calculations
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        orderHistory,
        saveOrder,
        clearOrderHistory,
        isOrderHistoryOpen,
        setIsOrderHistoryOpen,
        openOrderHistory: () => setIsOrderHistoryOpen(true),
        closeOrderHistory: () => setIsOrderHistoryOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
