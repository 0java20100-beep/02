"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ContactIcon, contactHref } from "@/components/ui/ContactIcon";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  type: string;
  value: string;
  icon: string | null;
}

interface SiteInfo {
  brand: string;
  logoUrl: string;
}

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/projects", label: "Проекты" },
  { href: "/sites", label: "Готовые сайты" },
  { href: "/services", label: "Услуги" },
  { href: "/contacts", label: "Контакты" },
];

export function Header({
  contacts,
  site,
}: {
  contacts: Contact[];
  site: SiteInfo;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const social = contacts.filter((c) =>
    ["telegram", "telegram_bot", "instagram"].includes(c.type)
  );

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong py-2 shadow-lg shadow-black/30" : "py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
        <Link href="/" aria-label={site.brand}>
          <Logo brand={site.brand} logoUrl={site.logoUrl} size="sm" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted hover:text-foreground transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-primary to-secondary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {social.map((c) => (
            <a
              key={c.id}
              href={contactHref(c.type, c.value)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={c.type}
              className="grid place-items-center h-9 w-9 rounded-lg glass card-hover text-primary"
            >
              <ContactIcon type={c.type} icon={c.icon} className="h-4 w-4" />
            </a>
          ))}
          <Link
            href="/#order"
            className="ml-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary btn-glow"
          >
            Заказать
          </Link>
        </div>

        <button
          className="lg:hidden grid place-items-center h-10 w-10 rounded-lg glass"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden mx-4 mt-2 glass-strong rounded-2xl p-4 animate-fade-up">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-lg hover:bg-white/5 text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 mt-3 px-3">
            {social.map((c) => (
              <a
                key={c.id}
                href={contactHref(c.type, c.value)}
                target="_blank"
                rel="noopener noreferrer"
                className="grid place-items-center h-10 w-10 rounded-lg glass text-primary"
              >
                <ContactIcon type={c.type} icon={c.icon} className="h-5 w-5" />
              </a>
            ))}
          </div>
          <Link
            href="/#order"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center rounded-lg px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary"
          >
            Заказать сайт
          </Link>
        </div>
      )}
    </header>
  );
}
