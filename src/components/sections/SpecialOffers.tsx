"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { offers } from "@/data/offers";
import { getDestination, unsplash } from "@/data/destinations";
import SectionHeading from "@/components/ui/SectionHeading";
import CountdownTimer from "@/components/ui/CountdownTimer";
import Reveal from "@/components/ui/Reveal";

export default function SpecialOffers() {
  const { dict, formatPrice } = useLanguage();

  return (
    <section id="offers" className="section bg-ink-50/60">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={dict.offers.limitedTime}
          title={dict.sections.offersTitle}
          subtitle={dict.sections.offersSubtitle}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer, i) => {
            const dest = getDestination(offer.destinationId);
            if (!dest) return null;
            return (
              <Reveal key={offer.id} delay={(i % 3) * 0.08}>
                <motion.article
                  whileHover={{ y: -6 }}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={unsplash(offer.image, 800, 75)}
                      alt={dest.city}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-watermelon-gradient px-3 py-1 text-xs font-bold text-white shadow-glow">
                      -{offer.discountPercent}% {dict.offers.save}
                    </span>
                    <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-900 backdrop-blur">
                      {offer.badge}
                    </span>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-xs text-white/80">{dest.country}</p>
                      <h3 className="font-display text-xl font-semibold">{dest.city}</h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="font-medium text-ink-900">{offer.title}</p>

                    <div className="mt-3 flex items-end gap-2">
                      <span className="font-display text-2xl font-bold text-watermelon-600">
                        {formatPrice(offer.newPrice)}
                      </span>
                      <span className="mb-1 text-sm text-ink-800/50 line-through">
                        {formatPrice(offer.originalPrice)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-800/60">
                        {dict.offers.endsIn}
                      </p>
                      <CountdownTimer endsInHours={offer.endsInHours} />
                    </div>

                    <Link
                      href={`/booking?destination=${dest.id}`}
                      className="btn btn-primary mt-5 w-full justify-center"
                    >
                      {dict.common.bookNow}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
