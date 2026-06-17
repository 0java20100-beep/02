"use client";

import Image from "next/image";
import { Compass, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { unsplash } from "@/data/destinations";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const values = [
  { icon: Compass, key: "tailored" },
  { icon: ShieldCheck, key: "trusted" },
  { icon: HeartHandshake, key: "care" },
  { icon: Sparkles, key: "premium" },
] as const;

const valueText: Record<string, { title: string; desc: string }> = {
  tailored: {
    title: "Tailor-made journeys",
    desc: "Every itinerary is handcrafted around how you love to travel.",
  },
  trusted: {
    title: "Trusted & secure",
    desc: "Protected payments and 24/7 support on every booking.",
  },
  care: {
    title: "Human concierge",
    desc: "Real travel experts, reachable any time, anywhere you go.",
  },
  premium: {
    title: "Premium partners",
    desc: "Hand-picked hotels, airlines and guides at the very top.",
  },
};

export default function About() {
  const { dict } = useLanguage();

  return (
    <section id="about" className="section bg-background">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
                <Image
                  src={unsplash("photo-1530122037265-a5f1f91d3b99", 800, 78)}
                  alt="Luxury travel by Watermelon Travel"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden w-44 overflow-hidden rounded-2xl border-4 border-background shadow-card sm:block">
                <div className="relative aspect-square">
                  <Image
                    src={unsplash("photo-1537996194471-e657df975ab4", 400, 75)}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="glass-light absolute -left-5 top-8 hidden rounded-2xl px-5 py-3 shadow-card sm:block">
                <p className="font-display text-2xl font-bold text-watermelon-600">12+</p>
                <p className="text-xs text-ink-800/70">{dict.stats.yearsExperience}</p>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              align="left"
              eyebrow={dict.nav.about}
              title={dict.sections.aboutTitle}
              subtitle={dict.sections.aboutSubtitle}
            />
            <p className="mt-5 text-ink-800/70">
              Watermelon Travel began with a simple belief: that travel should feel effortless,
              personal and unforgettable. Today we design premium journeys to more than 20 countries,
              blending iconic landmarks with hidden local moments — all wrapped in five-star service
              from the first click to your journey home.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {values.map((v, i) => {
                const Icon = v.icon;
                const text = valueText[v.key];
                return (
                  <Reveal key={v.key} delay={i * 0.08}>
                    <div className="flex gap-3.5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-watermelon-50 text-watermelon-600">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold text-ink-950">{text.title}</h3>
                        <p className="mt-1 text-sm text-ink-800/65">{text.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
