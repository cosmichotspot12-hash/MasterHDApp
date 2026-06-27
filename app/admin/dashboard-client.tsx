'use client'

import Link from 'next/link'
import { useState } from 'react'

export type Lead = {
  id: string
  name: string
  phone: string
  detail: string
  matchNote?: string
  href: string
  whatsappText: string
  created_at: string
}

export type VisitGroup = {
  propertyTitle: string
  leads: Lead[]
}

export type TodayVisit = {
  id: string
  finder_name: string
  finder_phone: string
  property_title: string | null
  preferred_time: string | null
}

export type AttentionProperty = {
  id: string
  title: string
  locality: string
  photos?: string[] | null
  reasons: string[]
}

export type DashboardData = {
  ownerLeads: Lead[]
  visitGroups: VisitGroup[]
  seekerLeads: Lead[]
  todayVisits: TodayVisit[]
  totalListings: number
  activeListings: number
  draftListings: number
  newRequirementsTotal: number
  attentionProperties: AttentionProperty[]
  monthRevenue: number
  monthDealCount: number
}

const BRAND = 'HubliDharwad.app'

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

function leadWaLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '')
  const full = digits.length === 10 ? '91' + digits : digits
  return 'https://wa.me/' + full + '?text=' + encodeURIComponent(message)
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

export default function AdminDashboard({ data }: { data: DashboardData }) {
  const [tab, setTab] = useState<LeadTab>('visits')

  const visitCount = data.visitGroups.reduce((n, g) => n + g.leads.length, 0)
  const totalNew = visitCount + data.ownerLeads.length + data.seekerLeads.length

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
              {totalNew > 0 || data.todayVisits.length > 0
                ? `${totalNew} lead${totalNew === 1 ? '' : 's'} to contact · ${data.todayVisits.length} visit${data.todayVisits.length === 1 ? '' : 's'} today`
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
            <div className="dao-rev-num">₹{data.monthRevenue.toLocaleString('en-IN')}</div>
          </div>
          <div className="dao-rev-deals">
            <div className="dao-rev-deals-num">{data.monthDealCount}</div>
            <div className="dao-rev-deals-label">deal{data.monthDealCount === 1 ? '' : 's'} closed</div>
          </div>
        </div>

        {/* Today's Visits */}
        {data.todayVisits.length > 0 && (
          <div className="dao-card dao-today-card">
            <div className="dao-card-hd">
              <div>
                <div className="dao-card-hd-title">📅 Visits Today</div>
                <div className="dao-card-hd-sub">Scheduled for today — confirm and go</div>
              </div>
              <Link href="/admin/visit-requests" className="dao-card-link">All visits {ICON_CHEVRON}</Link>
            </div>
            {data.todayVisits.map((v) => (
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
              Owners{data.ownerLeads.length > 0 && <span className="dao-tab-n">{data.ownerLeads.length}</span>}
            </button>
            <button className={`dao-tab ${tab === 'seekers' ? 'dao-tab-on' : ''}`} onClick={() => setTab('seekers')}>
              Seekers{data.seekerLeads.length > 0 && <span className="dao-tab-n">{data.seekerLeads.length}</span>}
            </button>
          </div>

          {tab === 'visits' && (
            data.visitGroups.length === 0 ? (
              <div className="dao-empty">{ICON_CHECK}No new visit requests</div>
            ) : (
              data.visitGroups.map((group) => (
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
            data.ownerLeads.length === 0 ? (
              <div className="dao-empty">{ICON_CHECK}No new owner leads</div>
            ) : (
              data.ownerLeads.map((lead) => <LeadRow key={lead.id} lead={lead} />)
            )
          )}

          {tab === 'seekers' && (
            data.seekerLeads.length === 0 ? (
              <div className="dao-empty">{ICON_CHECK}No seekers matching an active listing — others are in Requirements</div>
            ) : (
              data.seekerLeads.map((lead) => <LeadRow key={lead.id} lead={lead} />)
            )
          )}
        </div>

        {/* Stats strip */}
        <div className="dao-stats">
          <Link href="/admin/listings" className="dao-stat">
            <div className="dao-stat-num" style={{ color: '#059669' }}>{data.activeListings}</div>
            <div className="dao-stat-label">Active listings</div>
          </Link>
          <Link href="/admin/listings" className="dao-stat">
            <div className="dao-stat-num">{data.totalListings}</div>
            <div className="dao-stat-label">Total inventory</div>
          </Link>
          <Link href="/admin/listings" className="dao-stat">
            <div className="dao-stat-num" style={{ color: data.draftListings > 0 ? '#D97706' : '#0D1117' }}>{data.draftListings}</div>
            <div className="dao-stat-label">Drafts</div>
          </Link>
          <Link href="/admin/requirements" className="dao-stat">
            <div className="dao-stat-num" style={{ color: '#7C3AED' }}>{data.newRequirementsTotal}</div>
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

          {data.attentionProperties.length === 0 ? (
            <div className="dao-empty">
              {ICON_CHECK}
              No properties need attention right now
            </div>
          ) : (
            data.attentionProperties.map((p) => (
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
