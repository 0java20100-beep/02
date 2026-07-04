"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dish } from "@/lib/types";
import { useMenu } from "@/context/menu-provider";
import { DishCard } from "@/components/menu/dish-card";
import { DishModal } from "@/components/menu/dish-modal";
import { SectionHeading } from "@/components/ui/section-heading";
import { RippleButton } from "@/components/ui/ripple-button";

export function PopularDishes() {
  const [selected, setSelected] = useState<Dish | null>(null);
  const { popularDishes: popular, categories } = useMenu();

  const emojiFor = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.emoji;

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Mijozlar tanlovi"
          title="Mashhur taomlar"
          subtitle="Eng ko'p buyurtma qilinadigan taomlarimiz"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((dish, i) => (
            <DishCard
              key={dish.id}
              dish={dish}
              emoji={emojiFor(dish.categoryId)}
              onOpen={setSelected}
              index={i}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/menu">
            <RippleButton variant="outline" className="px-7 py-3.5">
              Barcha taomlar <ArrowRight className="h-5 w-5" />
            </RippleButton>
          </Link>
        </div>
      </div>

      <DishModal dish={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
