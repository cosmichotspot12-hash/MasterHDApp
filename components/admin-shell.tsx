'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/listings', label: 'Properties' },
  { href: '/admin/listings/new', label: 'Add listing' },
  { href: '/admin/owner-submissions', label: 'Owner leads' },
  { href: '/admin/visit-requests', label: 'Visit requests' },
  { href: '/admin/requirements', label: 'Requirements' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)
  const isActive = (href: string) => pathname === href || (href !== '/admin' && pathname.startsWith(href + '/'))

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (pathname === '/admin/login') return children

  return (
    <div className="page-shell min-h-screen">
      <div className="site-container py-5 md:py-8">
        <div className="mb-5 flex items-center gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Admin workspace</p>
            <h1 className="mt-1 text-xl font-bold text-slate-950">Property operations</h1>
          </div>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Link href="/admin/listings/new" className="inline-flex rounded-md border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700">
              Add listing
            </Link>
            <a href="/api/admin/logout" className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Log out
            </a>
          </div>
          <button
            type="button"
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 md:hidden"
            aria-label={open ? 'Close admin menu' : 'Open admin menu'}
            aria-expanded={open}
            aria-controls="admin-mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        <nav className="mb-6 hidden gap-2 overflow-x-auto pb-2 md:flex" aria-label="Admin navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-md border px-3 py-2 text-xs font-semibold ${isActive(link.href) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {open && (
          <div id="admin-mobile-menu" className="mb-6 rounded-md border border-slate-200 bg-white p-2 md:hidden">
            <nav className="grid gap-1" aria-label="Admin mobile navigation">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className={`rounded-md px-3 py-3 text-sm font-semibold ${isActive(link.href) ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'}`}
                >
                  {link.label}
                </Link>
              ))}
              <a href="/api/admin/logout" className="mt-1 rounded-md border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Log out
              </a>
            </nav>
          </div>
        )}

        <main className="admin-workspace">{children}</main>
      </div>
    </div>
  )
}
