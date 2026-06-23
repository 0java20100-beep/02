import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return input
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `item-${Date.now()}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function normalizeUrl(url: string | null | undefined): string | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `https://${trimmed}`;
}

export const CATEGORY_LABELS: Record<string, string> = {
  LANDING_PAGE: "Landing Page",
  CORPORATE_WEBSITE: "Corporate Website",
  ECOMMERCE: "E-commerce",
  WEB_APPLICATION: "Web Application",
  DASHBOARD: "Dashboard",
  SAAS: "SaaS",
};

// Maps public filter ids to the project categories they include.
export const FILTERS: { id: string; label: string; categories: string[] }[] = [
  { id: "all", label: "Все", categories: [] },
  {
    id: "sites",
    label: "Сайты",
    categories: ["LANDING_PAGE", "CORPORATE_WEBSITE"],
  },
  { id: "ecommerce", label: "Интернет-магазины", categories: ["ECOMMERCE"] },
  {
    id: "apps",
    label: "Приложения",
    categories: ["WEB_APPLICATION", "DASHBOARD", "SAAS"],
  },
  { id: "design", label: "Дизайн", categories: [] },
];
