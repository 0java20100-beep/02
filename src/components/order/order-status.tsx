"use client";

import { motion } from "framer-motion";
import { Check, ChefHat, Package, Truck, Clock } from "lucide-react";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const steps: { key: OrderStatus; label: string; icon: typeof Clock }[] = [
  { key: "pending", label: "Qabul qilindi", icon: Clock },
  { key: "cooking", label: "Tayyorlanmoqda", icon: ChefHat },
  { key: "ready", label: "Tayyor", icon: Package },
  { key: "delivered", label: "Yetkazildi", icon: Truck },
];

export function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 h-full w-0.5 bg-border sm:left-1/2 sm:hidden" />
      <div className="hidden sm:block">
        <div className="relative mx-auto flex max-w-2xl items-center justify-between">
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-border" />
          <motion.div
            className="absolute left-0 top-6 h-0.5 bg-gold"
            initial={{ width: "0%" }}
            animate={{
              width: `${(currentIndex / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.6 }}
          />
          {steps.map((step, i) => {
            const done = i <= currentIndex;
            const active = i === currentIndex;
            return (
              <div
                key={step.key}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <motion.div
                  animate={
                    active
                      ? { scale: [1, 1.12, 1] }
                      : { scale: 1 }
                  }
                  transition={{
                    duration: 1.5,
                    repeat: active ? Infinity : 0,
                  }}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-500",
                    done
                      ? "border-gold btn-gold shadow-glow-sm"
                      : "border-border bg-surface text-muted",
                  )}
                >
                  {done && !active ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-center text-xs font-medium",
                    done ? "text-gold-400" : "text-muted",
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile vertical */}
      <div className="space-y-6 sm:hidden">
        {steps.map((step, i) => {
          const done = i <= currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step.key} className="relative flex items-center gap-4 pl-0">
              <div
                className={cn(
                  "z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2",
                  done
                    ? "border-gold btn-gold shadow-glow-sm"
                    : "border-border bg-surface text-muted",
                )}
              >
                {done && !active ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div>
                <div
                  className={cn(
                    "font-semibold",
                    done ? "text-gold-400" : "text-muted",
                  )}
                >
                  {step.label}
                </div>
                {active && (
                  <div className="text-xs text-muted">Hozirgi holat</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
