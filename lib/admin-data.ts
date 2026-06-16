import 'server-only'

import type { AdminListing, OwnerSubmission, Requirement, VisitRequest } from '@/components/admin-operations'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function getAdminListings() {
  const { data, error } = await supabaseAdmin
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as AdminListing[]
}

export async function getAdminListing(id: string) {
  const { data, error } = await supabaseAdmin
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as AdminListing
}

export async function getAdminVisitRequests() {
  const { data, error } = await supabaseAdmin
    .from('visit_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as VisitRequest[]
}

export async function getAdminRequirements() {
  const { data, error } = await supabaseAdmin
    .from('requirements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as Requirement[]
}

export async function getAdminOwnerSubmissions() {
  const { data, error } = await supabaseAdmin
    .from('owner_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as OwnerSubmission[]
}
