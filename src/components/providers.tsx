"use client";

import { ThemeProvider } from "@/context/theme-provider";
import { CartProvider } from "@/context/cart-provider";
import { OrderProvider } from "@/context/order-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <OrderProvider>
        <CartProvider>{children}</CartProvider>
      </OrderProvider>
    </ThemeProvider>
  );
}
