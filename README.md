# QuickLoan - Micro Loan Platform

A mobile-first micro-loan platform built for Ghana. Users register, verify with live camera, apply for loans on a 6-day cycle, and repay via Mobile Money.

## Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Framer Motion, Zustand
- **Backend:** Express, TypeScript, Prisma, PostgreSQL
- **Real-time:** Socket.IO
- **Storage:** Cloudinary
- **Auth:** JWT + bcrypt

## Quick Start
```bash
# Dependencies
npm install && cd client && npm install && cd ../server && npm install

# Infrastructure
docker-compose up -d

# Database
cd server && npx prisma migrate dev && npx prisma db seed

# Start
npm run dev
```

## Admin Access
- URL: http://localhost:3000/admin/login
- Default: admin@loanplatform.com / admin123

## Loan Levels
| Level | Max Amount | Interest |
|-------|-----------|----------|
| Bronze | GHS 100 | 10% |
| Silver | GHS 300 | 8% |
| Gold | GHS 500 | 7% |
| Platinum | GHS 1,000 | 5% |
