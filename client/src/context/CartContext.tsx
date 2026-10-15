import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem } from '../types';
import { api } from '../services/api';

interface CartContextType {
  cart: Cart;
  isDrawerOpen: boolean;
  isLoading: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToBag: (variantId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  freeShippingThreshold: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ id: 0, items: [], subtotal: 0, count: 0 });
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const freeShippingThreshold = 999;

  const refreshCart = async () => {
    try {
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      console.warn('Failed to load cart', err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToBag = async (variantId: number, quantity: number = 1) => {
    setIsLoading(true);
    try {
      await api.addToCart(variantId, quantity);
      await refreshCart();
      openDrawer();
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    await api.updateCartItem(itemId, quantity);
    await refreshCart();
  };

  const removeItem = async (itemId: number) => {
    await api.removeCartItem(itemId);
    await refreshCart();
  };

  const clearCart = async () => {
    await api.clearCart();
    await refreshCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isDrawerOpen,
        isLoading,
        openDrawer,
        closeDrawer,
        addToBag,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        freeShippingThreshold,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
