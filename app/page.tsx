import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import PropertyCard, { PropertyCardStyles, type PropertyCardListing } from '@/components/property-card'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const HOME_PREVIEW_COUNT = 4

async function fetchListings(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const json = await res.json()
    return (json.data || []) as PropertyCardListing[]
  } catch {
    return [] as PropertyCardListing[]
  }
}

async function getHomeData() {
  const [previewListings, allListings] = await Promise.all([
    fetchListings(APP_URL + `/api/listings?sort=recent&limit=${HOME_PREVIEW_COUNT}`),
    fetchListings(APP_URL + '/api/listings?sort=recent'),
  ])
  return {
    previewListings,
    totalListings: allListings.length || previewListings.length,
  }
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

const OWNER_STEPS = [
  {
    actor: 'You',
    actorColor: '#1D9E75',
    num: '3',
    unit: 'min',
    numColor: '#1D9E75',
    day: 'Day 0',
    title: 'Share your details',
    desc: 'Location, type, expected rent or price. A short form — nothing more.',
  },
  {
    actor: 'Us',
    actorColor: '#4F46E5',
    num: '24',
    unit: 'hrs',
    numColor: '#4F46E5',
    day: 'Day 1',
    title: 'We call you',
    desc: 'Confirm details, answer your questions, schedule the property visit.',
  },
  {
    actor: 'Us',
    actorColor: '#4F46E5',
    num: '48',
    unit: 'hrs',
    numColor: '#4F46E5',
    day: 'Day 2',
    title: 'We visit & shoot',
    desc: 'We come to your property, verify every detail, create a full video tour. No cost.',
  },
  {
    actor: 'Us',
    actorColor: '#4F46E5',
    num: '72',
    unit: 'hrs',
    numColor: '#4F46E5',
    day: 'Day 3',
    title: 'Live to 300+ seekers',
    desc: 'Your listing goes live and is broadcast to every active seeker instantly.',
  },
]

export default async function HomePage() {
  const { previewListings, totalListings } = await getHomeData()

  return (
    <>
      <PropertyCardStyles />
      <style>{`
        @media (max-width: 640px) {
          .hd-hero-section {
            padding: 56px 14px 18px;
          }

          .hd-hero-shell {
            overflow: visible !important;
            border: 0 !important;
            border-radius: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
          }

          .hd-hero-map,
          .hd-hero-mobile-wash {
            display: none !important;
          }

          .hd-hero-content {
            padding: 0 !important;
            text-align: center;
          }

          .hd-hero-layout {
            display: block !important;
          }

          .hd-hero-card {
            border-radius: 0 !important;
            background: transparent !important;
            padding: 0 !important;
            backdrop-filter: none !important;
          }

          .hd-hero-kicker {
            margin-inline: auto;
            border-color: #D8C9BA !important;
            background: rgba(255,255,255,0.62) !important;
            color: #9F4A22 !important;
          }

          .hd-hero-title {
            margin-top: 28px !important;
            color: #070A18 !important;
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 39px !important;
            font-weight: 700 !important;
            line-height: 1.16 !important;
            text-align: center;
          }

          .hd-hero-title span {
            color: #1D9E75 !important;
          }

          .hd-hero-copy {
            margin-top: 22px !important;
            color: #4F5F78 !important;
            font-size: 20px !important;
            font-weight: 500 !important;
            line-height: 1.62 !important;
          }

          .hd-hero-stat-wrap {
            position: static !important;
            margin: 30px auto 0;
            justify-content: center;
          }

          .hd-hero-stat {
            width: 100%;
            max-width: 438px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            border-color: #D8C9BA !important;
            border-radius: 14px !important;
            padding: 18px 20px !important;
            text-align: left !important;
            box-shadow: 0 6px 18px rgba(58,46,40,0.06);
          }

          .hd-hero-stat p:first-child {
            font-size: 34px !important;
          }

          .hd-hero-actions {
            margin-top: 28px !important;
          }

          .hd-hero-owner {
            margin-top: 14px !important;
          }

          .hd-hero-chips {
            justify-content: center;
            margin-top: 26px !important;
          }
        }
      `}</style>
      <main className="min-h-screen bg-[#FFF4E6] text-slate-950">

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="hd-hero-section px-2 pt-3 pb-3 sm:px-5 sm:pt-8 sm:pb-5" aria-label="Hero">
          <div className="mx-auto w-full max-w-[1520px]">
            <div
              className="hd-hero-shell relative overflow-hidden rounded-[16px] border border-[#E2D5C8] sm:min-h-0 sm:rounded-[20px]"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #FFF8F0 55%, #FFF0DC 100%)',
                boxShadow: '0 16px 48px rgba(58,46,40,0.08)',
              }}
            >
              {/* dot texture */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'radial-gradient(circle, #5a3a1a 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                }}
              />
              {/* map illustration */}
              <div
                aria-hidden
                className="hd-hero-map pointer-events-none absolute -bottom-16 -right-40 top-16 block w-[145%] opacity-45 sm:bottom-0 sm:right-0 sm:top-0 sm:w-[58%] sm:opacity-90 lg:w-[52%]"
              >
                <Image
                  src="/hero-map.svg"
                  alt=""
                  fill
                  priority
                  className="object-contain object-right"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.72) 34%, rgba(255,255,255,0.12) 68%, transparent 100%)',
                  }}
                />
              </div>
              <div
                aria-hidden
                className="hd-hero-mobile-wash pointer-events-none absolute inset-0 block sm:hidden"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.9) 56%, rgba(255,244,230,0.38) 100%)',
                }}
              />

              <div className="hd-hero-content relative z-10 px-3 py-4 sm:px-10 sm:py-11">
                <div className="hd-hero-layout flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="hd-hero-card w-full rounded-[14px] bg-white/78 p-4 backdrop-blur-[2px] sm:max-w-[540px] sm:bg-transparent sm:p-0 sm:backdrop-blur-0">
                    <p className="hd-hero-kicker inline-flex items-center gap-1.5 rounded-full border border-[#C8B89A] bg-[#FFF4E6] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B4A28]">
                      <svg width="9" height="11" viewBox="0 0 10 12" fill="none" aria-hidden>
                        <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.75A1.75 1.75 0 1 1 5 3.25a1.75 1.75 0 0 1 0 3.5z" fill="currentColor" />
                      </svg>
                      Hubballi · Dharwad
                    </p>
                    <h1 className="hd-hero-title mt-3 text-[28px] font-black leading-[1.04] tracking-tight text-slate-950 min-[420px]:text-[32px] sm:text-[50px]">
                      Find Your Next<br />
                      Property in<br />
                      <span className="text-[#1D9E75]">Hubballi-Dharwad.</span>
                    </h1>
                    <p className="hd-hero-copy mt-3 text-[14px] font-medium leading-6 text-slate-500 sm:text-[16px] sm:leading-relaxed">
                      Personally verified listings — browse homes, post your requirement, or list your property with direct local support.
                    </p>
                    <div className="hd-hero-actions mt-5 grid gap-3 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap sm:items-center">
                      <Link
                        href="/properties"
                        className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#1D9E75] px-5 text-[14px] font-semibold text-white no-underline shadow-[0_8px_20px_rgba(29,158,117,0.25)] transition hover:bg-[#168662] active:scale-[0.98]"
                      >
                        Browse listings →
                      </Link>
                      <Link
                        href="/find"
                        className="inline-flex h-11 items-center justify-center rounded-[10px] border-2 border-[#4F46E5] bg-white/65 px-5 text-[14px] font-semibold text-[#4F46E5] no-underline transition hover:bg-[#4F46E5] hover:text-white active:scale-[0.98] sm:bg-transparent"
                      >
                        Post my requirement
                      </Link>
                    </div>
                    <p className="hd-hero-owner mt-2.5 text-[13px] text-slate-400">
                      Own a property?{' '}
                      <Link href="/list" className="font-semibold text-slate-600 no-underline hover:text-slate-900 hover:underline">
                        List it here →
                      </Link>
                    </p>
                    <div className="hd-hero-chips mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#E1F5EE] px-3 py-1 text-[12px] font-semibold text-[#085041]">✓ Personally verified</span>
                      <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[12px] font-semibold text-[#3730A3]">✓ Visit requests</span>
                      <span className="rounded-full bg-[#FAEEDA] px-3 py-1 text-[12px] font-semibold text-[#633806]">✓ Local support</span>
                    </div>
                  </div>

                  <div className="hd-hero-stat-wrap absolute right-4 top-4 flex shrink-0 flex-row gap-3 sm:relative sm:right-auto sm:top-auto sm:ml-auto sm:flex-col sm:items-end sm:pt-2">
                    <div className="hd-hero-stat rounded-[14px] border border-[#E2D5C8] bg-white/90 px-3 py-2.5 text-right backdrop-blur-sm sm:px-5 sm:py-4">
                      <p className="text-[30px] font-black leading-none text-[#4F46E5] sm:text-[36px]">300+</p>
                      <p className="mt-1 text-[12px] font-medium text-slate-500 sm:text-[13px]">Open requirements</p>
                    </div>
                    {totalListings >= 10 && (
                      <div className="rounded-[14px] border border-[#E2D5C8] bg-white/85 px-5 py-4 text-right backdrop-blur-sm">
                        <p className="text-[36px] font-black leading-none text-slate-950">{totalListings}</p>
                        <p className="mt-1 text-[13px] font-medium text-slate-500">Active listings</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LISTINGS GRID ─────────────────────────────────────────── */}
        <section className="px-3 pb-5 sm:px-5 sm:pb-7" aria-label="Recent listings">
          <div className="mx-auto w-full max-w-[1520px]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Recently verified
              </p>
              <Link href="/properties" className="text-[13px] font-semibold text-[#1D9E75] no-underline hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
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

        {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
        <section className="px-3 py-8 sm:px-5 sm:py-12" aria-label="How it works">
          <div className="mx-auto w-full max-w-[1520px]">
            <div className="mb-10">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                  <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#BFE9DC] bg-[#E1F5EE] px-3 py-1.5 text-[12px] font-black uppercase tracking-[0.12em] text-[#085041]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
                    How it works
                  </p>
                  <h2 className="text-[26px] font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-[34px]">
                    A simpler way to find your next property.
                  </h2>
                  <p className="mt-2 max-w-xl text-[14px] leading-6 text-slate-500">
                    Verified listings, video tours, and organised visit requests without brokerage confusion.
                  </p>
                </div>
                <Link
                  href="/properties"
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-[10px] bg-[#1D9E75] px-5 text-[13px] font-bold text-white no-underline transition hover:bg-[#168662] active:scale-[0.98]"
                >
                  Browse properties &rarr;
                </Link>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="overflow-hidden rounded-[14px] border border-[#D8C9BA] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_18px_rgba(58,46,40,0.06)] transition hover:border-[#C9B7A5] hover:bg-[#FAFAF9]">
                  <div className="h-1 bg-[#1D9E75]" />
                  <div className="p-5">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#E1F5EE] text-[12px] font-black text-[#085041]">
                    01
                  </div>
                  <h3 className="text-[18px] font-black leading-snug text-slate-950">
                    Browse verified listings
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-slate-500">
                    See active rent and sale properties with clear photos, locality, price, and visit options.
                  </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[14px] border border-[#D8C9BA] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_18px_rgba(58,46,40,0.06)] transition hover:border-[#C9B7A5] hover:bg-[#FAFAF9]">
                  <div className="h-1 bg-[#4F46E5]" />
                  <div className="p-5">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF] text-[12px] font-black text-[#3730A3]">
                    02
                  </div>
                  <h3 className="text-[18px] font-black leading-snug text-slate-950">
                    Watch before visiting
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-slate-500">
                    Use video tours and listing details to shortlist only the properties that genuinely fit.
                  </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[14px] border border-[#D8C9BA] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_18px_rgba(58,46,40,0.06)] transition hover:border-[#C9B7A5] hover:bg-[#FAFAF9]">
                  <div className="h-1 bg-[#D08A2D]" />
                  <div className="p-5">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#FAEEDA] text-[12px] font-black text-[#633806]">
                    03
                  </div>
                  <h3 className="text-[18px] font-black leading-snug text-slate-950">
                    Request a visit
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-slate-500">
                    Submit a visit request once. We organise the follow-up so nothing gets lost in chat.
                  </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="hidden">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1D9E75]">
                How it works
              </p>
              <h2 className="text-[36px] font-black leading-[1.06] tracking-[-0.02em] text-slate-950 sm:text-[48px]">
                Property the{' '}
                <span className="text-slate-300">right</span>{' '}
                way.<br />
                <span className="text-[#1D9E75]">Finally.</span>
              </h2>
              <p className="mt-3 max-w-[460px] text-[16px] leading-relaxed text-slate-500">
                Verified listings. Real visits. One person you can call. No brokers, no runaround.
              </p>
            </div>

            {/* ── SEEKERS ── */}
            <p className="hidden">
              For property seekers
            </p>

            {/* Bento — desktop: left tall + right 2 stacked, mobile: single col */}
            <div className="hidden">
              {/* Card 1 tall */}
              <div
                className="cursor-default border-b border-[#E7DED5] bg-white p-7 transition-colors hover:bg-[#FAFAF9] sm:border-b-0 sm:p-9"
                style={{ gridRow: '1 / 3' }}
              >
                <p className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Step 01 · You
                </p>
                <p className="text-[26px] font-black leading-[1.12] tracking-[-0.02em] text-slate-950 sm:text-[32px]">
                  Browse{' '}
                  <span className="text-[#1D9E75]">verified</span>{' '}
                  listings —{' '}not guesses.
                </p>
                <p className="mt-5 text-[14px] leading-relaxed text-slate-500">
                  Every flat on this platform has been physically visited by us before it went live. No stock photos. No ghost listings. No surprises.
                </p>
                <span
                  className="mt-5 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
                  style={{ background: '#E1F5EE', color: '#085041' }}
                >
                  You browse
                </span>
              </div>

              {/* Card 2 */}
              <div className="cursor-default border-b border-[#E7DED5] bg-white p-7 transition-colors hover:bg-[#FAFAF9] sm:border-l">
                <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Step 02 · You
                </p>
                <p className="mb-2 text-[18px] font-black leading-[1.2] tracking-[-0.01em] text-slate-950">
                  Watch the video tour from your phone.
                </p>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  We shoot a proper walkthrough of every property. See the rooms, the view, the building — before you leave home.
                </p>
                <span
                  className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
                  style={{ background: '#E1F5EE', color: '#085041' }}
                >
                  You decide
                </span>
              </div>

              {/* Card 3 */}
              <div className="cursor-default bg-white p-7 transition-colors hover:bg-[#FAFAF9] sm:border-l sm:border-t sm:border-[#E7DED5]">
                <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Step 03 · Us
                </p>
                <p className="mb-2 text-[18px] font-black leading-[1.2] tracking-[-0.01em] text-slate-950">
                  Tap &ldquo;Visit.&rdquo; We confirm within the hour.
                </p>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  We coordinate with the owner so you never have to make an awkward cold call to a stranger.
                </p>
                <span
                  className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
                  style={{ background: '#EEF2FF', color: '#3730A3' }}
                >
                  We coordinate
                </span>
              </div>
            </div>

            {/* Result card */}
            <div className="hidden">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    The result · You
                  </p>
                  <p className="mb-1.5 text-[20px] font-black leading-[1.2] tracking-[-0.01em] text-slate-950">
                    You walk in. It looks exactly like the video.
                  </p>
                  <p className="text-[13px] leading-relaxed text-slate-500">
                    No surprises. No negotiating with strangers. Just you and a flat that works — in Vidyanagar, Navanagar, Gokul Road, wherever you need.
                  </p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="text-[48px] font-black leading-none tracking-[-0.03em] text-[#1D9E75]">
                    300+
                  </p>
                  <p className="mt-0.5 text-[12px] text-slate-400">
                    found their property<br />this way already
                  </p>
                </div>
              </div>
            </div>

            {/* Seeker CTAs */}
            <div className="hidden">
              <Link
                href="/properties"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#1D9E75] px-7 text-[14px] font-bold text-white no-underline transition hover:bg-[#168662] active:scale-[0.98]"
                style={{ boxShadow: '0 6px 18px rgba(29,158,117,0.22)' }}
              >
                Browse listings →
              </Link>
              <Link
                href="/find"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#E2D5C8] bg-white px-7 text-[14px] font-bold text-slate-600 no-underline transition hover:bg-[#FFF4E6] active:scale-[0.98]"
              >
                Post my requirement
              </Link>
            </div>

            {/* ── OWNERS ── */}
            <div className="mb-4 h-px w-full bg-[#E7DED5]" />

            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D8D4FF] bg-[#EEF2FF] px-3 py-1.5 text-[12px] font-black uppercase tracking-[0.12em] text-[#3730A3]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                  For property owners
                </p>
                <h3 className="text-[28px] font-black leading-[1.1] tracking-[-0.02em] text-slate-950 sm:text-[36px]">
                  You tell us once.<br />
                  We do everything else.
                </h3>
              </div>
              <p className="max-w-[300px] text-[14px] leading-relaxed text-slate-500 sm:text-right">
                From your first message to your first confirmed visit — here&apos;s exactly what we commit to.
              </p>
            </div>

            {/* Commitment grid */}
            <div className="mb-2 overflow-hidden rounded-[18px] border border-[#D8C9BA] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_18px_rgba(58,46,40,0.06)]">
              <div className="grid grid-cols-2 md:grid-cols-4">
                {OWNER_STEPS.map(({ actor, actorColor, num, unit, numColor, day, title, desc }, i) => (
                  <div
                    key={i}
                    className="cursor-default bg-white px-5 py-6 transition-colors hover:bg-[#FAFAF9]"
                    style={{
                      borderLeft: i % 2 !== 0 ? '1px solid #D8C9BA' : 'none',
                      borderTop: i >= 2 ? '1px solid #D8C9BA' : 'none',
                    }}
                  >
                    <p
                      className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em]"
                      style={{ color: actorColor }}
                    >
                      {actor}
                    </p>
                    <p
                      className="mb-0.5 text-[40px] font-black leading-none tracking-[-0.03em] sm:text-[44px]"
                      style={{ color: numColor }}
                    >
                      {num}
                      <span className="text-[16px] font-black text-slate-300">
                        {' '}{unit}
                      </span>
                    </p>
                    <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      {day}
                    </p>
                    <p className="mb-1 text-[14px] font-black leading-[1.3] text-slate-950">
                      {title}
                    </p>
                    <p className="text-[12px] leading-relaxed text-slate-500">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payoff band */}
            <div
              className="overflow-hidden rounded-[18px] border border-[#D8C9BA] bg-white px-7 py-7 sm:px-9"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 18px rgba(58,46,40,0.06)' }}
            >
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div className="max-w-md">
                  <p className="mb-2 text-[22px] font-black leading-[1.2] tracking-[-0.02em] text-slate-950 sm:text-[28px]">
                    First enquiry arrives.<br />
                    <span style={{ color: '#4F46E5' }}>You just show up.</span>
                  </p>
                  <p className="text-[14px] leading-relaxed text-slate-500">
                    We screen every enquiry, coordinate all visits, and notify you when a serious buyer or tenant is ready to meet. You don&apos;t chase anyone.
                  </p>
                </div>
                <Link
                  href="/list"
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-full px-7 text-[14px] font-bold text-white no-underline transition hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: '#4F46E5',
                    boxShadow: '0 6px 18px rgba(79,70,229,0.22)',
                  }}
                >
                  List my property →
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ── POST YOUR REQUIREMENT — CTA BAND ─────────────────────── */}
        <section className="px-3 pb-5 sm:px-5 sm:pb-7" aria-label="Post requirement">
          <div className="mx-auto w-full max-w-[1520px]">
            <div
              className="relative overflow-hidden rounded-[20px] px-7 py-9 sm:px-12 sm:py-10"
              style={{
                background: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 60%, #6366F1 100%)',
                boxShadow: '0 16px 48px rgba(79,70,229,0.22)',
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="relative z-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-200">
                    Can&apos;t find what you need?
                  </p>
                  <h2 className="mt-2 text-[24px] font-black leading-tight text-white sm:text-[32px]">
                    Tell us what you&apos;re looking for.<br />
                    We&apos;ll find it for you.
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-indigo-200">
                    Share your requirement once — budget, location, type — and we&apos;ll match it against our listings and incoming properties. Join 300+ people who&apos;ve already shared their need.
                  </p>
                </div>
                <Link
                  href="/find"
                  className="inline-flex shrink-0 items-center justify-center rounded-[12px] bg-white px-7 py-3 text-[14px] font-bold text-[#4F46E5] no-underline shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition hover:bg-indigo-50 active:scale-[0.98]"
                >
                  Post my requirement →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── INSTAGRAM ─────────────────────────────────────────────── */}
        <section className="px-3 pb-10 sm:px-5 sm:pb-14" aria-label="Follow on Instagram">
          <div className="mx-auto w-full max-w-[1520px]">
            <div
              className="overflow-hidden rounded-[20px] border border-[#E2D5C8] bg-white"
              style={{ boxShadow: '0 4px 20px rgba(58,46,40,0.05)' }}
            >
              <div className="flex flex-col items-stretch sm:flex-row">

                {/* Left — text */}
                <div className="flex flex-col justify-center px-7 py-8 sm:px-10 sm:py-9 sm:flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig2)" strokeWidth="1.8"/>
                      <circle cx="12" cy="12" r="4.5" stroke="url(#ig2)" strokeWidth="1.8"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="#C8541A"/>
                      <defs>
                        <linearGradient id="ig2" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#F9A825"/>
                          <stop offset="50%" stopColor="#E91E8C"/>
                          <stop offset="100%" stopColor="#9C27B0"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Instagram</span>
                  </div>
                  <h2 className="mb-2 text-[22px] font-black tracking-tight text-slate-950 sm:text-[26px]">
                    See properties before you visit.
                  </h2>
                  <p className="mb-5 text-[14px] leading-relaxed text-slate-500">
                    We shoot video tours of every property we verify. Daily walkthroughs across Hubballi-Dharwad — see the flat before you take the auto.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="https://www.instagram.com/hublidharwad.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-[10px] px-5 text-[13px] font-bold text-white no-underline transition hover:opacity-90 active:scale-[0.98]"
                      style={{
                        background: 'linear-gradient(135deg, #F9A825 0%, #E91E8C 50%, #9C27B0 100%)',
                        boxShadow: '0 5px 16px rgba(233,30,140,0.22)',
                      }}
                    >
                      Follow @hublidharwad.app
                    </a>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #F9A825, #E91E8C)' }}
                      />
                      <span className="text-[13px] font-semibold text-slate-500">6,800+ followers</span>
                    </div>
                  </div>
                </div>

                {/* Right — video thumbnail grid */}
                <div className="grid grid-cols-3 gap-0 sm:w-[280px] sm:shrink-0">
                  {[
                    { label: 'Navanagar' },
                    { label: 'Vidyanagar' },
                    { label: 'Gokul Road' },
                  ].map(({ label }, n) => (
                    <a
                      key={n}
                      href="https://www.instagram.com/hublidharwad.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden bg-[#F0E8DC] no-underline"
                      style={{
                        borderLeft: n > 0 ? '1px solid #E7DED5' : 'none',
                      }}
                    >
                      {/* play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 transition group-hover:bg-white group-hover:scale-105">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-slate-700" aria-hidden>
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                      {/* label */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-2 py-1.5">
                        <p className="text-[9px] font-bold text-white">{label}</p>
                      </div>
                    </a>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
