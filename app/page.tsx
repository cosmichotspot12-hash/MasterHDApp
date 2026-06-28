import type { Metadata } from 'next'
import Link from 'next/link'
import { Dancing_Script, Outfit } from 'next/font/google'
import DemandBar from '@/components/demand-bar'
import PropertyCard, { PropertyCardStyles } from '@/components/property-card'
import { getPublicListings } from '@/lib/listings-data'
import { getPublicDemandSummary } from '@/lib/public-demand'

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-script',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-outfit',
  display: 'swap',
})

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
          padding: 48px 16px 28px;
          text-align: center;
        }
        .hd-hero-inner {
          margin: 0 auto;
          max-width: 680px;
        }
        .hd-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #111827;
          border-radius: 999px;
          padding: 6px 14px 6px 10px;
          color: rgba(255,255,255,0.75);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .hd-hero-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #C95F2C;
          flex-shrink: 0;
        }
        .hd-hero-eyebrow-sep {
          width: 1px;
          height: 13px;
          background: rgba(255,255,255,0.18);
          flex-shrink: 0;
        }
        .hd-hero-title {
          margin: 12px 0 0;
          line-height: 1.0;
        }
        .hd-title-top {
          display: block;
          font-family: var(--font-outfit), sans-serif;
          font-size: clamp(30px, 4.5vw, 52px);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #111827;
        }
        .hd-title-hl {
          display: block;
          font-family: var(--font-script), cursive;
          font-size: clamp(44px, 6.5vw, 76px);
          font-weight: 700;
          letter-spacing: 0.01em;
          line-height: 1.15;
          color: #C95F2C;
        }
        .hd-hero-tagline {
          margin: 10px auto 0;
          font-family: var(--font-outfit), sans-serif;
          color: #5B6472;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
        }

        /* ── demand bar ── */
        .hd-demand-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 4px 10px;
          margin: 14px auto 0;
          font-family: var(--font-outfit), sans-serif;
        }
        .hd-demand-sep {
          color: #C9B9A8;
          font-size: 12px;
        }
        .hd-demand-count {
          color: #111827;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .hd-demand-plus { color: #C95F2C; }
        .hd-demand-label {
          color: #5B6472;
          font-size: 12px;
          font-weight: 500;
        }
        .hd-demand-pill {
          color: #7A6E68;
          font-size: 12px;
          font-weight: 500;
        }
        .hd-demand-pill strong {
          color: #111827;
          font-weight: 800;
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
          .hd-hero { padding: 32px 12px 18px; }
          .hd-hero-title { font-size: 28px; letter-spacing: -0.02em; }
          .hd-hero-tagline { font-size: 13px; margin-top: 8px; }
          .hd-demand-bar { gap: 3px 8px; }
          .hd-demand-count { font-size: 13px; }
          .hd-demand-label, .hd-demand-pill { font-size: 11px; }
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
        <section className={`hd-hero ${dancingScript.variable} ${outfit.variable}`} aria-label="Hero">
          <div className="hd-hero-inner">
            <h1 className="hd-hero-title">
              <span className="hd-title-top">Hubballi-Dharwad&apos;s</span>
              <span className="hd-title-hl">property marketplace.</span>
            </h1>

            <p className="hd-hero-tagline">
              Your next property, verified before you visit.
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
