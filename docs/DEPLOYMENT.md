# Deployment

## Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Cloudinary account (for image uploads)
- SMTP service (for emails)

## Steps

1. Clone & install
```bash
git clone <repo>
cd loan-platform
npm install
```

The root `package.json` uses `concurrently`. To install all workspaces at once:
```bash
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

2. Start infrastructure
```bash
docker-compose up -d
```

3. Configure environment
```bash
cd server && cp .env.example .env
cd ../client && cp .env.example .env.local
# Edit .env / .env.local with your values
```

4. Run migrations
```bash
cd server
npx prisma migrate dev
npx prisma db seed
```

5. Build & start
```bash
npm run build
npm start
```

## Production
- Use a process manager (PM2)
- Set up Nginx reverse proxy
- Enable HTTPS with Let's Encrypt
- Use managed PostgreSQL