import { APP_URL } from '@/lib/env'
import { listingTypeNoun, listingTypeVerb } from '@/lib/listing-types'
import {
  getAdminListings,
  getAdminOwnerSubmissions,
  getAdminVisitRequests,
  getAdminRequirements,
  getAdminDeals,
  type Deal,
} from '@/lib/admin-data'
import type { AdminListing, OwnerSubmission, Requirement, VisitRequest } from '@/components/admin-operations'
import AdminDashboard, { type DashboardData, type Lead, type VisitGroup } from './dashboard-client'

export const dynamic = 'force-dynamic'

const BRAND = 'HubliDharwad.app'

function daysSince(value?: string | null) {
  if (!value) return 0
  const start = new Date(value).getTime()
  if (!Number.isFinite(start)) return 0
  return Math.max(0, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)))
}

function formatBudget(min: number | null, max: number) {
  if (!max) return ''
  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')
  return min ? fmt(min) + '–' + fmt(max) : 'up to ' + fmt(max)
}

function isToday(dateStr: string | null) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return false
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

const byNewest = (a: Lead, b: Lead) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

function buildOwnerLeads(owners: OwnerSubmission[]): Lead[] {
  return owners
    .filter((o) => o.status === 'new')
    .map((o) => ({
      id: 'o-' + o.id,
      name: o.owner_name,
      phone: o.owner_phone,
      detail: [listingTypeVerb(o.listing_type), o.locality, o.expected_price ? '₹' + o.expected_price.toLocaleString('en-IN') : ''].filter(Boolean).join(' · '),
      href: '/admin/owner-submissions',
      whatsappText: `Hi ${o.owner_name}, this is ${BRAND}. Thanks for submitting your property in ${o.locality} for ${listingTypeNoun(o.listing_type)}. We have verified seekers looking in your area — let's get it listed. When can we talk?`,
      created_at: o.created_at,
    }))
    .sort(byNewest)
}

// Groups new visit requests under their listing (by id, so title edits don't
// split groups). Requests whose property is closed/removed are counted
// separately so they surface as "update the seeker" work, not fresh leads.
function buildVisitGroups(visits: VisitRequest[], listings: AdminListing[]): { groups: VisitGroup[]; unavailableCount: number } {
  const listingById = new Map(listings.map((l) => [l.id, l]))
  const groups: Record<string, { title: string; leads: Lead[] }> = {}
  let unavailableCount = 0
  visits
    .filter((v) => v.status === 'new')
    .forEach((v) => {
      const listing = listingById.get(v.listing_id)
      if (!listing || listing.status !== 'active') {
        unavailableCount += 1
        return
      }
      const title = listing.title || v.property_title || 'Property visit'
      groups[listing.id] = groups[listing.id] || { title, leads: [] }
      groups[listing.id].leads.push({
        id: 'v-' + v.id,
        name: v.finder_name,
        phone: v.finder_phone,
        detail: [v.preferred_day, v.preferred_time].filter(Boolean).join(' · '),
        href: '/admin/visit-requests',
        whatsappText: `Hi ${v.finder_name}, this is ${BRAND}. Got your visit request${title ? ` for "${title}"` : ''}${v.preferred_day ? ` on ${v.preferred_day}` : ''}${v.preferred_time ? ` (${v.preferred_time})` : ''}. Let's confirm the time — when works for you?`,
        created_at: v.created_at,
      })
    })
  return {
    groups: Object.values(groups)
      .map(({ title, leads }) => ({ propertyTitle: title, leads: leads.sort(byNewest) }))
      .sort((a, b) => b.leads.length - a.leads.length),
    unavailableCount,
  }
}

function normalizeBhk(value?: string | null) {
  if (!value) return ''
  const match = value.match(/\d/)
  return match ? match[0] : ''
}

// Option B: a seeker appears on the dashboard only when at least one ACTIVE
// listing matches (same logic as matchRequirements in admin-operations, reversed)
function buildSeekerLeads(reqs: Requirement[], listings: AdminListing[]): Lead[] {
  const active = listings.filter((l) => l.status === 'active')
  const leads: Lead[] = []

  reqs
    .filter((r) => r.status === 'new' && !(r.special_requirements || '').includes('[GF-import]'))
    .forEach((r) => {
      const reqLocality = r.locality_preference.toLowerCase().trim()
      const reqBhk = normalizeBhk(r.bhk_count)
      const matches = active.filter((l) => {
        if (l.listing_type && l.listing_type !== r.listing_type) return false
        const listLocality = l.locality.toLowerCase().trim()
        if (!listLocality.includes(reqLocality) && !reqLocality.includes(listLocality)) return false
        const listBhk = normalizeBhk(l.bhk_count)
        if (listBhk && reqBhk && listBhk !== reqBhk) return false
        return true
      })
      if (matches.length === 0) return

      const top = matches[0]
      const what = [r.bhk_count && r.bhk_count !== 'any' ? r.bhk_count + ' BHK' : '', r.property_category.replace(/_/g, ' '), r.listing_type].filter(Boolean).join(' ')
      const propertyUrl = top.slug ? `${APP_URL}/property/${top.slug}` : ''
      leads.push({
        id: 'r-' + r.id,
        name: r.finder_name,
        phone: r.finder_phone,
        detail: [what, r.locality_preference, formatBudget(r.budget_min, r.budget_max)].filter(Boolean).join(' · '),
        matchNote: `Matches: ${top.title}` + (matches.length > 1 ? ` +${matches.length - 1} more` : ''),
        href: '/admin/requirements/locality/' + encodeURIComponent(r.locality_preference),
        whatsappText: `Hi ${r.finder_name}, this is ${BRAND}. About your requirement — ${what} in ${r.locality_preference}: we have a verified matching property, "${top.title}"${top.price ? ' (₹' + Number(top.price).toLocaleString('en-IN') + ')' : ''}.${propertyUrl ? ' See it here: ' + propertyUrl : ''} Want to schedule a visit?`,
        created_at: r.created_at,
      })
    })

  return leads.sort(byNewest)
}

async function getDashboardData(): Promise<DashboardData> {
  const empty: DashboardData = {
    ownerLeads: [],
    visitGroups: [],
    unavailableVisits: 0,
    seekerLeads: [],
    todayVisits: [],
    totalListings: 0,
    activeListings: 0,
    draftListings: 0,
    newRequirementsTotal: 0,
    attentionProperties: [],
    monthRevenue: 0,
    monthDealCount: 0,
  }

  try {
    const [listingData, ownerData, visitData, requirementData, dealData] = await Promise.all([
      getAdminListings(),
      getAdminOwnerSubmissions(),
      getAdminVisitRequests(),
      getAdminRequirements(),
      getAdminDeals(),
    ])

    const now = new Date()
    const monthDeals = (dealData as Deal[]).filter((d) => {
      const dt = new Date(d.closed_date)
      return dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth()
    })
    const monthRevenue = monthDeals.reduce((sum, d) => sum + (Number(d.fee_earned) || 0), 0)

    const visitsByListing = visitData.reduce<Record<string, { total: number; new: number }>>((acc, visit) => {
      acc[visit.listing_id] = acc[visit.listing_id] || { total: 0, new: 0 }
      acc[visit.listing_id].total += 1
      if (visit.status === 'new') acc[visit.listing_id].new += 1
      return acc
    }, {})

    const attentionProperties = listingData
      .map((listing) => {
        const visitCounts = visitsByListing[listing.id] || { total: 0, new: 0 }
        const missingMedia = !listing.youtube_url && (!listing.photos || listing.photos.length === 0)
        const daysActive = daysSince(listing.date_listed || listing.created_at)
        const reasons = [
          visitCounts.new > 0 ? visitCounts.new + ' new visits' : '',
          listing.status === 'active' && daysActive > 30 ? daysActive + ' days active' : '',
          listing.status === 'draft' ? 'Draft listing' : '',
          missingMedia ? 'Missing media' : '',
        ].filter(Boolean)
        return { ...listing, visitCounts, daysActive, reasons }
      })
      .filter((listing) => listing.reasons.length > 0)
      .sort((a, b) => b.visitCounts.new - a.visitCounts.new || b.daysActive - a.daysActive)
      .slice(0, 6)
      .map((p) => ({ id: p.id, title: p.title, locality: p.locality, photos: p.photos, reasons: p.reasons }))

    const todayVisits = visitData
      .filter((v) => isToday(v.preferred_day) && !['visit_done', 'converted', 'dropped'].includes(v.status))
      .map((v) => ({
        id: v.id,
        finder_name: v.finder_name,
        finder_phone: v.finder_phone,
        property_title: v.property_title,
        preferred_time: v.preferred_time,
      }))

    const { groups: visitGroups, unavailableCount } = buildVisitGroups(visitData, listingData)

    return {
      ownerLeads: buildOwnerLeads(ownerData),
      visitGroups,
      unavailableVisits: unavailableCount,
      seekerLeads: buildSeekerLeads(requirementData, listingData),
      todayVisits,
      totalListings: listingData.length,
      activeListings: listingData.filter((item) => item.status === 'active').length,
      draftListings: listingData.filter((item) => item.status === 'draft').length,
      newRequirementsTotal: requirementData.filter((item) => item.status === 'new').length,
      attentionProperties,
      monthRevenue,
      monthDealCount: monthDeals.length,
    }
  } catch {
    return empty
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData()
  return <AdminDashboard data={data} />
}
