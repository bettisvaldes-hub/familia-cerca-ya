import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Combo } from "@/data/combos";

export type CartItem = {
  comboId: string;
  name: string;
  priceUsd: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD"; combo: Combo; quantity?: number }
  | { type: "REMOVE"; comboId: string }
  | { type: "SET_QTY"; comboId: string; quantity: number }
  | { type: "CLEAR" };

const STORAGE_KEY = "combos_familia_cart_v1";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const q = action.quantity ?? 1;
      const existing = state.items.find((i) => i.comboId === action.combo.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.comboId === action.combo.id ? { ...i, quantity: i.quantity + q } : i,
          ),
        };
      }
      return {
        items: [
          {
            comboId: action.combo.id,
            name: action.combo.name,
            priceUsd: action.combo.priceUsd,
            image: action.combo.image,
            quantity: q,
          },
          ...state.items,
        ],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.comboId !== action.comboId) };
    case "SET_QTY": {
      const qty = Math.max(1, Math.min(99, Math.floor(action.quantity || 1)));
      return {
        items: state.items.map((i) => (i.comboId === action.comboId ? { ...i, quantity: qty } : i)),
      };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalUsd: number;
  add: (combo: Combo, quantity?: number) => void;
  remove: (comboId: string) => void;
  setQty: (comboId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function safeLoad(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed?.items || !Array.isArray(parsed.items)) return { items: [] };
    return {
      items: parsed.items
        .filter(Boolean)
        .map((i) => ({
          comboId: String(i.comboId),
          name: String(i.name),
          priceUsd: Number(i.priceUsd),
          image: String(i.image),
          quantity: Number(i.quantity) || 1,
        }))
        .filter((i) => i.comboId && i.name && Number.isFinite(i.priceUsd)),
    };
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, safeLoad);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotalUsd = state.items.reduce((acc, i) => acc + i.quantity * i.priceUsd, 0);
    return {
      items: state.items,
      count,
      subtotalUsd,
      add: (combo, quantity) => dispatch({ type: "ADD", combo, quantity }),
      remove: (comboId) => dispatch({ type: "REMOVE", comboId }),
      setQty: (comboId, quantity) => dispatch({ type: "SET_QTY", comboId, quantity }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
