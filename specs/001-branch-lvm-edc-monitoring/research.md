# Research & Technical Architecture Decisions

**Feature**: Branch LVM & EDC Monitoring System  
**Feature Directory**: `specs/001-branch-lvm-edc-monitoring`  
**Date**: 2026-11-22  

---

## 1. Web Framework & Runtime Architecture

### Decision
**Next.js 15 (App Router) with TypeScript & React 19** deployed to **Vercel**.

### Rationale
- **Full Cloud & Serverless**: Aligns directly with the user requirement for full-cloud Vercel deployment with zero server maintenance.
- **Unified Full-Stack**: Next.js App Router provides server-side rendering for initial load and Route Handlers / Server Actions for database mutations (CSV parsing, visit logging, config updates) without needing a decoupled backend server.
- **Fast Interactive UI**: Server Components reduce client bundle size while Client Components drive interactive Leaflet maps and reactive filters.

### Alternatives Considered
- *Vite + React SPA + Express API*: Requires managing two codebases and deploying two separate services or container setups; unnecessary overhead for an MVP.
- *Python FastAPI + Streamlit*: Great for rapid data science prototypes, but lacks the polished, mobile-friendly consumer UI feel required for branch staff doing field visits on smartphones or tablets.

---

## 2. Database & Data Persistence Layer

### Decision
**PostgreSQL hosted on Neon / Supabase**, accessed via **Prisma ORM**.

### Rationale
- **Serverless PostgreSQL**: Neon provides instant serverless Postgres with pooling via `@neondatabase/serverless` and WebSocket connections that integrate seamlessly with Vercel edge/serverless functions.
- **Type-Safe ORM**: Prisma generates TypeScript types directly from the schema, ensuring strict compile-time validation for merchant metrics, coordinate floats, and visit log relations.
- **Evolutionary Schema**: Prisma migrations (`prisma db push` / `prisma migrate`) simplify prototyping and fast iterations.

### Alternatives Considered
- *Drizzle ORM*: Highly performant and SQL-like, but Prisma's intuitive declarative schema syntax, built-in migration tools, and Prisma Studio visual data browser provide superior velocity for rapid prototyping and debugging.
- *SQLite / Local File DB*: Rejected because the system must be deployed to Vercel (read-only filesystem in serverless lambdas).

---

## 3. Geospatial Mapping & Pin Visualization

### Decision
**Leaflet with React-Leaflet and OpenStreetMap tiles** (client-side dynamic import with `ssr: false`).

### Rationale
- **Zero API Key / Free**: Completely open-source without requiring Google Maps or Mapbox API billing credentials, eliminating procurement delays in banking environments.
- **Custom HTML Markers**: Leaflet allows easy rendering of lightweight SVG DivIcons for 🔴 Red, 🟡 Yellow, and 🟢 Green status pins with pulse animations for high-priority underperforming merchants.
- **Mobile Friendly**: Responsive touch controls, pinch-to-zoom, and smooth panning on mobile web browsers for field officers on-site.
- **Navigation Integration**: A simple universal anchor link (`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`) provides instant 1-click turn-by-turn navigation in native Google Maps or Apple Maps apps on Android and iOS.

### Technical Constraint Note
Leaflet accesses the browser `window` and `document` objects. In Next.js App Router, all map components must be rendered inside `'use client'` components loaded via `next/dynamic(() => import(...), { ssr: false })` to avoid SSR hydration errors.

---

## 4. Ingestion Engine & CSV Parsing

### Decision
**Client-Side / Server-Side PapaParse with Zod Schema Validation**.

### Rationale
- **Streamlined File Handling**: PapaParse efficiently parses delimiter-separated files (`.csv`), strips extraneous BOM characters, auto-detects headers, and converts numbers.
- **Zod Schema Validation**: Every row is strictly validated against a Zod schema (`cif`, `sales_volume_current`, `latitude`, `longitude`, etc.). Malformed rows or missing required columns yield descriptive error messages pinpointing the exact row index.
- **Active State Overwrite with Upsert**: Existing merchants are updated (`upsert` based on `mid` or `tid`), new merchants are inserted, and merchants not in the new upload can be marked inactive, while preserving all existing `VisitLog` records.

---

## 5. Performance, Distance Calculations & Caching

### Decision
**Haversine Great-Circle Distance Calculation** computed dynamically in-memory or in database queries.

### Formula
Given Branch coordinates $(\phi_1, \lambda_1)$ and Merchant coordinates $(\phi_2, \lambda_2)$:
$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$d = 2R \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
where $R = 6371\text{ km}$.

### Rationale
For a single branch portfolio (typically 100 to 1,500 active merchants), client-side or server-side memory sorting via Haversine takes $< 2\text{ ms}$, eliminating the need for PostGIS database extensions while delivering instantaneous distance-ranked lists.
