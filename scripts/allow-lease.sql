-- Allow the 'lease' listing_type everywhere. Run once in the Supabase SQL editor.
--
-- The app (lib/listing-types.ts) supports rent | sale | lease, but the database
-- CHECK constraints on listings.listing_type and owner_submissions.listing_type
-- only permitted rent | sale, so any lease submission failed with error 23514
-- ("violates check constraint ..._listing_type_check").
--
-- This drops the old constraints and recreates them with 'lease' included.

alter table public.listings
  drop constraint if exists listings_listing_type_check;
alter table public.listings
  add constraint listings_listing_type_check
  check (listing_type in ('rent', 'sale', 'lease'));

alter table public.owner_submissions
  drop constraint if exists owner_submissions_listing_type_check;
alter table public.owner_submissions
  add constraint owner_submissions_listing_type_check
  check (listing_type in ('rent', 'sale', 'lease'));
