import StatusUpdater from '../owner-submissions/StatusUpdater'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

type Requirement = {
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
  special_requirements: string
  status: string
  created_at: string
}

async function getRequirements() {
  try {
    const res = await fetch(APP_URL + '/api/admin/reqs', {
      cache: 'no-store'
    })
    const { data } = await res.json()
    return data || []
  } catch {
    return []
  }
}

function getWhatsAppLink(name: string) {
  const msg = 'Hi ' + name + ', we found a property matching your requirement. Let us know if you are interested.'
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg)
}

export default async function RequirementsPage() {
  const requirements: Requirement[] = await getRequirements()
  const newCount = requirements.filter((r) => r.status === 'new').length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Requirements</h1>
        <p className="text-gray-500 text-sm mt-1">
          Finders looking for properties
          {newCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {newCount} new
            </span>
          )}
        </p>
      </div>

      {requirements.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-500">No requirements yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Phone</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">BHK</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Locality</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Budget</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Tenant</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Food</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Timeline</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requirements.map((r) => (
                <tr key={r.id} className={r.status === 'new' ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.finder_name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.finder_phone}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{r.listing_type}</td>
                  <td className="px-4 py-3 text-gray-600">{r.bhk_count}</td>
                  <td className="px-4 py-3 text-gray-600">{r.locality_preference}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {r.budget_min ? '₹' + r.budget_min.toLocaleString() + ' - ' : ''}
                    {'₹' + r.budget_max.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{r.tenant_type}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{r.food_preference}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize text-xs">{r.timeline.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">
                    <StatusUpdater
                      id={r.id}
                      currentStatus={r.status}
                      type="reqs"
                      options={['new', 'contacted', 'matched', 'fulfilled', 'no_match']}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      
                      <a  href={getWhatsAppLink(r.finder_name)}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                      >
                        WhatsApp
                      </a>
                      
                      <a  href={'tel:' + r.finder_phone}
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