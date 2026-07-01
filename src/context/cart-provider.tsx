"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import type { CartItem, Dish } from "@/lib/types";

interface PromoCode {
  code: string;
  discountPercent: number;
}

const PROMO_CODES: PromoCode[] = [
  { code: "SHARQONA10", discountPercent: 10 },
  { code: "PALOV20", discountPercent: 20 },
  { code: "VIP15", discountPercent: 15 },
];

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  promo: PromoCode | null;
  promoError: string | null;
  addItem: (dish: Dish) => void;
  removeItem: (dishId: string) => void;
  decrement: (dishId: string) => void;
  setQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyPromo: (code: string) => void;
  removePromo: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("sharqona-cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored) as CartItem[]);
      } catch {
        /* ignore corrupt cart */
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sharqona-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((dish: Dish) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.dish.id === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((dishId: string) => {
    setItems((prev) => prev.filter((i) => i.dish.id !== dishId));
  }, []);

  const decrement = useCallback((dishId: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.dish.id === dishId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const setQuantity = useCallback((dishId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.dish.id === dishId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromo(null);
    setPromoError(null);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const applyPromo = useCallback((code: string) => {
    const found = PROMO_CODES.find(
      (p) => p.code.toLowerCase() === code.trim().toLowerCase(),
    );
    if (found) {
      setPromo(found);
      setPromoError(null);
    } else {
      setPromo(null);
      setPromoError("Promo kod noto'g'ri");
    }
  }, []);

  const removePromo = useCallback(() => {
    setPromo(null);
    setPromoError(null);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0),
    [items],
  );

  const discount = useMemo(
    () => (promo ? Math.round((subtotal * promo.discountPercent) / 100) : 0),
    [subtotal, promo],
  );

  const total = subtotal - discount;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        promo,
        promoError,
        addItem,
        removeItem,
        decrement,
        setQuantity,
        clearCart,
        openCart,
        closeCart,
        applyPromo,
        removePromo,
        totalItems,
        subtotal,
        discount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
