# Quickstart & End-to-End Validation Guide

**Feature**: Branch LVM & EDC Monitoring System  
**Feature Directory**: `specs/001-branch-lvm-edc-monitoring`  
**Date**: 2026-11-22  

---

## 1. Prerequisites

- **Node.js**: `v18.18.0` or higher (Node 20+ recommended).
- **Package Manager**: `npm` or `pnpm`.
- **Database**: PostgreSQL connection string (e.g., free tier instance on [Neon](https://neon.tech) or [Supabase](https://supabase.com)).
- **Git**: Clone of the repository.

---

## 2. Environment Setup

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create `.env.local` in the project root:
   ```env
   DATABASE_URL="postgresql://user:password@ep-sample-1234.us-east-2.aws.neon.tech/neondb?sslmode=require"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Initialize Database Schema**:
   Push the schema to your Neon/Postgres instance:
   ```bash
   npx prisma db push
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

---

## 3. End-to-End Validation Scenarios

### Scenario A: Immediate Demonstration via Sample Data
1. Navigate to `http://localhost:3000`.
2. Click the **"Load Sample Data"** action in the header or settings.
3. **Expected Outcome**:
   - The map centers on Bank Mandiri KCP Wisma Nusantara (`-6.193962, 106.823673`).
   - ~20 markers appear with color-coded pins: 🔴 Red, 🟡 Yellow, and 🟢 Green.
   - The drawer list shows merchants ranked by distance (e.g., Djournal Coffee GI ~245m, Kopi Sabang 16 ~650m).

---

### Scenario B: Inspect Underperforming Merchant & Open Navigation
1. Filter the list to **"🔴 Needs Visit (Red)"**.
2. Click on the nearest Red merchant (e.g. *Djournal Coffee Grand Indonesia*).
3. **Expected Outcome**:
   - The map pans and zooms to the marker.
   - The detail card shows current volume (e.g. Rp 1.25M vs prior Rp 8.9M, -85% drop).
   - Clicking **"Navigate"** opens Google Maps in a new tab with the target coordinates.

---

### Scenario C: Conduct On-Site Visit & Mark as Done
1. On the selected Red merchant card, click **"Log Visit"**.
2. Select Root Cause: **"Thermal Paper Out" (Kertas Habis)**.
3. Enter Action Taken: `"Diserahkan 5 roll kertas thermal dan test swipe berhasil."`
4. Click **"Save & Mark as Done"**.
5. **Expected Outcome**:
   - The modal closes with a success toast notification.
   - The merchant card updates to show "Visited Today".
   - The historical visit record appears in the merchant's visit history tab.
   - The branch summary counter for "Completed Visits" increments by 1.

---

### Scenario D: Pin Adjustment (Fine-Tuning Outlet Location)
1. On a merchant with a slightly offset pin, click **"Adjust Pin Location"**.
2. Drag the pin 50 meters down the street or click on the exact rooftop.
3. Click **"Save Pin Location"**.
4. **Expected Outcome**:
   - The new coordinates are persisted via `PATCH /api/merchants/:id/coordinates`.
   - Reloading the page retains the adjusted location.

---

### Scenario E: Ingest Updated EDA CSV File
1. Navigate to **"Settings / Ingestion"**.
2. Download the standard CSV template via **"Download Template"**.
3. Edit or upload the sample CSV from [`contracts/csv-contract.md`](contracts/csv-contract.md).
4. Click **"Upload CSV"**.
5. **Expected Outcome**:
   - The ingestion progress modal displays parsed rows count.
   - Health classifications recalculate dynamically.
   - All previous visit records logged in Scenario C remain intact and linked.
