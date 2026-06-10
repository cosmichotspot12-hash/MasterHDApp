@AGENTS.md

---

# Project: HubliDharwad.app / MasterHD — Complete State Reference

> Last read: 2026-06-10. All file paths, schema fields, and status values are taken directly from the current codebase.

---

## 1. What This Project Is

A real-estate matchmaking platform for Hubballi-Dharwad, India. It connects:

- **Property seekers** — can browse listings, post requirements, request visits
- **Property owners** — can submit their property to get listed
- **Admin (single operator)** — manages all listings, leads, visits, and requirements through a private dashboard

The operator personally visits and verifies every property before listing it. The brand shows as **HubliDharwad.app** in the header/footer. The domain is `masterhdapp.in`. The package name is `masterhdapp`.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router, RSC + Client Components) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`) with heavy inline `<style>` blocks |
| Database | Supabase (PostgreSQL) — anon key for public reads, service role key for all writes |
| File Storage | Supabase Storage, bucket: `property-photos` |
| PWA | next-pwa ^5.6.0 (webpack only; disabled in Turbopack dev mode) |
| Runtime | Node.js (Vercel / any Node host) |
| React | 19.2.4 |

---

## 3. Environment Variables

File: `.env.local`

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (used for photo uploads from client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service role key (used in all API routes) |
| `ADMIN_PASSWORD` | Password submitted on the login form |
| `ADMIN_SESSION_SECRET` | Value stored in the `admin_auth` cookie after login |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number with country code, e.g. `918792683791` |
| `NEXT_PUBLIC_APP_URL` | Base URL for internal server-side `fetch` calls, e.g. `http://localhost:3000` |

`ADMIN_SESSION_SECRET` is compared to the cookie value; `ADMIN_PASSWORD` is compared to the login form value. Both are needed.

---

## 4. Folder and File Structure

```
masterhdapp/
├── app/
│   ├── layout.tsx                   Root layout — wraps everything in <SiteChrome>
│   ├── page.tsx                     Homepage — hero, listings preview, how it works, owner CTA
│   ├── globals.css                  Tailwind import + CSS custom properties + all shared utility classes
│   ├── loading.tsx                  Global loading skeleton (6 card skeletons)
│   ├── manifest.ts                  PWA manifest
│   ├── sitemap.ts                   Dynamic sitemap (fetches active listing slugs)
│   ├── robots.ts                    Robots.txt — disallows /admin/
│   │
│   ├── properties/
│   │   └── page.tsx                 Browse all listings with type/bhk/category/locality filters + pagination
│   │
│   ├── property/
│   │   └── [slug]/
│   │       └── page.tsx             Individual listing detail page — full details, video embed, contact sidebar
│   │
│   ├── rent/page.tsx                Redirect → /properties?type=rent
│   ├── sale/page.tsx                Redirect → /properties?type=sale
│   │
│   ├── find/
│   │   ├── layout.tsx               Sets <title> metadata
│   │   └── page.tsx                 Post-requirement form (client component) → POST /api/requirements
│   │
│   ├── list/
│   │   ├── layout.tsx               Sets <title> metadata
│   │   └── page.tsx                 Owner-submission form (client component) → POST /api/owner-submissions
│   │
│   ├── visit/
│   │   ├── layout.tsx               Sets <title> metadata
│   │   └── page.tsx                 Visit-request form (client component) → POST /api/visit-requests
│   │
│   ├── admin/
│   │   ├── layout.tsx               Wraps all admin pages in <AdminShell>
│   │   ├── page.tsx                 Admin dashboard — action counts + attention properties
│   │   ├── login/
│   │   │   └── page.tsx             Password login form → POST /api/admin/login
│   │   ├── listings/
│   │   │   ├── page.tsx             Grid of all listings with filters
│   │   │   ├── DeleteButton.tsx     Client component — DELETE /api/admin/listings/:id + reload
│   │   │   ├── new/
│   │   │   │   └── page.tsx         Full new-listing form (client) — uploads photos to Supabase, POST /api/admin/listings
│   │   │   └── [id]/
│   │   │       ├── page.tsx         Per-property workspace (RSC) — details + visits + matched requirements tabs
│   │   │       └── edit/
│   │   │           └── page.tsx     Edit listing form (client) — same fields as new, PUT /api/admin/listings/:id
│   │   ├── owner-submissions/
│   │   │   ├── page.tsx             Owner leads list with search/filter
│   │   │   └── StatusUpdater.tsx    Inline status dropdown — PATCH /api/admin/owner-sub/:id or visit-req/:id or reqs/:id
│   │   ├── visit-requests/
│   │   │   └── page.tsx             Visit requests grouped by active listing
│   │   └── requirements/
│   │       ├── page.tsx             Locality-grouped seeker requirements
│   │       └── locality/
│   │           └── [locality]/
│   │               └── page.tsx     All requirements for a specific locality with multi-filter
│   │
│   └── api/
│       ├── listings/
│       │   ├── route.ts             GET — public listings with filters (type/bhk/category/locality/sort/limit)
│       │   └── [slug]/route.ts      GET — single listing by slug (public, status=active only)
│       ├── owner-submissions/
│       │   └── route.ts             POST — public owner-submission form submission
│       ├── requirements/
│       │   └── route.ts             GET (counts only), POST — public requirement form submission
│       ├── visit-requests/
│       │   └── route.ts             POST — public visit-request form submission
│       └── admin/
│           ├── login/route.ts       POST — set admin_auth cookie on correct password
│           ├── logout/route.ts      GET — delete cookie, redirect to /admin/login
│           ├── listings/
│           │   ├── route.ts         GET all, POST new (admin auth required)
│           │   └── [id]/route.ts    GET one, PUT update, DELETE (admin auth required)
│           ├── owner-sub/
│           │   ├── route.ts         GET all (admin auth required)
│           │   └── [id]/route.ts    PATCH status (admin auth required)
│           ├── visit-req/
│           │   ├── route.ts         GET all (admin auth required)
│           │   └── [id]/route.ts    PATCH status (admin auth required)
│           └── reqs/
│               ├── route.ts         GET all (admin auth required)
│               └── [id]/route.ts    PATCH status (admin auth required)
│
├── components/
│   ├── site-chrome.tsx              Client wrapper — renders SiteHeader+SiteFooter on public routes, bare on /admin
│   ├── site-header.tsx              Sticky header with nav, mobile hamburger drawer, mobile sticky CTA bar
│   ├── site-footer.tsx              Footer with brand, nav links, WhatsApp button, Admin login link
│   ├── property-card.tsx            PropertyCard component + PropertyCardStyles (exported style tag)
│   ├── admin-shell.tsx              Admin layout shell — top bar, tab nav, mobile menu, page wrapper
│   ├── admin-operations.tsx         Large file — all admin UI widgets (see section 7 below)
│   └── admin/                       (directory exists but is EMPTY)
│
├── lib/
│   ├── supabase.ts                  Anon client (for client-side photo uploads)
│   ├── supabase-admin.ts            Service-role client (for server-side data access)
│   ├── admin-auth.ts                Cookie name, validation logic, helpers
│   ├── admin-api.ts                 adminApiHeaders() — reads cookie for SSR admin page fetches
│   └── lead-validation.ts           validateOwnerSubmission, validateRequirement, validateVisitRequest
│
├── public/
│   ├── hero-map.svg                 SVG map illustration used in homepage hero
│   ├── images/
│   │   └── home-hero-property.png   Poster image for homepage video previews
│   ├── icons/
│   │   ├── icon-192.png             PWA icon / header brand mark
│   │   └── icon-512.png             PWA icon
│   ├── videos/
│   │   └── .gitkeep                 Directory exists but videos ARE NOT committed
│   ├── sw.js                        Service worker (generated by next-pwa)
│   └── workbox-4754cb34.js          Workbox runtime (generated by next-pwa)
│
├── proxy.ts                         NOT USED AS MIDDLEWARE — exports proxy() but no middleware.ts exists
├── next.config.ts                   PWA config (webpack only), reactStrictMode, turbopack:{}
├── package.json
├── tsconfig.json
└── .env.local
```

---

## 5. Supabase Database Schema

Derived from all queries, form fields, and TypeScript types in the codebase. No Supabase migrations file exists in this repo.

### Table: `listings`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `title` | text | Required |
| `slug` | text | Auto-generated on create: `<title-lowercased>-<timestamp>` |
| `status` | text | `draft` \| `active` \| `rented_sold` \| `inactive` |
| `listing_type` | text | `rent` \| `sale` |
| `property_category` | text | `apartment` \| `independent_house` \| `house_in_layout` \| `commercial` \| `plot` |
| `city` | text | Default `Hubli-Dharwad` |
| `locality` | text | Required |
| `landmark` | text | Optional |
| `google_maps_url` | text | Optional |
| `society_building_name` | text | Optional |
| `bhk_count` | text | `1` \| `2` \| `3` \| `4+` |
| `bathrooms` | text | `1` \| `2` \| `3+` |
| `property_floor` | integer | Optional |
| `total_floors` | integer | Optional |
| `is_ground_floor` | boolean | |
| `age_of_property` | text | `new` \| `less_than_5` \| `5_to_10` \| `above_10` |
| `water_supply` | text | `corporation` \| `borewell` \| `both` |
| `facing` | text | `east` \| `west` \| `north` \| `south` \| `not_specified` |
| `furnishing` | text | `furnished` \| `semi_furnished` \| `unfurnished` \| `na` |
| `price` | integer | Monthly rent or sale price in INR |
| `negotiable` | boolean | |
| `deposit_amount` | integer | Optional, rent only |
| `maintenance_charges` | text | `included` \| `excluded` \| `not_applicable` |
| `available_from` | text | Free text or date string |
| `preferred_tenants` | text | `family` \| `bachelor` \| `students` \| `anyone` |
| `food_preference` | text | `veg_only` \| `veg_and_nonveg` \| `no_preference` |
| `pets_allowed` | boolean | |
| `female_bachelors_allowed` | boolean | |
| `lift` | boolean | |
| `power_backup` | boolean | |
| `water_24_7` | boolean | |
| `cctv` | boolean | |
| `security_guard` | boolean | |
| `car_parking` | boolean | |
| `two_wheeler_parking` | boolean | |
| `gym` | boolean | |
| `garden` | boolean | |
| `swimming_pool` | boolean | |
| `description` | text | Optional |
| `nearby_places` | text | Optional |
| `photos` | text[] | Array of public Supabase storage URLs (max 5) |
| `youtube_url` | text | Optional YouTube link |
| `is_featured` | boolean | Featured listings sort first |
| `owner_name` | text | Private — never exposed on public API |
| `owner_phone` | text | Private — never exposed on public API |
| `date_listed` | date | Optional, for days-on-market calc |
| `follow_up_date` | date | Admin internal |
| `internal_notes` | text | Admin internal, never public |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | Used by sitemap |

### Table: `owner_submissions`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `owner_name` | text | Required |
| `owner_phone` | text | Required, normalized to 10 digits |
| `listing_type` | text | `rent` \| `sale` |
| `locality` | text | Required |
| `expected_price` | integer | Optional |
| `status` | text | `new` \| `contacted` \| `visit_scheduled` \| `listed` \| `rejected` |
| `created_at` | timestamptz | |

### Table: `requirements`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `finder_name` | text | Required |
| `finder_phone` | text | Required, normalized to 10 digits |
| `listing_type` | text | `rent` \| `sale` |
| `property_category` | text | `apartment` \| `independent_house` \| `house_in_layout` \| `commercial` \| `plot` |
| `bhk_count` | text | `any` \| `1` \| `2` \| `3` \| `4+` |
| `locality_preference` | text | Required |
| `budget_min` | integer | Optional |
| `budget_max` | integer | Required |
| `furnishing_preference` | text | `any` \| `furnished` \| `semi_furnished` \| `unfurnished` |
| `timeline` | text | `immediately` \| `within_1_month` \| `within_3_months` \| `just_exploring` |
| `tenant_type` | text | `family` \| `bachelor` \| `student` |
| `food_preference` | text | `veg` \| `non_veg` |
| `facing_preference` | text | `any` \| `east` \| `west` \| `north` \| `south` |
| `special_requirements` | text | Optional, max 600 chars |
| `status` | text | `new` \| `contacted` \| `matched` \| `fulfilled` \| `no_match` |
| `created_at` | timestamptz | |

### Table: `visit_requests`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `finder_name` | text | Required |
| `finder_phone` | text | Required, normalized to 10 digits |
| `listing_id` | text | Optional — UUID of related listing |
| `property_title` | text | Snapshot of title at time of request |
| `preferred_day` | text | Date string |
| `preferred_time` | text | `morning` \| `afternoon` \| `evening` |
| `message` | text | Optional |
| `status` | text | `new` \| `contacted` \| `visit_scheduled` \| `visit_done` \| `converted` \| `dropped` |
| `created_at` | timestamptz | |

### Supabase Storage

- Bucket: `property-photos`
- Uploads done from the browser using the anon key (`lib/supabase.ts`) in the new-listing and edit-listing pages
- The bucket must have permissive upload RLS policies for this to work
- Public read access assumed (photos served as direct public URLs)

---

## 6. Authentication

Admin auth is cookie-based, single-password, no user table.

- Login: POST `/api/admin/login` with `{ password }`. If password matches `ADMIN_PASSWORD`, set cookie `admin_auth` = value of `ADMIN_SESSION_SECRET` (7-day, httpOnly, secure in prod).
- Logout: GET `/api/admin/logout` — deletes cookie, redirects to login.
- All `/api/admin/*` routes call `isAdminRequest(request)` which reads the cookie and compares it to `ADMIN_SESSION_SECRET`.
- Admin pages (`/admin/*`) are NOT middleware-protected. The file `proxy.ts` exports a `proxy()` function but there is no `middleware.ts` — it is dead code. Admin pages fetch data from the admin APIs passing the cookie via `adminApiHeaders()`. If unauthenticated, APIs return 401 and pages show empty states.
- `/admin/login` and the login/logout API routes are exempt from the auth check.

---

## 7. Component Details

### `components/admin-operations.tsx`

The largest file (~836 lines). Contains all admin UI widgets as named exports:

| Export | What it renders |
|---|---|
| `ListingsInventory` | Filterable grid of all listings with search, status, type filters |
| `VisitRequestsWorkspace` | Active listings that have visit requests, sorted by new-count |
| `PropertyWorkspace` | Full property detail with 3 tabs: Details / Visit Requests / Matched Requirements |
| `OwnerQueue` | Owner leads list with inline status updater and WhatsApp/call buttons |
| `RequirementsQueue` | Locality cards showing counts — links to locality drill-down page |
| `RequirementsLocalityWorkspace` | Full seeker list for a locality with status bucket counts + multi-filter |

Internal `matchRequirements()` matches a listing against requirements by `listing_type`, locality substring match, and BHK. Used in the Matched Requirements tab.

### `components/admin-shell.tsx`

Client component. Admin top bar + desktop tab nav + mobile hamburger menu. Skips chrome when `pathname === '/admin/login'`.

Nav links: Overview → Properties → Add listing → Owner leads → Visit requests → Requirements

### `components/property-card.tsx`

Public listing card. Exports `PropertyCardStyles` (a `<style>` tag) that must be rendered once per page that uses cards.

### `components/site-chrome.tsx`

Reads pathname. If `/admin/*`, renders children bare. Otherwise wraps in `SiteHeader` + `SiteFooter`.

### `components/site-header.tsx`

Sticky header. Desktop: brand + nav (Rent, Buy) + action buttons. Below 980px: hamburger. Below 640px: eyebrow tagline + mobile sticky CTA bar. Sticky CTA bar hidden on `/find`, `/list`, `/visit`, `/admin/*`.

---

## 8. Public Pages

| Route | Type | Description |
|---|---|---|
| `/` | RSC | Hero with video previews + recent listings grid + how-it-works + owner CTA + Instagram section |
| `/properties` | RSC | Full listing browser — type/BHK/category/locality filters (GET form). 12 per page. |
| `/property/[slug]` | RSC | Full listing detail — photos, title/price, details grid, video embed, amenities, nearby. Sidebar desktop + sticky bar mobile. |
| `/find` | Client | Post-requirement form |
| `/list` | Client | Owner-submission form |
| `/visit` | Client | Visit-request form. Reads `listing_id` and `title` from URL params. |
| `/rent` | Redirect | → `/properties?type=rent` |
| `/sale` | Redirect | → `/properties?type=sale` |

---

## 9. Admin Pages

All admin pages are RSC calling internal admin APIs (auth cookie passed via `adminApiHeaders()`).

| Route | Description |
|---|---|
| `/admin` | Dashboard: action counts + attention properties + listing health metrics |
| `/admin/login` | Password form |
| `/admin/listings` | Full inventory grid with search/filter |
| `/admin/listings/new` | Create listing — 10 sections (classification, location, details, pricing, rental prefs, amenities, description, media, owner info, admin settings) |
| `/admin/listings/[id]` | Property workspace — 3-tab: Details, Visit Requests, Matched Requirements. Inline status dropdown. |
| `/admin/listings/[id]/edit` | Edit form — same 10 sections, pre-populated. Existing photo management. |
| `/admin/owner-submissions` | Owner leads queue with search, status filter, WhatsApp/call actions |
| `/admin/visit-requests` | Visit requests grouped by active listing property cards |
| `/admin/requirements` | Locality grid — each card links to drill-down |
| `/admin/requirements/locality/[locality]` | Per-locality seeker list with status bucket summary and multi-filter |

---

## 10. Data Flow

### Public form submissions
```
Browser form → POST /api/{requirements|owner-submissions|visit-requests}
  → lib/lead-validation.ts validates + sanitizes
  → supabaseAdmin.from('...').insert()
  → { success: true } or { error: '...' }
```

### Public listing browse
```
RSC page → fetch(APP_URL + /api/listings?...) with cache: no-store
  → supabaseAdmin.from('listings').select(...).eq('status', 'active')
  → owner_name/owner_phone NOT in the select — never exposed publicly
```

### Admin data fetch
```
RSC admin page → adminApiHeaders() (reads cookie from next/headers cookies())
  → fetch(APP_URL + /api/admin/...) with cookie header
  → API route checks isAdminRequest() → supabaseAdmin query
  → returns { data: [...] }
```

### Admin status updates (inline)
```
StatusUpdater client component → PATCH /api/admin/{owner-sub|visit-req|reqs}/{id}
  → { status: newValue } → window.location.reload()

PropertyStatusSelect → PUT /api/admin/listings/{id} → { status: newValue } → window.location.reload()

DeleteButton → DELETE /api/admin/listings/{id} → window.location.reload()
```

### Photo uploads
```
New/Edit listing form (client component, browser)
  → supabase anon client .storage.from('property-photos').upload(filename, file)
  → get public URL
  → include URLs in listing payload sent to POST/PUT /api/admin/listings
```

---

## 11. Known Issues / Incomplete Items

### Critical

1. **No middleware protection on admin pages.** `proxy.ts` is dead code — there is no `middleware.ts`. Admin pages are accessible without auth (they show empty data). Fix: rename `proxy.ts` → `middleware.ts`, change `export function proxy` → `export function middleware`, keep `export const config` as-is.

2. **Homepage video files missing.** `app/page.tsx` references `/videos/property-preview-1.mp4` and `/videos/property-preview-2.mp4`. `public/videos/` only has `.gitkeep`. Videos fall back to the poster image — no video plays. Files need to be added to the repository.

### Design/UX

3. **Brand name inconsistency.** Package is `masterhdapp`, domain is `masterhdapp.in`, page titles say "MasterHD", header/footer show `HubliDharwad.app`, Instagram is `hublidharwad.app`.

4. **Success states use plain "OK" text** instead of a checkmark icon.

5. **`app/page.tsx` contains ~200 lines of hidden dead JSX** — old UI sections wrapped in `className="hidden"`.

### Code Quality

6. **`components/admin` directory is empty.**

7. **No pagination on admin data fetches.** All admin API calls use `select('*')` with no limit.

8. **Status updates use `window.location.reload()`** instead of a toast/optimistic update pattern.

9. **`/api/requirements` GET returns only IDs** (`select('id')`). The "300+" stat on the homepage is hardcoded, not fetched dynamically.

10. **Supabase anon key used for photo uploads.** The `property-photos` bucket must have permissive RLS insert policies for this to work. If the bucket is private, uploads silently fail.

11. **Slug generated client-side with `Date.now()`.** Not collision-safe if two listings created in the same millisecond.

---

## 12. CSS Architecture

Two parallel systems:

1. **Tailwind v4 utility classes** on JSX elements
2. **Component-scoped `<style>` tags** inline in each component for complex responsive styles

`globals.css` defines:
- CSS custom properties: `--ink` `--muted` `--line` `--surface` `--page` `--page-soft` `--brand` `--brand-dark`
- Shared utility classes: `.site-container` `.page-shell` `.content-card` `.btn-primary` `.btn-ghost` `.nav-link` `.glass-panel` `.admin-table-wrap` `.skeleton`
- Global resets for `input`, `select`, `textarea` with forced borders via `!important`
- Mobile breakpoints at 767px and 768px–1040px

Background: warm cream `#FFF4E6`. Brand green: `#1D9E75`. Brand indigo: `#4F46E5`. Brand orange: `#C95F2C`.

---

## 13. SEO / PWA

- Sitemap at `/sitemap.xml` — dynamic, all active listing slugs + static pages
- Robots: allows all except `/admin/`
- OG metadata on homepage and property detail pages
- PWA manifest: standalone display, cream background, orange theme
- Service worker via next-pwa (webpack builds only, disabled in dev)

---

## 14. Next.js 16.x API Notes

These breaking changes from earlier versions are already handled correctly in this codebase:

- `params` in route handlers and pages is a `Promise` — must be `await`ed
- `searchParams` in pages is also a `Promise`
- `cookies()` from `next/headers` is async

---

## 15. Scripts

```bash
npm run dev      # next dev (Turbopack)
npm run build    # next build (webpack, generates PWA assets)
npm run start    # next start
npm run lint     # eslint
```
