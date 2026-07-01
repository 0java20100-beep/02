"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Dish } from "@/lib/types";
import { categories, dishes } from "@/data/menu";
import { DishCard } from "./dish-card";
import { DishModal } from "./dish-modal";
import { cn } from "@/lib/utils";

type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Mashhur" },
  { key: "rating", label: "Reyting" },
  { key: "price-asc", label: "Arzon" },
  { key: "price-desc", label: "Qimmat" },
];

function emojiFor(categoryId: string) {
  return categories.find((c) => c.id === categoryId)?.emoji;
}

export function MenuView() {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [selected, setSelected] = useState<Dish | null>(null);

  const filtered = useMemo(() => {
    let list = dishes;
    if (active !== "all") list = list.filter((d) => d.categoryId === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.ingredients.some((i) => i.toLowerCase().includes(q)),
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort(
          (a, b) => Number(b.popular ?? false) - Number(a.popular ?? false),
        );
    }
    return sorted;
  }, [active, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Search + sort */}
      <div className="sticky top-20 z-30 mb-6 rounded-3xl glass-strong p-3 shadow-soft sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Taom qidirish..."
              className="w-full rounded-full border border-border bg-transparent py-3 pl-12 pr-10 text-sm focus:border-gold focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Tozalash"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted" />
            {sortOptions.map((o) => (
              <button
                key={o.key}
                onClick={() => setSort(o.key)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  sort === o.key
                    ? "btn-gold"
                    : "border border-border hover:border-gold hover:text-gold-400",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setActive("all")}
          className={cn(
            "shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
            active === "all"
              ? "btn-gold shadow-glow-sm"
              : "glass hover:text-gold-400",
          )}
        >
          Barchasi
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
              active === c.id
                ? "btn-gold shadow-glow-sm"
                : "glass hover:text-gold-400",
            )}
          >
            <span>{c.emoji}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <div className="text-5xl">🔍</div>
          <p className="text-muted">Hech narsa topilmadi</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((dish, i) => (
              <DishCard
                key={dish.id}
                dish={dish}
                emoji={emojiFor(dish.categoryId)}
                onOpen={setSelected}
                index={i}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <DishModal dish={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
