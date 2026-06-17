"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, ArrowRight, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { unsplash, type Destination } from "@/data/destinations";

export default function DestinationCard({ destination }: { destination: Destination }) {
  const { dict, formatPrice } = useLanguage();

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-3xl bg-white shadow-card"
    >
      <Link href={`/destinations/${destination.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={unsplash(destination.image, 800, 75)}
            alt={`${destination.city}, ${destination.country}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />

          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink-900 backdrop-blur">
            <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
            {destination.rating}
          </div>

          {destination.popular && (
            <div className="absolute right-4 top-4 rounded-full bg-watermelon-gradient px-2.5 py-1 text-xs font-semibold text-white shadow-glow">
              {dict.common.popular}
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <MapPin className="h-3.5 w-3.5" />
              {destination.country}
            </div>
            <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">
              {destination.city}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-white/80">
                <Clock className="h-3.5 w-3.5" />
                {destination.durationDays} {dict.common.days}
              </span>
              <span className="text-sm text-white/70">
                {dict.common.from}{" "}
                <span className="font-display text-lg font-semibold text-white">
                  {formatPrice(destination.startingPrice)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 p-4">
        <p className="line-clamp-1 text-sm text-ink-800/70">{destination.tagline}</p>
        <Link
          href={`/destinations/${destination.id}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-watermelon-50 text-watermelon-600 transition-colors group-hover:bg-watermelon-gradient group-hover:text-white"
          aria-label={`View ${destination.city}`}
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}
