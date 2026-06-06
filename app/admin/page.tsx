import Link from 'next/link'
import { adminApiHeaders } from '@/lib/admin-api'

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

async function getAdminData() {
  try {
    const headers = await adminApiHeaders()
    const [listings, submissions, visits, requirements] = await Promise.all([
      fetch(APP_URL + '/api/admin/listings', { cache: 'no-store', headers }).then((res) => res.json()),
      fetch(APP_URL + '/api/admin/owner-sub', { cache: 'no-store', headers }).then((res) => res.json()),
      fetch(APP_URL + '/api/admin/visit-req', { cache: 'no-store', headers }).then((res) => res.json()),
      fetch(APP_URL + '/api/admin/reqs', { cache: 'no-store', headers }).then((res) => res.json()),
    ])

    const listingData = (listings.data || []) as ListingItem[]
    const ownerData = (submissions.data || []) as StatusItem[]
    const visitData = (visits.data || []) as VisitItem[]
    const requirementData = (requirements.data || []) as StatusItem[]
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

    return {
      totalListings: listingData.length,
      activeListings: listingData.filter((item) => item.status === 'active').length,
      draftListings: listingData.filter((item) => item.status === 'draft').length,
      missingMedia: listingData.filter((item) => item.status === 'active' && !item.youtube_url && (!item.photos || item.photos.length === 0)).length,
      newSubmissions: ownerData.filter((item) => item.status === 'new').length,
      newVisits: visitData.filter((item) => item.status === 'new').length,
      newRequirements: requirementData.filter((item) => item.status === 'new').length,
      attentionProperties,
    }
  } catch {
    return { totalListings: 0, activeListings: 0, draftListings: 0, missingMedia: 0, newSubmissions: 0, newVisits: 0, newRequirements: 0, attentionProperties: [] }
  }
}

export default async function AdminDashboard() {
  const counts = await getAdminData()
  const actionTotal = counts.newSubmissions + counts.newVisits + counts.newRequirements

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Today&apos;s operations</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950">Action required</h1>
          <p className="mt-1 text-sm text-slate-500">{actionTotal} open items need attention across leads, visits, and requirements.</p>
        </div>
        <Link href="/admin/listings/new" className="inline-flex min-h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-700">
          Add listing
        </Link>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <ActionCard href="/admin/owner-submissions" label="New owner leads" value={counts.newSubmissions} helper="Owners waiting for contact" tone="red" />
        <ActionCard href="/admin/visit-requests" label="New visit requests" value={counts.newVisits} helper="Finders waiting for scheduling" tone="blue" />
        <ActionCard href="/admin/requirements" label="New requirements" value={counts.newRequirements} helper="Finders waiting for matching" tone="purple" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-950">Properties needing attention</h2>
              <p className="mt-1 text-sm text-slate-500">New visits, old active listings, drafts, and missing media.</p>
            </div>
            <Link href="/admin/listings" className="text-sm font-bold text-slate-700 hover:text-slate-950">View all</Link>
          </div>
          {counts.attentionProperties.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 p-5 text-sm font-semibold text-slate-500">
              No properties need attention right now.
            </div>
          ) : (
            <div className="grid gap-2">
              {counts.attentionProperties.map((property) => (
                <Link key={property.id} href={`/admin/listings/${property.id}`} className="flex flex-col gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-bold text-slate-950">{property.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{property.locality}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {property.reasons.map((reason) => (
                      <span key={reason} className="rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-bold text-orange-700">{reason}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-950">Listing health</h2>
              <p className="mt-1 text-sm text-slate-500">Inventory snapshot for property operations.</p>
            </div>
            <Link href="/admin/listings" className="text-sm font-bold text-slate-700 hover:text-slate-950">View properties</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Metric label="Total" value={counts.totalListings} />
            <Metric label="Active" value={counts.activeListings} />
            <Metric label="Draft" value={counts.draftListings} />
            <Metric label="Missing media" value={counts.missingMedia} />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-950">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            <QuickLink href="/admin/visit-requests" label="Coordinate visits" />
            <QuickLink href="/admin/owner-submissions" label="Call owner leads" />
            <QuickLink href="/admin/requirements" label="Match requirements" />
            <QuickLink href="/admin/listings" label="Manage properties" />
          </div>
        </section>
      </div>
    </div>
  )
}

function daysSince(value?: string | null) {
  if (!value) return 0
  const start = new Date(value).getTime()
  if (!Number.isFinite(start)) return 0
  return Math.max(0, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)))
}

function ActionCard({ href, label, value, helper, tone }: { href: string; label: string; value: number; helper: string; tone: 'red' | 'blue' | 'purple' }) {
  const colors = {
    red: 'border-l-red-500 bg-red-50 text-red-700',
    blue: 'border-l-blue-500 bg-blue-50 text-blue-700',
    purple: 'border-l-purple-500 bg-purple-50 text-purple-700',
  }

  return (
    <Link href={href} className="rounded-lg border border-slate-200 border-l-4 bg-white p-5 hover:border-slate-300">
      <div className={`mb-4 inline-flex rounded-full px-2 py-1 text-xs font-bold ${colors[tone]}`}>{label}</div>
      <p className="text-4xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </Link>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex min-h-11 items-center justify-between rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950">
      {label}
      <span aria-hidden="true">-&gt;</span>
    </Link>
  )
}
