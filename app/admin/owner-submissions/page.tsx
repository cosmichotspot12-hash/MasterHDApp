import StatusUpdater from './StatusUpdater'
import { adminApiHeaders } from '@/lib/admin-api'

type OwnerSubmission = {
  id: string
  status: string
  owner_name: string
  owner_phone: string
  listing_type: string
  locality: string
  expected_price: number | null
  created_at: string
}

async function getSubmissions() {
  try {
    const headers = await adminApiHeaders()
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/owner-sub`, {
      cache: 'no-store',
      headers,
    })
    const { data } = await res.json()
    return data || []
  } catch {
    return []
  }
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!

function getWhatsAppLink(name: string) {
  const msg = `Hi ${name}, we received your property listing request. We would like to schedule a visit. When are you available?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export default async function OwnerSubmissionsPage() {
  const submissions: OwnerSubmission[] = await getSubmissions()
  const newCount = submissions.filter((s) => s.status === 'new').length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Owner Submissions</h1>
        <p className="text-gray-500 text-sm mt-1">
          Property owners who want to list with you
          {newCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {newCount} new
            </span>
          )}
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-500">No submissions yet.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Phone</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Locality</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Price</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Submitted</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((s) => (
                <tr key={s.id} className={s.status === 'new' ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.owner_name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.owner_phone}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{s.listing_type}</td>
                  <td className="px-4 py-3 text-gray-600">{s.locality}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.expected_price ? '₹' + s.expected_price.toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusUpdater
                      id={s.id}
                      currentStatus={s.status}
                      type="owner-sub"
                      options={['new', 'contacted', 'visit_scheduled', 'listed', 'rejected']}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(s.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={getWhatsAppLink(s.owner_name)}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={'tel:' + s.owner_phone}
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
