'use client';

import React, { createContext, useContext, useEffect, useReducer, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  option?: string;
};

export type ToastState = {
  item: Omit<CartItem, 'quantity'>;
  timestamp: number;
  cartQuantity: number;
};

type CartState = {
  items: CartItem[];
  isHydrated: boolean;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: string; option?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; option?: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  isHydrated: false, // Ensures we don't render mismatched hydration state
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id && item.option === action.payload.option);
      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => !(item.id === action.payload.id && item.option === action.payload.option)) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => !(item.id === action.payload.id && item.option === action.payload.option)),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id && item.option === action.payload.option
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }
    case 'HYDRATE_CART': {
      return { ...state, items: action.payload, isHydrated: true };
    }
    default:
      return state;
  }
}

type CartContextType = {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, option?: string) => void;
  updateQuantity: (id: string, quantity: number, option?: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  toast: ToastState | null;
  hideToast: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'thb-cart-storage';

// Phase 2: We will connect this to a real backend database for checkout and persistence
// Currently it just operates fully in the browser and saves to localStorage.
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: 'HYDRATE_CART', payload: parsed });
      } else {
        dispatch({ type: 'HYDRATE_CART', payload: [] });
      }
    } catch (e) {
      console.error('Failed to parse cart from local storage', e);
      dispatch({ type: 'HYDRATE_CART', payload: [] });
    }
  }, []);

  // Save cart to localStorage on state changes (if hydrated)
  useEffect(() => {
    if (state.isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, state.isHydrated]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    
    const existing = state.items.find(i => i.id === item.id && i.option === item.option);
    const newQuantity = existing ? existing.quantity + 1 : 1;
    
    setToast({ item, timestamp: Date.now(), cartQuantity: newQuantity });
  };

  const hideToast = () => setToast(null);

  const removeItem = (id: string, option?: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, option } });
  };

  const updateQuantity = (id: string, quantity: number, option?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, option } });
  };
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        toast,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
