import Link from "next/link";
import { MapPin, Phone, Clock, Send, MessageCircle, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-gold/20 bg-emerald-700 text-emerald-50">
      <div className="absolute inset-0 bg-ornament [background-size:24px_24px] opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full btn-gold font-display text-xl font-bold">
                S
              </span>
              <span className="font-display text-2xl font-bold">
                Sharq<span className="text-gradient-gold">ona</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-emerald-100/80">
              Milliy taomlar san&apos;ati va zamonaviy hashamat uyg&apos;unligi.
              Har bir mehmon uchun unutilmas ta&apos;m.
            </p>
            <div className="mt-5 flex gap-3">
              {[MessageCircle, Send, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Ijtimoiy tarmoq"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold-300 transition-all hover:bg-gold hover:text-emerald-700"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-gold-300">
              Sahifalar
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-emerald-100/80">
              <li>
                <Link href="/" className="hover:text-gold-300">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-gold-300">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/order" className="hover:text-gold-300">
                  Buyurtma
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-gold-300">
              Aloqa
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-emerald-100/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                Toshkent sh., Amir Temur ko&apos;chasi 12
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold-300" />
                +998 71 200 00 00
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-gold-300" />
                Har kuni 10:00 — 23:00
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-gold-300">
              Yangiliklar
            </h4>
            <p className="mt-4 text-sm text-emerald-100/80">
              Aksiya va yangi taomlardan xabardor bo&apos;ling.
            </p>
            <form className="mt-4 flex gap-2">
              <input
                type="email"
                required
                placeholder="Email manzilingiz"
                className="w-full rounded-full border border-gold/30 bg-emerald-600/40 px-4 py-2.5 text-sm text-white placeholder:text-emerald-100/50 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Obuna bo'lish"
                className="flex h-10 w-11 shrink-0 items-center justify-center rounded-full btn-gold"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 gold-divider" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-emerald-100/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Sharqona. Barcha huquqlar himoyalangan.</p>
          <p>Toshkent · O&apos;zbekiston</p>
        </div>
      </div>
    </footer>
  );
}
