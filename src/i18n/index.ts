import en, { type Dictionary } from "./dictionaries/en";
import uz from "./dictionaries/uz";
import ru from "./dictionaries/ru";
import tr from "./dictionaries/tr";
import ar from "./dictionaries/ar";
import de from "./dictionaries/de";
import fr from "./dictionaries/fr";
import it from "./dictionaries/it";
import es from "./dictionaries/es";
import zh from "./dictionaries/zh";
import ja from "./dictionaries/ja";
import ko from "./dictionaries/ko";

export type LangCode =
  | "en"
  | "uz"
  | "ru"
  | "tr"
  | "ar"
  | "de"
  | "fr"
  | "it"
  | "es"
  | "zh"
  | "ja"
  | "ko";

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface Language {
  code: LangCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "gb", dir: "ltr" },
  { code: "uz", name: "Uzbek", nativeName: "O'zbekcha", flag: "uz", dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "ru", dir: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "tr", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "sa", dir: "rtl" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "de", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", flag: "fr", dir: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "it", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "es", dir: "ltr" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "cn", dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "jp", dir: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "kr", dir: "ltr" },
];

const partials: Record<LangCode, DeepPartial<Dictionary>> = {
  en,
  uz,
  ru,
  tr,
  ar,
  de,
  fr,
  it,
  es,
  zh,
  ja,
  ko,
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deepMerge<T>(base: T, override: DeepPartial<T>): T {
  if (!isObject(base) || !isObject(override)) {
    return (override as T) ?? base;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override)) {
    const o = (override as Record<string, unknown>)[key];
    const b = (base as Record<string, unknown>)[key];
    if (isObject(b) && isObject(o)) {
      out[key] = deepMerge(b, o as DeepPartial<typeof b>);
    } else if (o !== undefined) {
      out[key] = o;
    }
  }
  return out as T;
}

const cache = new Map<LangCode, Dictionary>();

export function getDictionary(code: LangCode): Dictionary {
  const cached = cache.get(code);
  if (cached) return cached;
  const merged = deepMerge(en, partials[code] ?? {});
  cache.set(code, merged);
  return merged;
}

export const defaultLang: LangCode = "en";
export type { Dictionary };
