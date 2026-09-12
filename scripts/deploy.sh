#!/bin/bash
set -e

echo "Deploying BoA Micro Finance..."
git pull origin main

npm install
cd client && npm install && npm run build && cd ..
cd server && npm install && npm run build && npx prisma migrate deploy && cd ..

pm2 restart boa-micro-finance || pm2 start npm --name "boa-micro-finance" -- start
echo "Done!"
