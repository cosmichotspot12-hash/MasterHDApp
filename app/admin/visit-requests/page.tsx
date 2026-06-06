import { VisitRequestsWorkspace, type AdminListing, type VisitRequest } from '@/components/admin-operations'
import { adminApiHeaders } from '@/lib/admin-api'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function getVisitWorkspaceData() {
  try {
    const headers = await adminApiHeaders()
    const [listingsRes, requestsRes] = await Promise.all([
      fetch(APP_URL + '/api/admin/listings', { cache: 'no-store', headers }),
      fetch(APP_URL + '/api/admin/visit-req', { cache: 'no-store', headers }),
    ])
    const [listingsJson, requestsJson] = await Promise.all([listingsRes.json(), requestsRes.json()])
    return {
      listings: (listingsJson.data || []) as AdminListing[],
      requests: (requestsJson.data || []) as VisitRequest[],
    }
  } catch {
    return { listings: [] as AdminListing[], requests: [] as VisitRequest[] }
  }
}

export default async function VisitRequestsPage() {
  const { listings, requests } = await getVisitWorkspaceData()
  const activeCount = listings.filter((listing) => listing.status === 'active').length
  const newCount = requests.filter((request) => request.status === 'new').length

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Visit Requests</h1>
          <p className="mt-1 text-sm text-slate-500">Open a property to schedule and follow up with interested finders.</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">{activeCount} active properties</span>
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">{newCount} new requests</span>
        </div>
      </div>
      <VisitRequestsWorkspace listings={listings} requests={requests} />
    </div>
  )
}
