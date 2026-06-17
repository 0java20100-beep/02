"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Globe, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { tours } from "@/data/tours";
import { getDestination, unsplash } from "@/data/destinations";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Tours({ full = false }: { full?: boolean }) {
  const { dict, formatPrice } = useLanguage();
  const list = full ? tours : tours.slice(0, 6);

  return (
    <section id="tours" className="section bg-background">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={dict.nav.tours}
          title={dict.sections.toursTitle}
          subtitle={dict.sections.toursSubtitle}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((tour, i) => (
            <Reveal key={tour.id} delay={(i % 3) * 0.08}>
              <motion.article
                whileHover={{ y: -6 }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <Image
                    src={unsplash(tour.image, 800, 75)}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-900 backdrop-blur">
                    {tour.style}
                  </span>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-xs text-white/90">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> {tour.days} {dict.common.days}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" /> {tour.countries} {dict.stats.countries}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-semibold text-ink-950">{tour.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-800/70">{tour.blurb}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tour.destinationIds.map((id) => {
                      const d = getDestination(id);
                      if (!d) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 rounded-full bg-ink-50 px-2.5 py-1 text-xs text-ink-800"
                        >
                          <MapPin className="h-3 w-3 text-watermelon-500" />
                          {d.city}
                        </span>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-ink-900/5 pt-4">
                    <span className="text-sm text-ink-800/60">
                      {dict.common.from}{" "}
                      <span className="font-display text-lg font-semibold text-watermelon-600">
                        {formatPrice(tour.priceFrom)}
                      </span>
                    </span>
                    <Link
                      href={`/booking?destination=${tour.destinationIds[0]}`}
                      className="flex items-center gap-1 text-sm font-semibold text-watermelon-600 hover:gap-2"
                    >
                      {dict.common.book} <ArrowRight className="h-4 w-4 transition-all" />
                    </Link>
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
