"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type { CartItem, Order, OrderStatus } from "@/lib/types";

interface OrderContextValue {
  tableNumber: number;
  setTableNumber: (n: number) => void;
  orders: Order[];
  myOrders: Order[];
  activeOrder: Order | null;
  loading: boolean;
  placeOrder: (items: CartItem[], total: number) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  setPaid: (orderId: string, paid: boolean) => Promise<void>;
  clearOrders: () => Promise<void>;
  refresh: () => Promise<void>;
  waiterCalled: boolean;
  callWaiter: () => void;
  resetWaiter: () => void;
  billRequested: boolean;
  requestBill: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

const TABLE_KEY = "sharqona-table";
const MY_ORDERS_KEY = "sharqona-my-orders";
const POLL_MS = 7000;

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [tableNumber, setTableNumberState] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [myOrderIds, setMyOrderIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [billRequested, setBillRequested] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { orders: Order[] };
      setOrders(data.orders ?? []);
    } catch {
      /* offline / transient — keep previous state */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedTable = window.localStorage.getItem(TABLE_KEY);
    if (storedTable) setTableNumberState(Number(storedTable));
    const storedMine = window.localStorage.getItem(MY_ORDERS_KEY);
    if (storedMine) {
      try {
        setMyOrderIds(JSON.parse(storedMine) as string[]);
      } catch {
        /* ignore */
      }
    }
    refresh();
    const interval = setInterval(refresh, POLL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
    };
  }, []);

  const setTableNumber = useCallback((n: number) => {
    setTableNumberState(n);
    window.localStorage.setItem(TABLE_KEY, String(n));
  }, []);

  const placeOrder = useCallback(
    async (items: CartItem[], total: number) => {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableNumber, items, total }),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { order: Order };
        const order = data.order;
        setOrders((prev) => [order, ...prev]);
        setMyOrderIds((prev) => {
          const next = [order.id, ...prev].slice(0, 50);
          window.localStorage.setItem(MY_ORDERS_KEY, JSON.stringify(next));
          return next;
        });
        return order;
      } catch {
        return null;
      }
    },
    [tableNumber],
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
      try {
        await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
      } catch {
        /* will re-sync on next poll */
      }
    },
    [],
  );

  const setPaid = useCallback(async (orderId: string, paid: boolean) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paid } : o)),
    );
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid }),
      });
    } catch {
      /* will re-sync on next poll */
    }
  }, []);

  const clearOrders = useCallback(async () => {
    setOrders([]);
    try {
      await fetch("/api/orders", { method: "DELETE" });
    } catch {
      /* ignore */
    }
    setMyOrderIds([]);
    window.localStorage.removeItem(MY_ORDERS_KEY);
  }, []);

  const callWaiter = useCallback(() => {
    setWaiterCalled(true);
    const t = setTimeout(() => setWaiterCalled(false), 10000);
    timers.current.push(t);
  }, []);

  const resetWaiter = useCallback(() => setWaiterCalled(false), []);
  const requestBill = useCallback(() => setBillRequested(true), []);

  const myOrders = orders
    .filter((o) => myOrderIds.includes(o.id) || o.tableNumber === tableNumber)
    .sort((a, b) => b.createdAt - a.createdAt);

  const activeOrder =
    myOrders.find((o) => o.status !== "delivered") ?? myOrders[0] ?? null;

  return (
    <OrderContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        orders,
        myOrders,
        activeOrder,
        loading,
        placeOrder,
        updateOrderStatus,
        setPaid,
        clearOrders,
        refresh,
        waiterCalled,
        callWaiter,
        resetWaiter,
        billRequested,
        requestBill,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}
