import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderView } from "@/components/order/order-view";

export const metadata: Metadata = {
  title: "Buyurtma",
  description:
    "QR orqali buyurtma bering va holatini real vaqtda kuzating — tayyorlanmoqda, tayyor, yetkazildi.",
};

export default function OrderPage() {
  return (
    <div className="pb-16 pt-28">
      <Suspense
        fallback={
          <div className="mx-auto max-w-4xl px-4">
            <div className="h-40 animate-pulse rounded-3xl bg-foreground/5" />
          </div>
        }
      >
        <OrderView />
      </Suspense>
    </div>
  );
}
