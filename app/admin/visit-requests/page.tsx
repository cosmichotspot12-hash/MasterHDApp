import StatusUpdater from '../owner-submissions/StatusUpdater'
import { adminApiHeaders } from '@/lib/admin-api'

type VisitRequest = {
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

async function getVisitRequests(propertyFilter: string): Promise<VisitRequest[]> {
  try {
    const headers = await adminApiHeaders()
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/visit-req`, {
      cache: 'no-store',
      headers,
    })
    const { data } = await res.json()
    if (propertyFilter) {
      return (data || []).filter((v: VisitRequest) => v.listing_id === propertyFilter)
    }
    return data || []
  } catch {
    return []
  }
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!

function getWhatsAppLink(name: string, property: string) {
  const msg = `Hi ${name}, we received your visit request for ${property}. We will arrange a visit for you. What day and time works best?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export default async function VisitRequestsPage() {
  const requests = await getVisitRequests('')
  const newCount = requests.filter((v) => v.status === 'new').length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Visit Requests</h1>
        <p className="text-gray-500 text-sm mt-1">
          Finders who want to visit properties
          {newCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {newCount} new
            </span>
          )}
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-500">No visit requests yet.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Finder</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Phone</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Property</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Preferred Day</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Time</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Submitted</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((v) => (
                <tr key={v.id} className={v.status === 'new' ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">{v.finder_name}</td>
                  <td className="px-4 py-3 text-gray-600">{v.finder_phone}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{v.property_title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(v.preferred_day).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{v.preferred_time}</td>
                  <td className="px-4 py-3">
                    <StatusUpdater
                      id={v.id}
                      currentStatus={v.status}
                      type="visit-req"
                      options={['new', 'contacted', 'visit_scheduled', 'visit_done', 'converted', 'dropped']}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(v.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={getWhatsAppLink(v.finder_name, v.property_title)}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={'tel:' + v.finder_phone}
                        className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Call
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
