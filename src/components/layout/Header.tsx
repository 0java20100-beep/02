"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import { cn } from "@/lib/utils";

export default function Header() {
  const { dict } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const transparent = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/destinations", label: dict.nav.destinations },
    { href: "/tours", label: dict.nav.tours },
    { href: "/offers", label: dict.nav.offers },
    { href: "/gallery", label: dict.nav.gallery },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent py-4"
          : "glass border-b border-ink-900/5 py-2.5 shadow-soft",
      )}
    >
      <div className="container-px mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Watermelon Travel home">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-watermelon-gradient shadow-glow">
            <span className="h-4 w-4 rounded-full bg-white/90" />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-leaf-500" />
          </span>
          <span
            className={cn(
              "font-display text-lg font-semibold tracking-tight transition-colors",
              transparent ? "text-white" : "text-ink-950",
            )}
          >
            Watermelon<span className="text-watermelon-500">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  transparent
                    ? "text-white/90 hover:text-white"
                    : "text-ink-800 hover:text-watermelon-600",
                  active && (transparent ? "text-white" : "text-watermelon-600"),
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-watermelon-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block">
            <LanguageSelector dark={transparent} />
          </div>
          <Link href="/booking" className="btn btn-primary hidden md:inline-flex">
            {dict.nav.bookNow}
          </Link>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors lg:hidden",
              transparent ? "text-white hover:bg-white/10" : "text-ink-900 hover:bg-ink-50",
            )}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-ink-950">
                  Watermelon<span className="text-watermelon-500">.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-900 hover:bg-ink-50"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-4 py-3 text-base font-medium text-ink-800 transition-colors hover:bg-watermelon-50 hover:text-watermelon-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-4">
                <LanguageSelector />
                <Link href="/booking" className="btn btn-primary w-full">
                  {dict.nav.bookNow}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
