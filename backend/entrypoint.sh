#!/bin/sh

# Wait for database to be ready
echo "Waiting for database connection..."
until nc -z -v -w30 melodb 5432; do
  echo "Waiting for database..."
  sleep 1
done
echo "Database is up!"

# Check if the database schema exists
if [ "$(psql -U postgres -h melodb -d postgres -tAc "SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='User'")" != "1" ]; then
  echo "Database is empty. Running Prisma migrations..."
  npx prisma db push
else
  echo "Database already initialized. Skipping migrations."
fi

# Generate Prisma Client
npx prisma generate

# Start the app
npm run dev
