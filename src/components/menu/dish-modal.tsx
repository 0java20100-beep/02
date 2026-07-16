"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Clock, Flame, Utensils } from "lucide-react";
import type { Dish } from "@/lib/types";
import { formatSom } from "@/lib/utils";
import { useCart } from "@/context/cart-provider";
import { DishImage } from "@/components/ui/dish-image";
import { Rating } from "@/components/ui/rating";
import { RippleButton } from "@/components/ui/ripple-button";

interface DishModalProps {
  dish: Dish | null;
  onClose: () => void;
}

export function DishModal({ dish, onClose }: DishModalProps) {
  const { addItem, openCart } = useCart();

  const handleAdd = () => {
    if (!dish) return;
    addItem(dish);
    onClose();
    openCart();
  };

  return (
    <AnimatePresence>
      {dish && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="glass-strong relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl shadow-card sm:rounded-3xl no-scrollbar"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl">
              <DishImage
                src={dish.image}
                alt={dish.name}
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button
                onClick={onClose}
                aria-label="Yopish"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full glass-strong text-foreground transition-transform hover:rotate-90"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <h2 className="font-display text-2xl font-bold text-white drop-shadow-lg">
                  {dish.name}
                </h2>
                <Rating value={dish.rating} />
              </div>
            </div>

            <div className="p-6">
              <p className="text-muted">{dish.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-2xl glass p-3">
                  <Clock className="h-5 w-5 text-gold-400" />
                  <span>{dish.cookTime} daqiqa</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl glass p-3">
                  <Flame className="h-5 w-5 text-gold-400" />
                  <span>{dish.calories} kkal</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-400">
                  <Utensils className="h-4 w-4" /> Tarkibi
                </div>
                <div className="flex flex-wrap gap-2">
                  {dish.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-sm"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-muted">Narxi</div>
                  <div className="font-display text-2xl font-bold text-gold-400">
                    {formatSom(dish.price)}
                  </div>
                </div>
                <RippleButton onClick={handleAdd} className="flex-1 sm:flex-none">
                  <Plus className="h-5 w-5" /> Savatga qo&apos;shish
                </RippleButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
