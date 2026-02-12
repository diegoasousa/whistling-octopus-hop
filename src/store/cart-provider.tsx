import React, { useEffect, useMemo, useReducer } from "react";
import {
  CART_STORAGE_KEY,
  CartContext,
  cartReducer,
  loadInitialState,
  type CartContextValue,
} from "@/store/cart-context";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const value: CartContextValue = useMemo(() => {
    const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = state.items.reduce((acc, i) => acc + i.quantity * i.price, 0);
    return {
      items: state.items,
      totalItems,
      subtotal,
      addItem: (product, quantity = 1, variationId) =>
        dispatch({ type: "ADD", payload: { product, variationId, quantity } }),
      removeItem: (productId, variationId) =>
        dispatch({ type: "REMOVE", payload: { productId, variationId } }),
      updateQty: (productId, quantity, variationId) =>
        dispatch({ type: "SET_QTY", payload: { productId, variationId, quantity } }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [state]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
