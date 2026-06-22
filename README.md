# NAVIX — Full Stack Digital Agency Platform

Премиум платформа веб-студии **NAVIX** (navix.uz): портфолио проектов, продажа
услуг, приём заявок, публикация готовых сайтов и полноценная админ-панель.

Futuristic 2030 дизайн: Dark theme, Glassmorphism, неоновые акценты, GSAP/Framer
Motion анимации, parallax, micro-interactions. Mobile-first, SEO-friendly, SSR.

## Технологии

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, GSAP, Framer Motion
- **Backend:** Next.js Route Handlers (Node.js runtime), Prisma ORM
- **База данных:** PostgreSQL (+ Redis в docker-compose для будущего масштабирования)
- **Auth:** JWT (httpOnly cookie), bcrypt, принудительная смена пароля при первом входе
- **Интеграции:** Telegram Bot API, SMTP Email, Google Analytics
- **DevOps:** Docker, Docker Compose, Nginx, SSL-ready

> Архитектура: единое Next.js full-stack приложение. Бэкенд реализован на Route
> Handlers (`/api/*`), что даёт SSR/ISR, единый деплой и совместимость с Vercel,
> и одновременно работает в Docker Compose с PostgreSQL/Nginx для self-host.

## Возможности

### Публичная часть
- Hero с анимациями, каталог проектов с фильтрами (Все / Сайты / Магазины / Приложения / Дизайн)
- Страницы: Главная, Проекты, Проект (галерея, технологии, демо), Готовые сайты, Услуги, Контакты
- Форма заказа с загрузкой файлов → сохранение в БД + Telegram + Email уведомления
- Отзывы (авто-скролл), контакты (Telegram, бот, Instagram, email) в шапке/футере/контактах
- SEO: `sitemap.xml`, `robots.txt`, Open Graph, Schema.org, аналитика просмотров

### Админ-панель `/the-admin-navix`
- JWT-вход (`admin` / пароль из env), обязательная смена пароля при первом входе
- Dashboard: просмотры, посетители, заявки, конверсия, графики, топ проектов
- CRUD: проекты, готовые сайты (**загрузка ZIP** → авто-публикация), отзывы, контакты
- Заявки: просмотр, смена статуса, удаление, вложения
- Медиа-библиотека с авто-оптимизацией в WebP (sharp)
- Конструктор контента: тексты, цвета, логотип, Hero, SEO — без программиста
- Audit logs всех действий

## Безопасность
JWT в httpOnly cookie · bcrypt (12 rounds) · rate limiting · валидация Zod ·
zip-slip защита · security-заголовки · защита загрузок только для админа · audit logs.

## Локальный запуск (dev)

```bash
# 1. PostgreSQL (например через Docker)
docker run -d --name navix-pg -e POSTGRES_USER=navix -e POSTGRES_PASSWORD=navix \
  -e POSTGRES_DB=navix -p 5432:5432 postgres:16-alpine

# 2. Зависимости и переменные окружения
cp .env.example .env   # отредактируйте при необходимости
npm install

# 3. Миграции + seed (admin, контакты, настройки)
npx prisma migrate deploy
npm run prisma:seed

# 4. Запуск
npm run dev   # http://localhost:3000
```

Админка: http://localhost:3000/the-admin-navix · логин `admin`, пароль из `ADMIN_PASSWORD`.

## Запуск через Docker Compose (production self-host)

```bash
cp .env.example .env   # задайте JWT_SECRET, ADMIN_PASSWORD, Telegram/SMTP
docker compose up -d --build
```

Поднимает PostgreSQL + Redis + приложение (миграции и seed применяются автоматически)
+ Nginx на порту 80. Открыть: http://localhost

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `DATABASE_URL` | строка подключения PostgreSQL |
| `JWT_SECRET` | секрет для JWT (обязательно сменить в prod) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | учётка администратора (seed) |
| `NEXT_PUBLIC_SITE_URL` | публичный URL для SEO/OG |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | уведомления о заявках в Telegram |
| `SMTP_*` / `MAIL_FROM` / `MAIL_TO` | email-уведомления о заявках |
| `NEXT_PUBLIC_GA_ID` | Google Analytics (опционально) |

Уведомления Telegram/Email включаются автоматически при заданных переменных;
без них заявки всё равно сохраняются в БД.

## Деплой на Vercel

1. Импортируйте репозиторий в Vercel.
2. Подключите PostgreSQL (Vercel Postgres / Neon) и задайте `DATABASE_URL` + остальные env.
3. Build Command: `npm run build` (выполняет `prisma generate`).
4. После первого деплоя примените миграции: `npx prisma migrate deploy`.

> На Vercel файловая система эфемерна — для загрузок медиа/ZIP в production
> используйте объектное хранилище (Vercel Blob / S3). Для Docker/self-host
> используются тома `uploads` и `sites`.

## API

`/api/auth` · `/api/projects` · `/api/orders` · `/api/reviews` · `/api/contacts`
· `/api/settings` · `/api/uploads` · `/api/sites` · `/api/analytics`

## Контакты NAVIX
Telegram [@navixstudio](https://t.me/navixstudio) · Bot
[@Navix_studio_bot](https://t.me/Navix_studio_bot) · Instagram
[@navi.xstudio](https://instagram.com/navi.xstudio)
