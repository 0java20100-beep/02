---
name: testing-navix
description: Test the NAVIX digital-agency platform end-to-end. Use when verifying public site, admin CMS, project publishing, or order-form changes.
---

# Testing NAVIX

NAVIX is a Next.js 14 (App Router) + Prisma + PostgreSQL full-stack app. Backend is implemented as Next.js Route Handlers under `/api/*` (not a separate Express service).

## Running locally for tests
- Requires PostgreSQL reachable via `DATABASE_URL` (local dev default: `postgresql://navix:navix@localhost:5432/navix?schema=public`).
- Apply schema + seed: `npx prisma migrate deploy && npx prisma db seed` (seed is idempotent; creates admin user, NAVIX contacts, default settings).
- Build + run prod server: `npm run build && npm start` (serves on `http://localhost:3000`).
- Quick API smoke: `curl -s localhost:3000/api/projects`.

## Admin panel
- URL: `/the-admin-navix`. Login `admin` / value of `ADMIN_PASSWORD` env (dev default `java20102909navi`).
- First login forces a password change: a correct login redirects to `/the-admin-navix/change-password` (NOT the dashboard). After changing, you land on `/the-admin-navix/dashboard`. This is enforced by the `(panel)/layout.tsx` guard + `mustChangePassword` flag on the seeded user. NOTE: once you change the password during a test, subsequent logins need the new password — re-seed or reset the user if you need the forced-change flow again.

## Primary flows to verify
1. Public site (`/`, `/projects`, `/contacts`): Hero, project catalog, services, order form, footer contacts render. Category filters (`src/components/site/ProjectsExplorer.tsx`, `FILTERS` in `src/lib/utils.ts`) actually filter — e.g. a LANDING_PAGE project is hidden under "Интернет-магазины".
2. Create project in admin (Проекты → Добавить проект, status PUBLISHED) → appears on public `/projects`.
3. Submit order on the public form → success state "Заявка отправлена!" → order appears in admin Заявки with status "Новая"; inline status buttons (NEW/IN_PROGRESS/...) persist changes.

## Gotchas
- Browser computer-use typing can drop/garble leading characters and Cyrillic in fast `type` actions; verify field values in the returned DOM and re-type with triple_click + ctrl+a + Delete if mangled.
- Notifications (Telegram/Email) only fire when `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SMTP_*` are set; otherwise they no-op and the order still saves (graceful degrade) — not a bug.
- File uploads (`/public/uploads`, `/public/sites`) are ephemeral on Vercel; production needs object storage.

## Devin Secrets Needed
- None required for core E2E testing (DB is local, admin seeded).
- Optional for notification testing: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`.
