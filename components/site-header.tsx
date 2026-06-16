'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSiteLanguage, setSiteLanguage } from '@/components/language-provider'

const navLinks = [
  { href: '/properties?type=rent', label: 'Rent' },
  { href: '/properties?type=sale', label: 'Buy' },
  { href: '/properties?type=lease', label: 'Lease' },
  { href: '/services', label: 'Services' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const currentType = searchParams.get('type')
  const [language, setLanguage] = useState<'en' | 'kn'>(() => getSiteLanguage() as 'en' | 'kn')
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

  function changeLanguage(lang: 'en' | 'kn') {
    setLanguage(lang)
    setSiteLanguage(lang)
    window.setTimeout(() => setSiteLanguage(lang), 0)
  }

  return (
    <>
      <style>{`
        :root {
          --sh-height: 70px;
        }

        .sh-root {
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(216,201,186,0.82);
          background: rgba(255,244,230,0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
        }

        .sh-inner {
          max-width: 1520px;
          min-height: 70px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 34px;
        }

        .sh-brand {
          min-width: 0;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          color: inherit;
          text-decoration: none;
        }

        .sh-brand-copy {
          min-width: 0;
          border-left: 3px solid #A95424;
          padding-left: 13px;
        }

        .sh-brand-dot {
          color: #A95424;
          font-weight: 950;
        }

        .sh-brand-name {
          color: #111827;
          font-size: 25px;
          font-weight: 950;
          line-height: 1;
          letter-spacing: 0;
          white-space: nowrap;
          text-shadow: 0 1px 0 rgba(255,255,255,0.8);
        }

        .sh-brand-name span {
          color: #111827;
        }

        .sh-brand-sub {
          display: block;
          margin-top: 6px;
          color: #6B5F58;
          font-size: 12px;
          font-weight: 750;
          letter-spacing: 0;
          white-space: nowrap;
        }

        .sh-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
        }

        .sh-nav-link {
          border: 1px solid transparent;
          border-radius: 999px;
          padding: 10px 15px;
          color: #334155;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          transition: border-color 0.12s, color 0.12s, background 0.12s;
          white-space: nowrap;
        }

        .sh-nav-link:hover {
          border-color: rgba(216,201,186,0.78);
          background: rgba(255,255,255,0.62);
          color: #111827;
        }

        .sh-nav-link-active {
          border-color: #D8C9BA !important;
          background: #FFFFFF !important;
          color: #111827 !important;
        }

        .sh-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sh-language {
          display: inline-grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          border: 1px solid #D8C9BA;
          border-radius: 999px;
          background: rgba(255,255,255,0.58);
          padding: 3px;
        }

        .sh-language button {
          min-height: 34px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          padding: 6px 10px;
          color: #6B5F58;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
        }

        .sh-language button[aria-pressed="true"] {
          background: #111827;
          color: #fff;
        }

        .sh-btn-primary,
        .sh-btn-secondary {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 11px 18px;
          font-size: 14px;
          font-weight: 850;
          text-decoration: none;
          transition: border-color 0.12s, background 0.12s, color 0.12s;
          white-space: nowrap;
        }

        .sh-btn-primary {
          border: 1px solid #111827;
          background: #111827;
          color: #FFFFFF;
          box-shadow: 0 10px 24px rgba(17,24,39,0.14);
        }

        .sh-btn-primary:hover {
          border-color: #2C3441;
          background: #2C3441;
          color: #FFFFFF;
        }

        .sh-btn-secondary {
          min-height: 44px;
          border: 1px solid #D8C9BA;
          background: rgba(255,255,255,0.62);
          color: #33251C;
        }

        .sh-btn-secondary:hover {
          border-color: #C1AD99;
          background: #fff;
          color: #111827;
        }

        .sh-hamburger {
          width: 50px;
          height: 50px;
          display: none;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          border: 1px solid rgba(15,23,42,0.1);
          border-radius: 14px;
          background: rgba(255,255,255,0.72);
          color: #18120E;
          cursor: pointer;
          transition: border-color 0.12s, background 0.12s, color 0.12s;
        }

        .sh-hamburger:hover {
          border-color: #94A3B8;
          background: #fff;
          color: #111827;
        }

        .sh-drawer {
          position: fixed;
          top: var(--sh-height);
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 99;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          border-top: 1px solid #E3E8EF;
          background: rgba(255,244,230,0.98);
          padding: 18px 28px 32px;
          animation: sh-slide-in 0.2s ease;
        }

        @keyframes sh-slide-in {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sh-drawer-link {
          min-height: 54px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #F0EBE5;
          color: #18120E;
          font-size: 18px;
          font-weight: 850;
          text-decoration: none;
          transition: color 0.12s;
        }

        .sh-drawer-link:hover,
        .sh-drawer-link-active {
          color: #111827;
        }

        .sh-drawer-link-arrow {
          margin-left: auto;
          color: #B0A89F;
          font-size: 22px;
        }

        .sh-drawer-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 30px;
        }

        .sh-drawer-btn-ghost,
        .sh-drawer-btn-primary {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          padding: 13px 18px;
          font-size: 15px;
          font-weight: 750;
          text-align: center;
          text-decoration: none;
        }

        .sh-drawer-btn-ghost {
          border: 1px solid #111827;
          background: #111827;
          color: #FFFFFF;
          box-shadow: 0 8px 22px rgba(17,24,39,0.14);
          transition: border-color 0.12s, background 0.12s, color 0.12s;
        }

        .sh-drawer-btn-ghost:hover {
          border-color: #2C3441;
          background: #2C3441;
          color: #FFFFFF;
        }

        .sh-drawer-btn-primary {
          border: 1px solid #D8C9BA;
          border-radius: 10px;
          background: rgba(255,255,255,0.7);
          color: #33251C;
          transition: border-color 0.12s, background 0.12s, color 0.12s;
        }

        .sh-drawer-btn-primary:hover {
          border-color: #C1AD99;
          background: #fff;
          color: #111827;
        }

        .sh-sticky-actions {
          display: none;
        }

        .sh-sticky-actions {
          position: fixed;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 90;
          border-top: 1px solid #D8C9BA;
          background: rgba(255,244,230,0.94);
          padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
          box-shadow: 0 -10px 26px rgba(58,46,40,0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .sh-sticky-inner {
          display: grid;
          grid-template-columns: 1fr 0.82fr;
          gap: 10px;
          max-width: 440px;
          margin: 0 auto;
        }

        .sh-sticky-primary,
        .sh-sticky-secondary {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          font-weight: 900;
          text-align: center;
          text-decoration: none;
          white-space: nowrap;
        }

        .sh-sticky-primary {
          border: 1px solid #111827;
          background: #111827;
          color: #FFFFFF;
          box-shadow: 0 8px 20px rgba(17,24,39,0.18);
        }

        .sh-sticky-secondary {
          border: 1px solid #D8C9BA;
          background: rgba(255,255,255,0.68);
          color: #33251C;
        }

        @media (max-width: 980px) {
          .sh-nav,
          .sh-actions {
            display: none;
          }

          .sh-language {
            margin-left: auto;
          }

          .sh-hamburger {
            display: flex;
          }
        }

        @media (max-width: 640px) {
          :root {
            --sh-height: 70px;
          }

          .sh-inner {
            position: relative;
            min-height: 70px;
            padding: 0 12px;
            gap: 12px;
            justify-content: space-between;
          }

          .sh-brand {
            position: static;
            max-width: none;
            transform: none;
            justify-content: flex-start;
          }

          .sh-brand-copy {
            position: static;
            max-width: calc(100vw - 184px);
            transform: none;
            text-align: left;
            border-left-width: 2px;
            padding-left: 10px;
          }

          .sh-brand-name {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 20px;
            line-height: 1.05;
          }

          .sh-brand-sub {
            display: block;
            margin-top: 4px;
            max-width: none;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #6B5F58;
            font-size: 11.5px;
            font-weight: 650;
            line-height: 1.15;
            text-transform: none;
          }

          .sh-hamburger {
            position: relative;
            z-index: 2;
            width: 50px;
            height: 50px;
            margin-left: 0;
            border-radius: 14px;
            background: #fff;
          }

          .sh-drawer {
            padding: 12px 18px 28px;
          }

          .sh-drawer-actions {
            grid-template-columns: 1fr;
          }

          .sh-sticky-actions {
            display: block;
          }
        }
      `}</style>

      <header className="sh-root">
        <div className="sh-inner">
          <Link href="/" onClick={close} className="sh-brand" aria-label="Hubli Dharwad App home">
            <div className="sh-brand-copy">
              <span className="sh-brand-name">
                Hubli<span>Dharwad</span><span className="sh-brand-dot">.app</span>
              </span>
              <span className="sh-brand-sub" data-i18n="nav_verified_support">Verified properties, local support</span>
            </div>
          </Link>

          <nav className="sh-nav" aria-label="Primary navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`sh-nav-link ${isActive(href) ? 'sh-nav-link-active' : ''}`}
                data-i18n={label === 'Rent' ? 'nav_rent' : label === 'Buy' ? 'nav_buy' : label === 'Lease' ? 'nav_lease' : 'nav_services'}
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

          <div className="sh-language" aria-label="Language" style={{display:'none'}}>
            <button type="button" aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>
              EN
            </button>
            <button type="button" aria-pressed={language === 'kn'} onClick={() => changeLanguage('kn')}>
              ಕನ್ನಡ
            </button>
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
                data-i18n={label === 'Rent' ? 'nav_rent' : label === 'Buy' ? 'nav_buy' : label === 'Lease' ? 'nav_lease' : 'nav_services'}
              >
                {label}
                <span className="sh-drawer-link-arrow" aria-hidden="true">&gt;</span>
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
