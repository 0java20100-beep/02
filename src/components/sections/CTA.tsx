"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { unsplash } from "@/data/destinations";
import Reveal from "@/components/ui/Reveal";

export default function CTA() {
  const { dict } = useLanguage();

  return (
    <section className="section bg-background">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-12 sm:py-20">
            <Image
              src={unsplash("photo-1439066615861-d1af74d74000", 1600, 70)}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-watermelon-600/90 via-watermelon-500/85 to-leaf-600/85" />
            <div className="relative mx-auto max-w-2xl text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
                <Sparkles className="h-4 w-4" />
                {dict.hero.badge}
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold sm:text-5xl">
                {dict.hero.titleLine1} {dict.hero.titleLine2}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/85">{dict.sections.contactSubtitle}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/booking"
                  className="btn bg-white px-7 py-3.5 text-watermelon-600 hover:bg-white/90"
                >
                  {dict.nav.bookNow}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/destinations"
                  className="btn border border-white/50 px-7 py-3.5 text-white hover:bg-white/10"
                >
                  {dict.hero.exploreButton}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
