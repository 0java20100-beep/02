"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Moon, Sun, Menu as MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/layout/logo";
import { useTheme } from "@/context/theme-provider";
import { useCart } from "@/context/cart-provider";
import { useOrder } from "@/context/order-provider";

const links = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Buyurtma" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { totalItems, openCart } = useCart();
  const { tableNumber } = useOrder();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6",
            scrolled ? "glass-strong shadow-soft" : "bg-transparent",
          )}
        >
          <Link href="/" className="group flex items-center gap-2.5">
            <LogoMark className="h-10 w-auto transition-transform group-hover:scale-105" />
            <span className="font-display text-xl font-bold tracking-wide">
              Sharq<span className="text-gradient-gold">ona</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  pathname === l.href
                    ? "text-gold-400"
                    : "text-foreground/80 hover:text-gold-400",
                )}
              >
                {pathname === l.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-gold/10"
                    transition={{ type: "spring", damping: 24, stiffness: 300 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs font-semibold text-gold-400 sm:inline-block">
              Stol #{tableNumber}
            </span>
            <button
              onClick={toggleTheme}
              aria-label="Rejimni almashtirish"
              className="flex h-10 w-10 items-center justify-center rounded-full glass transition-transform hover:scale-105"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-gold-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-emerald-600" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              onClick={openCart}
              aria-label="Savatchani ochish"
              className="relative flex h-10 w-10 items-center justify-center rounded-full glass transition-transform hover:scale-105"
            >
              <ShoppingBag className="h-5 w-5 text-gold-400" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menyu"
              className="flex h-10 w-10 items-center justify-center rounded-full glass md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-strong mt-2 flex flex-col gap-1 rounded-3xl p-3 shadow-soft md:hidden"
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    pathname === l.href
                      ? "bg-gold/10 text-gold-400"
                      : "hover:bg-foreground/5",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
