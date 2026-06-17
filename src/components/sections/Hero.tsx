"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { destinations, unsplash } from "@/data/destinations";

const slideIds = destinations.filter((d) => d.featured).slice(0, 5);

export default function Hero() {
  const { dict } = useLanguage();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [dest, setDest] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slideIds.length), 6000);
    return () => clearInterval(t);
  }, []);

  const active = slideIds[index];

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    params.set("guests", String(guests));
    if (dest) {
      router.push(`/booking?destination=${dest}&${params.toString()}`);
    } else {
      router.push(`/destinations`);
    }
  }

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={unsplash(active.image, 2000, 80)}
              alt={`${active.city}, ${active.country}`}
              fill
              priority
              sizes="100vw"
              className="animate-ken-burns object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/55 via-ink-950/25 to-ink-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/75 via-ink-950/20 to-transparent" />
      </div>

      <div className="container-px relative z-10 mx-auto w-full max-w-7xl pt-28">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-watermelon-500" />
            {dict.hero.badge}
          </motion.span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {dict.hero.titleLine1}
            </motion.span>
            <motion.span
              className="block text-gradient"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              {dict.hero.titleLine2}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-xl text-base text-white/80 sm:text-lg"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.form
            onSubmit={onSearch}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-8 grid gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl sm:grid-cols-[1.4fr_1fr_0.9fr_auto]"
          >
            <label className="flex items-center gap-2 rounded-xl bg-white/90 px-3.5 py-3 text-sm">
              <MapPin className="h-4 w-4 shrink-0 text-watermelon-500" />
              <div className="relative w-full">
                <select
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  className="w-full appearance-none bg-transparent pr-5 font-medium text-ink-900 focus:outline-none"
                >
                  <option value="">{dict.search.anyDestination}</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.city}, {d.country}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40" />
              </div>
            </label>

            <label className="flex items-center gap-2 rounded-xl bg-white/90 px-3.5 py-3 text-sm">
              <Calendar className="h-4 w-4 shrink-0 text-watermelon-500" />
              <input
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent font-medium text-ink-900 focus:outline-none"
              />
            </label>

            <label className="flex items-center gap-2 rounded-xl bg-white/90 px-3.5 py-3 text-sm">
              <Users className="h-4 w-4 shrink-0 text-watermelon-500" />
              <input
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                className="w-full bg-transparent font-medium text-ink-900 focus:outline-none"
                aria-label={dict.search.guests}
              />
            </label>

            <button type="submit" className="btn btn-primary justify-center">
              <Search className="h-4 w-4" />
              <span className="sm:hidden lg:inline">{dict.hero.searchButton}</span>
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link href="/destinations" className="btn btn-ghost">
              {dict.hero.exploreButton}
            </Link>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="flex -space-x-2">
                {[47, 12, 32, 45].map((n) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/80?img=${n}`}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-white/80 object-cover"
                  />
                ))}
              </div>
              <span>{dict.hero.trusted}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {slideIds.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.city}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-watermelon-500" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-5 right-6 z-10 hidden items-center gap-2 text-xs uppercase tracking-widest text-white/60 lg:flex">
        <span className="font-medium text-white/80">{active.city}</span>
        <span>/ {active.country}</span>
      </div>
    </section>
  );
}
