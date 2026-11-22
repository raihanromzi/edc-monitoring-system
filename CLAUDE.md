# CLAUDE.md

## Scope and sources

- Build single-branch monitoring web app Mandiri EDC and Livin' Merchant portfolios.
- Use `docs/system-design-spec.md` original product direction.
- Use `specs/001-branch-lvm-edc-monitoring/spec.md` requirements and acceptance criteria.
- Use `specs/001-branch-lvm-edc-monitoring/tasks.md` implementation order. Complete dependency phases first.
- Keep API and CSV behavior compatible `specs/001-branch-lvm-edc-monitoring/contracts/`.
- Before UI code, read `@design-system/mandiri-edc-monitoring/MASTER.md`; for dashboard code, read `@design-system/mandiri-edc-monitoring/pages/dashboard.md` first. Page rules override Master.
- When a development task is verified done (tests pass, build succeeds), always commit and push to `origin` before reporting completion. Never commit `.env.local` or secrets.

## Repository state

- Application source, tests, CI, and deployment config now exist (`src/`, `prisma/`, `.github/workflows/ci.yml`, `vercel.json`).
- When scaffolding creates verified scripts, replace preceding line exact commands from `package.json` or CI.

## Planned code map

- Create Next.js App Router application under `src/app/`; place route handlers in `src/app/api/`.
- Keep Prisma schema and seed data in `prisma/`; model `BranchConfig`, `Merchant`, and append-only `VisitLog` records from `specs/001-branch-lvm-edc-monitoring/data-model.md`.
- Put database access in `src/lib/db.ts`, health classification in `src/lib/health.ts`, Haversine distance in `src/lib/geo.ts`, CSV parsing in `src/lib/csv.ts`, and request schemas in `src/lib/validations/`.
- Keep Leaflet components in `src/components/map/`; merchant UI in `src/components/merchants/`; visit UI in `src/components/visits/`; settings and ingestion UI in `src/components/settings/` and `src/components/ingestion/`.

## Invariants

- Keep scope single-branch. Add no multi-branch abstraction.
- Match CSV rows by `mid`; update merchant metrics without deleting linked visit history.
- Recalculate health on ingestion and threshold changes: inactive, zero current transactions, or current volume below red threshold is `RED`; qualifying volume drop is `YELLOW`; otherwise `GREEN`.
- Preserve every completed visit officer, timestamp, structured root cause, action, and notes. Never overwrite visit record.
- Validate every CSV header and row before mutation; return row-specific errors.
- Treat missing or invalid coordinates unresolved location data; never substitute branch coordinates.
- Retain CSV identifiers strings and monetary values in IDR.

## Platform constraints

- Render Leaflet only in client components dynamically loaded `next/dynamic(..., { ssr: false })`; never access browser globals during SSR.
- Use OpenStreetMap tiles and Google Maps direction links. Add no paid map provider without explicit request.
- Use only synthetic merchant data in seeds, demos, fixtures, tests, and screenshots.
- Keep `.env.local`, database URLs, production CSV exports, and real merchant contact data untracked.

## Verification

- Exercise changed product flows; do not claim completion static checks alone.
- Follow relevant scenarios in `specs/001-branch-lvm-edc-monitoring/quickstart.md`.
- For ingestion: verify valid upsert, invalid-row rejection, health recalculation, and preserved visit history.
- For map changes: verify SSR safety, status filters, distance ordering, navigation links, and persisted pin adjustments.
- Commands: `npm run lint`, `npm test`, `npm run build`, `npx prisma generate`, `npx prisma db push`, `npx prisma db seed`.
- GitHub Actions runs lint, tests, Prisma client generation, and build on pull requests and `main` pushes.

## Documentation

- Update applicable specification, contract, data model, plan, or task list when behavior changes.
- Update `docs/system-design-spec.md` only for intentional product-decision change.
- Defer authentication, camera capture, GPS geofencing, PostGIS, and multi-branch support unless explicitly requested.
