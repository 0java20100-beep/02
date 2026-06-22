import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "java20102909navi";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      email: "0java20100@gmail.com",
      passwordHash,
      role: "ADMIN",
      mustChangePassword: true,
    },
  });

  const contacts = [
    { type: "telegram", label: "Telegram", value: "@navixstudio", icon: "send", order: 1 },
    { type: "telegram_bot", label: "Telegram Bot", value: "@Navix_studio_bot", icon: "bot", order: 2 },
    { type: "instagram", label: "Instagram", value: "@navi.xstudio", icon: "instagram", order: 3 },
    { type: "email", label: "Email", value: "0java20100@gmail.com", icon: "mail", order: 4 },
  ];

  for (const c of contacts) {
    const existing = await prisma.contact.findFirst({ where: { type: c.type } });
    if (!existing) {
      await prisma.contact.create({ data: c });
    }
  }

  const settings: { key: string; value: unknown }[] = [
    {
      key: "site",
      value: {
        brand: "NAVIX",
        tagline: "WE BUILD THE FUTURE",
        logoUrl: "",
        primaryColor: "#22d3ee",
        secondaryColor: "#a855f7",
        accentColor: "#3b82f6",
        font: "Geist",
      },
    },
    {
      key: "hero",
      value: {
        title: "Создаём сайты будущего",
        subtitle:
          "Разрабатываем современные сайты, веб-приложения и цифровые продукты для бизнеса.",
        ctaPrimary: "Посмотреть проекты",
        ctaSecondary: "Заказать сайт",
        ctaTertiary: "Заказать приложение",
      },
    },
    {
      key: "seo",
      value: {
        title: "NAVIX — Создаём сайты будущего | Digital Agency",
        description:
          "NAVIX — премиум digital-агентство. Разработка сайтов, веб-приложений и цифровых продуктов уровня 2030.",
        keywords:
          "веб-студия, разработка сайтов, веб-приложения, NAVIX, digital agency, Узбекистан, navix.uz",
        ogImage: "/og-image.png",
      },
    },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, value: s.value as object },
    });
  }

  console.log("Seed complete: admin user, contacts, settings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
