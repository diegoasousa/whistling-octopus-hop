import React, { createContext, useContext } from "react";
import type { CartItem, Product } from "@/types/api";
import {
  getProductPrimaryImage,
  getProductPriceCents,
  getProductTitle,
  getProductTypeLabel,
} from "@/lib/products";

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | { type: "ADD"; payload: { product: Product; variationId?: string; quantity: number } }
  | { type: "REMOVE"; payload: { productId: string; variationId?: string } }
  | { type: "SET_QTY"; payload: { productId: string; variationId?: string; quantity: number } }
  | { type: "CLEAR" }
  | { type: "RESTORE"; payload: CartState };  // NOVO - para restaurar do localStorage

export type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number, variationId?: string) => void;
  removeItem: (productId: string, variationId?: string) => void;
  updateQty: (productId: string, quantity: number, variationId?: string) => void;
  clearCart: () => void;
};

export const CART_STORAGE_KEY = "kpop_storefront_cart_v1";

function clampQty(qty: number) {
  return Math.max(1, Math.min(99, Math.floor(qty)));
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const { product, variationId, quantity } = action.payload;
      const q = clampQty(quantity);

      // Determinar preco: variacao ou produto base
      let priceCents = getProductPriceCents(product);
      if (variationId && product.variations) {
        const variation = product.variations.find(
          (v) => v.id === variationId || v.name === variationId,
        );
        if (variation?.priceCents) priceCents = variation.priceCents;
        else if (typeof variation?.price === "number") priceCents = Math.round(variation.price * 100);
      }

      const price = priceCents / 100; // converter para reais

      // Procurar item existente com mesma combinacao de produto + variacao
      const existingIdx = state.items.findIndex(
        (i) => i.productId === product.id && i.variationId === variationId,
      );

      if (existingIdx >= 0) {
        const updated = [...state.items];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: clampQty(updated[existingIdx].quantity + q),
        };
        return { items: updated };
      }

      return {
        items: [
          {
            productId: product.id,
            variationId,
            name: getProductTitle(product),
            price,
            image: getProductPrimaryImage(product) ?? "",
            type: getProductTypeLabel(product),
            quantity: q,
          },
          ...state.items,
        ],
      };
    }
    case "REMOVE": {
      return {
        items: state.items.filter(
          (i) => !(i.productId === action.payload.productId && i.variationId === action.payload.variationId),
        ),
      };
    }
    case "SET_QTY": {
      const q = clampQty(action.payload.quantity);
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId && i.variationId === action.payload.variationId
            ? { ...i, quantity: q }
            : i,
        ),
      };
    }
    case "CLEAR": {
      return { items: [] };
    }
    case "RESTORE": {
      return action.payload;
    }
    default:
      return state;
  }
}

export function loadInitialState(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed?.items || !Array.isArray(parsed.items)) return { items: [] };
    return { items: parsed.items };
  } catch {
    return { items: [] };
  }
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
