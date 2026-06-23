#!/bin/sh
set -e

echo "→ Applying database migrations..."
node_modules/.bin/prisma migrate deploy

echo "→ Seeding database (idempotent)..."
node_modules/.bin/prisma db seed || echo "Seed skipped"

echo "→ Starting NAVIX..."
exec "$@"
