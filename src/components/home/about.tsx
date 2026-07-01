"use client";

import { motion } from "framer-motion";
import { Leaf, Award, ChefHat, HeartHandshake } from "lucide-react";
import { DishImage } from "@/components/ui/dish-image";
import { Reveal } from "@/components/ui/reveal";

const values = [
  { icon: Leaf, title: "Tabiiy mahsulotlar", desc: "Har kuni yangi va sifatli" },
  { icon: ChefHat, title: "Usta oshpazlar", desc: "15 yillik tajriba" },
  { icon: Award, title: "Premium sifat", desc: "Yuqori standartlar" },
  { icon: HeartHandshake, title: "Mehmondo'stlik", desc: "Sharqona samimiyat" },
];

export function About() {
  return (
    <section className="relative py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-card">
              <DishImage
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=80"
                alt="Restoran interyeri"
                emoji="🏛️"
                sizes="25vw"
              />
            </div>
            <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-3xl shadow-card">
              <DishImage
                src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=700&q=80"
                alt="Milliy taom"
                emoji="🥘"
                sizes="25vw"
              />
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -right-2 top-1/2 rounded-2xl glass-strong px-5 py-4 shadow-card"
          >
            <div className="font-display text-3xl font-bold text-gold-400">
              15+
            </div>
            <div className="text-xs text-muted">yillik tajriba</div>
          </motion.div>
        </Reveal>

        <div>
          <Reveal>
            <div className="mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
              <span className="h-px w-8 bg-gold/60" /> Biz haqimizda
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              An&apos;ana va zamonaviylik{" "}
              <span className="text-gradient-gold">uyg&apos;unligi</span>
            </h2>
            <p className="mt-5 text-muted">
              Sharqona restorani — o&apos;zbek oshxonasining eng nafis
              an&apos;analarini zamonaviy gastronomiya bilan birlashtiradi. Biz
              har bir taomga qalbimizni qo&apos;yamiz va mehmonlarimizga
              unutilmas taassurotlar taqdim etamiz.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="flex items-start gap-3 rounded-2xl glass p-4 transition-transform hover:-translate-y-1">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-400">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{v.title}</div>
                    <div className="text-sm text-muted">{v.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
