import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-orange-500">MasterHD</h1>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium text-sm">
            Dashboard
          </Link>
          <Link href="/admin/listings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium text-sm">
            Listings
          </Link>
          <Link href="/admin/owner-submissions" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium text-sm">
            Owner Submissions
          </Link>
          <Link href="/admin/visit-requests" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium text-sm">
            Visit Requests
          </Link>
          <Link href="/admin/requirements" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium text-sm">
            Requirements
          </Link>
        </nav>

        <div className="p-4 border-t">
          <a href="/api/admin/logout" className="block w-full text-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg font-medium">
            Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}