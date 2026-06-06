import Link from 'next/link'
import { ListingsInventory, type AdminListing, type VisitRequest } from '@/components/admin-operations'
import { adminApiHeaders } from '@/lib/admin-api'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function getListingsData() {
  try {
    const headers = await adminApiHeaders()
    const [listingsRes, visitsRes] = await Promise.all([
      fetch(APP_URL + '/api/admin/listings', { cache: 'no-store', headers }),
      fetch(APP_URL + '/api/admin/visit-req', { cache: 'no-store', headers }),
    ])
    const [listingsJson, visitsJson] = await Promise.all([listingsRes.json(), visitsRes.json()])
    return {
      listings: (listingsJson.data || []) as AdminListing[],
      visits: (visitsJson.data || []) as VisitRequest[],
    }
  } catch {
    return { listings: [] as AdminListing[], visits: [] as VisitRequest[] }
  }
}

export default async function ListingsPage() {
  const { listings, visits } = await getListingsData()
  const activeCount = listings.filter((listing) => listing.status === 'active').length
  const draftCount = listings.filter((listing) => listing.status === 'draft').length

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Properties</h1>
          <p className="mt-1 text-sm text-slate-500">Manage property inventory with the same context customers see.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">{activeCount} active</span>
          <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">{draftCount} draft</span>
          <Link href="/admin/listings/new" className="inline-flex min-h-8 items-center justify-center rounded-md bg-slate-900 px-3 text-xs font-bold text-white hover:bg-slate-700">
            Add listing
          </Link>
        </div>
      </div>
      <ListingsInventory listings={listings} visits={visits} />
    </div>
  )
}
