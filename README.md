# Mandiri EDC Monitoring

Single-branch operational monitoring for synthetic Mandiri EDC and Livin' Merchant portfolios.

## Stack

Next.js 15, React 19, Prisma/PostgreSQL, Leaflet/OpenStreetMap, Zod, PapaParse, Tailwind CSS.

## Local setup

```bash
cp .env.example .env.local
# Set DATABASE_URL to your PostgreSQL connection string.
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Open `http://localhost:3000`. All seeds and CSV examples are synthetic.

## Commands

```bash
npm run dev
npm run lint
npm test
npm run build
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Verification flows

Follow [`specs/001-branch-lvm-edc-monitoring/quickstart.md`](specs/001-branch-lvm-edc-monitoring/quickstart.md):

1. Load sample data. Confirm color-coded, distance-ranked pins.
2. Select a merchant. Confirm details and Google Maps link.
3. Log a visit. Confirm timeline entry persists.
4. Adjust a selected merchant pin. Confirm reload retains coordinates.
5. Upload `public/templates/sample_eda_merchants.csv`. Confirm metrics/health update while visit history remains.

## CI/CD

GitHub Actions runs lint, unit tests, Prisma client generation, and production build on pull requests and `main` pushes. Vercel builds via `vercel.json`; connect this GitHub repository in Vercel and configure `DATABASE_URL` for Preview and Production.

Never commit `.env.local`, database URLs, production CSV exports, or real merchant contact data.
