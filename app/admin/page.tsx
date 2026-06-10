'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

type StatusItem = { status: string }
type ListingItem = StatusItem & {
  id: string
  title: string
  locality: string
  photos?: string[] | null
  youtube_url?: string | null
  date_listed?: string | null
  created_at?: string | null
}
type VisitItem = StatusItem & { listing_id: string }
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

function daysSince(value?: string | null) {
  if (!value) return 0
  const start = new Date(value).getTime()
  if (!Number.isFinite(start)) return 0
  return Math.max(0, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)))
}

function groupRequirementsByLocality(requirements: RequirementItem[]) {
  const grouped: Record<string, { rent: number; sale: number; budget_min: number; budget_max: number }> = {}

  requirements.forEach((req) => {
    const locality = req.locality_preference.trim()
    if (!grouped[locality]) {
      grouped[locality] = { rent: 0, sale: 0, budget_min: Infinity, budget_max: 0 }
    }
    if (req.listing_type === 'rent') {
      grouped[locality].rent += 1
    } else if (req.listing_type === 'sale') {
      grouped[locality].sale += 1
    }
    grouped[locality].budget_min = Math.min(grouped[locality].budget_min, req.budget_min || req.budget_max)
    grouped[locality].budget_max = Math.max(grouped[locality].budget_max, req.budget_max)
  })

  return Object.entries(grouped)
    .map(([locality, stats]) => ({
      locality,
      ...stats,
      budget_min: stats.budget_min === Infinity ? 0 : stats.budget_min,
      total: stats.rent + stats.sale,
    }))
    .sort((a, b) => b.total - a.total)
}

async function getAdminData() {
  try {
    const [listings, submissions, visits, requirements] = await Promise.all([
      fetch(APP_URL + '/api/admin/listings', { cache: 'no-store' }).then((res) => res.json()),
      fetch(APP_URL + '/api/admin/owner-sub', { cache: 'no-store' }).then((res) => res.json()),
      fetch(APP_URL + '/api/admin/visit-req', { cache: 'no-store' }).then((res) => res.json()),
      fetch(APP_URL + '/api/admin/reqs', { cache: 'no-store' }).then((res) => res.json()),
    ])

    const listingData = (listings.data || []) as ListingItem[]
    const ownerData = (submissions.data || []) as StatusItem[]
    const visitData = (visits.data || []) as VisitItem[]
    const requirementData = (requirements.data || []) as RequirementItem[]

    const visitsByListing = visitData.reduce<Record<string, { total: number; new: number }>>((acc, visit) => {
      acc[visit.listing_id] = acc[visit.listing_id] || { total: 0, new: 0 }
      acc[visit.listing_id].total += 1
      if (visit.status === 'new') acc[visit.listing_id].new += 1
      return acc
    }, {})

    const localityGrouped = groupRequirementsByLocality(requirementData)

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
      .slice(0, 8)

    return {
      totalListings: listingData.length,
      activeListings: listingData.filter((item) => item.status === 'active').length,
      draftListings: listingData.filter((item) => item.status === 'draft').length,
      missingMedia: listingData.filter((item) => item.status === 'active' && !item.youtube_url && (!item.photos || item.photos.length === 0)).length,
      newSubmissions: ownerData.filter((item) => item.status === 'new').length,
      newVisits: visitData.filter((item) => item.status === 'new').length,
      newRequirements: requirementData.filter((item) => item.status === 'new').length,
      attentionProperties,
      requirementsByLocality: localityGrouped,
    }
  } catch {
    return {
      totalListings: 0, activeListings: 0, draftListings: 0, missingMedia: 0,
      newSubmissions: 0, newVisits: 0, newRequirements: 0, attentionProperties: [],
      requirementsByLocality: [],
    }
  }
}

const ICON_HOME = (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const ICON_USERS = (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
)
const ICON_CAL = (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const ICON_SEARCH = (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const ICON_CHEVRON = (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)
const ICON_PLUS = (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const ICON_CHECK = (
  <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)
const ICON_THUMB_PH = (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
)

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Awaited<ReturnType<typeof getAdminData>> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminData().then(setCounts).finally(() => setLoading(false))
  }, [])

  if (loading || !counts) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  const actionTotal = counts.newSubmissions + counts.newVisits + counts.newRequirements

  const kpiCards = [
    {
      href: '/admin/listings',
      accent: 'dao-kpi-g',
      iconClass: 'dao-kpi-icon-g',
      icon: ICON_HOME,
      value: counts.activeListings,
      label: 'Active Listings',
      sub: `${counts.totalListings} total in inventory`,
      newCount: 0,
    },
    {
      href: '/admin/owner-submissions',
      accent: 'dao-kpi-r',
      iconClass: 'dao-kpi-icon-r',
      icon: ICON_USERS,
      value: counts.newSubmissions,
      label: 'Owner Leads',
      sub: 'Waiting to be contacted',
      newCount: counts.newSubmissions,
    },
    {
      href: '/admin/visit-requests',
      accent: 'dao-kpi-b',
      iconClass: 'dao-kpi-icon-b',
      icon: ICON_CAL,
      value: counts.newVisits,
      label: 'Visit Requests',
      sub: 'Pending scheduling',
      newCount: counts.newVisits,
    },
    {
      href: '/admin/requirements',
      accent: 'dao-kpi-p',
      iconClass: 'dao-kpi-icon-p',
      icon: ICON_SEARCH,
      value: counts.newRequirements,
      label: 'Requirements',
      sub: 'Seekers awaiting match',
      newCount: counts.newRequirements,
    },
  ]

  const quickActions = [
    {
      href: '/admin/visit-requests',
      label: 'Coordinate visits',
      countLabel: `${counts.newVisits} new`,
      iconStyle: { background: '#EFF6FF', color: '#2563EB' },
      icon: ICON_CAL,
    },
    {
      href: '/admin/owner-submissions',
      label: 'Call owner leads',
      countLabel: `${counts.newSubmissions} new`,
      iconStyle: { background: '#FEF2F2', color: '#DC2626' },
      icon: ICON_USERS,
    },
    {
      href: '/admin/requirements',
      label: 'Match requirements',
      countLabel: `${counts.newRequirements} new`,
      iconStyle: { background: '#F5F3FF', color: '#7C3AED' },
      icon: ICON_SEARCH,
    },
    {
      href: '/admin/listings',
      label: 'Manage properties',
      countLabel: `${counts.activeListings} active`,
      iconStyle: { background: '#ECFDF5', color: '#059669' },
      icon: ICON_HOME,
    },
  ]

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
          margin-bottom: 22px;
          padding-bottom: 20px;
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
        .dao-header-right {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
          padding-top: 4px;
        }
        .dao-pending {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 40px;
          border: 1.5px solid #FEE2E2;
          border-radius: 10px;
          background: #FFF5F5;
          padding: 0 14px;
          font-size: 12.5px;
          font-weight: 700;
          color: #DC2626;
          white-space: nowrap;
        }
        .dao-pulse {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #DC2626;
          animation: dao-pulse 2s infinite;
          flex-shrink: 0;
        }
        @keyframes dao-pulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(220,38,38,.45); }
          50%      { opacity:.8; box-shadow:0 0 0 6px rgba(220,38,38,0); }
        }
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
          transition: background .14s, transform .1s, box-shadow .14s;
          white-space: nowrap;
        }
        .dao-btn:hover {
          background: #1E293B;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(13,17,23,.22);
        }
        .dao-btn:active { transform: none; box-shadow: none; }

        /* KPI Cards */
        .dao-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 12px;
          margin-bottom: 18px;
        }
        .dao-kpi {
          position: relative;
          overflow: hidden;
          display: block;
          text-decoration: none;
          background: #fff;
          border: 1px solid #E8ECF1;
          border-radius: 14px;
          padding: 20px 20px 18px;
          transition: border-color .15s, box-shadow .2s, transform .15s;
        }
        .dao-kpi:hover {
          border-color: #C4CFDE;
          box-shadow: 0 8px 28px rgba(13,17,23,.08);
          transform: translateY(-2px);
        }
        .dao-kpi::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 14px 14px 0 0;
        }
        .dao-kpi-g::after { background: linear-gradient(90deg,#10B981,#059669); }
        .dao-kpi-r::after { background: linear-gradient(90deg,#F87171,#DC2626); }
        .dao-kpi-b::after { background: linear-gradient(90deg,#60A5FA,#2563EB); }
        .dao-kpi-p::after { background: linear-gradient(90deg,#A78BFA,#7C3AED); }
        .dao-kpi-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .dao-kpi-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dao-kpi-icon-g { background:#ECFDF5; color:#059669; }
        .dao-kpi-icon-r { background:#FEF2F2; color:#DC2626; }
        .dao-kpi-icon-b { background:#EFF6FF; color:#2563EB; }
        .dao-kpi-icon-p { background:#F5F3FF; color:#7C3AED; }
        .dao-new-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .02em;
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FECACA;
        }
        .dao-new-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: currentColor;
          animation: dao-pulse 2s infinite;
        }
        .dao-kpi-num {
          font-size: 40px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -.04em;
          color: #0D1117;
          margin-bottom: 7px;
        }
        .dao-kpi-label {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .09em;
          color: #94A3B8;
        }
        .dao-kpi-sub { margin-top: 4px; font-size: 12px; font-weight: 500; color: #64748B; }

        /* Content grid */
        .dao-content {
          display: grid;
          grid-template-columns: 1fr 316px;
          gap: 12px;
          align-items: start;
        }

        /* Card shell */
        .dao-card {
          background: #fff;
          border: 1px solid #E8ECF1;
          border-radius: 14px;
          overflow: hidden;
        }
        .dao-card-hd {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 17px 20px 14px;
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
          transition: background .12s, color .12s;
        }
        .dao-card-link:hover { background:#F8FAFC; color:#0D1117; }

        /* Attention rows */
        .dao-empty {
          padding: 44px 24px;
          text-align: center;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 600;
        }
        .dao-empty svg { display:block; margin:0 auto 12px; color:#CBD5E1; }
        .dao-attn-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 20px;
          border-bottom: 1px solid #F8FAFC;
          text-decoration: none;
          transition: background .12s;
        }
        .dao-attn-row:last-child { border-bottom: none; }
        .dao-attn-row:hover { background: #F8FAFC; }
        .dao-thumb {
          width: 50px; height: 50px;
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
        .dao-arrow { color:#D1D5DB; flex-shrink:0; transition:color .12s, transform .12s; }
        .dao-attn-row:hover .dao-arrow { color:#6B7280; transform:translateX(2px); }

        /* Sidebar */
        .dao-sidebar { display:flex; flex-direction:column; gap:12px; }

        /* Health grid */
        .dao-health { display:grid; grid-template-columns:1fr 1fr; }
        .dao-hcell {
          padding: 17px 16px;
          border-right: 1px solid #F1F5F9;
          border-bottom: 1px solid #F1F5F9;
        }
        .dao-hcell:nth-child(2n)              { border-right:none; }
        .dao-hcell:nth-child(3),
        .dao-hcell:nth-child(4)               { border-bottom:none; }
        .dao-hlabel {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .1em;
          color: #94A3B8;
          margin-bottom: 8px;
        }
        .dao-hval {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -.04em;
          color: #0D1117;
          line-height: 1;
        }
        .dao-hctx { font-size:11px; color:#9CA3AF; font-weight:500; margin-top:4px; }

        /* Quick actions */
        .dao-actions { padding:6px 8px 10px; display:flex; flex-direction:column; gap:2px; }
        .dao-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border-radius: 10px;
          text-decoration: none;
          transition: background .12s;
        }
        .dao-action:hover { background:#F8FAFC; }
        .dao-action-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dao-action-body { flex:1; min-width:0; }
        .dao-action-label { font-size:13px; font-weight:700; color:#0D1117; }
        .dao-action-count { font-size:11px; color:#94A3B8; font-weight:500; margin-top:1px; }
        .dao-action:hover .dao-arrow { color:#6B7280; transform:translateX(2px); }

        /* Responsive */
        @media (max-width:1050px) {
          .dao-content { grid-template-columns:1fr; }
          .dao-sidebar { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        }
        @media (max-width:760px) {
          .dao-kpi-grid { grid-template-columns:1fr 1fr; }
          .dao-kpi-num  { font-size:34px; }
        }
        @media (max-width:640px) {
          .dao-header       { flex-direction:column; gap:14px; }
          .dao-header-right { padding-top:0; width:100%; }
          .dao-btn          { flex:1; }
          .dao-sidebar      { grid-template-columns:1fr; }
          .dao-attn-tags    { display:none; }
        }
        @media (max-width:440px) {
          .dao-kpi-grid { grid-template-columns:1fr; }
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
            <h1 className="dao-h1">Operations Overview</h1>
            <p className="dao-sub">
              {actionTotal > 0
                ? `${actionTotal} item${actionTotal === 1 ? '' : 's'} need your attention`
                : 'All caught up — nothing pending'}
            </p>
          </div>
          <div className="dao-header-right">
            {actionTotal > 0 && (
              <span className="dao-pending">
                <span className="dao-pulse" />
                {actionTotal} pending
              </span>
            )}
            <Link href="/admin/listings/new" className="dao-btn">
              {ICON_PLUS}
              Add listing
            </Link>
          </div>
        </div>

        {/* KPI Row */}
        <div className="dao-kpi-grid">
          {kpiCards.map((card) => (
            <Link key={card.href} href={card.href} className={`dao-kpi ${card.accent}`}>
              <div className="dao-kpi-top">
                <span className={`dao-kpi-icon ${card.iconClass}`}>{card.icon}</span>
                {card.newCount > 0 && (
                  <span className="dao-new-badge">
                    <span className="dao-new-dot" />
                    {card.newCount} new
                  </span>
                )}
              </div>
              <div className="dao-kpi-num">{card.value}</div>
              <div className="dao-kpi-label">{card.label}</div>
              <div className="dao-kpi-sub">{card.sub}</div>
            </Link>
          ))}
        </div>

        {/* Main Grid */}
        <div className="dao-content">

          {/* Left — Attention Properties */}
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

          {/* Right — Sidebar */}
          <div className="dao-sidebar">

            {/* Listing Health */}
            <div className="dao-card">
              <div className="dao-card-hd">
                <div>
                  <div className="dao-card-hd-title">Listing Health</div>
                  <div className="dao-card-hd-sub">Inventory snapshot</div>
                </div>
                <Link href="/admin/listings" className="dao-card-link">
                  Manage {ICON_CHEVRON}
                </Link>
              </div>
              <div className="dao-health">
                <div className="dao-hcell">
                  <div className="dao-hlabel">Total</div>
                  <div className="dao-hval">{counts.totalListings}</div>
                  <div className="dao-hctx">all listings</div>
                </div>
                <div className="dao-hcell">
                  <div className="dao-hlabel">Active</div>
                  <div className="dao-hval" style={{ color: '#059669' }}>{counts.activeListings}</div>
                  <div className="dao-hctx">live now</div>
                </div>
                <div className="dao-hcell">
                  <div className="dao-hlabel">Draft</div>
                  <div className="dao-hval" style={{ color: counts.draftListings > 0 ? '#D97706' : '#0D1117' }}>{counts.draftListings}</div>
                  <div className="dao-hctx">unpublished</div>
                </div>
                <div className="dao-hcell">
                  <div className="dao-hlabel">No Media</div>
                  <div className="dao-hval" style={{ color: counts.missingMedia > 0 ? '#DC2626' : '#94A3B8' }}>{counts.missingMedia}</div>
                  <div className="dao-hctx">need photos / video</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dao-card">
              <div className="dao-card-hd">
                <div>
                  <div className="dao-card-hd-title">Quick Actions</div>
                  <div className="dao-card-hd-sub">Jump to what matters</div>
                </div>
              </div>
              <div className="dao-actions">
                {quickActions.map(({ href, label, countLabel, iconStyle, icon }) => (
                  <Link key={href} href={href} className="dao-action">
                    <span className="dao-action-icon" style={iconStyle}>{icon}</span>
                    <span className="dao-action-body">
                      <span className="dao-action-label">{label}</span>
                      <span className="dao-action-count">{countLabel}</span>
                    </span>
                    <span className="dao-arrow">{ICON_CHEVRON}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Demand by Locality */}
        <div className="dao-card" style={{ marginTop: '18px' }}>
          <div className="dao-card-hd">
            <div>
              <div className="dao-card-hd-title">🔥 Buyer Demand by Locality</div>
              <div className="dao-card-hd-sub">Where seekers are looking — post to Instagram</div>
            </div>
            <button
              onClick={() => {
                const text = counts.requirementsByLocality
                  .slice(0, 5)
                  .map(
                    (item) =>
                      `${item.locality}: ${item.rent > 0 ? `${item.rent} rent` : ''} ${item.sale > 0 ? `${item.sale} sale` : ''}`.trim()
                  )
                  .join('\n')
                const fullText = `📊 THIS WEEK'S BUYER DEMAND:\n\n${text}\n\nOwn a property in these areas? DM us to list today.`
                navigator.clipboard.writeText(fullText)
                alert('Copied! Paste on Instagram.')
              }}
              className="dao-card-link"
              style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#6B7280', fontSize: '12px', fontWeight: 700 }}
            >
              Copy for Instagram
            </button>
          </div>

          {counts.requirementsByLocality.length === 0 ? (
            <div className="dao-empty">
              {ICON_SEARCH}
              No requirements yet
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', padding: '12px' }}>
              {counts.requirementsByLocality.map((item) => (
                <div
                  key={item.locality}
                  style={{
                    border: '1px solid #E8ECF1',
                    borderRadius: '10px',
                    padding: '14px',
                    background: '#F8FAFC',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#0D1117', marginBottom: '8px' }}>
                    {item.locality}
                  </div>
                  <div style={{ display: 'grid', gap: '6px', fontSize: '13px' }}>
                    <div style={{ color: '#64748B' }}>
                      <strong style={{ color: '#DC2626' }}>{item.rent}</strong> looking for rent
                    </div>
                    <div style={{ color: '#64748B' }}>
                      <strong style={{ color: '#2563EB' }}>{item.sale}</strong> looking to buy
                    </div>
                    {item.budget_min > 0 && (
                      <div style={{ color: '#64748B', fontSize: '12px' }}>
                        Budget: ₹{item.budget_min.toLocaleString('en-IN')} — ₹{item.budget_max.toLocaleString('en-IN')}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const text = `📍 ${item.locality}\n🔴 ${item.rent} looking for RENT (₹${item.budget_min.toLocaleString('en-IN')} - ₹${item.budget_max.toLocaleString('en-IN')})\n🔵 ${item.sale} looking to BUY\n\nOwn a property here? List now and get matched instantly!`
                        navigator.clipboard.writeText(text)
                        alert('Copied for Instagram!')
                      }}
                      style={{
                        marginTop: '8px',
                        padding: '6px 10px',
                        background: '#111827',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Copy Post
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  )
}
