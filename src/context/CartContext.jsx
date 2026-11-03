import React, { createContext, useContext, useState, useEffect } from 'react';
import { CONFIG } from '../config';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Cart state persisted to localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
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

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Open cart drawer immediately on add for responsive feedback
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
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
