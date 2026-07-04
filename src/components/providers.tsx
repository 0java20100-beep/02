"use client";

import { ThemeProvider } from "@/context/theme-provider";
import { CartProvider } from "@/context/cart-provider";
import { OrderProvider } from "@/context/order-provider";
import { MenuProvider } from "@/context/menu-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MenuProvider>
        <OrderProvider>
          <CartProvider>{children}</CartProvider>
        </OrderProvider>
      </MenuProvider>
    </ThemeProvider>
  );
}
