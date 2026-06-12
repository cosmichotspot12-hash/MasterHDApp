import 'server-only'
import { supabaseAdmin } from '@/lib/supabase-admin'

type RequirementRow = {
  listing_type: string | null
  locality_preference: string | null
  status: string | null
  created_at: string | null
}

export type PublicDemandLocality = {
  locality: string
  total: number
  rent: number
  sale: number
  latestCreatedAt: string | null
}

export type PublicDemandSummary = {
  totalActive: number
  localityCount: number
  rentTotal: number
  saleTotal: number
  localities: PublicDemandLocality[]
}

const CLOSED_STATUSES = new Set(['fulfilled', 'converted', 'closed', 'dropped'])

function normalizeLocality(value: string | null) {
  return (value || '').trim().replace(/\s+/g, ' ')
}

export async function getPublicDemandSummary(): Promise<PublicDemandSummary> {
  const { data, error } = await supabaseAdmin
    .from('requirements')
    .select('listing_type, locality_preference, status, created_at')
    .order('created_at', { ascending: false })
    .limit(600)

  if (error || !data) {
    return {
      totalActive: 0,
      localityCount: 0,
      rentTotal: 0,
      saleTotal: 0,
      localities: [],
    }
  }

  const activeRows = (data as RequirementRow[]).filter((row) => {
    const locality = normalizeLocality(row.locality_preference)
    const status = (row.status || '').toLowerCase()
    return locality && !CLOSED_STATUSES.has(status)
  })

  const grouped = activeRows.reduce<Record<string, RequirementRow[]>>((acc, row) => {
    const locality = normalizeLocality(row.locality_preference)
    acc[locality] = acc[locality] || []
    acc[locality].push(row)
    return acc
  }, {})

  const localities = Object.entries(grouped)
    .map(([locality, rows]) => {
      return {
        locality,
        total: rows.length,
        rent: rows.filter((row) => row.listing_type === 'rent').length,
        sale: rows.filter((row) => row.listing_type === 'sale').length,
        latestCreatedAt: rows[0]?.created_at || null,
      }
    })
    .sort((a, b) => b.total - a.total || new Date(b.latestCreatedAt || 0).getTime() - new Date(a.latestCreatedAt || 0).getTime())

  return {
    totalActive: activeRows.length,
    localityCount: localities.length,
    rentTotal: activeRows.filter((row) => row.listing_type === 'rent').length,
    saleTotal: activeRows.filter((row) => row.listing_type === 'sale').length,
    localities: localities.slice(0, 8),
  }
}
