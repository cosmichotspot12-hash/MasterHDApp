'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/properties?type=rent', label: 'Rent' },
  { href: '/properties?type=sale', label: 'Buy' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [currentType, setCurrentType] = useState<string | null>(null)
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

  useEffect(() => {
    setCurrentType(new URLSearchParams(window.location.search).get('type'))
  })

  return (
    <>
      <style>{`
        :root {
          --sh-height: 88px;
        }

        .sh-root {
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid #E3E8EF;
          background: #FFF4E6;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
        }

        .sh-eyebrow {
          display: none;
        }

        .sh-inner {
          max-width: 1520px;
          min-height: var(--sh-height);
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 42px;
        }

        .sh-brand {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
          color: inherit;
          text-decoration: none;
        }

        .sh-brand-copy {
          min-width: 0;
        }

        .sh-brand-dot {
          color: #1D9E75;
          font-weight: 950;
        }

        .sh-brand-mark {
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          overflow: hidden;
          border: 1px solid rgba(24,18,14,0.08);
          border-radius: 14px;
        }

        .sh-brand-name {
          color: #111827;
          font-size: 24px;
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
          margin-top: 5px;
          color: #7A6E68;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0;
          white-space: nowrap;
        }

        .sh-nav {
          display: flex;
          flex: 1;
          align-items: center;
          gap: 6px;
        }

        .sh-nav-link {
          border-radius: 10px;
          padding: 12px 17px;
          color: #334155;
          font-size: 16px;
          font-weight: 800;
          text-decoration: none;
          transition: color 0.12s, background 0.12s;
          white-space: nowrap;
        }

        .sh-nav-link:hover {
          background: rgba(255,255,255,0.62);
          color: #111827;
        }

        .sh-nav-link-active {
          background: #FFFFFF !important;
          color: #111827 !important;
          box-shadow: inset 0 0 0 1px #D7DDE5;
        }

        .sh-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
        }

        .sh-btn-primary,
        .sh-btn-secondary {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          padding: 12px 21px;
          font-size: 15px;
          font-weight: 850;
          text-decoration: none;
          transition: border-color 0.12s, background 0.12s, color 0.12s;
          white-space: nowrap;
        }

        .sh-btn-primary {
          border: 1px solid #1D9E75;
          background: #1D9E75;
          color: #FFFFFF;
          box-shadow: 0 8px 22px rgba(29,158,117,0.18);
        }

        .sh-btn-primary:hover {
          border-color: #168662;
          background: #168662;
          color: #FFFFFF;
        }

        .sh-btn-secondary {
          min-height: 34px;
          border: 1px solid #1D9E75;
          border-radius: 20px;
          background: transparent;
          padding: 5px 14px;
          color: #085041;
          font-size: 13px;
        }

        .sh-btn-secondary:hover {
          border-color: #168662;
          background: #F2FBF7;
          color: #064338;
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
          border-radius: 12px;
          background: rgba(255,255,255,0.62);
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
          background: #FFF4E6;
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
          min-height: 58px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #F0EBE5;
          color: #18120E;
          font-size: 20px;
          font-weight: 750;
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
          border: 1px solid #1D9E75;
          background: #1D9E75;
          color: #FFFFFF;
          box-shadow: 0 8px 22px rgba(29,158,117,0.16);
          transition: border-color 0.12s, background 0.12s, color 0.12s;
        }

        .sh-drawer-btn-ghost:hover {
          border-color: #168662;
          background: #168662;
          color: #FFFFFF;
        }

        .sh-drawer-btn-primary {
          border: 1px solid #1D9E75;
          border-radius: 20px;
          background: transparent;
          color: #085041;
          transition: border-color 0.12s, background 0.12s, color 0.12s;
        }

        .sh-drawer-btn-primary:hover {
          border-color: #168662;
          background: #F2FBF7;
          color: #064338;
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
          border: 1px solid #1D9E75;
          background: #1D9E75;
          color: #FFFFFF;
          box-shadow: 0 8px 20px rgba(29,158,117,0.22);
        }

        .sh-sticky-secondary {
          border: 1px solid #1D9E75;
          background: rgba(255,255,255,0.68);
          color: #085041;
        }

        @media (max-width: 980px) {
          .sh-nav,
          .sh-actions {
            display: none;
          }

          .sh-hamburger {
            display: flex;
          }
        }

        @media (max-width: 640px) {
          :root {
            --sh-height: 154px;
          }

          .sh-eyebrow {
            min-height: 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #D8C9BA;
            padding: 9px 18px;
            color: #9F4A22;
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 14px;
            font-weight: 700;
            line-height: 1.35;
            text-align: center;
          }

          .sh-inner {
            position: relative;
            min-height: 100px;
            padding: 0 12px;
            gap: 12px;
            justify-content: space-between;
          }

          .sh-brand {
            position: static;
            max-width: none;
            transform: none;
            justify-content: flex-start;
            gap: 14px;
          }

          .sh-brand-mark {
            position: static;
            width: 58px;
            height: 58px;
            border-radius: 4px;
            background: #fff;
            box-shadow: 0 1px 8px rgba(58,46,40,0.07);
          }

          .sh-brand-copy {
            position: static;
            max-width: calc(100vw - 142px);
            transform: none;
            text-align: left;
          }

          .sh-brand-name {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 21px;
            line-height: 1.05;
          }

          .sh-brand-sub {
            display: block;
            margin-top: 5px;
            max-width: none;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #6B5F58;
            font-size: 13px;
            font-weight: 650;
            line-height: 1.15;
            text-transform: none;
          }

          .sh-hamburger {
            position: relative;
            z-index: 2;
            width: 50px;
            height: 50px;
            margin-left: auto;
            border-radius: 12px;
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
        <div className="sh-eyebrow">
          Verified property support for Hubballi-Dharwad homes
        </div>
        <div className="sh-inner">
          <Link href="/" onClick={close} className="sh-brand" aria-label="Hubli Dharwad App home">
            <div className="sh-brand-mark">
              <Image src="/icons/icon-192.png" alt="" width={56} height={56} priority />
            </div>
            <div className="sh-brand-copy">
              <span className="sh-brand-name">
                Hubli<span>Dharwad</span><span className="sh-brand-dot">.app</span>
              </span>
              <span className="sh-brand-sub">Verified properties, local support</span>
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
            <Link href="/find" className="sh-btn-primary">
              Post requirement
            </Link>
            <Link href="/list" className="sh-btn-secondary">
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
                <span className="sh-drawer-link-arrow" aria-hidden="true">&gt;</span>
              </Link>
            ))}
          </nav>

          <div className="sh-drawer-actions">
            <Link href="/find" onClick={close} className="sh-drawer-btn-ghost">
              Post requirement
            </Link>
            <Link href="/list" onClick={close} className="sh-drawer-btn-primary">
              List property
            </Link>
          </div>
        </div>
      )}

      {!hideStickyActions && !open && (
        <div className="sh-sticky-actions" aria-label="Quick actions">
          <div className="sh-sticky-inner">
            <Link href="/find" className="sh-sticky-primary">
              Post requirement
            </Link>
            <Link href="/list" className="sh-sticky-secondary">
              List property
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
