import 'server-only'

import { supabaseAdmin } from '@/lib/supabase-admin'

const DEFAULT_WINDOW_HOURS = 24

function sinceIso(hours = DEFAULT_WINDOW_HOURS) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

export async function hasRecentOwnerSubmission(input: { owner_phone: string; locality: string }) {
  const { data, error } = await supabaseAdmin
    .from('owner_submissions')
    .select('id')
    .eq('owner_phone', input.owner_phone)
    .ilike('locality', input.locality)
    .gte('created_at', sinceIso())
    .limit(1)

  if (error) throw error
  return Boolean(data?.length)
}

export async function hasRecentRequirement(input: {
  finder_phone: string
  listing_type: string
  locality_preference: string
}) {
  const { data, error } = await supabaseAdmin
    .from('requirements')
    .select('id')
    .eq('finder_phone', input.finder_phone)
    .eq('listing_type', input.listing_type)
    .ilike('locality_preference', input.locality_preference)
    .gte('created_at', sinceIso())
    .limit(1)

  if (error) throw error
  return Boolean(data?.length)
}

export async function hasRecentVisitRequest(input: { finder_phone: string; listing_id: string | null }) {
  let query = supabaseAdmin
    .from('visit_requests')
    .select('id')
    .eq('finder_phone', input.finder_phone)
    .gte('created_at', sinceIso(6))
    .limit(1)

  query = input.listing_id ? query.eq('listing_id', input.listing_id) : query.is('listing_id', null)

  const { data, error } = await query
  if (error) throw error
  return Boolean(data?.length)
}
