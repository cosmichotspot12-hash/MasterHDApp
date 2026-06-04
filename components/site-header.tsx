'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/rent', label: 'Rentals' },
  { href: '/sale', label: 'Buy' },
  { href: '/find', label: 'Find my home' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

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
      <style>{`
        :root {
          --sh-height: 88px;
        }

        .sh-root {
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid #EAD4C8;
          background: #FFF4E6;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
        }

        .sh-inner {
          max-width: 1320px;
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

        .sh-brand-mark {
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          overflow: hidden;
          border: 1px solid rgba(24,18,14,0.08);
          border-radius: 14px;
        }

        .sh-brand-name {
          color: #18120E;
          font-size: 23px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0;
          white-space: nowrap;
        }

        .sh-brand-name span {
          color: #C2440E;
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
          color: #7A6E68;
          font-size: 16px;
          font-weight: 750;
          text-decoration: none;
          transition: color 0.12s, background 0.12s;
          white-space: nowrap;
        }

        .sh-nav-link:hover {
          background: #FFF9F1;
          color: #18120E;
        }

        .sh-nav-link-active {
          background: #FFF0E2 !important;
          color: #C2440E !important;
        }

        .sh-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
        }

        .sh-btn-ghost,
        .sh-btn-primary {
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

        .sh-btn-ghost {
          border: 1.5px solid #DCC8B6;
          background: rgba(255,255,255,0.42);
          color: #3A2E28;
        }

        .sh-btn-ghost:hover {
          border-color: #C2440E;
          background: #FFF0E2;
          color: #C2440E;
        }

        .sh-btn-primary {
          border: 1.5px solid #7A3A18;
          background: #7A3A18;
          color: #fff;
        }

        .sh-btn-primary:hover {
          border-color: #C2440E;
          background: #C2440E;
        }

        .sh-hamburger {
          width: 50px;
          height: 50px;
          display: none;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          border: 1.5px solid #DCC8B6;
          border-radius: 12px;
          background: rgba(255,255,255,0.5);
          color: #18120E;
          cursor: pointer;
          transition: border-color 0.12s, background 0.12s, color 0.12s;
        }

        .sh-hamburger:hover {
          border-color: #C2440E;
          background: #FFF0E2;
          color: #C2440E;
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
          border-top: 1px solid #EAD4C8;
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
          color: #C2440E;
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
          border: 1.5px solid #D4CEC8;
          color: #3A2E28;
          transition: border-color 0.12s, background 0.12s, color 0.12s;
        }

        .sh-drawer-btn-ghost:hover {
          border-color: #C2440E;
          background: #FFF0E2;
          color: #C2440E;
        }

        .sh-drawer-btn-primary {
          background: #7A3A18;
          color: #fff;
          transition: background 0.12s;
        }

        .sh-drawer-btn-primary:hover {
          background: #C2440E;
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
            --sh-height: 76px;
          }

          .sh-inner {
            padding: 0 14px;
            gap: 14px;
          }

          .sh-brand {
            gap: 10px;
          }

          .sh-brand-mark {
            width: 46px;
            height: 46px;
            border-radius: 11px;
          }

          .sh-brand-name {
            font-size: 18px;
          }

          .sh-brand-sub {
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 11.5px;
          }

          .sh-hamburger {
            width: 46px;
            height: 46px;
          }

          .sh-drawer {
            padding: 12px 18px 28px;
          }

          .sh-drawer-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="sh-root">
        <div className="sh-inner">
          <Link href="/" onClick={close} className="sh-brand" aria-label="Hubli Dharwad App home">
            <div className="sh-brand-mark">
              <Image src="/icons/icon-192.png" alt="" width={56} height={56} priority />
            </div>
            <div>
              <span className="sh-brand-name">
                Hubli<span>Dharwad</span>.app
              </span>
              <span className="sh-brand-sub">Verified homes · Zero brokerage</span>
            </div>
          </Link>

          <nav className="sh-nav" aria-label="Primary navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`sh-nav-link ${pathname === href ? 'sh-nav-link-active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="sh-actions">
            <Link href="/find" className="sh-btn-ghost">
              Share my need
            </Link>
            <Link href="/list" className="sh-btn-primary">
              List a property
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
                className={`sh-drawer-link ${pathname === href ? 'sh-drawer-link-active' : ''}`}
              >
                {label}
                <span className="sh-drawer-link-arrow" aria-hidden="true">›</span>
              </Link>
            ))}
          </nav>

          <div className="sh-drawer-actions">
            <Link href="/find" onClick={close} className="sh-drawer-btn-ghost">
              Share my need
            </Link>
            <Link href="/list" onClick={close} className="sh-drawer-btn-primary">
              List a property
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
