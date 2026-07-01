"use client";

import { motion } from "framer-motion";
import { Plus, Quote } from "lucide-react";
import { getChefPicks } from "@/data/menu";
import { formatSom } from "@/lib/utils";
import { useCart } from "@/context/cart-provider";
import { DishImage } from "@/components/ui/dish-image";
import { Rating } from "@/components/ui/rating";
import { Reveal } from "@/components/ui/reveal";

const picks = getChefPicks();

export function ChefPick() {
  const { addItem, openCart } = useCart();

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10 bg-emerald-700" />
      <div className="absolute inset-0 -z-10 bg-ornament [background-size:24px_24px] opacity-30" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(212,175,55,0.2),transparent_50%)]" />

      <div className="mx-auto max-w-7xl px-4 text-emerald-50">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="mb-3 flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-gold-300">
            <span className="h-px w-8 bg-gold/60" /> Bosh oshpaz tavsiyasi
            <span className="h-px w-8 bg-gold/60" />
          </div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Oshpazimiz sevimlilari
          </h2>
          <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-3 text-emerald-100/80">
            <Quote className="h-8 w-8 shrink-0 text-gold-300" />
            <p className="italic">
              Har bir taom qalbdan tayyorlanadi — bu mening asrlar davomida
              sayqallangan retseptlarim.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {picks.map((dish, i) => (
            <Reveal key={dish.id} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -10 }}
                className="group overflow-hidden rounded-3xl glass-strong shadow-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <DishImage
                    src={dish.image}
                    alt={dish.name}
                    sizes="33vw"
                    className="transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-emerald-700">
                    Chef tavsiyasi
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-xl font-bold">
                      {dish.name}
                    </h3>
                    <Rating value={dish.rating} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-emerald-100/75">
                    {dish.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-gold-300">
                      {formatSom(dish.price)}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        addItem(dish);
                        openCart();
                      }}
                      aria-label="Savatga qo'shish"
                      className="flex h-11 w-11 items-center justify-center rounded-full btn-gold shadow-glow-sm"
                    >
                      <Plus className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
