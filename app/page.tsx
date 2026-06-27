import type { Metadata } from 'next'
import Link from 'next/link'
import DemandBar from '@/components/demand-bar'
import PropertyCard, { PropertyCardStyles } from '@/components/property-card'
import { getPublicListings } from '@/lib/listings-data'
import { getPublicDemandSummary } from '@/lib/public-demand'

const HOME_PREVIEW_COUNT = 4

export const dynamic = 'force-dynamic'

async function getHomeData() {
  const [previewListings, demand] = await Promise.all([
    getPublicListings({ sort: 'recent', limit: HOME_PREVIEW_COUNT }),
    getPublicDemandSummary(),
  ])
  return { previewListings, demand }
}

function PreviewSkeleton() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#E7DED5] bg-white">
      <div className="h-[130px] animate-pulse bg-[#E7DED5] sm:h-[160px]" />
      <div className="grid gap-2 p-3">
        <span className="h-3 w-4/5 rounded bg-[#E7DED5]" />
        <span className="h-5 w-1/2 rounded bg-[#E7DED5]" />
        <span className="mt-1 h-8 rounded bg-[#E7DED5]" />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'MasterHD – Verified Properties in Hubballi-Dharwad',
  description: 'Find verified flats, houses and plots in Hubballi-Dharwad. Browse listings, post your requirement, or list your property — personally verified, locally trusted.',
  keywords: 'properties in hubli, flats for rent in hubli, house for sale in dharwad, hubli dharwad real estate',
  openGraph: {
    title: 'MasterHD – Verified Properties in Hubballi-Dharwad',
    description: 'Personally verified property listings for Hubballi-Dharwad.',
    url: 'https://www.masterhdapp.in',
    siteName: 'MasterHD',
    locale: 'en_IN',
    type: 'website',
  },
}

const LOCALITY_CHIPS = [
  'Navanagar', 'Saptapur', 'Vidyanagar', 'Kalyan Nagar',
  'Gokul Road', 'Shivaji Nagar', 'Deshpande Nagar', 'Keshwapur',
]

export default async function HomePage() {
  const { previewListings, demand } = await getHomeData()

  return (
    <>
      <PropertyCardStyles />
      <style>{`
        @keyframes hd-live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(201,95,44,0.34); }
          55% { opacity: .72; transform: scale(.86); box-shadow: 0 0 0 7px rgba(201,95,44,0); }
        }
        @keyframes hd-badge-glow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset, 0 8px 28px rgba(201,95,44,0.12); }
          50%       { box-shadow: 0 0 0 1px rgba(255,255,255,0.10) inset, 0 8px 36px rgba(201,95,44,0.26); }
        }

        /* ── shared ── */
        .hd-home-section {
          padding-left: 20px;
          padding-right: 20px;
        }
        .hd-section-kicker {
          display: inline-flex;
          width: fit-content;
          border: 1px solid #DCEBDD;
          border-radius: 999px;
          background: #F4FBF5;
          padding: 6px 10px;
          color: #14724B;
          font-size: 11px;
          font-weight: 900;
        }
        .hd-section-title {
          margin: 9px 0 0;
          color: #111827;
          font-size: 28px;
          font-weight: 950;
          line-height: 1.1;
        }
        .hd-section-copy {
          margin: 6px 0 0;
          max-width: 620px;
          color: #5B6472;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.55;
        }
        .hd-section-btn {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #111827;
          border-radius: 8px;
          background: #111827;
          padding: 9px 14px;
          color: #fff;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
        }

        /* ── hero ── */
        .hd-hero {
          padding: 56px 20px 40px;
          text-align: center;
        }
        .hd-hero-inner {
          margin: 0 auto;
          max-width: 860px;
        }
        .hd-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(201,95,44,0.28);
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(17,24,39,0.94) 0%, rgba(45,24,16,0.94) 100%);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 7px 16px 7px 7px;
          color: #F8E6D5;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          animation: hd-badge-glow 3s ease-in-out infinite;
        }
        .hd-hero-badge-dot {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 999px;
          background: #C95F2C;
          box-shadow: 0 0 6px 2px rgba(201,95,44,0.55);
          animation: hd-live-pulse 1.8s ease-in-out infinite;
        }
        .hd-hero-badge strong {
          border-radius: 999px;
          background: linear-gradient(135deg, #C95F2C 0%, #F5A623 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 950;
          letter-spacing: -0.01em;
        }
        .hd-hero-badge-sep {
          width: 1px;
          height: 12px;
          background: rgba(255,255,255,0.18);
          flex-shrink: 0;
        }
        .hd-hero-title {
          margin: 22px 0 0;
          font-size: clamp(42px, 6.5vw, 92px);
          font-weight: 950;
          line-height: 0.96;
          letter-spacing: -0.03em;
        }
        .hd-title-top {
          color: #1C1917;
        }
        .hd-title-hl {
          background: linear-gradient(135deg, #C95F2C 0%, #7A3018 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hd-hero-tagline {
          margin: 22px auto 0;
          max-width: 520px;
          color: #4A3728;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.55;
          letter-spacing: 0.005em;
        }
        .hd-hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }
        .hd-hero-btn-primary {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #111827 0%, #C95F2C 100%);
          padding: 13px 30px;
          color: #fff;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
          box-shadow: 0 8px 28px rgba(201,95,44,0.38), 0 2px 8px rgba(17,24,39,0.20);
          transition: box-shadow 0.2s, transform 0.15s;
        }
        .hd-hero-btn-primary:hover {
          box-shadow: 0 12px 36px rgba(201,95,44,0.50), 0 4px 12px rgba(17,24,39,0.24);
          transform: translateY(-1px);
        }
        .hd-hero-btn-ghost {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(201,95,44,0.28);
          border-radius: 999px;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 13px 30px;
          color: #1C1917;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(201,95,44,0.10), inset 0 1px 0 rgba(255,255,255,0.8);
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .hd-hero-btn-ghost:hover {
          border-color: rgba(201,95,44,0.48);
          background: rgba(255,255,255,0.80);
          box-shadow: 0 6px 20px rgba(201,95,44,0.16), inset 0 1px 0 rgba(255,255,255,0.9);
          transform: translateY(-1px);
        }

        /* ── demand bar ── */
        /* ── demand bar ── */
        .hd-demand-bar {
          display: block;
          margin: 32px auto 0;
          max-width: 380px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(201,95,44,0.20) 0%, transparent 55%),
            linear-gradient(160deg, #0F1623 0%, #1E0E06 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 14px 18px 14px;
          text-decoration: none;
          color: #fff;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 16px 52px rgba(17,24,39,0.32),
            0 0 80px rgba(201,95,44,0.07);
          transition: box-shadow 0.25s, border-color 0.25s;
        }
        .hd-demand-bar:hover {
          border-color: rgba(201,95,44,0.20);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 20px 60px rgba(17,24,39,0.40),
            0 0 100px rgba(201,95,44,0.13);
        }
        .hd-demand-live {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #F5A623;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .09em;
          text-transform: uppercase;
        }
        .hd-demand-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 auto;
          border-radius: 999px;
          background: #F5A623;
          box-shadow: 0 0 8px 3px rgba(245,166,35,0.55);
          animation: hd-live-pulse 1.35s ease-in-out infinite;
        }
        .hd-demand-count {
          display: block;
          margin-top: 8px;
          color: #fff;
          font-size: clamp(38px, 7vw, 52px);
          font-weight: 950;
          line-height: 1;
          letter-spacing: -0.04em;
        }
        .hd-demand-plus {
          background: linear-gradient(135deg, #C95F2C 0%, #F5A623 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 0.5em;
          margin-left: 4px;
          vertical-align: super;
        }
        .hd-demand-label {
          display: block;
          margin-top: 8px;
          color: rgba(255,255,255,0.42);
          font-size: 14px;
          font-weight: 700;
          line-height: 1.4;
          letter-spacing: 0.01em;
        }
        .hd-demand-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 7px;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .hd-demand-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          padding: 6px 14px;
          color: rgba(255,255,255,0.60);
          font-size: 11.5px;
          font-weight: 800;
        }
        .hd-demand-pill::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: #F5A623;
          opacity: 0.75;
          flex-shrink: 0;
        }
        .hd-demand-action {
          display: inline-flex;
          min-height: 36px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: linear-gradient(135deg, #C95F2C 0%, #F5A623 100%);
          padding: 8px 22px;
          color: #fff;
          font-size: 12px;
          font-weight: 950;
          white-space: nowrap;
          margin-top: 12px;
          box-shadow: 0 4px 20px rgba(201,95,44,0.45);
          transition: box-shadow 0.2s, transform 0.15s;
        }
        .hd-demand-action:hover {
          box-shadow: 0 8px 28px rgba(201,95,44,0.55);
          transform: translateY(-1px);
        }

        /* ── locality chips ── */
        .hd-chips-row {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          margin: 22px auto 0;
          max-width: 720px;
        }
        .hd-chip {
          flex: 0 0 auto;
          border: 1px solid rgba(17,24,39,0.10);
          border-radius: 999px;
          background: rgba(255,255,255,0.68);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 8px 16px;
          color: #334155;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(17,24,39,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
          transition: all 0.15s;
        }
        .hd-chip:nth-child(3n + 1) {
          background: linear-gradient(135deg, #111827 0%, #1E3055 100%);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 4px 16px rgba(17,24,39,0.30);
        }
        .hd-chip:nth-child(3n + 2) {
          background: linear-gradient(135deg, rgba(201,95,44,0.10) 0%, rgba(245,166,35,0.08) 100%);
          border-color: rgba(201,95,44,0.24);
          color: #9F4A22;
        }
        .hd-chip:hover {
          border-color: rgba(201,95,44,0.36);
          background: rgba(255,255,255,0.92);
          color: #111827;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(201,95,44,0.12), inset 0 1px 0 rgba(255,255,255,1);
        }

        /* ── close / cta band ── */
        .hd-close-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 0.62fr);
          gap: 14px;
        }
        .hd-need-band,
        .hd-social-band {
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          padding: 24px;
        }
        .hd-need-band {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }
        .hd-band-eyebrow {
          color: #7A6E68;
          font-size: 11px;
          font-weight: 950;
        }
        .hd-band-title {
          margin: 8px 0 0;
          color: #111827;
          font-size: 28px;
          font-weight: 950;
          line-height: 1.1;
        }
        .hd-band-copy {
          margin: 8px 0 0;
          max-width: 620px;
          color: #5B6472;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.65;
        }
        .hd-band-btn,
        .hd-band-btn-light {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
          white-space: nowrap;
        }
        .hd-band-btn {
          border: 1px solid #111827;
          background: #111827;
          color: #fff;
        }
        .hd-band-btn-light {
          border: 1px solid #E4DED6;
          background: #FFF9F1;
          color: #111827;
        }
        .hd-social-band {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
        }
        .hd-social-mark {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: linear-gradient(135deg, #F9A825 0%, #E91E8C 52%, #9C27B0 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 950;
        }

        /* ── responsive ── */
        @media (max-width: 640px) {
          .hd-home-section { padding-left: 12px; padding-right: 12px; }
          .hd-hero { padding: 40px 16px 28px; }
          .hd-hero-title { font-size: 36px; letter-spacing: -0.02em; }
          .hd-title-hl { display: inline; }
          .hd-hero-tagline { font-size: 15px; }
          .hd-hero-actions { gap: 8px; }
          .hd-hero-btn-primary,
          .hd-hero-btn-ghost { min-height: 46px; padding: 11px 22px; font-size: 13px; }
          .hd-demand-bar { max-width: 100%; border-radius: 14px; padding: 20px 18px; }
          .hd-demand-count { font-size: 52px; }
          .hd-demand-label { font-size: 13px; }
          .hd-demand-action { min-height: 38px; padding: 9px 22px; font-size: 12px; }
          .hd-chips-row { gap: 6px; }
          .hd-chip { padding: 7px 12px; font-size: 11px; }
          .hd-close-grid { grid-template-columns: 1fr; }
          .hd-need-band { align-items: stretch; flex-direction: column; padding: 18px; }
          .hd-social-band { padding: 18px; }
          .hd-band-title { font-size: 22px; }
          .hd-band-btn,
          .hd-band-btn-light { width: 100%; }
          .hd-section-title { font-size: 22px; }
        }

        @media (max-width: 359px) {
          .hd-listings-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <main className="min-h-screen bg-[#FFF4E6] text-slate-950">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="hd-hero" aria-label="Hero">
          <div className="hd-hero-inner">
            <span className="hd-hero-badge">
              <span className="hd-hero-badge-dot" aria-hidden />
              <strong>Hubballi-Dharwad</strong>
              <span className="hd-hero-badge-sep" aria-hidden />
              <span>verified local support</span>
            </span>

            <h1 className="hd-hero-title">
              <span className="hd-title-top">Hubballi-Dharwad&apos;s</span>
              <br />
              <span className="hd-title-hl">property marketplace.</span>
            </h1>

            <p className="hd-hero-tagline">
              Your next property, verified before you visit.
            </p>

            <div className="hd-hero-actions">
              <Link href="/properties" className="hd-hero-btn-primary">
                Browse properties
              </Link>
              <Link href="/find" className="hd-hero-btn-ghost">
                Post requirement
              </Link>
            </div>

            <DemandBar
              totalActive={demand.totalActive}
              rentTotal={demand.rentTotal}
              saleTotal={demand.saleTotal}
              leaseTotal={demand.leaseTotal}
            />

            <div className="hd-chips-row" aria-label="Popular localities">
              {LOCALITY_CHIPS.map((name) => (
                <Link
                  key={name}
                  href={`/properties?locality=${encodeURIComponent(name)}`}
                  className="hd-chip"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* ── LISTINGS GRID ──────────────────────────────────────────── */}
        <section className="hd-home-section pb-5 sm:pb-7" aria-label="Recent listings">
          <div className="mx-auto w-full max-w-[1520px]">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="hd-section-kicker">Recently verified</p>
                <h2 className="hd-section-title">Fresh properties you can visit.</h2>
                <p className="hd-section-copy">
                  New rent and sale listings with photos, locality, price, and visit requests in one place.
                </p>
              </div>
              <Link href="/properties" className="hd-section-btn">
                View all →
              </Link>
            </div>
            <div className="hd-listings-grid grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
              {previewListings.length > 0
                ? previewListings.map((listing) => (
                    <PropertyCard key={listing.id} listing={listing} />
                  ))
                : Array.from({ length: HOME_PREVIEW_COUNT }).map((_, i) => (
                    <PreviewSkeleton key={i} />
                  ))}
            </div>
          </div>
        </section>


        {/* ── CTA BAND ───────────────────────────────────────────────── */}
        <section className="hd-home-section py-5 sm:py-7" aria-label="Next steps">
          <div className="mx-auto w-full max-w-[1520px]">
            <div className="hd-close-grid">
              <div className="hd-need-band">
                <div>
                  <p className="hd-band-eyebrow">Can&apos;t find what you need?</p>
                  <h2 className="hd-band-title">Tell us the exact property you want.</h2>
                  <p className="hd-band-copy">
                    Share your locality, budget, BHK, and timeline. We will match your need with available and incoming properties.
                  </p>
                </div>
                <Link href="/find" className="hd-band-btn">
                  Post requirement
                </Link>
              </div>

              <div className="hd-social-band">
                <div>
                  <div className="hd-social-mark" aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="1.8"/>
                      <circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="1.8"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="#fff"/>
                    </svg>
                  </div>
                  <h2 className="hd-band-title">Watch before you visit.</h2>
                  <p className="hd-band-copy">
                    Follow local walkthroughs, updates, and new property previews across Hubballi-Dharwad.
                  </p>
                </div>
                <a
                  href="https://www.instagram.com/hublidharwad.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hd-band-btn-light"
                >
                  Follow Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
