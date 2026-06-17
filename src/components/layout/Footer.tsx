"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InstagramIcon, TelegramIcon } from "@/components/ui/BrandIcons";
import { destinations } from "@/data/destinations";

export default function Footer() {
  const { dict } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const topDestinations = destinations.slice(0, 6);

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-watermelon-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-leaf-500/10 blur-3xl" />

      <div className="container-px relative mx-auto max-w-7xl py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-watermelon-gradient shadow-glow">
                <span className="h-4 w-4 rounded-full bg-white/90" />
                <span className="absolute h-1.5 w-1.5 rounded-full bg-leaf-500" />
              </span>
              <span className="font-display text-lg font-semibold">
                Watermelon<span className="text-watermelon-500">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {dict.footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://t.me/watermelontravel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-colors hover:bg-watermelon-500"
              >
                <TelegramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/watermelontravel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-colors hover:bg-watermelon-500"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {dict.footer.quickLinks}
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              {[
                { href: "/destinations", label: dict.nav.destinations },
                { href: "/tours", label: dict.nav.tours },
                { href: "/offers", label: dict.nav.offers },
                { href: "/gallery", label: dict.nav.gallery },
                { href: "/about", label: dict.nav.about },
                { href: "/contact", label: dict.nav.contact },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-watermelon-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {dict.footer.destinations}
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              {topDestinations.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/destinations/${d.id}`}
                    className="transition-colors hover:text-watermelon-400"
                  >
                    {d.city}, {d.country}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {dict.footer.newsletter}
            </h4>
            <p className="mt-5 text-sm text-white/60">{dict.footer.newsletterText}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubscribed(true);
              }}
              className="mt-4 flex gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.footer.emailPlaceholder}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-watermelon-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-xl bg-watermelon-gradient px-4 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              >
                {subscribed ? dict.footer.subscribed : dict.footer.subscribe}
              </button>
            </form>
            <ul className="mt-6 space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2.5">
                <TelegramIcon className="h-4 w-4 text-watermelon-400" />
                <a href="https://t.me/watermelontravel" className="hover:text-white">
                  @watermelontravel
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <InstagramIcon className="h-4 w-4 text-watermelon-400" />
                <a href="https://instagram.com/watermelontravel" className="hover:text-white">
                  @watermelontravel
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-watermelon-400" />
                <span>{dict.contact.phonePlaceholder}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-watermelon-400" />
                <span>{dict.contact.addressPlaceholder}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Watermelon Travel. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-white">
              {dict.footer.terms}
            </Link>
            <Link href="/contact" className="hover:text-white">
              {dict.footer.privacy}
            </Link>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> hello@watermelon.travel
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
