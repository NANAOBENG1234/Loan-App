# BoA Micro Finance

[![CI](https://github.com/NANAOBENG1234/Loan-App/actions/workflows/ci.yml/badge.svg)](https://github.com/NANAOBENG1234/Loan-App/actions/workflows/ci.yml)

A mobile-first micro-lending platform built for Ghana. Users register with their phone number, verify their identity with a live camera, get loans on a 6-day cycle, and repay directly to Mobile Money.

## Features

- **Onboarding & KYC** — Phone-first registration, camera capture for Ghana Card front/back + selfie, and a verification hub that tracks each document through pending/approved/rejected with rejection reasons.
- **Loan lifecycle** — Apply, approve, six-day active window with due-countdown, repay, overdue, and level progression (Bronze → Platinum). Loan detail page shows schedule, totals, and contextual actions.
- **Mobile Money repayments** — Gateway-agnostic provider layer. Ships with a `mock` provider for local development and a Flutterwave `mobile_money_ghana` provider (MTN, Vodafone, AirtelTigo) with signature-verified, idempotent webhooks.
- **Real-time notifications** — Persistent in-app notifications pushed over Socket.IO (loan approved, overdue, repaid, verification results, reminders) plus a full REST API.
- **PWA** — Installable shell: web app manifest, generated icons, service worker with offline fallback.
- **Hardened auth** — HttpOnly SameSite=Lax cookies, 7-day rotating sessions, per-endpoint account-aware rate limits, cross-origin request guard.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand
- **Backend:** Express, TypeScript, Prisma, PostgreSQL
- **Real-time:** Socket.IO
- **Storage:** Cloudinary
- **Payments:** Flutterwave Mobile Money (mock provider for dev)
- **Auth:** JWT (httpOnly cookie) + bcrypt
- **Test/CI:** Vitest, GitHub Actions

## Repository Layout

```
client/   Next.js app (src/app + components)
server/   Express API, Prisma schema + committed migrations, jobs, sockets
scripts/  setup.sh, deploy.sh (pm2)
docs/     API reference, deployment guide
```

## Quick Start

```bash
# 1. Install dependencies
npm install && cd client && npm install && cd ../server && npm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Apply migrations + seed the admin account
cd server && npm run migrate && npm run seed

# 4. Copy server/.env.example -> server/.env and fill in values

# 5. Run the app (client :3000, server :5000)
npm run dev
```

> Prisma is pinned to v5 via the server lockfile. Use the repo scripts (`npm run migrate` / `npm run generate` / `npm test`) so commands resolve the installed binary rather than a globally cached one.

## Tests

```bash
cd server && npm test   # 36 unit tests: repayment, levels, validators, payment providers, security, rate-limit keys
```

## Admin Access

- URL: http://localhost:3000/admin/login
- Default: `admin@boamicrofinance.com` / `admin123`

## Loan Levels

| Level | Max Amount | Interest | Repayment |
|-------|-----------|----------|-----------|
| Bronze | GHS 100 | 10% | 6 days |
| Silver | GHS 300 | 8% | 6 days |
| Gold | GHS 500 | 7% | 6 days |
| Platinum | GHS 1,000 | 5% | 6 days |

## Documentation

- `docs/API.md` — full REST + Socket.IO API reference
- `docs/DEPLOYMENT.md` — production setup
- `server/.env.example` — all environment variables

## Deployment

`scripts/deploy.sh` builds both apps, runs `prisma migrate deploy`, and starts the API under pm2 (`boa-micro-finance`). CI (`.github/workflows/ci.yml`) runs prisma generate, the test suite, and both production builds on every push/PR to `main`.