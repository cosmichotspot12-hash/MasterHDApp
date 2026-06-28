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


export default async function HomePage() {
  const { previewListings, demand } = await getHomeData()

  return (
    <>
      <PropertyCardStyles />
      <style>{`

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
          padding: 60px 16px 36px;
          text-align: center;
        }
        .hd-hero-inner {
          margin: 0 auto;
          max-width: 560px;
        }
        .hd-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #8B4513;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 0;
        }
        .hd-hero-eyebrow::before,
        .hd-hero-eyebrow::after {
          content: '';
          display: block;
          width: 22px;
          height: 1px;
          background: currentColor;
          opacity: 0.5;
        }
        .hd-hero-title {
          margin: 14px 0 0;
          font-size: clamp(40px, 6vw, 68px);
          line-height: 0.96;
          letter-spacing: -0.04em;
        }
        .hd-title-top {
          display: block;
          color: #3D2E25;
          font-weight: 400;
          font-style: italic;
          letter-spacing: -0.02em;
        }
        .hd-title-hl {
          display: block;
          color: #111827;
          font-weight: 800;
          font-style: normal;
        }
        .hd-hero-tagline {
          margin: 18px auto 0;
          max-width: 380px;
          color: #9B8F88;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.65;
          letter-spacing: 0.01em;
        }

        /* ── demand stats ── */
        .hd-demand-bar {
          display: inline-flex;
          align-items: center;
          gap: 0;
          margin: 32px auto 0;
          padding-top: 20px;
          border-top: 1px solid #E4DAD2;
        }
        .hd-demand-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 0 24px;
          border-right: 1px solid #E4DAD2;
        }
        .hd-demand-stat:first-child { padding-left: 0; }
        .hd-demand-stat:last-child  { border-right: none; padding-right: 0; }
        .hd-demand-count {
          color: #111827;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .hd-demand-plus {
          color: #C95F2C;
          font-size: 0.65em;
          font-weight: 900;
        }
        .hd-demand-label {
          color: #B0A89F;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .hd-demand-div { display: none; }


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
          .hd-hero { padding: 40px 12px 24px; }
          .hd-hero-title { font-size: 38px; letter-spacing: -0.035em; margin-top: 10px; }
          .hd-hero-tagline { font-size: 13.5px; margin-top: 14px; }
          .hd-demand-bar { margin-top: 24px; padding-top: 16px; }
          .hd-demand-stat { padding: 0 16px; }
          .hd-demand-count { font-size: 20px; }
          .hd-demand-label { font-size: 9px; }
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
            <div className="hd-hero-eyebrow" aria-hidden>Hubballi-Dharwad</div>

            <h1 className="hd-hero-title">
              <span className="hd-title-top">Find the right</span>
              <span className="hd-title-hl">property.</span>
            </h1>

            <p className="hd-hero-tagline">
              Every listing personally visited and verified before it goes live.
            </p>

            <DemandBar
              totalActive={demand.totalActive}
              rentTotal={demand.rentTotal}
              saleTotal={demand.saleTotal}
              leaseTotal={demand.leaseTotal}
            />
          </div>
        </section>


        {/* ── LISTINGS GRID ──────────────────────────────────────────── */}
        <section className="hd-home-section pb-5 sm:pb-7" aria-label="Recent listings">
          <div className="mx-auto w-full max-w-[1520px]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 style={{ margin: 0, color: '#111827', fontSize: '18px', fontWeight: 950, letterSpacing: '-0.01em' }}>
                Latest listings
              </h2>
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
