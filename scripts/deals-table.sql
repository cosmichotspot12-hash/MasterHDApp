-- Phase 2: deals ledger. Run once in the Supabase SQL editor.
-- Records every closed deal so revenue is tracked instead of invisible.

create table if not exists public.deals (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid references public.listings(id) on delete set null,
  requirement_id uuid references public.requirements(id) on delete set null,
  property_title text,                       -- snapshot, survives if listing is deleted
  seeker_name   text,
  seeker_phone  text,
  deal_type     text not null,               -- 'rent' | 'sale'
  fee_earned    integer not null default 0,  -- brokerage fee in INR
  closed_date   date not null default current_date,
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists deals_closed_date_idx on public.deals (closed_date desc);

-- Phase 2: lead source tracking. Adds a nullable column to each lead table.
-- 'google_form' already applied to imported requirements via the [GF-import] tag.
alter table public.owner_submissions add column if not exists source text default 'website';
alter table public.requirements      add column if not exists source text default 'website';
alter table public.visit_requests    add column if not exists source text default 'website';
