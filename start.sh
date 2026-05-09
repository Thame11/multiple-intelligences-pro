#!/bin/sh
# Production startup script for Railway
# Runs migrations and seeds the database, then starts the app

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "🌱 Seeding database (admin user)..."
npx tsx scripts/seed.ts

echo "🚀 Starting application..."
exec npm start
