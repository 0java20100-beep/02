"use client";

import { Users, Globe, Plane, Award } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { stats } from "@/data/stats";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";

const icons = {
  happyTravelers: Users,
  countries: Globe,
  toursCompleted: Plane,
  yearsExperience: Award,
} as const;

export default function Stats() {
  const { dict } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-ink-950 py-20">
      <div className="pointer-events-none absolute inset-0 bg-premium-radial opacity-40" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-watermelon-500/20 blur-3xl" />
      <div className="container-px relative mx-auto max-w-7xl">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="heading-display text-3xl text-white sm:text-4xl">
            {dict.sections.statsTitle}
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = icons[s.id];
            return (
              <Reveal key={s.id} delay={i * 0.1}>
                <div className="glass-dark rounded-3xl p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-watermelon-gradient shadow-glow">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="font-display text-4xl font-bold text-white sm:text-5xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-2 text-sm font-medium uppercase tracking-wider text-white/60">
                    {dict.stats[s.id]}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
