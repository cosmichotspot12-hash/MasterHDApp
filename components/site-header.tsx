'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/properties?type=rent', label: 'Rent' },
  { href: '/properties?type=sale', label: 'Sale' },
  { href: '/properties?type=lease', label: 'Lease' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About us' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const currentType = searchParams.get('type')
  const close = () => setOpen(false)
  const hideStickyActions =
    pathname === '/find' ||
    pathname === '/list' ||
    pathname === '/visit' ||
    pathname.startsWith('/admin')

  function isActive(href: string) {
    const [path, query] = href.split('?')
    if (pathname !== path) return false
    if (!query) return true

    const params = new URLSearchParams(query)
    const targetType = params.get('type')
    return targetType ? currentType === targetType : true
  }

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      <header className="sh-root">
        <div className="sh-inner">
          <Link href="/" onClick={close} className="sh-brand" aria-label="Hubli Dharwad App home">
            <div className="sh-brand-mark">
              <Image src="/icons/icon-192.png" alt="" width={38} height={38} />
            </div>
            <div className="sh-brand-copy">
              <span className="sh-brand-name">
                Hubli<span>Dharwad</span><span className="sh-brand-dot">.app</span>
              </span>
              <span className="sh-brand-sub" data-i18n="nav_verified_support">Verified · Local · Trusted</span>
            </div>
          </Link>

          <nav className="sh-nav" aria-label="Primary navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`sh-nav-link ${isActive(href) ? 'sh-nav-link-active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="sh-actions">
            <Link href="/find" className="sh-btn-primary" data-i18n="nav_post_requirement">
              Post requirement
            </Link>
            <Link href="/list" className="sh-btn-secondary" data-i18n="nav_list_property">
              List property
            </Link>
          </div>

          <button
            className="sh-hamburger"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {open && (
        <div id="site-mobile-navigation" className="sh-drawer" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <nav>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`sh-drawer-link ${isActive(href) ? 'sh-drawer-link-active' : ''}`}
              >
                {label}
                <svg className="sh-drawer-link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </nav>

          <div className="sh-drawer-actions">
            <Link href="/find" onClick={close} className="sh-drawer-btn-ghost" data-i18n="nav_post_requirement">
              Post requirement
            </Link>
            <Link href="/list" onClick={close} className="sh-drawer-btn-primary" data-i18n="nav_list_property">
              List property
            </Link>
          </div>
        </div>
      )}

      {!hideStickyActions && !open && (
        <div className="sh-sticky-actions" aria-label="Quick actions">
          <div className="sh-sticky-inner">
            <Link href="/find" className="sh-sticky-primary" data-i18n="nav_post_requirement">
              Post requirement
            </Link>
            <Link href="/list" className="sh-sticky-secondary" data-i18n="nav_list_property">
              List property
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
