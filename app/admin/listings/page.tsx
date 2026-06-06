import Link from 'next/link'
import { adminApiHeaders } from '@/lib/admin-api'
import DeleteButton from './DeleteButton'

type AdminListing = {
  id: string
  title: string
  listing_type: string
  locality: string
  price: number
  status: string
}

async function getListings() {
  try {
    const headers = await adminApiHeaders()
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/listings`, {
      cache: 'no-store',
      headers,
    })
    const { data } = await res.json()
    return data || []
  } catch {
    return []
  }
}

export default async function ListingsPage() {
  const listings: AdminListing[] = await getListings()

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Listings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all property listings</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="inline-flex w-full items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 sm:w-auto"
        >
          + Add New Listing
        </Link>
      </div>

      {!listings || listings.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-500">No listings yet. Add your first listing.</p>
          <Link href="/admin/listings/new" className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
            + Add New Listing
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Locality</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Price</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{listing.title}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{listing.listing_type}</td>
                  <td className="px-4 py-3 text-gray-600">{listing.locality}</td>
                  <td className="px-4 py-3 text-gray-600">₹{listing.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      listing.status === 'active' ? 'bg-green-100 text-green-700' :
                      listing.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      listing.status === 'rented_sold' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/listings/${listing.id}/edit`} className="text-orange-500 hover:text-orange-600 font-medium">
                        Edit
                      </Link>
                      <DeleteButton id={listing.id} />
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
