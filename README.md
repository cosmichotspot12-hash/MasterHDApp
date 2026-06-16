# MasterHD App

Property listing and lead-operations app for Hubli-Dharwad.

## What It Does

- Public property browsing for rent, sale, and lease listings.
- Property detail pages with photos, video links, visit CTAs, and SEO metadata.
- Lead capture for owner submissions, seeker requirements, and visit requests.
- Admin workspace for listings, owner leads, requirements, visit requests, and deals.
- Supabase-backed storage, database access, and admin operations.
- PWA manifest/service worker support.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- next-pwa

## Setup

Copy the example environment file and fill in the real values:

```bash
cp .env.example .env.local
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Environment Variables

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

Recommended:

- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not expose it to client components.

## Database Scripts

- `scripts/deals-table.sql` adds the deals ledger and lead source columns.
- `scripts/setup-deals.mjs` attempts to apply the deals SQL through a Supabase RPC if available.
- `scripts/parse-demand-csv.mjs` parses imported demand CSV data into preview records.
- `scripts/import-demand.mjs` imports preview records into Supabase with a dry-run default.

## Notes For Future Changes

This project uses Next.js 16. Before changing framework conventions, read the local docs in:

```text
node_modules/next/dist/docs/
```

Admin pages and service-role database helpers must remain server-only. Public API mutations should keep validation, rate limiting, and duplicate checks in place.
