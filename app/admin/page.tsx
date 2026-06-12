'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

type StatusItem = { status: string }
type ListingItem = StatusItem & {
  id: string
  title: string
  slug?: string
  locality: string
  listing_type?: string
  bhk_count?: string | null
  price?: number | null
  photos?: string[] | null
  youtube_url?: string | null
  date_listed?: string | null
  created_at?: string | null
}
type OwnerItem = {
  id: string
  owner_name: string
  owner_phone: string
  listing_type: string
  locality: string
  expected_price: number | null
  status: string
  created_at: string
}
type VisitItem = {
  id: string
  finder_name: string
  finder_phone: string
  listing_id: string
  property_title: string | null
  preferred_day: string | null
  preferred_time: string | null
  message: string | null
  status: string
  created_at: string
}
type RequirementItem = {
  id: string
  finder_name: string
  finder_phone: string
  listing_type: string
  property_category: string
  bhk_count: string
  locality_preference: string
  budget_min: number | null
  budget_max: number
  furnishing_preference: string
  timeline: string
  tenant_type: string
  food_preference: string
  facing_preference: string
  special_requirements: string | null
  status: string
  created_at: string
}

type Lead = {
  id: string
  name: string
  phone: string
  detail: string
  matchNote?: string
  href: string
  whatsappText: string
  created_at: string
}

type VisitGroup = {
  propertyTitle: string
  leads: Lead[]
}

function daysSince(value?: string | null) {
  if (!value) return 0
  const start = new Date(value).getTime()
  if (!Number.isFinite(start)) return 0
  return Math.max(0, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)))
}

function timeAgo(value: string) {
  const ms = Date.now() - new Date(value).getTime()
  if (!Number.isFinite(ms) || ms < 0) return ''
  const mins = Math.floor(ms / 60000)
  if (mins < 60) return mins <= 1 ? 'just now' : mins + ' min ago'
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + (hrs === 1 ? ' hr ago' : ' hrs ago')
  const days = Math.floor(hrs / 24)
  return days + (days === 1 ? ' day ago' : ' days ago')
}

function formatBudget(min: number | null, max: number) {
  if (!max) return ''
  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')
  return min ? fmt(min) + '–' + fmt(max) : 'up to ' + fmt(max)
}

function leadWaLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '')
  const full = digits.length === 10 ? '91' + digits : digits
  return 'https://wa.me/' + full + '?text=' + encodeURIComponent(message)
}

function isToday(dateStr: string | null) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return false
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

const BRAND = 'HubliDharwad.app'

const byNewest = (a: Lead, b: Lead) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

function buildOwnerLeads(owners: OwnerItem[]): Lead[] {
  return owners
    .filter((o) => o.status === 'new')
    .map((o) => ({
      id: 'o-' + o.id,
      name: o.owner_name,
      phone: o.owner_phone,
      detail: [o.listing_type === 'sale' ? 'Selling' : 'Renting out', o.locality, o.expected_price ? '₹' + o.expected_price.toLocaleString('en-IN') : ''].filter(Boolean).join(' · '),
      href: '/admin/owner-submissions',
      whatsappText: `Hi ${o.owner_name}, this is ${BRAND}. Thanks for submitting your property in ${o.locality} for ${o.listing_type === 'sale' ? 'sale' : 'rent'}. We have verified seekers looking in your area — let's get it listed. When can we talk?`,
      created_at: o.created_at,
    }))
    .sort(byNewest)
}

function buildVisitGroups(visits: VisitItem[]): VisitGroup[] {
  const groups: Record<string, Lead[]> = {}
  visits
    .filter((v) => v.status === 'new')
    .forEach((v) => {
      const key = v.property_title || 'Property visit'
      groups[key] = groups[key] || []
      groups[key].push({
        id: 'v-' + v.id,
        name: v.finder_name,
        phone: v.finder_phone,
        detail: [v.preferred_day, v.preferred_time, v.message].filter(Boolean).join(' · '),
        href: '/admin/visit-requests',
        whatsappText: `Hi ${v.finder_name}, this is ${BRAND}. Got your visit request${v.property_title ? ` for "${v.property_title}"` : ''}${v.preferred_day ? ` on ${v.preferred_day}` : ''}${v.preferred_time ? ` (${v.preferred_time})` : ''}. Let's confirm the time — when works for you?`,
        created_at: v.created_at,
      })
    })
  return Object.entries(groups)
    .map(([propertyTitle, leads]) => ({ propertyTitle, leads: leads.sort(byNewest) }))
    .sort((a, b) => b.leads.length - a.leads.length)
}

function normalizeBhk(value?: string | null) {
  if (!value) return ''
  const match = value.match(/\d/)
  return match ? match[0] : ''
}

// Option B: a seeker appears on the dashboard only when at least one ACTIVE
// listing matches (same logic as matchRequirements in admin-operations, reversed)
function buildSeekerLeads(reqs: RequirementItem[], listings: ListingItem[]): Lead[] {
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

type DealItem = {
  id: string
  fee_earned: number
  closed_date: string
}

async function getAdminData() {
  try {
    const [listings, submissions, visits, requirements, deals] = await Promise.all([
      fetch(APP_URL + '/api/admin/listings', { cache: 'no-store' }).then((res) => res.json()),
      fetch(APP_URL + '/api/admin/owner-sub', { cache: 'no-store' }).then((res) => res.json()),
      fetch(APP_URL + '/api/admin/visit-req', { cache: 'no-store' }).then((res) => res.json()),
      fetch(APP_URL + '/api/admin/reqs', { cache: 'no-store' }).then((res) => res.json()),
      fetch(APP_URL + '/api/admin/deals', { cache: 'no-store' }).then((res) => res.json()).catch(() => ({ data: [] })),
    ])

    const listingData = (listings.data || []) as ListingItem[]
    const ownerData = (submissions.data || []) as OwnerItem[]
    const visitData = (visits.data || []) as VisitItem[]
    const requirementData = (requirements.data || []) as RequirementItem[]
    const dealData = (deals?.data || []) as DealItem[]

    const now = new Date()
    const monthDeals = dealData.filter((d) => {
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

    const todayVisits = visitData.filter(
      (v) => isToday(v.preferred_day) && !['visit_done', 'converted', 'dropped'].includes(v.status)
    )

    return {
      ownerLeads: buildOwnerLeads(ownerData),
      visitGroups: buildVisitGroups(visitData),
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
    return {
      ownerLeads: [] as Lead[],
      visitGroups: [] as VisitGroup[],
      seekerLeads: [] as Lead[],
      todayVisits: [] as VisitItem[],
      totalListings: 0, activeListings: 0, draftListings: 0,
      newRequirementsTotal: 0,
      attentionProperties: [],
      monthRevenue: 0,
      monthDealCount: 0,
    }
  }
}

const ICON_PLUS = (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const ICON_CHEVRON = (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)
const ICON_CHECK = (
  <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)
const ICON_PHONE = (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
)
const ICON_WA = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)
const ICON_THUMB_PH = (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
)

type LeadTab = 'visits' | 'owners' | 'seekers'

function LeadRow({ lead }: { lead: Lead }) {
  return (
    <div className="dao-lead">
      <Link href={lead.href} className="dao-lead-info">
        <div className="dao-lead-name">{lead.name}</div>
        <div className="dao-lead-detail">{lead.detail}</div>
        {lead.matchNote && <div className="dao-lead-match">{lead.matchNote}</div>}
        <div className="dao-lead-age">{timeAgo(lead.created_at)}</div>
      </Link>
      <div className="dao-lead-actions">
        <a className="dao-act dao-act-wa" href={leadWaLink(lead.phone, lead.whatsappText)} target="_blank" rel="noreferrer" aria-label="WhatsApp">{ICON_WA}</a>
        <a className="dao-act dao-act-call" href={'tel:' + lead.phone} aria-label="Call">{ICON_PHONE}</a>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Awaited<ReturnType<typeof getAdminData>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<LeadTab>('visits')

  useEffect(() => {
    getAdminData().then(setCounts).finally(() => setLoading(false))
  }, [])

  if (loading || !counts) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  const visitCount = counts.visitGroups.reduce((n, g) => n + g.leads.length, 0)
  const totalNew = visitCount + counts.ownerLeads.length + counts.seekerLeads.length

  return (
    <>
      <style>{`
        .dao-page { width: 100%; }

        /* Header */
        .dao-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
          padding-bottom: 16px;
          border-bottom: 1px solid #E8ECF1;
        }
        .dao-eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: #9CA3AF;
          margin-bottom: 7px;
        }
        .dao-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.18);
        }
        .dao-h1 {
          font-size: 26px;
          font-weight: 900;
          color: #0D1117;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin: 0 0 5px;
        }
        .dao-sub { font-size: 13px; color: #64748B; font-weight: 500; }
        .dao-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          height: 40px;
          border-radius: 10px;
          background: #0D1117;
          padding: 0 18px;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .dao-btn:hover { background: #1E293B; }

        /* Revenue banner */
        .dao-revenue {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
          padding: 16px 20px;
          border-radius: 14px;
          background: linear-gradient(135deg, #065F46, #047857);
          color: #fff;
        }
        .dao-rev-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #A7F3D0;
        }
        .dao-rev-num {
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -.03em;
          line-height: 1.1;
          margin-top: 3px;
        }
        .dao-rev-deals { text-align: right; flex-shrink: 0; }
        .dao-rev-deals-num { font-size: 26px; font-weight: 900; line-height: 1; }
        .dao-rev-deals-label { font-size: 11px; font-weight: 600; color: #A7F3D0; margin-top: 3px; }

        /* Card shell */
        .dao-card {
          background: #fff;
          border: 1px solid #E8ECF1;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .dao-card-hd {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 15px 18px 12px;
          border-bottom: 1px solid #F1F5F9;
        }
        .dao-card-hd-title { font-size: 13.5px; font-weight: 800; color: #0D1117; }
        .dao-card-hd-sub { font-size: 11px; color: #94A3B8; font-weight: 500; margin-top: 2px; }
        .dao-card-link {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 5px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #6B7280;
          text-decoration: none;
          white-space: nowrap;
        }
        .dao-card-link:hover { background:#F8FAFC; color:#0D1117; }
        .dao-count-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 22px;
          height: 22px;
          padding: 0 7px;
          margin-left: 8px;
          border-radius: 999px;
          background: #DC2626;
          color: #fff;
          font-size: 11.5px;
          font-weight: 800;
          vertical-align: 2px;
        }
        .dao-empty {
          padding: 36px 24px;
          text-align: center;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 600;
        }
        .dao-empty svg { display:block; margin:0 auto 12px; color:#CBD5E1; }

        /* Lead rows */
        .dao-lead {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border-bottom: 1px solid #F8FAFC;
        }
        .dao-lead:last-child { border-bottom: none; }
        .dao-kind {
          flex-shrink: 0;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: .06em;
          padding: 4px 8px;
          border-radius: 6px;
          white-space: nowrap;
        }
        .dao-kind-visit  { background:#EFF6FF; color:#2563EB; border:1px solid #BFDBFE; }
        .dao-lead-match { font-size: 11.5px; color: #059669; font-weight: 700; margin-top: 3px; }
        .dao-lead-info { flex: 1; min-width: 0; text-decoration: none; display: block; }
        .dao-lead-name {
          font-size: 14px;
          font-weight: 700;
          color: #0D1117;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dao-lead-detail {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dao-lead-age { font-size: 10.5px; color: #B45309; font-weight: 700; margin-top: 3px; }
        .dao-lead-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .dao-act {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px; height: 44px;
          border-radius: 10px;
          text-decoration: none;
        }
        .dao-act-wa   { background:#ECFDF5; color:#059669; border:1px solid #A7F3D0; }
        .dao-act-wa:hover   { background:#D1FAE5; }
        .dao-act-call { background:#EFF6FF; color:#2563EB; border:1px solid #BFDBFE; }
        .dao-act-call:hover { background:#DBEAFE; }

        /* Tabs */
        .dao-tabs {
          display: flex;
          gap: 6px;
          padding: 10px 14px;
          border-bottom: 1px solid #F1F5F9;
          background: #FAFBFC;
        }
        .dao-tab {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 40px;
          border: 1px solid transparent;
          border-radius: 9px;
          background: none;
          font-size: 13px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
        }
        .dao-tab-on { background: #fff; border-color: #C4CFDE; color: #0D1117; box-shadow: 0 1px 4px rgba(13,17,23,.06); }
        .dao-tab-n {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 19px;
          height: 19px;
          padding: 0 6px;
          border-radius: 999px;
          background: #DC2626;
          color: #fff;
          font-size: 10.5px;
          font-weight: 800;
        }

        /* Visit group header */
        .dao-group-hd {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          background: #F8FAFC;
          border-bottom: 1px solid #F1F5F9;
          font-size: 12px;
          font-weight: 800;
          color: #334155;
        }
        .dao-group-n {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: #E2E8F0;
          color: #334155;
          font-size: 10.5px;
          font-weight: 800;
        }

        /* Today's visits highlight */
        .dao-today-card { border: 1.5px solid #BFDBFE; }
        .dao-today-card .dao-card-hd { background: #EFF6FF; border-bottom-color: #DBEAFE; }

        /* Stats strip */
        .dao-stats {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 10px;
          margin-bottom: 14px;
        }
        .dao-stat {
          display: block;
          text-decoration: none;
          background: #fff;
          border: 1px solid #E8ECF1;
          border-radius: 12px;
          padding: 13px 14px;
        }
        .dao-stat:hover { border-color: #C4CFDE; }
        .dao-stat-num { font-size: 24px; font-weight: 900; letter-spacing: -.03em; color: #0D1117; line-height: 1; }
        .dao-stat-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #94A3B8;
          margin-top: 5px;
        }

        /* Attention rows */
        .dao-attn-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-bottom: 1px solid #F8FAFC;
          text-decoration: none;
        }
        .dao-attn-row:last-child { border-bottom: none; }
        .dao-attn-row:hover { background: #F8FAFC; }
        .dao-thumb {
          width: 44px; height: 44px;
          border-radius: 10px;
          background: #F1F5F9;
          border: 1px solid #E8ECF1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          color: #CBD5E1;
        }
        .dao-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
        .dao-attn-info { flex:1; min-width:0; }
        .dao-attn-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #0D1117;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 3px;
        }
        .dao-attn-loc { font-size:12px; color:#94A3B8; font-weight:500; }
        .dao-attn-tags { display:flex; flex-wrap:wrap; gap:5px; flex-shrink:0; }
        .dao-tag {
          font-size: 10.5px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .dao-tag-red   { background:#FEF2F2; color:#DC2626; border:1px solid #FECACA; }
        .dao-tag-amber { background:#FFFBEB; color:#B45309; border:1px solid #FDE68A; }
        .dao-tag-blue  { background:#EFF6FF; color:#2563EB; border:1px solid #BFDBFE; }
        .dao-tag-gray  { background:#F8FAFC; color:#64748B; border:1px solid #E2E8F0; }
        .dao-arrow { color:#D1D5DB; flex-shrink:0; }

        /* Responsive — mobile first behaviours */
        @media (max-width:760px) {
          .dao-stats { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width:640px) {
          .dao-header { flex-direction:column; gap:12px; }
          .dao-btn { width:100%; }
          .dao-lead { flex-wrap: wrap; gap: 8px; padding: 12px 14px; }
          .dao-lead-info { flex-basis: calc(100% - 110px); }
          .dao-lead-detail, .dao-lead-name { white-space: normal; }
          .dao-attn-tags { display:none; }
        }
      `}</style>

      <div className="dao-page">

        {/* Header */}
        <div className="dao-header">
          <div>
            <p className="dao-eyebrow">
              <span className="dao-live-dot" />
              Property Operations
            </p>
            <h1 className="dao-h1">Today</h1>
            <p className="dao-sub">
              {totalNew > 0 || counts.todayVisits.length > 0
                ? `${totalNew} lead${totalNew === 1 ? '' : 's'} to contact · ${counts.todayVisits.length} visit${counts.todayVisits.length === 1 ? '' : 's'} today`
                : 'All caught up — nothing pending'}
            </p>
          </div>
          <Link href="/admin/listings/new" className="dao-btn">
            {ICON_PLUS}
            Add listing
          </Link>
        </div>

        {/* Revenue this month */}
        <div className="dao-revenue">
          <div>
            <div className="dao-rev-label">Revenue this month</div>
            <div className="dao-rev-num">₹{counts.monthRevenue.toLocaleString('en-IN')}</div>
          </div>
          <div className="dao-rev-deals">
            <div className="dao-rev-deals-num">{counts.monthDealCount}</div>
            <div className="dao-rev-deals-label">deal{counts.monthDealCount === 1 ? '' : 's'} closed</div>
          </div>
        </div>

        {/* Today's Visits */}
        {counts.todayVisits.length > 0 && (
          <div className="dao-card dao-today-card">
            <div className="dao-card-hd">
              <div>
                <div className="dao-card-hd-title">📅 Visits Today</div>
                <div className="dao-card-hd-sub">Scheduled for today — confirm and go</div>
              </div>
              <Link href="/admin/visit-requests" className="dao-card-link">All visits {ICON_CHEVRON}</Link>
            </div>
            {counts.todayVisits.map((v) => (
              <div key={v.id} className="dao-lead">
                <span className="dao-kind dao-kind-visit">{v.preferred_time?.toUpperCase() || 'TODAY'}</span>
                <Link href="/admin/visit-requests" className="dao-lead-info">
                  <div className="dao-lead-name">{v.finder_name}</div>
                  <div className="dao-lead-detail">{v.property_title || 'Property visit'}</div>
                </Link>
                <div className="dao-lead-actions">
                  <a
                    className="dao-act dao-act-wa"
                    href={leadWaLink(v.finder_phone, `Hi ${v.finder_name}, this is ${BRAND}. Confirming today's visit${v.property_title ? ` to "${v.property_title}"` : ''}${v.preferred_time ? ` (${v.preferred_time})` : ''}. See you there!`)}
                    target="_blank" rel="noreferrer" aria-label="WhatsApp"
                  >{ICON_WA}</a>
                  <a className="dao-act dao-act-call" href={'tel:' + v.finder_phone} aria-label="Call">{ICON_PHONE}</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Leads — tabbed */}
        <div className="dao-card">
          <div className="dao-card-hd">
            <div>
              <div className="dao-card-hd-title">
                New Leads
                {totalNew > 0 && <span className="dao-count-pill">{totalNew}</span>}
              </div>
              <div className="dao-card-hd-sub">Newest first · one tap to contact</div>
            </div>
          </div>

          <div className="dao-tabs">
            <button className={`dao-tab ${tab === 'visits' ? 'dao-tab-on' : ''}`} onClick={() => setTab('visits')}>
              Visits{visitCount > 0 && <span className="dao-tab-n">{visitCount}</span>}
            </button>
            <button className={`dao-tab ${tab === 'owners' ? 'dao-tab-on' : ''}`} onClick={() => setTab('owners')}>
              Owners{counts.ownerLeads.length > 0 && <span className="dao-tab-n">{counts.ownerLeads.length}</span>}
            </button>
            <button className={`dao-tab ${tab === 'seekers' ? 'dao-tab-on' : ''}`} onClick={() => setTab('seekers')}>
              Seekers{counts.seekerLeads.length > 0 && <span className="dao-tab-n">{counts.seekerLeads.length}</span>}
            </button>
          </div>

          {tab === 'visits' && (
            counts.visitGroups.length === 0 ? (
              <div className="dao-empty">{ICON_CHECK}No new visit requests</div>
            ) : (
              counts.visitGroups.map((group) => (
                <div key={group.propertyTitle}>
                  <div className="dao-group-hd">
                    {group.propertyTitle}
                    <span className="dao-group-n">{group.leads.length}</span>
                  </div>
                  {group.leads.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
                </div>
              ))
            )
          )}

          {tab === 'owners' && (
            counts.ownerLeads.length === 0 ? (
              <div className="dao-empty">{ICON_CHECK}No new owner leads</div>
            ) : (
              counts.ownerLeads.map((lead) => <LeadRow key={lead.id} lead={lead} />)
            )
          )}

          {tab === 'seekers' && (
            counts.seekerLeads.length === 0 ? (
              <div className="dao-empty">{ICON_CHECK}No seekers matching an active listing — others are in Requirements</div>
            ) : (
              counts.seekerLeads.map((lead) => <LeadRow key={lead.id} lead={lead} />)
            )
          )}
        </div>

        {/* Stats strip */}
        <div className="dao-stats">
          <Link href="/admin/listings" className="dao-stat">
            <div className="dao-stat-num" style={{ color: '#059669' }}>{counts.activeListings}</div>
            <div className="dao-stat-label">Active listings</div>
          </Link>
          <Link href="/admin/listings" className="dao-stat">
            <div className="dao-stat-num">{counts.totalListings}</div>
            <div className="dao-stat-label">Total inventory</div>
          </Link>
          <Link href="/admin/listings" className="dao-stat">
            <div className="dao-stat-num" style={{ color: counts.draftListings > 0 ? '#D97706' : '#0D1117' }}>{counts.draftListings}</div>
            <div className="dao-stat-label">Drafts</div>
          </Link>
          <Link href="/admin/requirements" className="dao-stat">
            <div className="dao-stat-num" style={{ color: '#7C3AED' }}>{counts.newRequirementsTotal}</div>
            <div className="dao-stat-label">Open requirements</div>
          </Link>
        </div>

        {/* Attention Properties */}
        <div className="dao-card">
          <div className="dao-card-hd">
            <div>
              <div className="dao-card-hd-title">Properties Needing Attention</div>
              <div className="dao-card-hd-sub">New visits · Stale active · Drafts · Missing media</div>
            </div>
            <Link href="/admin/listings" className="dao-card-link">
              View all {ICON_CHEVRON}
            </Link>
          </div>

          {counts.attentionProperties.length === 0 ? (
            <div className="dao-empty">
              {ICON_CHECK}
              No properties need attention right now
            </div>
          ) : (
            counts.attentionProperties.map((p) => (
              <Link key={p.id} href={`/admin/listings/${p.id}`} className="dao-attn-row">
                <div className="dao-thumb">
                  {p.photos?.[0]
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={p.photos[0]} alt={p.title} />
                    : ICON_THUMB_PH}
                </div>
                <div className="dao-attn-info">
                  <div className="dao-attn-name">{p.title}</div>
                  <div className="dao-attn-loc">{p.locality}</div>
                </div>
                <div className="dao-attn-tags">
                  {p.reasons.map((reason) => (
                    <span
                      key={reason}
                      className={`dao-tag ${
                        reason.includes('visits')  ? 'dao-tag-red'
                        : reason.includes('days')  ? 'dao-tag-amber'
                        : reason.includes('Draft') ? 'dao-tag-blue'
                        : 'dao-tag-gray'
                      }`}
                    >
                      {reason}
                    </span>
                  ))}
                </div>
                <span className="dao-arrow">{ICON_CHEVRON}</span>
              </Link>
            ))
          )}
        </div>

      </div>
    </>
  )
}
