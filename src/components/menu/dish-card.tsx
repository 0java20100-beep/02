"use client";

import { motion } from "framer-motion";
import { Plus, Flame, Clock } from "lucide-react";
import type { Dish } from "@/lib/types";
import { formatSom } from "@/lib/utils";
import { useCart } from "@/context/cart-provider";
import { DishImage } from "@/components/ui/dish-image";
import { Rating } from "@/components/ui/rating";

interface DishCardProps {
  dish: Dish;
  emoji?: string;
  onOpen?: (dish: Dish) => void;
  index?: number;
}

export function DishCard({ dish, emoji, onOpen, index = 0 }: DishCardProps) {
  const { addItem, openCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(dish);
    openCart();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      whileHover={{ y: -8 }}
      onClick={() => onOpen?.(dish)}
      className="group glass card relative flex cursor-pointer flex-col overflow-hidden rounded-3xl shadow-soft transition-shadow duration-500 hover:shadow-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <DishImage
          src={dish.image}
          alt={dish.name}
          emoji={emoji}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          {dish.chefPick && (
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-emerald-700 shadow-glow-sm">
              Chef tavsiyasi
            </span>
          )}
          {dish.spicy && (
            <span className="flex items-center gap-1 rounded-full bg-red-600/90 px-2.5 py-1 text-xs font-semibold text-white">
              <Flame className="h-3 w-3" /> Achchiq
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full glass-strong px-3 py-1.5 text-sm font-bold text-gold-400 shadow-soft">
          {formatSom(dish.price)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-tight">
            {dish.name}
          </h3>
          <Rating value={dish.rating} />
        </div>
        <p className="line-clamp-2 flex-1 text-sm text-muted">
          {dish.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Clock className="h-3.5 w-3.5 text-gold-400" />
            {dish.cookTime} daq · {dish.calories} kkal
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            aria-label={`${dish.name} savatga qo'shish`}
            className="btn-gold flex h-10 w-10 items-center justify-center rounded-full shadow-glow-sm transition-shadow hover:shadow-glow"
          >
            <Plus className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
