"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, ReceiptText, Sparkles, X, Check } from "lucide-react";
import { useOrder } from "@/context/order-provider";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const { callWaiter, waiterCalled, requestBill, billRequested } = useOrder();

  const actions = [
    {
      label: waiterCalled ? "Ofitsiant chaqirildi" : "Ofitsiantni chaqirish",
      icon: waiterCalled ? Check : BellRing,
      onClick: callWaiter,
      active: waiterCalled,
    },
    {
      label: billRequested ? "Hisob so'raldi" : "Hisobni so'rash",
      icon: billRequested ? Check : ReceiptText,
      onClick: requestBill,
      active: billRequested,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[55] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          actions.map((a, i) => (
            <motion.button
              key={a.label}
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ delay: i * 0.06 }}
              onClick={a.onClick}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-soft transition-colors",
                a.active
                  ? "bg-gold text-emerald-700"
                  : "glass-strong hover:text-gold-400",
              )}
            >
              <a.icon className="h-5 w-5" />
              {a.label}
            </motion.button>
          ))}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Xizmatlar"
        className="relative flex h-14 w-14 items-center justify-center rounded-full btn-gold shadow-glow"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            {open ? (
              <X className="h-6 w-6" />
            ) : (
              <Sparkles className="h-6 w-6" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
