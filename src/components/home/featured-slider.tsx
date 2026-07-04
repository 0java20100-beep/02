"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMenu } from "@/context/menu-provider";
import { formatSom } from "@/lib/utils";
import { useCart } from "@/context/cart-provider";
import { DishImage } from "@/components/ui/dish-image";
import { Rating } from "@/components/ui/rating";
import { SectionHeading } from "@/components/ui/section-heading";
import { RippleButton } from "@/components/ui/ripple-button";

const slideVariants = {
  enter: (custom: number) => ({ opacity: 0, x: custom * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (custom: number) => ({ opacity: 0, x: custom * -60 }),
};

export function FeaturedSlider() {
  const { addItem, openCart } = useCart();
  const { popularDishes: slides } = useMenu();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setIndex((prev) => (prev + dir + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => paginate(1), 5000);
    return () => clearInterval(t);
  }, [paginate, slides.length]);

  useEffect(() => {
    if (index >= slides.length && slides.length > 0) setIndex(0);
  }, [index, slides.length]);

  if (slides.length === 0) return null;

  const dish = slides[Math.min(index, slides.length - 1)];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Tavsiya etamiz"
          title="Milliy taomlar"
          subtitle="Eng sevimli va mashhur taomlarimiz to'plami"
        />

        <div className="relative mt-12 overflow-hidden rounded-[2rem] glass shadow-card">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={dish.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid md:grid-cols-2"
            >
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px]">
                <DishImage src={dish.image} alt={dish.name} sizes="50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <Rating value={dish.rating} className="mb-3" />
                <h3 className="font-display text-3xl font-bold md:text-4xl">
                  {dish.name}
                </h3>
                <p className="mt-4 text-muted">{dish.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {dish.ingredients.slice(0, 4).map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-sm"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <span className="font-display text-3xl font-bold text-gold-400">
                    {formatSom(dish.price)}
                  </span>
                  <RippleButton
                    onClick={() => {
                      addItem(dish);
                      openCart();
                    }}
                  >
                    <Plus className="h-5 w-5" /> Buyurtma
                  </RippleButton>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={() => paginate(-1)}
            aria-label="Oldingi"
            className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass-strong transition-transform hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => paginate(1)}
            aria-label="Keyingi"
            className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass-strong transition-transform hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Slayd ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-gold" : "w-2 bg-gold/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
