import { prisma } from "./prisma";

export interface SiteSettings {
  brand: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
}

export interface HeroSettings {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

const DEFAULTS = {
  site: {
    brand: "NAVIX",
    tagline: "WE BUILD THE FUTURE",
    logoUrl: "",
    primaryColor: "#22d3ee",
    secondaryColor: "#a855f7",
    accentColor: "#3b82f6",
    font: "Geist",
  } as SiteSettings,
  hero: {
    title: "Создаём сайты будущего",
    subtitle:
      "Разрабатываем современные сайты, веб-приложения и цифровые продукты для бизнеса.",
    ctaPrimary: "Посмотреть проекты",
    ctaSecondary: "Заказать сайт",
    ctaTertiary: "Заказать приложение",
  } as HeroSettings,
  seo: {
    title: "NAVIX — Создаём сайты будущего | Digital Agency",
    description:
      "NAVIX — премиум digital-агентство. Разработка сайтов, веб-приложений и цифровых продуктов уровня 2030.",
    keywords: "веб-студия, разработка сайтов, NAVIX, navix.uz",
    ogImage: "/og-image.png",
  } as SeoSettings,
};

export async function getSetting<K extends keyof typeof DEFAULTS>(
  key: K
): Promise<(typeof DEFAULTS)[K]> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    if (!row) return DEFAULTS[key];
    return { ...DEFAULTS[key], ...(row.value as object) };
  } catch {
    return DEFAULTS[key];
  }
}

export async function getAllSettings() {
  const [site, hero, seo] = await Promise.all([
    getSetting("site"),
    getSetting("hero"),
    getSetting("seo"),
  ]);
  return { site, hero, seo };
}
