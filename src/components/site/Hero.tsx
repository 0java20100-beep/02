"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Sparkles, Code2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface HeroProps {
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaTertiary: string;
  };
  site: { brand: string; tagline: string; logoUrl: string };
}

export function Hero({ hero, site }: HeroProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-logo", { y: 30, opacity: 0, duration: 0.8 })
        .from(".hero-badge", { y: 20, opacity: 0, duration: 0.5 }, "-=0.4")
        .from(".hero-title", { y: 40, opacity: 0, duration: 0.9 }, "-=0.2")
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(
          ".hero-cta",
          { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 },
          "-=0.4"
        )
        .from(".hero-stat", { opacity: 0, y: 16, stagger: 0.1 }, "-=0.3");
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.12),transparent_55%)]" />
      <div className="mx-auto max-w-5xl px-4 text-center">
        <div className="hero-logo flex justify-center mb-6">
          <Logo
            brand={site.brand}
            tagline={site.tagline}
            logoUrl={site.logoUrl}
            size="lg"
            showTagline
          />
        </div>

        <div className="hero-badge inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-primary mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          Digital Agency 2030 · Premium Web Development
        </div>

        <h1 className="hero-title text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05]">
          <span className="gradient-text neon-text">{hero.title}</span>
        </h1>

        <p className="hero-sub mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted">
          {hero.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/projects"
            className="hero-cta group inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white bg-gradient-to-r from-primary to-secondary btn-glow"
          >
            {hero.ctaPrimary}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/#order"
            className="hero-cta inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium glass card-hover"
          >
            <Code2 className="h-4 w-4 text-primary" />
            {hero.ctaSecondary}
          </Link>
          <Link
            href="/#order"
            className="hero-cta inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium glass card-hover"
          >
            {hero.ctaTertiary}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { value: "100+", label: "Проектов" },
            { value: "90+", label: "PageSpeed" },
            { value: "24/7", label: "Поддержка" },
          ].map((s) => (
            <div key={s.label} className="hero-stat glass rounded-2xl py-5">
              <div className="text-2xl md:text-3xl font-bold gradient-text">
                {s.value}
              </div>
              <div className="text-xs text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
