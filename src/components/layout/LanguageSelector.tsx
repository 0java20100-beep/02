"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { languages } from "@/i18n";
import { cn } from "@/lib/utils";

export default function LanguageSelector({ dark = false }: { dark?: boolean }) {
  const { lang, setLang, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Select language"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all",
          dark
            ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
            : "border-ink-900/10 bg-white/70 text-ink-900 hover:border-watermelon-300 hover:bg-white",
        )}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{language.nativeName}</span>
        <Image
          src={`https://flagcdn.com/w40/${language.flag}.png`}
          alt=""
          width={20}
          height={14}
          className="h-3.5 w-5 rounded-[2px] object-cover sm:hidden"
          unoptimized
        />
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-50 mt-2 max-h-[70vh] w-56 overflow-auto rounded-2xl border border-ink-900/10 bg-white p-2 shadow-card no-scrollbar"
          >
            {languages.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    lang === l.code
                      ? "bg-watermelon-50 text-watermelon-700"
                      : "text-ink-800 hover:bg-ink-50",
                  )}
                >
                  <Image
                    src={`https://flagcdn.com/w40/${l.flag}.png`}
                    alt=""
                    width={24}
                    height={16}
                    className="h-4 w-6 rounded-[2px] object-cover shadow-sm"
                    unoptimized
                  />
                  <span className="flex-1">
                    <span className="block font-medium leading-tight">{l.nativeName}</span>
                    <span className="block text-xs text-ink-800/50">{l.name}</span>
                  </span>
                  {lang === l.code && <Check className="h-4 w-4 text-watermelon-600" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
