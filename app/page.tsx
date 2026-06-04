import type { Metadata } from 'next'
import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'

type Listing = {
  id: string
  title: string
  slug: string
  listing_type: 'rent' | 'sale'
  property_category: string
  locality: string
  price: number
  bhk_count: string
  photos: string[]
  is_featured: boolean
}

const DEMAND_SIGNALS = [
  { segment: '2 BHK Rent', area: 'Vidyanagar', seekers: 38, budget: '₹8K–12K/mo', urgency: 'high' as const },
  { segment: 'Family Home Sale', area: 'Keshwapur / Gokul Rd', seekers: 21, budget: '₹40–65L', urgency: 'high' as const },
  { segment: 'Budget 1 BHK Rent', area: 'Hubli-Dharwad', seekers: 54, budget: '₹5K–8K/mo', urgency: 'medium' as const },
  { segment: 'Plot / Land', area: 'Growth localities', seekers: 17, budget: '₹15–40L', urgency: 'medium' as const },
]

const WA_ICON = (
  <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

async function getHomeData() {
  try {
    const res = await fetch(APP_URL + '/api/listings', { cache: 'no-store' })
    const json = await res.json()
    const listings: Listing[] = json.data || []
    return {
      all: listings,
      rent: listings.filter((l) => l.listing_type === 'rent'),
      sale: listings.filter((l) => l.listing_type === 'sale'),
    }
  } catch {
    return { all: [] as Listing[], rent: [] as Listing[], sale: [] as Listing[] }
  }
}

function formatPrice(listing: Listing) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(listing.price)
}

function ListingCard({ listing }: { listing: Listing }) {
  const isRent = listing.listing_type === 'rent'
  return (
    <article className="lc">
      <Link href={'/property/' + listing.slug} className="lc-link">
        <div className="lc-photo">
          {listing.photos?.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.photos[0]}
              alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div className="lc-photo-empty">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
              </svg>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="lc-overlay" />

          {/* Top badges */}
          <div className="lc-top-left">
            <span className={`lc-badge lc-badge-${isRent ? 'rent' : 'sale'}`}>
              {isRent ? 'Rent' : 'Sale'}
            </span>
            {listing.is_featured && <span className="lc-badge lc-badge-featured">Featured</span>}
          </div>

          {listing.bhk_count && (
            <span className="lc-bhk">{listing.bhk_count} BHK</span>
          )}

          {/* Locality on photo */}
          <div className="lc-locality">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            {listing.locality}
          </div>
        </div>

        <div className="lc-body">
          <p className="lc-title">{listing.title}</p>
          <p className="lc-price">
            {formatPrice(listing)}
            {isRent && <span className="lc-price-unit">/mo</span>}
          </p>
        </div>
      </Link>

      {/* WhatsApp CTA — separate from the link */}
      <div className="lc-footer">
        <a
          href={whatsappLink(`Hi, I'm interested in: ${listing.title} in ${listing.locality}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="lc-wa-btn"
        >
          {WA_ICON}
          Enquire on WhatsApp
        </a>
      </div>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className="lc lc-skeleton">
      <div className="lc-photo sk-block" />
      <div className="lc-body">
        <div className="sk-line" style={{ width: '70%', height: 14, marginBottom: 10 }} />
        <div className="sk-line" style={{ width: '40%', height: 18 }} />
      </div>
      <div className="lc-footer">
        <div className="sk-line" style={{ width: '60%', height: 32, borderRadius: 8 }} />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Hubli Dharwad App — Verified Properties in Hubballi',
  description: 'Find verified flats, houses and plots in Hubballi. Matched with real local demand, video tours, and WhatsApp support.',
  keywords: 'properties in hubli, flats for rent in hubli, house for sale in dharwad, hubli dharwad real estate',
  openGraph: {
    title: 'Hubli Dharwad App — Verified Properties in Hubballi',
    description: 'Verified property matching for Hubli-Dharwad.',
    url: 'https://www.masterhdapp.in',
    siteName: 'Hubli Dharwad App',
    locale: 'en_IN',
    type: 'website',
  },
}

export default async function HomePage() {
  const { all, rent, sale } = await getHomeData()

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --brand:       #C2440E;
          --brand-mid:   #D85A30;
          --brand-bg:    #FEF3EC;
          --ink:         #18120E;
          --ink-2:       #3A2E28;
          --ink-3:       #7A6E68;
          --ink-4:       #B0A89F;
          --surface:     #FFF4E6;
          --card-bg:     #FFFFFF;
          --line:        #EAE4DE;
          --line-dark:   #D4CEC8;
          --wa-green:    #25D366;
          --radius-md:   10px;
          --radius-lg:   16px;
          --container:   1320px;
          --gutter:      20px;
          font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
        }

        .wrap { max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter); }

        /* ══ TOP BAR ══════════════════════════════════ */
        .top-bar {
          background: var(--surface);
          border-bottom: 1px solid var(--line);
          padding: 18px var(--gutter);
          max-width: 100%;
        }
        .top-bar-inner {
          max-width: var(--container); margin: 0 auto;
          display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
          flex-wrap: wrap;
        }
        .top-tagline {
          font-size: 14px; font-weight: 600; color: #5A5550;
        }
        .top-tagline strong { color: #7A3A18; font-weight: 850; }

        /* Filter tabs */
        .filter-tabs {
          display: flex; gap: 6px; align-items: center;
        }
        .filter-tab {
          font-size: 13px; font-weight: 600;
          padding: 7px 18px; border-radius: 20px;
          border: 1.5px solid #D4B79D;
          text-decoration: none; color: #5A5550;
          transition: all 0.12s; white-space: nowrap;
          background: rgba(255,255,255,0.34);
        }
        .filter-tab:hover { border-color: #7A3A18; color: #7A3A18; background: #fff; }
        .filter-tab-active {
          background: #7A3A18; color: #fff;
          border-color: #7A3A18;
        }
        .filter-tab-rent-active {
          background: #1A4FCC; color: #fff; border-color: #1A4FCC;
        }
        .filter-tab-sale-active {
          background: #148040; color: #fff; border-color: #148040;
        }

        /* ══ LISTINGS GRID ════════════════════════════ */
        .listings-section {
          padding: 32px 0 48px;
          background: var(--surface);
        }
        .listings-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* ══ LISTING CARD ═════════════════════════════ */
        .lc {
          background: var(--card-bg);
          border: 1.5px solid var(--line);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 1px 3px rgba(24,18,14,0.06);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s;
        }
        .lc:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 32px rgba(24,18,14,0.11);
          border-color: var(--line-dark);
        }
        .lc-link { text-decoration: none; display: flex; flex-direction: column; flex: 1; }

        .lc-photo {
          position: relative; aspect-ratio: 4/3;
          background: var(--surface); overflow: hidden; flex-shrink: 0;
        }
        .lc-photo img { transition: transform 0.35s ease; }
        .lc:hover .lc-photo img { transform: scale(1.05); }

        .lc-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(24,18,14,0.65) 0%, transparent 55%);
          pointer-events: none;
        }
        .lc-photo-empty {
          display: flex; align-items: center; justify-content: center;
          height: 100%; color: var(--ink-4);
        }

        .lc-top-left {
          position: absolute; top: 10px; left: 10px;
          display: flex; gap: 5px;
        }
        .lc-badge {
          font-size: 10px; font-weight: 700;
          padding: 3px 9px; border-radius: 5px;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .lc-badge-rent     { background: #1A4FCC; color: #fff; }
        .lc-badge-sale     { background: #148040; color: #fff; }
        .lc-badge-featured { background: var(--brand); color: #fff; }

        .lc-bhk {
          position: absolute; top: 10px; right: 10px;
          font-size: 11px; font-weight: 700; color: #fff;
          background: rgba(0,0,0,0.42); padding: 3px 9px;
          border-radius: 5px; backdrop-filter: blur(4px);
        }
        .lc-locality {
          position: absolute; bottom: 10px; left: 10px;
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; font-weight: 600; color: #fff;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        .lc-body {
          padding: 14px 16px 12px;
          display: flex; flex-direction: column; gap: 6px; flex: 1;
        }
        .lc-title {
          font-size: 14px; font-weight: 500; color: var(--ink-2);
          line-height: 1.45;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .lc-price {
          font-size: 20px; font-weight: 700; color: var(--ink);
          letter-spacing: -0.03em;
        }
        .lc-price-unit {
          font-size: 13px; font-weight: 400;
          color: var(--ink-3); margin-left: 2px;
        }

        .lc-footer {
          padding: 0 12px 12px;
        }
        .lc-wa-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          width: 100%; padding: 9px 0;
          background: var(--wa-green); color: #fff;
          font-size: 13px; font-weight: 700;
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: background 0.12s;
        }
        .lc-wa-btn:hover { background: #1EB85A; }

        /* ══ SKELETON ══════════════════════════════════ */
        .lc-skeleton { pointer-events: none; }
        .sk-block, .sk-line {
          background: linear-gradient(90deg, var(--line) 25%, var(--surface) 50%, var(--line) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 4px;
        }
        .sk-block { aspect-ratio: 4/3; border-radius: 0; }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ══ EMPTY STATE ══════════════════════════════ */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center; padding: 72px 24px;
          border: 2px dashed var(--line); border-radius: var(--radius-lg);
        }
        .empty-state h3 { font-size: 17px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
        .empty-state p  { font-size: 14px; color: var(--ink-3); margin-bottom: 24px; }
        .btn-wa {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 20px; border-radius: var(--radius-md);
          background: var(--wa-green); color: #fff;
          font-size: 14px; font-weight: 700;
          text-decoration: none; transition: background 0.12s;
        }
        .btn-wa:hover { background: #1EB85A; }

        /* ══ DEMAND SECTION ═══════════════════════════ */
        .demand-section {
          background: var(--surface);
          padding: 64px 0;
          border-top: 1px solid var(--line);
        }
        .demand-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 24px; flex-wrap: wrap; margin-bottom: 36px;
        }
        .demand-eyebrow {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--brand);
          display: flex; align-items: center; gap: 7px; margin-bottom: 10px;
        }
        .demand-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
        .demand-title {
          font-size: clamp(22px, 3vw, 32px); font-weight: 700;
          color: var(--ink); letter-spacing: -0.02em; line-height: 1.2;
          margin-bottom: 8px;
        }
        .demand-sub { font-size: 14px; color: var(--ink-3); max-width: 440px; line-height: 1.65; }
        .demand-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn-white {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 18px; border-radius: var(--radius-md);
          background: var(--brand); color: #fff;
          font-size: 13px; font-weight: 700;
          text-decoration: none; border: 1.5px solid var(--brand);
          transition: background 0.12s, border-color 0.12s;
        }
        .btn-white:hover { background: var(--brand-mid); border-color: var(--brand-mid); }
        .btn-wa-sm {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 18px; border-radius: var(--radius-md);
          background: var(--wa-green); color: #fff;
          font-size: 13px; font-weight: 700;
          text-decoration: none; transition: background 0.12s;
        }
        .btn-wa-sm:hover { background: #1EB85A; }

        .demand-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
        }
        .demand-card {
          background: var(--card-bg);
          border: 1.5px solid var(--line);
          border-radius: var(--radius-lg); padding: 22px;
          display: flex; flex-direction: column;
          box-shadow: 0 1px 3px rgba(24,18,14,0.04);
          transition: border-color 0.15s, transform 0.15s;
        }
        .demand-card:hover {
          border-color: var(--line-dark);
          transform: translateY(-2px);
        }
        .demand-urgency {
          display: flex; align-items: center; gap: 7px; margin-bottom: 14px;
        }
        .demand-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .demand-dot-high   { background: #F87171; }
        .demand-dot-medium { background: #FBBF24; }
        .demand-urgency-label {
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em;
        }
        .demand-urgency-label.high   { color: #B91C1C; }
        .demand-urgency-label.medium { color: #B45309; }
        .demand-segment {
          font-size: 17px; font-weight: 700; color: var(--ink); margin-bottom: 3px;
        }
        .demand-area { font-size: 12px; color: var(--ink-3); margin-bottom: 18px; }
        .demand-bottom {
          display: flex; align-items: flex-end; justify-content: space-between;
          border-top: 1px solid var(--line);
          padding-top: 14px; margin-top: auto;
        }
        .demand-count {
          font-size: 40px; font-weight: 800; color: var(--brand);
          line-height: 1; letter-spacing: -0.04em;
        }
        .demand-count-label { font-size: 11px; color: var(--ink-3); margin-top: 3px; }
        .demand-budget { font-size: 13px; font-weight: 700; color: var(--ink); }
        .demand-budget-label { font-size: 10px; color: var(--ink-3); margin-top: 3px; text-align: right; }

        /* ══ DUAL CTA ══════════════════════════════════ */
        .cta-section {
          background: var(--surface);
          padding: 12px 0 72px;
        }
        .cta-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .cta-panel {
          padding: 36px;
          border: 1.5px solid var(--line);
          border-radius: var(--radius-lg);
          background: var(--card-bg);
          box-shadow: 0 1px 3px rgba(24,18,14,0.04);
        }
        .cta-panel:first-child { border-right: 1.5px solid var(--line); }
        .cta-panel-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--brand); margin-bottom: 12px;
        }
        .cta-panel-title {
          font-size: 22px; font-weight: 800; color: var(--ink);
          line-height: 1.25; margin-bottom: 10px; letter-spacing: -0.02em;
        }
        .cta-panel-body {
          font-size: 14px; color: var(--ink-3); line-height: 1.7; margin-bottom: 26px;
        }
        .cta-btns { display: flex; gap: 10px; flex-wrap: wrap; }

        /* ══ RESPONSIVE ════════════════════════════════ */
        @media (max-width: 900px) {
          .listings-grid  { grid-template-columns: repeat(2, 1fr); }
          .demand-grid    { grid-template-columns: repeat(2, 1fr); }
          .cta-grid       { grid-template-columns: 1fr; }
          .cta-panel:first-child { border-right: 1.5px solid var(--line); }
        }
        @media (max-width: 560px) {
          .listings-grid  { grid-template-columns: 1fr; }
          .demand-grid    { grid-template-columns: 1fr; }
          .top-bar-inner  { flex-direction: column; align-items: flex-start; }
          :root { --gutter: 12px; }
        }
      `}</style>

      <main style={{ background: 'var(--surface)' }}>

        {/* Listings toolbar */}
        <div className="top-bar">
          <div className="top-bar-inner">
            <p className="top-tagline">
              <strong>Verified properties</strong> in Hubballi-Dharwad &mdash; direct from owners, zero brokerage.
            </p>
            <div className="filter-tabs">
              <Link href="/" className="filter-tab filter-tab-active">All ({all.length})</Link>
              {rent.length > 0 && (
                <Link href="/rent" className="filter-tab">
                  Rent ({rent.length})
                </Link>
              )}
              {sale.length > 0 && (
                <Link href="/sale" className="filter-tab">
                  Buy ({sale.length})
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ══ LISTINGS ══════════════════════════════════ */}
        <section className="listings-section" aria-label="Property listings">
          <div className="wrap">
            <div className="listings-grid">
              {all.length > 0
                ? all.map((l) => <ListingCard key={l.id} listing={l} />)
                : Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              }

              {all.length === 0 && (
                <div className="empty-state">
                  <h3>Listings coming soon</h3>
                  <p>We&apos;re verifying properties right now. Share your need and we&apos;ll match you directly.</p>
                  <a
                    href={whatsappLink('Hi, I am looking for a property in Hubballi.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa"
                  >
                    {WA_ICON} Chat on WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══ DEMAND SIGNALS ════════════════════════════ */}
        <section className="demand-section" aria-label="Active property demand">
          <div className="wrap">
            <div className="demand-header">
              <div>
                <p className="demand-eyebrow">
                  <span className="demand-eyebrow-dot" />
                  For property owners
                </p>
                <h2 className="demand-title">Real seekers. Right now.</h2>
                <p className="demand-sub">
                  These are active requirements from people who reached out this month.
                  If your property fits, we connect you directly.
                </p>
              </div>
              <div className="demand-actions">
                <Link href="/list" className="btn-white">Submit my property</Link>
                <a
                  href={whatsappLink('Hi, I want to list my property in Hubballi.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa-sm"
                >
                  {WA_ICON} WhatsApp us
                </a>
              </div>
            </div>

            <div className="demand-grid">
              {DEMAND_SIGNALS.map((d) => (
                <div key={d.segment} className="demand-card">
                  <div className="demand-urgency">
                    <span className={`demand-dot demand-dot-${d.urgency}`} />
                    <span className={`demand-urgency-label ${d.urgency}`}>
                      {d.urgency === 'high' ? 'High demand' : 'Active demand'}
                    </span>
                  </div>
                  <p className="demand-segment">{d.segment}</p>
                  <p className="demand-area">{d.area}</p>
                  <div className="demand-bottom">
                    <div>
                      <p className="demand-count">{d.seekers}</p>
                      <p className="demand-count-label">seekers waiting</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="demand-budget">{d.budget}</p>
                      <p className="demand-budget-label">budget range</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ DUAL CTA ══════════════════════════════════ */}
        <section className="cta-section" aria-label="Get started">
          <div className="wrap">
            <div className="cta-grid">
              <div className="cta-panel">
                <p className="cta-panel-label">I own a property</p>
                <h3 className="cta-panel-title">List it. We&apos;ll find your tenant or buyer.</h3>
                <p className="cta-panel-body">
                  We verify, shoot a video tour, and match with seekers already in our pipeline.
                  Free to list — zero brokerage cut.
                </p>
                <div className="cta-btns">
                  <Link href="/list" className="btn-white">Submit property</Link>
                  <a
                    href={whatsappLink('Hi, I want to list my property in Hubballi.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa-sm"
                  >
                    {WA_ICON} WhatsApp
                  </a>
                </div>
              </div>
              <div className="cta-panel">
                <p className="cta-panel-label">I&apos;m looking for a property</p>
                <h3 className="cta-panel-title">Tell us what you need. We&apos;ll match you.</h3>
                <p className="cta-panel-body">
                  Share your locality, budget, and BHK once.
                  We do the legwork and connect you directly with verified owners.
                </p>
                <div className="cta-btns">
                  <Link href="/find" className="btn-white">Share my need</Link>
                  <a
                    href={whatsappLink('Hi, I am looking for a property in Hubballi. Can you help me find one?')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa-sm"
                  >
                    {WA_ICON} WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
