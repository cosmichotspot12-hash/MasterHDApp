'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/listings', label: 'Listings' },
  { href: '/admin/owner-submissions', label: 'Owner leads' },
  { href: '/admin/visit-requests', label: 'Visit requests' },
  { href: '/admin/requirements', label: 'Requirements' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') return children

  return (
    <div className="page-shell">
      <div className="site-container py-8">
        <div className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Admin workspace</p>
            <h1 className="mt-1 text-xl font-bold text-slate-950">Property operations</h1>
          </div>
          <a href="/api/admin/logout" className="inline-flex w-fit rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Log out</a>
        </div>
        <nav className="mb-6 flex gap-2 overflow-x-auto pb-2" aria-label="Admin navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className={`shrink-0 rounded-md border px-3 py-2 text-xs font-semibold ${pathname === link.href ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}>{link.label}</Link>)}
        </nav>
        <main className="admin-workspace">{children}</main>
      </div>
    </div>
  )
}
