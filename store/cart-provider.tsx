'use client';

import { useEffect, useState, useReducer, useMemo } from 'react';
import {
  CART_STORAGE_KEY,
  CartContext,
  cartReducer,
  type CartContextValue,
  type CartState,
} from './cart-context';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Carregar localStorage apenas no cliente
  useEffect(() => {
    setMounted(true);
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (parsed?.items?.length) {
          dispatch({ type: 'RESTORE', payload: parsed });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Salvar no localStorage quando state mudar
  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, mounted]);

  const value: CartContextValue = useMemo(() => {
    const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = state.items.reduce((acc, i) => acc + i.quantity * i.price, 0);
    return {
      items: state.items,
      totalItems,
      subtotal,
      addItem: (product, quantity = 1, variationId) =>
        dispatch({ type: 'ADD', payload: { product, variationId, quantity } }),
      removeItem: (productId, variationId) =>
        dispatch({ type: 'REMOVE', payload: { productId, variationId } }),
      updateQty: (productId, quantity, variationId) =>
        dispatch({ type: 'SET_QTY', payload: { productId, variationId, quantity } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    };
  }, [state]);

  // Renderizar vazio até montar no cliente (evita hydration mismatch)
  if (!mounted) {
    const emptyValue: CartContextValue = {
      items: [],
      totalItems: 0,
      subtotal: 0,
      addItem: () => {},
      removeItem: () => {},
      updateQty: () => {},
      clearCart: () => {},
    };
    return <CartContext.Provider value={emptyValue}>{children}</CartContext.Provider>;
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
