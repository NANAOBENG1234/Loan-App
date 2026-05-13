#!/bin/bash
set -e

echo "Setting up QuickLoan..."

# Check deps
command -v node >/dev/null 2>&1 || { echo "Node.js required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker required"; exit 1; }

# Install
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Start DB
docker-compose up -d

# Migrate & seed
cd server && npx prisma migrate dev && npx prisma db seed && cd ..

echo "Done! Run: npm run dev"
