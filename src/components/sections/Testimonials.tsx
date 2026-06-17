"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { testimonials } from "@/data/testimonials";
import SectionHeading from "@/components/ui/SectionHeading";
import RatingStars from "@/components/ui/RatingStars";

export default function Testimonials() {
  const { dict } = useLanguage();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setIndex((i) => (i + d + testimonials.length) % testimonials.length);
    },
    [],
  );

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[index];

  return (
    <section className="section relative overflow-hidden bg-gradient-to-b from-watermelon-50/40 to-background">
      <div className="container-px mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={dict.sections.testimonialsTitle}
          title={dict.sections.testimonialsTitle}
          subtitle={dict.sections.testimonialsSubtitle}
        />

        <div className="relative mt-12">
          <Quote className="mx-auto mb-6 h-12 w-12 text-watermelon-200" />
          <div className="relative min-h-[16rem] sm:min-h-[14rem]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={t.id}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="mx-auto max-w-3xl text-center"
              >
                <RatingStars rating={t.rating} size={20} className="justify-center" />
                <p className="mt-5 font-display text-xl leading-relaxed text-ink-900 sm:text-2xl">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-watermelon-200"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-ink-950">{t.name}</p>
                    <p className="text-sm text-ink-800/60">
                      {t.trip} · {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/10 bg-white text-ink-800 transition-colors hover:border-watermelon-300 hover:text-watermelon-600"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1.5">
              {testimonials.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-watermelon-500" : "w-2 bg-ink-900/15 hover:bg-ink-900/30"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/10 bg-white text-ink-800 transition-colors hover:border-watermelon-300 hover:text-watermelon-600"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
