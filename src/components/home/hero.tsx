"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, QrCode, Star } from "lucide-react";
import { RippleButton } from "@/components/ui/ripple-button";
import { DishImage } from "@/components/ui/dish-image";
import { LogoMark } from "@/components/layout/logo";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], [8, -8]);
  const ry = useTransform(mx, [-0.5, 0.5], [-8, 8]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800" />
      <motion.div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.25),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(212,175,55,0.18),transparent_45%)] [background-size:200%_200%] animate-gradient-pan"
      />
      <div className="absolute inset-0 -z-10 bg-ornament [background-size:26px_26px] opacity-30" />

      {/* Floating elements */}
      <motion.div
        className="absolute left-[8%] top-[22%] hidden h-24 w-24 rounded-full bg-gold/20 blur-2xl md:block animate-float"
        style={{ animationDelay: "0s" }}
      />
      <motion.div
        className="absolute right-[12%] top-[60%] hidden h-32 w-32 rounded-full bg-gold/10 blur-3xl md:block animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 md:grid-cols-2">
        <motion.div style={{ y, opacity }} className="text-emerald-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <LogoMark className="h-24 w-auto drop-shadow-[0_4px_24px_rgba(212,175,55,0.35)]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-emerald-900/30 px-4 py-2 text-sm backdrop-blur"
          >
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span className="text-gold-200">
              Toshkentning eng premium restorani
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            Milliy ta&apos;m,
            <br />
            <span className="text-gradient-gold">zamonaviy hashamat</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-md text-lg text-emerald-100/85"
          >
            An&apos;anaviy o&apos;zbek taomlari eng nafis ko&apos;rinishda.
            Stolingizdagi QR kodni skaner qiling va lazzatli sayohatni boshlang.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link href="/menu">
              <RippleButton className="px-7 py-3.5 text-base">
                Menyuni ko&apos;rish <ArrowRight className="h-5 w-5" />
              </RippleButton>
            </Link>
            <Link href="/order">
              <RippleButton
                variant="outline"
                className="px-7 py-3.5 text-base text-gold-200"
              >
                <QrCode className="h-5 w-5" /> QR buyurtma
              </RippleButton>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 flex items-center gap-8"
          >
            {[
              { value: "50+", label: "Milliy taom" },
              { value: "15 yil", label: "Tajriba" },
              { value: "4.9", label: "Reyting" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-gold-300">
                  {s.value}
                </div>
                <div className="text-xs text-emerald-100/70">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero visual with mouse tilt */}
        <motion.div
          onMouseMove={handleMouse}
          onMouseLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          style={{ perspective: 1000 }}
          className="relative hidden md:block"
        >
          <motion.div
            style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            <div className="absolute inset-0 rounded-[2.5rem] bg-gold/20 blur-3xl" />
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border border-gold/30 shadow-card">
              <DishImage
                src="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80"
                alt="Premium palov"
                emoji="🍚"
                priority
                sizes="(max-width: 768px) 100vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              style={{ transform: "translateZ(60px)" }}
              className="absolute -bottom-5 -left-5 rounded-2xl glass-strong p-4 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full btn-gold text-xl">
                  🍚
                </div>
                <div>
                  <div className="text-sm font-bold">To&apos;y Oshi</div>
                  <div className="flex items-center gap-1 text-xs text-gold-400">
                    <Star className="h-3 w-3 fill-gold text-gold" /> 4.9 · Top
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-gold/50 p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
