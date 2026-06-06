import Link from 'next/link'
import { adminApiHeaders } from '@/lib/admin-api'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function getCounts() {
  try {
    const headers = await adminApiHeaders()
    const [listings, submissions, visits, requirements] = await Promise.all([
      fetch(APP_URL + '/api/admin/listings', { cache: 'no-store', headers }).then(r => r.json()),
      fetch(APP_URL + '/api/admin/owner-sub', { cache: 'no-store', headers }).then(r => r.json()),
      fetch(APP_URL + '/api/admin/visit-req', { cache: 'no-store', headers }).then(r => r.json()),
      fetch(APP_URL + '/api/admin/reqs', { cache: 'no-store', headers }).then(r => r.json()),
    ])
    return {
      totalListings: listings.data?.length || 0,
      activeListings: listings.data?.filter((item: { status: string }) => item.status === 'active').length || 0,
      newSubmissions: submissions.data?.filter((item: { status: string }) => item.status === 'new').length || 0,
      newVisits: visits.data?.filter((item: { status: string }) => item.status === 'new').length || 0,
      newRequirements: requirements.data?.filter((item: { status: string }) => item.status === 'new').length || 0,
    }
  } catch {
    return { totalListings: 0, activeListings: 0, newSubmissions: 0, newVisits: 0, newRequirements: 0 }
  }
}

export default async function AdminDashboard() {
  const counts = await getCounts()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Hubli Dharwad App Property Platform</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="content-card border-l-4 border-l-orange-500 p-6">
          <p className="text-sm text-gray-500">Total Listings</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{counts.totalListings}</p>
          <p className="text-xs text-green-600 mt-1">{counts.activeListings} active</p>
        </div>
        <div className="content-card border-l-4 border-l-red-500 p-6">
          <p className="text-sm text-gray-500">New Owner Submissions</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{counts.newSubmissions}</p>
          <p className="text-xs text-gray-400 mt-1">Pending contact</p>
        </div>
        <div className="content-card border-l-4 border-l-blue-500 p-6">
          <p className="text-sm text-gray-500">New Visit Requests</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{counts.newVisits}</p>
          <p className="text-xs text-gray-400 mt-1">Pending coordination</p>
        </div>
        <div className="content-card border-l-4 border-l-purple-500 p-6">
          <p className="text-sm text-gray-500">New Requirements</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{counts.newRequirements}</p>
          <p className="text-xs text-gray-400 mt-1">Pending matching</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/listings" className="content-card p-5 transition hover:-translate-y-1 hover:shadow-lg">
          <h2 className="font-bold text-gray-800">Listings</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all properties</p>
        </Link>
        <Link href="/admin/owner-submissions" className="content-card p-5 transition hover:-translate-y-1 hover:shadow-lg">
          <h2 className="font-bold text-gray-800">Owner Submissions</h2>
          <p className="text-gray-500 text-sm mt-1">New property inquiries</p>
        </Link>
        <Link href="/admin/visit-requests" className="content-card p-5 transition hover:-translate-y-1 hover:shadow-lg">
          <h2 className="font-bold text-gray-800">Visit Requests</h2>
          <p className="text-gray-500 text-sm mt-1">Coordinate property visits</p>
        </Link>
        <Link href="/admin/requirements" className="content-card p-5 transition hover:-translate-y-1 hover:shadow-lg">
          <h2 className="font-bold text-gray-800">Requirements</h2>
          <p className="text-gray-500 text-sm mt-1">Finder requirements</p>
        </Link>
      </div>
    </div>
  )
}
