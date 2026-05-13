#!/bin/bash
set -e

echo "Deploying QuickLoan..."
git pull origin main

npm install
cd client && npm install && npm run build && cd ..
cd server && npm install && npm run build && npx prisma migrate deploy && cd ..

pm2 restart quickloan || pm2 start npm --name "quickloan" -- start
echo "Done!"
