# Implementation Plan: Branch LVM & EDC Monitoring System

**Branch**: `001-branch-lvm-edc-monitoring` | **Date**: 2026-11-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-branch-lvm-edc-monitoring/spec.md`

## Summary

Build an operational branch-level monitoring and field-intervention web platform for a single Bank Mandiri branch to track, locate, and troubleshoot underperforming merchants acquired across Mandiri EDC terminals and Livin' Merchant accounts. The technical approach uses Next.js 15 App Router deployed to Vercel, serverless PostgreSQL hosted on Neon/Supabase accessed via Prisma ORM, client-rendered interactive Leaflet maps with OpenStreetMap tiles, and a CSV ingestion pipeline with automated health classification (Red/Yellow/Green) and lean visit diagnostic logging.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+

**Primary Dependencies**: Next.js 15 (App Router), React 19, Tailwind CSS, Prisma ORM, Leaflet / React-Leaflet, Lucide React, PapaParse, Zod

**Storage**: PostgreSQL (Neon Serverless Postgres / Supabase) via Prisma ORM

**Testing**: Vitest / Playwright for integration & unit validation

**Target Platform**: Full Cloud Serverless on Vercel (Mobile-responsive web for Android/iOS field staff and desktop browser for branch managers)

**Project Type**: Full-Stack Web Application

**Performance Goals**: < 1.5s initial page load; < 50ms reactive map filter interactions; < 2s for 1,000-row CSV parse and batch upsert

**Constraints**: Leaflet map components must be loaded dynamically on the client (`ssr: false`) to avoid server-side window hydration mismatch; branch coordinates used as anchor for Haversine distance calculations

**Scale/Scope**: Single branch operational scope monitoring 100 to 1,500 merchants; 20+ sample dummy merchants for initial seed demonstration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & Lean MVP**: PASS. No over-engineered microservices or complex authentication layers. Single full-stack Next.js project with Prisma and serverless Postgres.
- **Privacy & Compliance**: PASS. Cloud demo runs with realistic synthetic data; CSV ingestion allows flexible updates without hardcoding sensitive bank credentials.
- **Independent Testability**: PASS. All P1-P3 user journeys have standalone verification scenarios documented in `quickstart.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-branch-lvm-edc-monitoring/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output: Tech stack decisions & rationales
├── data-model.md        # Phase 1 output: Prisma schema, entity definitions, health rules
├── quickstart.md        # Phase 1 output: Setup and runnable validation guide
├── contracts/           # Phase 1 output: Interface definitions
│   ├── csv-contract.md  # EDA CSV ingestion schema and sample records
│   └── api-endpoints.md # REST API & Server Action contracts
└── checklists/
    └── requirements.md  # Spec quality validation checklist
```

### Source Code Layout (Next.js 15 Full-Stack)

```text
edc-monitoring-system/
├── prisma/
│   ├── schema.prisma            # Prisma schema (BranchConfig, Merchant, VisitLog)
│   └── seed.ts                  # Seed script with Wisma Danantara Indonesia sample data
├── public/
│   ├── templates/
│   │   └── sample_eda_merchants.csv # Downloadable CSV template for branch admins
│   └── markers/                 # Custom SVG markers for Red/Yellow/Green pins
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Global layout & Tailwind providers
│   │   ├── page.tsx             # Main dashboard (Map + Distance-ranked drawer)
│   │   ├── settings/
│   │   │   └── page.tsx         # CSV Uploader, Threshold configs, Seed demo
│   │   └── api/
│   │       ├── merchants/
│   │       │   ├── route.ts     # GET distance-sorted merchants with filters
│   │       │   ├── upload/
│   │       │   │   └── route.ts # POST CSV upload & batch upsert
│   │       │   └── [id]/
│   │       │       └── coordinates/
│   │       │           └── route.ts # PATCH pin coordinates adjustment
│   │       ├── visits/
│   │       │   └── route.ts     # POST create visit log & GET visit history
│   │       ├── branch-config/
│   │       │   └── route.ts     # GET / PUT branch anchor & threshold settings
│   │       └── seed/
│   │           └── route.ts     # POST reset & load sample demo data
│   ├── components/
│   │   ├── map/
│   │   │   ├── MapContainer.tsx # Dynamic wrapper (ssr: false) for Leaflet map
│   │   │   ├── LeafletMap.tsx   # Core Leaflet map with custom status pins
│   │   │   └── PinAdjuster.tsx  # Interactive pin relocation tool
│   │   ├── merchants/
│   │   │   ├── MerchantList.tsx # Distance-sorted drawer & filter controls
│   │   │   ├── MerchantCard.tsx # Detailed card with volume, drop %, navigation
│   │   │   └── StatusBadge.tsx  # 🔴 Red / 🟡 Yellow / 🟢 Green badges
│   │   ├── visits/
│   │   │   ├── VisitModal.tsx   # Diagnostic checklist form (Mark as Done)
│   │   │   └── VisitHistory.tsx # Historical timeline of past visits
│   │   └── ui/                  # Reusable UI primitives (Dialog, Button, Input, Select)
│   └── lib/
│       ├── db.ts                # Prisma client singleton
│       ├── geo.ts               # Haversine distance calculator
│       ├── health.ts            # Dynamic Red/Yellow/Green health status evaluator
│       └── csv.ts               # PapaParse wrapper & Zod row validator
├── docs/
│   └── system-design-spec.md    # Initial business & technical specification
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

**Structure Decision**: Standard modern Next.js 15 App Router architecture co-locating UI components, API route handlers, and Prisma database utilities in a single serverless repository.

## Complexity Tracking

*No constitutional violations. Standard lean full-stack design.*
