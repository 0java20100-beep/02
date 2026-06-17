"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Clock,
  CalendarDays,
  Languages,
  Wallet,
  Plane,
  Hotel,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDestination, destinations, unsplash } from "@/data/destinations";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import RatingStars from "@/components/ui/RatingStars";
import Lightbox from "@/components/ui/Lightbox";
import DestinationCard from "@/components/ui/DestinationCard";

export default function DestinationDetail({ id }: { id: string }) {
  const { dict, formatPrice } = useLanguage();
  const destination = getDestination(id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!destination) notFound();

  const related = destinations
    .filter((d) => d.region === destination.region && d.id !== destination.id)
    .slice(0, 4);

  const galleryImages = [destination.image, ...destination.gallery].map((photo) => ({
    photo,
    caption: destination.city,
    location: destination.country,
  }));

  return (
    <article>
      {/* Hero */}
      <section className="relative flex min-h-[72vh] items-end overflow-hidden pb-12 pt-32">
        <Image
          src={unsplash(destination.image, 2000, 80)}
          alt={`${destination.city}, ${destination.country}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-ink-950/30" />
        <div className="container-px relative z-10 mx-auto w-full max-w-7xl text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                <MapPin className="h-3.5 w-3.5" /> {destination.country}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> {destination.rating} (
                {destination.reviews})
              </span>
              <span className="rounded-full bg-watermelon-gradient px-3 py-1 font-medium shadow-glow">
                {destination.region}
              </span>
            </div>
            <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl lg:text-7xl">
              {destination.city}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-white/80">{destination.tagline}</p>
          </motion.div>
        </div>
      </section>

      <div className="container-px mx-auto max-w-7xl py-14">
        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-14">
            {/* Overview */}
            <section>
              <h2 className="heading-display text-2xl text-ink-950 sm:text-3xl">
                {dict.destinations.overview}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-800/75">{destination.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Fact icon={Clock} label={dict.common.duration} value={`${destination.durationDays} ${dict.common.days}`} />
                <Fact icon={CalendarDays} label={dict.destinations.bestTime} value={destination.bestTime} />
                <Fact icon={Languages} label={dict.destinations.language} value={destination.localLanguage} />
                <Fact icon={Wallet} label={dict.destinations.currency} value={destination.currency} />
              </div>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="heading-display text-2xl text-ink-950 sm:text-3xl">
                {dict.destinations.highlights}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {destination.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-watermelon-50 text-watermelon-600">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-ink-900">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery */}
            <section>
              <h2 className="heading-display text-2xl text-ink-950 sm:text-3xl">
                {dict.destinations.gallery}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`group relative overflow-hidden rounded-2xl ${
                      i === 0 ? "col-span-2 row-span-2 aspect-[4/3] sm:aspect-[3/2]" : "aspect-square"
                    }`}
                  >
                    <Image
                      src={unsplash(img.photo, 700, 72)}
                      alt={`${destination.city} ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-ink-950/0 transition-colors group-hover:bg-ink-950/20" />
                  </button>
                ))}
              </div>
            </section>

            {/* Packages */}
            <section id="packages">
              <h2 className="heading-display text-2xl text-ink-950 sm:text-3xl">
                {dict.destinations.packages}
              </h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {destination.packages.map((pkg, i) => (
                  <div
                    key={pkg.id}
                    className={`flex flex-col rounded-3xl border p-6 shadow-soft transition-all hover:shadow-card ${
                      i === 1
                        ? "border-watermelon-200 bg-gradient-to-b from-watermelon-50/60 to-white"
                        : "border-ink-900/5 bg-white"
                    }`}
                  >
                    {i === 1 && (
                      <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-watermelon-gradient px-3 py-1 text-xs font-semibold text-white">
                        <Sparkles className="h-3 w-3" /> {dict.common.popular}
                      </span>
                    )}
                    <h3 className="font-display text-xl font-semibold text-ink-950">{pkg.name}</h3>
                    <p className="mt-1 text-sm text-ink-800/65">{pkg.summary}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-display text-3xl font-bold text-watermelon-600">
                        {formatPrice(pkg.price)}
                      </span>
                      <span className="text-sm text-ink-800/55">/ {dict.common.perPerson}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-800/55">
                      {pkg.nights} {dict.common.nights}
                    </p>
                    <ul className="mt-4 flex-1 space-y-2">
                      {pkg.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2 text-sm text-ink-800/80">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf-500" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/booking?destination=${destination.id}&package=${pkg.id}`}
                      className={`mt-5 w-full justify-center ${i === 1 ? "btn btn-primary" : "btn btn-outline"}`}
                    >
                      {dict.destinations.viewPackage}
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Hotel & Flight */}
            <section className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-2 text-watermelon-600">
                  <Hotel className="h-5 w-5" />
                  <h3 className="font-semibold uppercase tracking-wide">{dict.destinations.hotel}</h3>
                </div>
                <p className="mt-3 font-display text-lg font-semibold text-ink-950">
                  {destination.hotel.name}
                </p>
                <RatingStars rating={destination.hotel.stars} className="mt-1" />
                <p className="mt-3 text-sm text-ink-800/70">{destination.hotel.description}</p>
              </div>
              <div className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-2 text-watermelon-600">
                  <Plane className="h-5 w-5" />
                  <h3 className="font-semibold uppercase tracking-wide">{dict.destinations.flight}</h3>
                </div>
                <p className="mt-3 font-display text-lg font-semibold text-ink-950">
                  {destination.flight.airline}
                </p>
                <dl className="mt-3 space-y-2 text-sm text-ink-800/70">
                  <div className="flex justify-between">
                    <dt>From</dt>
                    <dd className="font-medium text-ink-900">{destination.flight.from}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Duration</dt>
                    <dd className="font-medium text-ink-900">{destination.flight.duration}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Cabin</dt>
                    <dd className="font-medium text-ink-900">{destination.flight.cabin}</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Included */}
            <section>
              <h2 className="heading-display text-2xl text-ink-950 sm:text-3xl">
                {dict.destinations.includes}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {destination.included.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-ink-800/80">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
                      <Check className="h-4 w-4" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky booking card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-card">
              <p className="text-sm text-ink-800/60">{dict.destinations.perPersonFrom}</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-ink-950">
                  {formatPrice(destination.startingPrice)}
                </span>
                <span className="text-sm text-ink-800/55">/ {dict.common.perPerson}</span>
              </div>

              <div className="mt-5 space-y-3 border-y border-ink-900/5 py-5 text-sm">
                <Row label={dict.common.duration} value={`${destination.durationDays} ${dict.common.days}`} />
                <Row label={dict.destinations.bestTime} value={destination.bestTime} />
                <Row label={dict.destinations.hotel} value={`${destination.hotel.stars}★ ${destination.hotel.name}`} />
                <Row label={dict.destinations.flight} value={destination.flight.cabin} />
              </div>

              <Link
                href={`/booking?destination=${destination.id}`}
                className="btn btn-primary mt-5 w-full justify-center"
              >
                {dict.common.bookNow}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://t.me/watermelon_travel"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline mt-3 w-full justify-center"
              >
                {dict.contact.telegram}
              </a>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <SectionHeading align="left" title={dict.destinations.relatedTitle} />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((d, i) => (
                <Reveal key={d.id} delay={(i % 4) * 0.06}>
                  <DestinationCard destination={d} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      <Lightbox
        images={galleryImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </article>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <Icon className="h-5 w-5 text-watermelon-500" />
      <p className="mt-2 text-xs uppercase tracking-wide text-ink-800/50">{label}</p>
      <p className="text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-ink-800/60">{label}</span>
      <span className="text-right font-medium text-ink-900">{value}</span>
    </div>
  );
}
