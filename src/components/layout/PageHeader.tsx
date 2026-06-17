"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { unsplash } from "@/data/destinations";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  image?: string;
  crumbs?: Crumb[];
}

export default function PageHeader({
  title,
  subtitle,
  image = "photo-1502602898657-3e91760cbb34",
  crumbs = [],
}: PageHeaderProps) {
  return (
    <section className="relative flex min-h-[46vh] items-end overflow-hidden pb-12 pt-32">
      <div className="absolute inset-0">
        <Image
          src={unsplash(image, 1800, 75)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/55 to-ink-950/40" />
      </div>
      <div className="container-px relative z-10 mx-auto w-full max-w-7xl">
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-center gap-1.5 text-sm text-white/70"
        >
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {c.href ? (
                <Link href={c.href} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </motion.nav>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="heading-display max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 max-w-2xl text-lg text-white/80"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
