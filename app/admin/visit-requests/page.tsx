import { APP_URL } from '@/lib/env'
import { getAdminListings, getAdminVisitRequests } from '@/lib/admin-data'
import { VisitRequestsWorkspace, type AdminListing, type VisitRequest } from '@/components/admin-operations'

export const dynamic = 'force-dynamic'

export default async function VisitRequestsPage() {
  let listings: AdminListing[] = []
  let requests: VisitRequest[] = []
  try {
    ;[listings, requests] = await Promise.all([getAdminListings(), getAdminVisitRequests()])
  } catch {
    // Render with empty data if the database is unreachable.
  }

  const newCount = requests.filter((request) => request.status === 'new').length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Visit Requests</h1>
        <p className="text-gray-500 text-sm mt-1">
          Grouped by property — properties with new requests first
          {newCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {newCount} new
            </span>
          )}
        </p>
      </div>

      <VisitRequestsWorkspace listings={listings} requests={requests} appUrl={APP_URL} />
    </div>
  )
}
