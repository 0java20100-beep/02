"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLang,
  getDictionary,
  languages,
  type Dictionary,
  type Language,
  type LangCode,
} from "@/i18n";

interface LanguageContextValue {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  dict: Dictionary;
  language: Language;
  dir: "ltr" | "rtl";
  formatPrice: (value: number) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "wm_lang";

const localeMap: Record<LangCode, string> = {
  en: "en-US",
  uz: "uz-UZ",
  ru: "ru-RU",
  tr: "tr-TR",
  ar: "ar-SA",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  es: "es-ES",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(defaultLang);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && languages.some((l) => l.code === stored)) {
      setLangState(stored);
    }
  }, []);

  const language = useMemo(
    () => languages.find((l) => l.code === lang) ?? languages[0],
    [lang],
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = language.dir;
  }, [lang, language.dir]);

  const setLang = (code: LangCode) => {
    setLangState(code);
    window.localStorage.setItem(STORAGE_KEY, code);
  };

  const dict = useMemo(() => getDictionary(lang), [lang]);

  const formatPrice = useMemo(() => {
    return (value: number) =>
      new Intl.NumberFormat(localeMap[lang], {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, dict, language, dir: language.dir, formatPrice }),
    [lang, dict, language, formatPrice],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
