import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Product } from "@/types/api";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  category: Product["category"];
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE"; payload: { productId: string } }
  | { type: "SET_QTY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR" };

const STORAGE_KEY = "kpop_storefront_cart_v1";

function clampQty(qty: number) {
  return Math.max(1, Math.min(99, Math.floor(qty)));
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const { product, quantity } = action.payload;
      const q = clampQty(quantity);
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: clampQty(i.quantity + q) }
              : i,
          ),
        };
      }

      return {
        items: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            category: product.category,
            quantity: q,
          },
          ...state.items,
        ],
      };
    }
    case "REMOVE": {
      return {
        items: state.items.filter((i) => i.productId !== action.payload.productId),
      };
    }
    case "SET_QTY": {
      const q = clampQty(action.payload.quantity);
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId ? { ...i, quantity: q } : i,
        ),
      };
    }
    case "CLEAR": {
      return { items: [] };
    }
    default:
      return state;
  }
}

function loadInitialState(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed?.items || !Array.isArray(parsed.items)) return { items: [] };
    return { items: parsed.items };
  } catch {
    return { items: [] };
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const value: CartContextValue = useMemo(() => {
    const count = state.items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = state.items.reduce((acc, i) => acc + i.quantity * i.price, 0);
    return {
      items: state.items,
      count,
      subtotal,
      addItem: (product, quantity = 1) =>
        dispatch({ type: "ADD", payload: { product, quantity } }),
      removeItem: (productId) => dispatch({ type: "REMOVE", payload: { productId } }),
      setQuantity: (productId, quantity) =>
        dispatch({ type: "SET_QTY", payload: { productId, quantity } }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
