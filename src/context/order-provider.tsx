"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type { CartItem, OrderStatus } from "@/lib/types";

export interface Order {
  id: string;
  tableNumber: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
}

interface OrderContextValue {
  tableNumber: number;
  setTableNumber: (n: number) => void;
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (items: CartItem[], total: number) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  clearOrders: () => void;
  waiterCalled: boolean;
  callWaiter: () => void;
  resetWaiter: () => void;
  billRequested: boolean;
  requestBill: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

const STATUS_FLOW: OrderStatus[] = ["pending", "cooking", "ready", "delivered"];
const ORDERS_KEY = "sharqona-orders";

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [tableNumber, setTableNumberState] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [billRequested, setBillRequested] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ordersLoaded = useRef(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("sharqona-table");
    if (stored) setTableNumberState(Number(stored));

    const storedOrders = window.localStorage.getItem(ORDERS_KEY);
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders) as Order[]);
      } catch {
        /* ignore corrupt orders */
      }
    }
    ordersLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!ordersLoaded.current) return;
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
    };
  }, []);

  const setTableNumber = useCallback((n: number) => {
    setTableNumberState(n);
    window.localStorage.setItem("sharqona-table", String(n));
  }, []);

  const advanceStatus = useCallback((orderId: string, next: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: next } : o)),
    );
  }, []);

  const placeOrder = useCallback(
    (items: CartItem[], total: number) => {
      const order: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        tableNumber,
        items,
        total,
        status: "pending",
        createdAt: Date.now(),
      };
      setOrders((prev) => [order, ...prev]);

      // Simulate realtime kitchen progress.
      STATUS_FLOW.slice(1).forEach((status, idx) => {
        const t = setTimeout(
          () => advanceStatus(order.id, status),
          (idx + 1) * 6000,
        );
        timers.current.push(t);
      });

      return order;
    },
    [tableNumber, advanceStatus],
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
    },
    [],
  );

  const clearOrders = useCallback(() => setOrders([]), []);

  const callWaiter = useCallback(() => {
    setWaiterCalled(true);
    const t = setTimeout(() => setWaiterCalled(false), 10000);
    timers.current.push(t);
  }, []);

  const resetWaiter = useCallback(() => setWaiterCalled(false), []);
  const requestBill = useCallback(() => setBillRequested(true), []);

  const activeOrder =
    orders.find((o) => o.status !== "delivered") ?? orders[0] ?? null;

  return (
    <OrderContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        orders,
        activeOrder,
        placeOrder,
        updateOrderStatus,
        clearOrders,
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
