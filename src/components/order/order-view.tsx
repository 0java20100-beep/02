"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  QrCode,
  UtensilsCrossed,
  ReceiptText,
  BellRing,
  Check,
  PartyPopper,
} from "lucide-react";
import { useOrder } from "@/context/order-provider";
import { formatSom } from "@/lib/utils";
import { DishImage } from "@/components/ui/dish-image";
import { OrderStatusTracker } from "./order-status";
import { RippleButton } from "@/components/ui/ripple-button";

export function OrderView() {
  const params = useSearchParams();
  const {
    tableNumber,
    setTableNumber,
    activeOrder,
    myOrders,
    callWaiter,
    waiterCalled,
    requestBill,
    billRequested,
  } = useOrder();

  useEffect(() => {
    const t = params.get("table");
    if (t && !Number.isNaN(Number(t))) {
      setTableNumber(Number(t));
    }
  }, [params, setTableNumber]);

  // Notify (vibrate) once when the active order becomes ready.
  const prevStatus = useRef<string | null>(null);
  useEffect(() => {
    const status = activeOrder?.status ?? null;
    if (
      status === "ready" &&
      prevStatus.current &&
      prevStatus.current !== "ready" &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    ) {
      navigator.vibrate?.([200, 100, 200]);
    }
    prevStatus.current = status;
  }, [activeOrder?.status]);

  const isReady = activeOrder?.status === "ready";
  const isDelivered = activeOrder?.status === "delivered";

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* Table banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-emerald-700 to-emerald-800 p-6 text-emerald-50 shadow-card sm:p-8"
      >
        <div className="absolute inset-0 bg-ornament [background-size:22px_22px] opacity-30" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl btn-gold shadow-glow-sm">
            <QrCode className="h-7 w-7" />
          </div>
          <div>
            <div className="text-sm text-emerald-100/80">
              Xush kelibsiz, sizning stolingiz
            </div>
            <div className="font-display text-3xl font-bold">
              Stol #{tableNumber}
            </div>
          </div>
        </div>
      </motion.div>

      {activeOrder ? (
        <div className="space-y-8">
          <AnimatePresence>
            {(isReady || isDelivered) && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className={
                  isReady
                    ? "flex items-center gap-4 rounded-3xl border border-gold/40 bg-gradient-to-br from-gold/20 to-gold/5 p-5 shadow-glow-sm"
                    : "flex items-center gap-4 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-5"
                }
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full btn-gold">
                  {isReady ? (
                    <PartyPopper className="h-6 w-6" />
                  ) : (
                    <Check className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <p className="font-display text-lg font-bold">
                    {isReady
                      ? "Buyurtmangiz tayyor! 🎉"
                      : "Buyurtma yetkazildi"}
                  </p>
                  <p className="text-sm text-muted">
                    {isReady
                      ? "Ofitsiant tez orada stolingizga olib keladi."
                      : "Yoqimli ishtaha! Rahmat."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl glass p-6 shadow-soft sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">
                  Buyurtma holati
                </h2>
                <p className="text-sm text-muted">#{activeOrder.id}</p>
              </div>
            </div>
            <OrderStatusTracker status={activeOrder.status} />
          </motion.section>

          {/* Bill */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl glass p-6 shadow-soft sm:p-8"
          >
            <div className="mb-5 flex items-center gap-2">
              <ReceiptText className="h-5 w-5 text-gold-400" />
              <h2 className="font-display text-xl font-bold">Hisob</h2>
            </div>
            <div className="space-y-3">
              {activeOrder.items.map((item) => (
                <div key={item.dish.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <DishImage
                      src={item.dish.image}
                      alt={item.dish.name}
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">
                      {item.dish.name}
                    </div>
                    <div className="text-xs text-muted">
                      {item.quantity} × {formatSom(item.dish.price)}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gold-400">
                    {formatSom(item.dish.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="font-display text-lg font-bold">Jami</span>
              <span className="font-display text-2xl font-bold text-gold-400">
                {formatSom(activeOrder.total)}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <RippleButton
                variant="outline"
                onClick={callWaiter}
                className="flex-1"
              >
                {waiterCalled ? (
                  <>
                    <Check className="h-5 w-5" /> Chaqirildi
                  </>
                ) : (
                  <>
                    <BellRing className="h-5 w-5" /> Ofitsiant
                  </>
                )}
              </RippleButton>
              <RippleButton onClick={requestBill} className="flex-1">
                {billRequested ? (
                  <>
                    <Check className="h-5 w-5" /> Hisob so&apos;raldi
                  </>
                ) : (
                  <>
                    <ReceiptText className="h-5 w-5" /> To&apos;lash
                  </>
                )}
              </RippleButton>
            </div>
          </motion.section>

          <div className="text-center">
            <Link href="/menu">
              <RippleButton variant="ghost">
                <UtensilsCrossed className="h-5 w-5" /> Qo&apos;shimcha buyurtma
              </RippleButton>
            </Link>
          </div>

          {myOrders.length > 1 && (
            <section className="rounded-3xl glass p-6 shadow-soft">
              <h3 className="mb-4 font-display text-lg font-bold">
                Oldingi buyurtmalar
              </h3>
              <div className="space-y-2">
                {myOrders.slice(1).map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm"
                  >
                    <span className="text-muted">#{o.id}</span>
                    <span className="font-semibold text-gold-400">
                      {formatSom(o.total)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-5 rounded-3xl glass p-12 text-center shadow-soft"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
            <UtensilsCrossed className="h-9 w-9 text-gold-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">
              Hali buyurtma yo&apos;q
            </h2>
            <p className="mt-2 max-w-sm text-muted">
              Menyudan sevimli taomlaringizni tanlang va buyurtma bering.
              Holatini shu yerda real vaqtda kuzatasiz.
            </p>
          </div>
          <Link href="/menu">
            <RippleButton className="px-7 py-3.5">
              <UtensilsCrossed className="h-5 w-5" /> Menyuni ochish
            </RippleButton>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
