'use client'

import Link from 'next/link'
import { Children, useMemo, useState } from 'react'
import StatusUpdater from '@/app/admin/owner-submissions/StatusUpdater'
import SourceUpdater from '@/app/admin/owner-submissions/SourceUpdater'
import DeleteButton from '@/app/admin/listings/DeleteButton'
import {
  furnishingLabel,
  hasRecurringPrice,
  listingTypeClosedLabel,
  listingTypeLabel,
} from '@/lib/listing-types'

export type AdminListing = {
  id: string
  title: string
  slug?: string | null
  listing_type: string
  property_category?: string | null
  locality: string
  price: number
  status: string
  description?: string | null
  youtube_url?: string | null
  date_listed?: string | null
  created_at?: string | null
  bhk_count?: string | null
  furnishing?: string | null
  preferred_tenants?: string | null
  food_preference?: string | null
  facing?: string | null
  photos?: string[] | null
  owner_name?: string | null
  owner_phone?: string | null
}

export type VisitRequest = {
  id: string
  listing_id: string
  property_title: string
  finder_name: string
  finder_phone: string
  preferred_day: string
  preferred_time: string
  status: string
  created_at: string
}

export type OwnerSubmission = {
  id: string
  status: string
  owner_name: string
  owner_phone: string
  listing_type: string
  locality: string
  expected_price: number | null
  source?: string | null
  created_at: string
}

export type Requirement = {
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

const visitStatuses = ['all', 'new', 'contacted', 'visit_scheduled', 'visit_done', 'converted', 'dropped']
const ownerStatuses = ['all', 'new', 'contacted', 'visit_scheduled', 'listed', 'rejected']
const requirementStatuses = ['all', 'new', 'contacted', 'matched', 'fulfilled', 'no_match']
const matchableRequirementStatuses = new Set(['new', 'contacted', 'matched'])

function formatDate(value?: string | null) {
  if (!value) return 'Not set'
  return new Date(value).toLocaleDateString('en-IN')
}

function formatPrice(value?: number | null) {
  if (!value) return 'Not set'
  if (value >= 10000000) return 'Rs ' + trimDecimal(value / 10000000) + ' Cr'
  if (value >= 100000) return 'Rs ' + trimDecimal(value / 100000) + ' Lakh'
  return 'Rs ' + value.toLocaleString('en-IN')
}

function trimDecimal(value: number) {
  return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')
}

function formatLabel(value?: string | null) {
  if (!value) return 'Not set'
  return value.replace(/_/g, ' ')
}

function statusClass(status: string) {
  const colors: Record<string, string> = {
    new: 'bg-red-100 text-red-700 border-red-200',
    active: 'bg-green-100 text-green-700 border-green-200',
    draft: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    visit_scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
    visit_done: 'bg-purple-100 text-purple-700 border-purple-200',
    converted: 'bg-green-100 text-green-700 border-green-200',
    listed: 'bg-green-100 text-green-700 border-green-200',
    fulfilled: 'bg-green-100 text-green-700 border-green-200',
    matched: 'bg-blue-100 text-blue-700 border-blue-200',
    rented_sold: 'bg-blue-100 text-blue-700 border-blue-200',
    dropped: 'bg-gray-100 text-gray-700 border-gray-200',
    rejected: 'bg-gray-100 text-gray-700 border-gray-200',
    no_match: 'bg-gray-100 text-gray-700 border-gray-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

function waLink(number: string, message: string) {
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message)
}

// Build a wa.me link that messages a specific person (e.g. the seeker),
// normalizing a 10-digit Indian number to include the country code.
function waLinkTo(phone: string, message: string) {
  const digits = (phone || '').replace(/\D/g, '')
  const full = digits.length === 10 ? '91' + digits : digits
  return 'https://wa.me/' + full + '?text=' + encodeURIComponent(message)
}

function ActionLink({ href, children, tone = 'neutral' }: { href: string; children: React.ReactNode; tone?: 'neutral' | 'green' | 'blue' }) {
  const toneClass = tone === 'green'
    ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
    : tone === 'blue'
      ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'

  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className={`inline-flex min-h-9 items-center justify-center rounded-md border px-3 text-xs font-semibold ${toneClass}`}>
      {children}
    </a>
  )
}

function FilterBar({
  search,
  onSearch,
  status,
  onStatus,
  statuses,
  type,
  onType,
  placeholder,
}: {
  search: string
  onSearch: (value: string) => void
  status: string
  onStatus: (value: string) => void
  statuses: string[]
  type?: string
  onType?: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="mb-5 grid gap-3 rounded-md border border-slate-200 bg-white p-3 md:grid-cols-[1fr_auto_auto]">
      <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder={placeholder} className="w-full px-3 py-2 text-sm" />
      <select value={status} onChange={(event) => onStatus(event.target.value)} className="px-3 py-2 text-sm">
        {statuses.map((item) => <option key={item} value={item}>{item === 'all' ? 'All status' : formatLabel(item)}</option>)}
      </select>
      {type !== undefined && onType && (
        <select value={type} onChange={(event) => onType(event.target.value)} className="px-3 py-2 text-sm">
          <option value="all">Rent, sale, and lease</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
          <option value="lease">Lease</option>
        </select>
      )}
    </div>
  )
}

function AdminPropertyCard({
  listing,
  requestCount,
  newRequestCount,
  selected,
  onSelect,
  href,
  actions,
}: {
  listing: AdminListing
  requestCount?: number
  newRequestCount?: number
  selected?: boolean
  onSelect?: () => void
  href?: string
  actions?: React.ReactNode
}) {
  const firstPhoto = listing.photos?.[0]
  const typeLabel = listingTypeLabel(listing.listing_type)
  const typeColor = listing.listing_type === 'sale' ? 'bg-green-700' : listing.listing_type === 'lease' ? 'bg-purple-700' : 'bg-blue-700'
  const recurringPrice = hasRecurringPrice(listing.listing_type)
  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-orange-50 sm:aspect-[5/3]">
        {firstPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={firstPhoto} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-400">No photo</div>
        )}
        <div className="absolute left-1.5 top-1.5 flex gap-1.5">
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white ${typeColor}`}>{typeLabel}</span>
          {newRequestCount ? <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{newRequestCount} new</span> : null}
        </div>
        {listing.bhk_count && <span className="absolute right-1.5 top-1.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-bold text-slate-900">{listing.bhk_count} BHK</span>}
      </div>
      <div className="grid flex-1 gap-1.5 p-2.5">
        <p className="truncate text-[11px] font-bold text-slate-500">{listing.locality}</p>
        <h2 className="line-clamp-2 text-[13px] font-extrabold leading-tight text-slate-950">{listing.title}</h2>
        <div className="flex flex-wrap gap-1 text-[10px] font-semibold text-slate-600">
          <span className="max-w-full truncate rounded-full bg-orange-50 px-1.5 py-0.5">{formatLabel(listing.property_category)}</span>
          {listing.furnishing && <span className="max-w-full truncate rounded-full bg-orange-50 px-1.5 py-0.5">{furnishingLabel(listing.furnishing)}</span>}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-black text-slate-950 sm:text-[15px]">{formatPrice(listing.price)}{recurringPrice && <span className="text-[10px] font-semibold text-slate-500">/mo</span>}</p>
          {requestCount !== undefined && <span className="shrink-0 rounded-full border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{requestCount} visits</span>}
        </div>
      </div>
    </>
  )

  return (
    <article className={`flex min-w-0 flex-col overflow-hidden rounded-lg border bg-white ${selected ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200'}`}>
      {href ? (
        <Link href={href} className="flex flex-1 flex-col text-left hover:bg-slate-50/40">
          {body}
        </Link>
      ) : onSelect ? (
        <button type="button" onClick={onSelect} className="flex flex-1 flex-col text-left">
          {body}
        </button>
      ) : (
        <div className="flex flex-1 flex-col">{body}</div>
      )}
      {actions && <div className="grid gap-1.5 border-t border-slate-100 p-2.5">{actions}</div>}
    </article>
  )
}

export function ListingsInventory({ listings, visits }: { listings: AdminListing[]; visits: VisitRequest[] }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const requestCounts = useMemo(() => countByListing(visits), [visits])

  const filtered = listings.filter((listing) => {
    const query = search.toLowerCase().trim()
    const matchesSearch = !query || [listing.title, listing.locality, listing.owner_name, listing.owner_phone].some((value) => value?.toLowerCase().includes(query))
    const matchesStatus = status === 'all' || listing.status === status
    const matchesType = type === 'all' || listing.listing_type === type
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div>
      <FilterBar search={search} onSearch={setSearch} status={status} onStatus={setStatus} statuses={['all', 'active', 'draft', 'rented_sold', 'inactive']} type={type} onType={setType} placeholder="Search title, locality, owner, phone" />
      {filtered.length === 0 ? <EmptyState text="No listings match these filters." /> : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] lg:gap-3">
          {filtered.map((listing) => (
            <AdminPropertyCard
              key={listing.id}
              listing={listing}
              requestCount={requestCounts[listing.id] || 0}
              href={`/admin/listings/${listing.id}`}
              actions={
                <div className="grid grid-cols-2 gap-1.5">
                  <Link href={`/admin/listings/${listing.id}`} className="inline-flex min-h-8 items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-2 text-[11px] font-semibold text-white">Open</Link>
                  <Link href={`/admin/listings/${listing.id}/edit`} className="inline-flex min-h-8 items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-2 text-[11px] font-semibold text-white">Edit</Link>
                  {listing.slug && <Link href={`/property/${listing.slug}`} className="inline-flex min-h-8 items-center justify-center rounded-md border border-slate-200 px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">Public</Link>}
                  <DeleteButton id={listing.id} />
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function VisitRequestsWorkspace({ listings, requests }: { listings: AdminListing[]; requests: VisitRequest[] }) {
  const activeListings = listings.filter((listing) => listing.status === 'active')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const grouped = useMemo(() => groupVisits(requests), [requests])

  const filteredListings = activeListings
    .filter((listing) => {
      const propertyRequests = grouped[listing.id] || []
      if (propertyRequests.length === 0) return false
      const query = search.toLowerCase().trim()
      const matchesType = type === 'all' || listing.listing_type === type
      const matchesStatus = status === 'all' || propertyRequests.some((request) => request.status === status)
      const matchesSearch = !query || [listing.title, listing.locality].some((value) => value?.toLowerCase().includes(query)) ||
        propertyRequests.some((request) => [request.finder_name, request.finder_phone, request.property_title].some((value) => value?.toLowerCase().includes(query)))
      return matchesType && matchesStatus && matchesSearch
    })
    .sort((a, b) => {
      const aNew = (grouped[a.id] || []).filter((request) => request.status === 'new').length
      const bNew = (grouped[b.id] || []).filter((request) => request.status === 'new').length
      if (bNew !== aNew) return bNew - aNew
      return (grouped[b.id] || []).length - (grouped[a.id] || []).length
    })

  return (
    <div>
      <FilterBar search={search} onSearch={setSearch} status={status} onStatus={setStatus} statuses={visitStatuses} type={type} onType={setType} placeholder="Search property, locality, finder, phone" />
      {filteredListings.length === 0 ? <EmptyState text="No active properties match these filters." /> : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] lg:gap-3">
          {filteredListings.map((listing) => {
            const propertyRequests = grouped[listing.id] || []
            return (
              <AdminPropertyCard
                key={listing.id}
                listing={listing}
                requestCount={propertyRequests.length}
                newRequestCount={propertyRequests.filter((request) => request.status === 'new').length}
                href={`/admin/listings/${listing.id}`}
                actions={
                  <Link href={`/admin/listings/${listing.id}`} className="inline-flex min-h-8 items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-2 text-[11px] font-semibold text-white">
                    Open workspace
                  </Link>
                }
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export function PropertyWorkspace({
  listing,
  visits,
  requirements,
  whatsappNumber,
}: {
  listing: AdminListing
  visits: VisitRequest[]
  requirements: Requirement[]
  whatsappNumber: string
}) {
  const [tab, setTab] = useState<'details' | 'visits' | 'matches'>('details')
  const matchedRequirements = useMemo(() => matchRequirements(listing, requirements), [listing, requirements])
  const isClosed = listing.status === 'rented_sold'
  const firstPhoto = listing.photos?.[0]

  return (
    <div className="grid gap-5">
      {isClosed && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
          This property is marked {listingTypeClosedLabel(listing.listing_type)} and is hidden from public listings.
        </div>
      )}

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[230px] bg-orange-50">
            {firstPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={firstPhoto} alt={listing.title} className="h-full min-h-[230px] w-full object-cover" />
            ) : (
              <div className="flex min-h-[230px] items-center justify-center text-sm font-semibold text-slate-400">No property photo</div>
            )}
          </div>
          <div className="grid gap-4 p-5">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className={`rounded-full border px-2 py-1 text-xs font-bold ${statusClass(listing.status)}`}>{formatLabel(listing.status)}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold capitalize text-slate-700">{formatLabel(listing.listing_type)}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold capitalize text-slate-700">{daysOnMarket(listing)} days active</span>
              </div>
              <h1 className="text-2xl font-black leading-tight text-slate-950">{listing.title}</h1>
              <p className="mt-2 text-sm font-semibold text-slate-500">{listing.locality}</p>
              <p className="mt-3 text-2xl font-black text-slate-950">{formatPrice(listing.price)}{hasRecurringPrice(listing.listing_type) && <span className="text-sm font-semibold text-slate-500">/mo</span>}</p>
            </div>

            <div className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Owner details</p>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-slate-950">{listing.owner_name || 'Owner name not set'}</p>
                  <p className="text-sm text-slate-600">{listing.owner_phone || 'Owner phone not set'}</p>
                </div>
                {listing.owner_phone && (
                  <div className="flex flex-wrap gap-2">
                    <ActionLink href={'tel:' + listing.owner_phone} tone="blue">Call owner</ActionLink>
                    <ActionLink href={waLink(whatsappNumber, `Hi ${listing.owner_name || ''}, regarding your property ${listing.title} in ${listing.locality}.`)} tone="green">WhatsApp owner</ActionLink>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <PropertyStatusSelect listingId={listing.id} currentStatus={listing.status} />
              {!isClosed && <CloseDealButton listing={listing} matches={matchedRequirements.map((m) => m.requirement)} />}
              <Link href={`/admin/listings/${listing.id}/edit`} className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-4 text-sm font-bold text-white">Edit listing</Link>
              {listing.slug && <Link href={`/property/${listing.slug}`} className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">View public</Link>}
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2" role="tablist" aria-label="Property workspace tabs">
        <TabButton active={tab === 'details'} onClick={() => setTab('details')}>Details</TabButton>
        <TabButton active={tab === 'visits'} onClick={() => setTab('visits')}>Visit Requests ({visits.length})</TabButton>
        <TabButton active={tab === 'matches'} onClick={() => setTab('matches')}>Matched Requirements ({isClosed ? 0 : matchedRequirements.length})</TabButton>
      </div>

      {tab === 'details' && (
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-950">Property details</h2>
          <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <DetailItem label="Category" value={formatLabel(listing.property_category)} />
            <DetailItem label="BHK" value={listing.bhk_count ? listing.bhk_count + ' BHK' : 'Not set'} />
            <DetailItem label="Furnishing" value={furnishingLabel(listing.furnishing)} />
            <DetailItem label="YouTube" value={listing.youtube_url ? 'Available' : 'Not added'} />
          </div>
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Description</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{listing.description || 'No description added.'}</p>
          </div>
        </section>
      )}

      {tab === 'visits' && (
        <section className="grid gap-3">
          {visits.length === 0 ? <EmptyState text="No visit requests for this property yet." /> : visits.map((request) => (
            <VisitRequestCard key={request.id} request={request} whatsappNumber={whatsappNumber} />
          ))}
        </section>
      )}

      {tab === 'matches' && (
        <section className="grid gap-3">
          {isClosed ? <EmptyState text="Matched requirements are hidden because this property is closed." /> : matchedRequirements.length === 0 ? <EmptyState text="No matched seeker requirements found for this property." /> : matchedRequirements.map((match) => (
            <MatchedRequirementCard key={match.requirement.id} match={match} listing={listing} whatsappNumber={whatsappNumber} />
          ))}
        </section>
      )}
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold ${active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}>
      {children}
    </button>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold capitalize text-slate-950">{value}</p>
    </div>
  )
}

function MatchedRequirementCard({
  match,
  listing,
  whatsappNumber,
}: {
  match: RequirementMatch
  listing: AdminListing
  whatsappNumber: string
}) {
  const { requirement, score, strength, reasons, budgetWarning } = match
  const budget = (requirement.budget_min ? formatPrice(requirement.budget_min) + ' - ' : '') + formatPrice(requirement.budget_max)
  const message = `Hi ${requirement.finder_name}, we have a ${listing.bhk_count || ''} ${formatLabel(listing.property_category)} in ${listing.locality} for ${formatPrice(listing.price)}. Let us know if you would like details.`

  return (
    <LeadCard
      title={requirement.finder_name}
      phone={requirement.finder_phone}
      status={requirement.status}
      submitted={requirement.created_at}
      details={[strength + ' match', score + '% score', formatLabel(requirement.listing_type), requirement.bhk_count + ' BHK', requirement.locality_preference, budget, budgetWarning ? 'Above budget' : 'Budget fit']}
      note={requirement.special_requirements || undefined}
      insight={reasons.join(' · ')}
      statusControl={<StatusUpdater id={requirement.id} currentStatus={requirement.status} type="reqs" options={requirementStatuses.filter((option) => option !== 'all')} />}
      actions={<><ActionLink href={waLink(whatsappNumber, message)} tone="green">WhatsApp</ActionLink><ActionLink href={'tel:' + requirement.finder_phone} tone="blue">Call</ActionLink></>}
    />
  )
}

function PropertyStatusSelect({ listingId, currentStatus }: { listingId: string; currentStatus: string }) {
  const [saving, setSaving] = useState(false)

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSaving(true)
    await fetch(`/api/admin/listings/${listingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: event.target.value }),
    })
    window.location.reload()
  }

  return (
    <select defaultValue={currentStatus} onChange={handleChange} disabled={saving} className={`min-h-10 px-3 py-2 text-sm font-bold capitalize ${statusClass(currentStatus)}`}>
      {['draft', 'active', 'rented_sold', 'inactive'].map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
    </select>
  )
}

function CloseDealButton({ listing, matches }: { listing: AdminListing; matches: Requirement[] }) {
  const [open, setOpen] = useState(false)
  const [seekerId, setSeekerId] = useState('')
  const [fee, setFee] = useState('')
  const [closedDate, setClosedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!fee || Number(fee) < 0) {
      setError('Enter the fee you earned (0 is allowed if none).')
      return
    }
    setSaving(true)
    setError('')
    const seeker = matches.find((m) => m.id === seekerId)
    const res = await fetch('/api/admin/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: listing.id,
        requirement_id: seeker?.id || null,
        property_title: listing.title,
        seeker_name: seeker?.finder_name || null,
        seeker_phone: seeker?.finder_phone || null,
        deal_type: listing.listing_type,
        fee_earned: Number(fee),
        closed_date: closedDate,
        notes: notes || null,
      }),
    })
    if (res.ok) {
      window.location.reload()
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Could not save the deal. Try again.')
      setSaving(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center justify-center rounded-md border border-green-600 bg-green-600 px-4 text-sm font-bold text-white hover:bg-green-700"
      >
        Close deal
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !saving && setOpen(false)}>
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-slate-950">Close this deal</h3>
            <p className="mt-1 text-sm text-slate-500">Records revenue, marks the property {listingTypeClosedLabel(listing.listing_type).toLowerCase()}, and fulfils the seeker.</p>

            <div className="mt-4 grid gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Seeker (optional)</label>
                <select value={seekerId} onChange={(e) => setSeekerId(e.target.value)} className="mt-1 w-full px-3 py-2 text-sm">
                  <option value="">— Not from a tracked requirement —</option>
                  {matches.map((m) => (
                    <option key={m.id} value={m.id}>{m.finder_name} · {m.finder_phone}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Fee earned (₹)</label>
                <input type="number" inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="e.g. 5000" className="mt-1 w-full px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Closed date</label>
                <input type="date" value={closedDate} onChange={(e) => setClosedDate(e.target.value)} className="mt-1 w-full px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 text-sm" />
              </div>

              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

              <div className="flex gap-2">
                <button type="button" onClick={submit} disabled={saving} className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md border border-green-600 bg-green-600 px-4 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60">
                  {saving ? 'Saving…' : 'Confirm deal'}
                </button>
                <button type="button" onClick={() => setOpen(false)} disabled={saving} className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function VisitRequestCard({ request, whatsappNumber }: { request: VisitRequest; whatsappNumber: string }) {
  const message = `Hi ${request.finder_name}, we received your visit request for ${request.property_title}. We will arrange a visit for you. What day and time works best?`
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-950">{request.finder_name}</h3>
            <span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${statusClass(request.status)}`}>{formatLabel(request.status)}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{request.finder_phone}</p>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Preferred {formatDate(request.preferred_day)} · {formatLabel(request.preferred_time)} · Submitted {formatDate(request.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusUpdater id={request.id} currentStatus={request.status} type="visit-req" options={visitStatuses.filter((item) => item !== 'all')} />
          <ActionLink href={waLink(whatsappNumber, message)} tone="green">WhatsApp</ActionLink>
          <ActionLink href={'tel:' + request.finder_phone} tone="blue">Call</ActionLink>
        </div>
      </div>
    </div>
  )
}

export function OwnerQueue({ submissions, whatsappNumber }: { submissions: OwnerSubmission[]; whatsappNumber: string }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const filtered = submissions.filter((item) => {
    const query = search.toLowerCase().trim()
    const matchesSearch = !query || [item.owner_name, item.owner_phone, item.locality, item.listing_type].some((value) => value?.toLowerCase().includes(query))
    return matchesSearch && (status === 'all' || item.status === status)
  })

  return (
    <LeadQueueLayout search={search} setSearch={setSearch} status={status} setStatus={setStatus} statuses={ownerStatuses} placeholder="Search owner, phone, locality">
      {filtered.length === 0 ? <EmptyState text="No owner leads match these filters." /> : filtered.map((item) => {
        const message = `Hi ${item.owner_name}, we received your property listing request. We would like to schedule a visit. When are you available?`
        return (
          <LeadCard
            key={item.id}
            title={item.owner_name}
            phone={item.owner_phone}
            status={item.status}
            submitted={item.created_at}
            details={[formatLabel(item.listing_type), item.locality, formatPrice(item.expected_price)]}
            statusControl={<div className="flex flex-wrap gap-2"><StatusUpdater id={item.id} currentStatus={item.status} type="owner-sub" options={ownerStatuses.filter((option) => option !== 'all')} /><SourceUpdater id={item.id} currentSource={item.source ?? null} type="owner-sub" /></div>}
            actions={<><ActionLink href={waLink(whatsappNumber, message)} tone="green">WhatsApp</ActionLink><ActionLink href={'tel:' + item.owner_phone} tone="blue">Call</ActionLink></>}
          />
        )
      })}
    </LeadQueueLayout>
  )
}

export function RequirementsQueue({ requirements }: { requirements: Requirement[] }) {
  const localitySummaries = useMemo(() => {
    const grouped = requirements.reduce<Record<string, Requirement[]>>((acc, item) => {
      const group = item.locality_preference || 'Locality not set'
      acc[group] = acc[group] || []
      acc[group].push(item)
      return acc
    }, {})

    return Object.entries(grouped)
      .map(([locality, items]) => ({
        locality,
        href: '/admin/requirements/locality?name=' + encodeURIComponent(locality),
        total: items.length,
        fresh: items.filter((item) => item.status === 'new').length,
        rent: items.filter((item) => item.listing_type === 'rent').length,
        sale: items.filter((item) => item.listing_type === 'sale').length,
        lease: items.filter((item) => item.listing_type === 'lease').length,
        topBhk: mostCommon(items.map((item) => item.bhk_count).filter(Boolean)),
      }))
      .sort((a, b) => b.fresh - a.fresh || b.total - a.total || a.locality.localeCompare(b.locality))
  }, [requirements])

  if (localitySummaries.length === 0) return <EmptyState text="No requirements yet." />

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {localitySummaries.map((summary) => (
        <Link key={summary.locality} href={summary.href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 hover:bg-slate-50">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">{summary.locality}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">{summary.total} seeker requirement{summary.total === 1 ? '' : 's'}</p>
            </div>
            {summary.fresh > 0 && <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">{summary.fresh} new</span>}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            <LocalityMetric label="Rent" value={summary.rent} />
            <LocalityMetric label="Sale" value={summary.sale} />
            <LocalityMetric label="Lease" value={summary.lease} />
            <LocalityMetric label="Top BHK" value={summary.topBhk || '-'} />
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">Open locality -&gt;</p>
        </Link>
      ))}
    </div>
  )
}

type DemandLocalitySummary = {
  locality: string
  total: number
  fresh: number
  urgent: number
  activeSupply: number
  unmatched: number
  rent: number
  sale: number
  lease: number
  topType: string
  topBhk: string
  medianBudget: number | null
}

export function DemandIntelligence({ requirements, listings }: { requirements: Requirement[]; listings: AdminListing[] }) {
  const insight = useMemo(() => {
    const openRequirements = requirements.filter((item) => matchableRequirementStatuses.has(item.status))
    const activeListings = listings.filter((listing) => listing.status === 'active')
    const summaries = openRequirements.reduce<Record<string, DemandLocalitySummary>>((acc, item) => {
      const locality = item.locality_preference || 'Locality not set'
      const current = acc[locality] || {
        locality,
        total: 0,
        fresh: 0,
        urgent: 0,
        activeSupply: 0,
        unmatched: 0,
        rent: 0,
        sale: 0,
        lease: 0,
        topType: '',
        topBhk: '',
        medianBudget: null,
      }

      current.total += 1
      current.fresh += item.status === 'new' ? 1 : 0
      current.urgent += item.timeline === 'immediately' || item.timeline === 'within_1_month' ? 1 : 0
      current.rent += item.listing_type === 'rent' ? 1 : 0
      current.sale += item.listing_type === 'sale' ? 1 : 0
      current.lease += item.listing_type === 'lease' ? 1 : 0
      current.unmatched += matchListingsForRequirement(item, activeListings).length === 0 ? 1 : 0
      acc[locality] = current
      return acc
    }, {})

    const listingCounts = activeListings.reduce<Record<string, number>>((acc, listing) => {
      const locality = listing.locality || 'Locality not set'
      acc[locality] = (acc[locality] || 0) + 1
      return acc
    }, {})

    const localities = Object.values(summaries).map((summary) => {
      const items = openRequirements.filter((item) => (item.locality_preference || 'Locality not set') === summary.locality)
      return {
        ...summary,
        activeSupply: listingCounts[summary.locality] || 0,
        topType: mostCommon(items.map((item) => item.property_category).filter(Boolean)) || 'Any',
        topBhk: mostCommon(items.map((item) => item.bhk_count).filter(Boolean)) || 'Any',
        medianBudget: median(items.map((item) => item.budget_max).filter((value): value is number => Boolean(value))),
      }
    })

    const hotLocalities = [...localities]
      .sort((a, b) => b.total - a.total || b.fresh - a.fresh || a.locality.localeCompare(b.locality))
      .slice(0, 3)

    const supplyGaps = [...localities]
      .filter((item) => item.unmatched > 0)
      .sort((a, b) => b.unmatched - a.unmatched || b.urgent - a.urgent || b.total - a.total || a.locality.localeCompare(b.locality))
      .slice(0, 4)

    const urgentUnmatched = openRequirements
      .filter((item) => item.timeline === 'immediately' || item.timeline === 'within_1_month' || item.status === 'new')
      .map((item) => ({ requirement: item, matches: matchListingsForRequirement(item, activeListings) }))
      .filter((item) => item.matches.length === 0)
      .sort((a, b) => demandPriority(b.requirement) - demandPriority(a.requirement) || new Date(b.requirement.created_at).getTime() - new Date(a.requirement.created_at).getTime())
      .slice(0, 4)

    const topCategories = Object.entries(countRequirementsBy(openRequirements, (item) => formatDemandNeed(item)))
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 4)

    return {
      openRequirements,
      activeListings,
      hotLocalities,
      supplyGaps,
      urgentUnmatched,
      topCategories,
      totalUnmatched: localities.reduce((sum, item) => sum + item.unmatched, 0),
      urgentCount: openRequirements.filter((item) => item.timeline === 'immediately' || item.timeline === 'within_1_month').length,
    }
  }, [requirements, listings])

  if (insight.openRequirements.length === 0) return null

  return (
    <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Demand intelligence</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Where demand is ahead of inventory</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:min-w-[420px]">
          <LocalityMetric label="Open" value={insight.openRequirements.length} />
          <LocalityMetric label="Unmatched" value={insight.totalUnmatched} />
          <LocalityMetric label="Urgent" value={insight.urgentCount} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-3">
          <InsightPanel title="Supply gaps" empty="No supply gaps found against active listings.">
            {insight.supplyGaps.map((item) => (
              <Link key={item.locality} href={'/admin/requirements/locality?name=' + encodeURIComponent(item.locality)} className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-slate-300 hover:bg-white md:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">{item.locality}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{item.topBhk} BHK {formatLabel(item.topType)} - {formatPrice(item.medianBudget)} median budget</p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <DemandBadge label="unmatched" value={item.unmatched} tone="red" />
                  <DemandBadge label="active supply" value={item.activeSupply} />
                  {item.urgent > 0 && <DemandBadge label="urgent" value={item.urgent} tone="amber" />}
                </div>
              </Link>
            ))}
          </InsightPanel>

          <InsightPanel title="Hot localities" empty="No locality demand yet.">
            <div className="grid gap-2 md:grid-cols-3">
              {insight.hotLocalities.map((item) => (
                <Link key={item.locality} href={'/admin/requirements/locality?name=' + encodeURIComponent(item.locality)} className="rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-slate-300 hover:bg-white">
                  <p className="truncate text-sm font-black text-slate-950">{item.locality}</p>
                  <div className="mt-3 grid grid-cols-4 gap-1.5">
                    <LocalityMetric label="Total" value={item.total} />
                    <LocalityMetric label="Rent" value={item.rent} />
                    <LocalityMetric label="Sale" value={item.sale} />
                    <LocalityMetric label="Lease" value={item.lease} />
                  </div>
                </Link>
              ))}
            </div>
          </InsightPanel>
        </div>

        <div className="grid gap-3">
          <InsightPanel title="Top requested needs" empty="No requirement pattern yet.">
            {insight.topCategories.map(([label, count]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="min-w-0 truncate text-sm font-bold text-slate-800">{label}</p>
                <span className="shrink-0 rounded-full bg-slate-900 px-2 py-1 text-xs font-bold text-white">{count}</span>
              </div>
            ))}
          </InsightPanel>

          <InsightPanel title="Urgent unmatched seekers" empty="No urgent unmatched seekers.">
            {insight.urgentUnmatched.map(({ requirement }) => (
              <Link key={requirement.id} href={'/admin/requirements/locality?name=' + encodeURIComponent(requirement.locality_preference || 'Locality not set')} className="block rounded-md border border-red-100 bg-red-50 px-3 py-2 hover:border-red-200 hover:bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">{requirement.finder_name}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-600">{requirement.locality_preference} - {formatDemandNeed(requirement)} - {formatPrice(requirement.budget_max)}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold text-white">{formatLabel(requirement.timeline)}</span>
                </div>
              </Link>
            ))}
          </InsightPanel>
        </div>
      </div>
    </section>
  )
}

export function RequirementsLocalityWorkspace({ locality, requirements, activeListings = [], whatsappNumber }: { locality: string; requirements: Requirement[]; activeListings?: AdminListing[]; whatsappNumber: string }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [bhk, setBhk] = useState('all')

  const bhkOptions = useMemo(() => {
    return Array.from(new Set(requirements.map((item) => item.bhk_count).filter(Boolean))).sort((a, b) => a.localeCompare(b))
  }, [requirements])

  const filtered = requirements.filter((item) => {
    const query = search.toLowerCase().trim()
    const matchesSearch = !query || [item.finder_name, item.finder_phone, item.locality_preference, item.bhk_count, item.listing_type].some((value) => value?.toLowerCase().includes(query))
    const matchesStatus = status === 'all' || item.status === status
    const matchesType = type === 'all' || item.listing_type === type
    const matchesBhk = bhk === 'all' || item.bhk_count === bhk
    return matchesSearch && matchesStatus && matchesType && matchesBhk
  })

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Pipeline {status !== 'all' && <span className="text-slate-400">· filtered by {formatLabel(status)}</span>}</p>
        {status !== 'all' && (
          <button type="button" onClick={() => setStatus('all')} className="text-xs font-bold text-blue-600 hover:underline">Clear filter</button>
        )}
      </div>
      <div className="mb-4 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {requirementStatuses.filter((item) => item !== 'all').map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus((current) => (current === item ? 'all' : item))}
            className={`rounded-lg border p-3 text-left ${status === item ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            <p className="text-xs font-bold uppercase tracking-wide opacity-70">{formatLabel(item)}</p>
            <p className="mt-1 text-2xl font-black">{requirements.filter((requirement) => requirement.status === item).length}</p>
          </button>
        ))}
      </div>

      <div className="mb-5 grid gap-3 rounded-md border border-slate-200 bg-white p-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search finder, phone, locality, BHK" className="w-full px-3 py-2 text-sm" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="px-3 py-2 text-sm">
          {requirementStatuses.map((item) => <option key={item} value={item}>{item === 'all' ? 'All status' : formatLabel(item)}</option>)}
        </select>
        <select value={type} onChange={(event) => setType(event.target.value)} className="px-3 py-2 text-sm">
          <option value="all">Rent, sale, and lease</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
          <option value="lease">Lease</option>
        </select>
        <select value={bhk} onChange={(event) => setBhk(event.target.value)} className="px-3 py-2 text-sm">
          <option value="all">All BHK</option>
          {bhkOptions.map((item) => <option key={item} value={item}>{item} BHK</option>)}
        </select>
        <div className="inline-flex min-h-[42px] items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600">{locality}</div>
      </div>

      {filtered.length === 0 ? <EmptyState text="No requirements match these filters." /> : (
        <div className="grid gap-3">
          {filtered.map((item) => {
            const message = 'Hi ' + item.finder_name + ', we found a property matching your requirement. Let us know if you are interested.'
            const budget = (item.budget_min ? formatPrice(item.budget_min) + ' - ' : '') + formatPrice(item.budget_max)
            const matches = matchListingsForRequirement(item, activeListings)
            return (
              <div key={item.id} className="grid gap-0">
                <LeadCard
                  title={item.finder_name}
                  phone={item.finder_phone}
                  status={item.status}
                  submitted={item.created_at}
                  details={[formatLabel(item.listing_type), item.bhk_count + ' BHK', budget, formatLabel(item.tenant_type), formatLabel(item.timeline)]}
                  note={item.special_requirements || undefined}
                  statusControl={<StatusUpdater id={item.id} currentStatus={item.status} type="reqs" options={requirementStatuses.filter((option) => option !== 'all')} />}
                  actions={<><ActionLink href={waLink(whatsappNumber, message)} tone="green">WhatsApp</ActionLink><ActionLink href={'tel:' + item.finder_phone} tone="blue">Call</ActionLink></>}
                />
                <MatchingProperties requirement={item} matches={matches} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MatchingProperties({ requirement, matches }: { requirement: Requirement; matches: ListingMatch[] }) {
  const [open, setOpen] = useState(false)

  if (matches.length === 0) {
    return (
      <div className="-mt-px rounded-b-lg border border-t-0 border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-400">
        No active listings match this seeker yet.
      </div>
    )
  }

  return (
    <div className="-mt-px rounded-b-lg border border-t-0 border-green-200 bg-green-50/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-2 text-left text-xs font-bold text-green-800 hover:bg-green-50"
      >
        <span>{matches.length} matching propert{matches.length === 1 ? 'y' : 'ies'} — send to seeker</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="grid gap-2 px-4 pb-3">
          {matches.map(({ listing, overBudget }) => {
            const url = listing.slug ? `${typeof window !== 'undefined' ? window.location.origin : ''}/property/${listing.slug}` : ''
            const message = `Hi ${requirement.finder_name}, this is HubliDharwad.app. We have a verified ${listing.bhk_count ? listing.bhk_count + ' BHK ' : ''}${formatLabel(listing.property_category)} in ${listing.locality} for ${formatPrice(listing.price)}${hasRecurringPrice(listing.listing_type) ? '/mo' : ''}.${url ? ' See it here: ' + url : ''} Want to schedule a visit?`
            return (
              <div key={listing.id} className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-950">{listing.title}</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">
                    {listing.locality} · {formatPrice(listing.price)}
                    {overBudget && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Above budget</span>}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <ActionLink href={waLinkTo(requirement.finder_phone, message)} tone="green">Send via WhatsApp</ActionLink>
                  <Link href={`/admin/listings/${listing.id}`} className="inline-flex min-h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">Open</Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function LocalityMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  )
}

function InsightPanel({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const hasChildren = Children.count(children) > 0

  return (
    <div className="rounded-md border border-slate-200 p-3">
      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3 grid gap-2">
        {hasChildren ? children : <EmptyState text={empty} compact />}
      </div>
    </div>
  )
}

function DemandBadge({ label, value, tone = 'slate' }: { label: string; value: number; tone?: 'slate' | 'red' | 'amber' }) {
  const toneClass = tone === 'red'
    ? 'bg-red-100 text-red-700'
    : tone === 'amber'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-white text-slate-700'

  return (
    <span className={`inline-flex min-h-7 items-center gap-1 rounded-full border border-slate-200 px-2 text-xs font-bold ${toneClass}`}>
      {value} {label}
    </span>
  )
}

function LeadQueueLayout({
  children,
  search,
  setSearch,
  status,
  setStatus,
  statuses,
  placeholder,
}: {
  children: React.ReactNode
  search: string
  setSearch: (value: string) => void
  status: string
  setStatus: (value: string) => void
  statuses: string[]
  placeholder: string
}) {
  return (
    <div>
      <FilterBar search={search} onSearch={setSearch} status={status} onStatus={setStatus} statuses={statuses} placeholder={placeholder} />
      <div className="grid gap-3">{children}</div>
    </div>
  )
}

function LeadCard({
  title,
  phone,
  status,
  submitted,
  details,
  note,
  insight,
  statusControl,
  actions,
}: {
  title: string
  phone: string
  status: string
  submitted: string
  details: string[]
  note?: string
  insight?: string
  statusControl: React.ReactNode
  actions: React.ReactNode
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold text-slate-950">{title}</h2>
            <span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${statusClass(status)}`}>{formatLabel(status)}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{phone}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {details.filter(Boolean).map((detail) => <span key={detail} className="rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold capitalize text-slate-700">{detail}</span>)}
          </div>
          {insight && <p className="mt-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold text-green-800">{insight}</p>}
          {note && <p className="mt-3 text-sm text-slate-600">{note}</p>}
          <p className="mt-3 text-xs font-semibold text-slate-400">Submitted {formatDate(submitted)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusControl}
          {actions}
        </div>
      </div>
    </article>
  )
}

function EmptyState({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <div className={`rounded-md border border-dashed border-slate-300 bg-white text-center text-sm font-semibold text-slate-500 ${compact ? 'p-4' : 'p-8'}`}>
      {text}
    </div>
  )
}

function groupVisits(requests: VisitRequest[]) {
  return requests.reduce<Record<string, VisitRequest[]>>((acc, request) => {
    acc[request.listing_id] = acc[request.listing_id] || []
    acc[request.listing_id].push(request)
    return acc
  }, {})
}

function countByListing(requests: VisitRequest[]) {
  return requests.reduce<Record<string, number>>((acc, request) => {
    acc[request.listing_id] = (acc[request.listing_id] || 0) + 1
    return acc
  }, {})
}

function daysOnMarket(listing: AdminListing) {
  const source = listing.date_listed || listing.created_at
  if (!source) return 0

  const start = new Date(source).getTime()
  if (!Number.isFinite(start)) return 0

  const diff = Date.now() - start
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

type MatchStrength = 'Strong' | 'Good' | 'Possible'

type MatchScore = {
  score: number
  strength: MatchStrength
  reasons: string[]
  overBudget: boolean
}

type RequirementMatch = MatchScore & {
  requirement: Requirement
  budgetWarning: boolean
}

type ListingMatch = MatchScore & {
  listing: AdminListing
}

function matchRequirements(listing: AdminListing, requirements: Requirement[]): RequirementMatch[] {
  return requirements
    .filter((requirement) => matchableRequirementStatuses.has(requirement.status))
    .map((requirement) => {
      const match = scoreListingRequirement(listing, requirement)
      if (!match) return null
      return {
        requirement,
        ...match,
        budgetWarning: match.overBudget,
      }
    })
    .filter((match): match is RequirementMatch => Boolean(match))
    .sort((a, b) => b.score - a.score || Number(a.budgetWarning) - Number(b.budgetWarning) || new Date(b.requirement.created_at).getTime() - new Date(a.requirement.created_at).getTime())
}

// Reverse of matchRequirements: given a seeker, find active listings that fit.
function matchListingsForRequirement(requirement: Requirement, listings: AdminListing[]): ListingMatch[] {
  if (!matchableRequirementStatuses.has(requirement.status)) return []

  return listings
    .filter((listing) => listing.status === 'active')
    .map((listing) => {
      const match = scoreListingRequirement(listing, requirement)
      if (!match) return null
      return {
        listing,
        ...match,
      }
    })
    .filter((match): match is ListingMatch => Boolean(match))
    .sort((a, b) => b.score - a.score || Number(a.overBudget) - Number(b.overBudget) || Number(a.listing.price) - Number(b.listing.price))
}

function scoreListingRequirement(listing: AdminListing, requirement: Requirement): MatchScore | null {
  if (listing.status !== 'active') return null
  if (listing.listing_type !== requirement.listing_type) return null

  const reasons: string[] = []
  let score = 0

  const locality = scoreLocality(listing.locality, requirement.locality_preference)
  if (locality.score === 0) return null
  score += locality.score
  reasons.push(locality.reason)

  const category = scoreCategory(listing.property_category, requirement.property_category)
  if (category.score === 0 && requirement.property_category) return null
  score += category.score
  reasons.push(category.reason)

  const bhk = scoreBhk(listing.bhk_count, requirement.bhk_count)
  if (bhk.score === 0 && requirement.bhk_count !== 'any') return null
  score += bhk.score
  reasons.push(bhk.reason)

  const budget = scoreBudget(Number(listing.price || 0), Number(requirement.budget_min || 0), Number(requirement.budget_max || 0), listing.listing_type)
  if (budget.score === 0) return null
  score += budget.score
  reasons.push(budget.reason)

  const furnishing = scorePreference(listing.furnishing, requirement.furnishing_preference, 'Furnishing')
  score += furnishing.score
  if (furnishing.reason) reasons.push(furnishing.reason)

  const facing = scorePreference(listing.facing, requirement.facing_preference, 'Facing')
  score += facing.score
  if (facing.reason) reasons.push(facing.reason)

  const tenant = scoreTenantPreference(listing.preferred_tenants, requirement.tenant_type)
  score += tenant.score
  if (tenant.reason) reasons.push(tenant.reason)

  const food = scorePreference(listing.food_preference, requirement.food_preference, 'Food')
  score += food.score
  if (food.reason) reasons.push(food.reason)

  const timeline = scoreTimeline(requirement.timeline)
  score += timeline.score
  if (timeline.reason) reasons.push(timeline.reason)

  const finalScore = Math.min(100, Math.max(0, Math.round(score)))
  if (finalScore < 55) return null

  return {
    score: finalScore,
    strength: matchStrength(finalScore),
    reasons: reasons.slice(0, 5),
    overBudget: budget.overBudget,
  }
}

function scoreLocality(listingLocality: string, requirementLocality: string) {
  const listing = normalizeLocalityForMatch(listingLocality)
  const requirement = normalizeLocalityForMatch(requirementLocality)
  if (!listing || !requirement) return { score: 0, reason: '' }

  if (listing.compact === requirement.compact) return { score: 30, reason: 'Exact locality' }
  if (listing.compact.includes(requirement.compact) || requirement.compact.includes(listing.compact)) {
    return { score: 24, reason: 'Close locality' }
  }

  const overlap = tokenOverlap(listing.tokens, requirement.tokens)
  if (overlap >= 0.6) return { score: 18, reason: 'Nearby locality words' }
  if (overlap >= 0.4) return { score: 10, reason: 'Loose locality match' }

  return { score: 0, reason: '' }
}

function scoreCategory(listingCategory?: string | null, requirementCategory?: string | null) {
  const listing = normalizeChoice(listingCategory)
  const requirement = normalizeChoice(requirementCategory)
  if (!requirement || requirement === 'any') return { score: 8, reason: 'Any property type' }
  if (!listing) return { score: 4, reason: 'Property type not set' }
  if (listing === requirement) return { score: 15, reason: 'Property type match' }
  return { score: 0, reason: '' }
}

function scoreBhk(listingValue?: string | null, requirementValue?: string | null) {
  const listing = normalizeBhk(listingValue)
  const requirement = normalizeBhk(requirementValue)
  if (!requirement || requirement === 'any') return { score: 12, reason: 'Any BHK accepted' }
  if (!listing) return { score: 4, reason: 'BHK not set' }
  if (requirement === '4+') return Number(listing) >= 4 ? { score: 15, reason: 'BHK match' } : { score: 0, reason: '' }
  if (listing === requirement) return { score: 15, reason: 'BHK match' }
  return { score: 0, reason: '' }
}

function scoreBudget(price: number, budgetMin: number, budgetMax: number, listingType: string) {
  if (!price || !budgetMax) return { score: 8, reason: 'Budget needs review', overBudget: false }

  const tolerance = listingType === 'rent' ? 1.15 : 1.1
  const softTolerance = listingType === 'rent' ? 1.25 : 1.18
  const overBudget = price > budgetMax

  if (price <= budgetMax && (!budgetMin || price >= budgetMin * 0.75)) {
    return { score: 25, reason: 'Budget fits', overBudget }
  }
  if (price <= budgetMax * tolerance) {
    return { score: 16, reason: 'Slightly above budget', overBudget }
  }
  if (price <= budgetMax * softTolerance) {
    return { score: 7, reason: 'Budget stretch', overBudget }
  }

  return { score: 0, reason: '', overBudget }
}

function scorePreference(listingValue?: string | null, requirementValue?: string | null, label = 'Preference') {
  const listing = normalizeChoice(listingValue)
  const requirement = normalizeChoice(requirementValue)
  if (!requirement || requirement === 'any') return { score: 3, reason: '' }
  if (!listing || listing === 'any') return { score: 2, reason: '' }
  if (listing === requirement) return { score: 5, reason: label + ' match' }
  return { score: 0, reason: '' }
}

function scoreTenantPreference(listingValue?: string | null, requirementValue?: string | null) {
  const listing = normalizeChoice(listingValue)
  const requirement = normalizeChoice(requirementValue)
  if (!requirement) return { score: 0, reason: '' }
  if (!listing || listing === 'any') return { score: 3, reason: '' }
  if (listing.includes(requirement) || requirement.includes(listing)) return { score: 6, reason: 'Tenant preference match' }
  if (listing.includes('family') && requirement !== 'family') return { score: -8, reason: 'Tenant preference conflict' }
  return { score: 0, reason: '' }
}

function scoreTimeline(value?: string | null) {
  if (value === 'immediately') return { score: 5, reason: 'Immediate seeker' }
  if (value === 'within_1_month') return { score: 3, reason: 'Near-term seeker' }
  if (value === 'within_3_months') return { score: 1, reason: '' }
  return { score: 0, reason: '' }
}

function matchStrength(score: number): MatchStrength {
  if (score >= 82) return 'Strong'
  if (score >= 68) return 'Good'
  return 'Possible'
}

function normalizeChoice(value?: string | null) {
  return (value || '').toLowerCase().trim().replace(/\s+/g, '_')
}

function normalizeLocalityForMatch(value?: string | null) {
  const cleaned = (value || '')
    .toLowerCase()
    .replace(/hubballi/g, 'hubli')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const tokens = cleaned
    .split(' ')
    .filter((token) => token && !['hubli', 'dharwad', 'road', 'area', 'near'].includes(token))

  return {
    compact: tokens.join(''),
    tokens,
  }
}

function tokenOverlap(a: string[], b: string[]) {
  if (!a.length || !b.length) return 0
  const source = new Set(a)
  const matches = b.filter((token) => source.has(token)).length
  return matches / Math.min(a.length, b.length)
}

function normalizeBhk(value?: string | null) {
  if (!value) return ''
  if (value.toLowerCase().includes('any')) return 'any'
  if (value.includes('4')) return value.includes('+') ? '4+' : '4'
  const match = value.match(/\d/)
  return match ? match[0] : value.toLowerCase().trim()
}

function mostCommon(values: string[]) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || ''
}

function median(values: number[]) {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 1) return sorted[middle]
  return Math.round((sorted[middle - 1] + sorted[middle]) / 2)
}

function countRequirementsBy(requirements: Requirement[], getKey: (requirement: Requirement) => string) {
  return requirements.reduce<Record<string, number>>((acc, requirement) => {
    const key = getKey(requirement)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

function formatDemandNeed(requirement: Requirement) {
  const bhk = requirement.bhk_count && requirement.bhk_count !== 'any' ? requirement.bhk_count + ' BHK' : 'Any BHK'
  return `${formatLabel(requirement.listing_type)} ${bhk} ${formatLabel(requirement.property_category)}`
}

function demandPriority(requirement: Requirement) {
  let score = 0
  if (requirement.status === 'new') score += 3
  if (requirement.timeline === 'immediately') score += 4
  if (requirement.timeline === 'within_1_month') score += 2
  return score
}
