import type { Metadata } from 'next'
import Link from 'next/link'
import PropertyCard, { PropertyCardStyles, type PropertyCardListing } from '@/components/property-card'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'
import { isListingType, listingTypeActionLabel } from '@/lib/listing-types'
import { getPublicListings } from '@/lib/listings-data'
import FiltersForm from './FiltersForm'

const PAGE_SIZE = 12

type PropertyType = 'all' | 'rent' | 'sale' | 'lease'
type PropertyView = 'available' | 'closed'

type PropertySearchParams = {
  view?: string
  type?: string
  bhk?: string
  category?: string
  locality?: string
  page?: string
}

const SEO_BY_TYPE: Record<PropertyType, { title: string; description: string }> = {
  all: {
    title: 'All Verified Properties in Hubli-Dharwad',
    description: 'Browse verified rental, sale, and lease properties in Hubli-Dharwad with filters for BHK, category, and locality.',
  },
  rent: {
    title: 'Flats & Houses for Rent in Hubli-Dharwad',
    description: 'Browse verified flats, houses, and PGs for rent in Hubli-Dharwad. Personally verified with video tours and local support.',
  },
  sale: {
    title: 'Properties for Sale in Hubli-Dharwad',
    description: 'Browse verified flats, houses, and plots for sale in Hubli-Dharwad. Personally verified with video tours and local support.',
  },
  lease: {
    title: 'Properties for Lease in Hubli-Dharwad',
    description: 'Browse verified properties for lease in Hubli-Dharwad. Personally verified with video tours and local support.',
  },
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<PropertySearchParams>
}): Promise<Metadata> {
  const params = await searchParams
  const type = normalizeType(params.type)
  const seo = SEO_BY_TYPE[type]

  return {
    title: seo.title + ' | HubliDharwad.app',
    description: seo.description,
    alternates: {
      canonical: type === 'all' ? '/properties' : '/properties?type=' + type,
    },
  }
}

function normalizeType(type?: string): PropertyType {
  if (isListingType(type)) return type
  return 'all'
}

function normalizeView(view?: string): PropertyView {
  return view === 'closed' ? 'closed' : 'available'
}

// Categories that have no BHK concept — BHK must be ignored for these so we
// don't build impossible filter combinations (e.g. "2 BHK plot") that always
// return zero results.
const CATEGORIES_WITHOUT_BHK = new Set(['plot', 'commercial'])

function bhkAppliesTo(category: string) {
  return !CATEGORIES_WITHOUT_BHK.has(category)
}

async function getListings(params: {
  view: PropertyView
  type: PropertyType
  bhk: string
  category: string
  locality: string
}) {
  try {
    return await getPublicListings({
      view: params.view,
      type: params.type === 'all' ? null : params.type,
      bhk: bhkAppliesTo(params.category) ? params.bhk : '',
      category: params.category,
      locality: params.locality,
    }) as PropertyCardListing[]
  } catch {
    return [] as PropertyCardListing[]
  }
}

function propertiesHref(params: {
  view?: PropertyView
  type?: PropertyType
  bhk?: string
  category?: string
  locality?: string
  page?: number
}) {
  const query = new URLSearchParams()
  if (params.view === 'closed') query.set('view', 'closed')
  if (params.type && params.type !== 'all') query.set('type', params.type)
  if (params.bhk) query.set('bhk', params.bhk)
  if (params.category) query.set('category', params.category)
  if (params.locality) query.set('locality', params.locality)
  if (params.page && params.page > 1) query.set('page', String(params.page))

  const queryString = query.toString()
  return '/properties' + (queryString ? '?' + queryString : '')
}

function titleForType(type: PropertyType) {
  if (type === 'rent') return 'Properties for rent'
  if (type === 'sale') return 'Properties for sale'
  if (type === 'lease') return 'Properties for lease'
  return 'All verified properties'
}

function titleForPage(view: PropertyView, type: PropertyType) {
  if (view === 'closed') {
    if (type === 'rent') return 'Recently rented properties'
    if (type === 'sale') return 'Recently sold properties'
    if (type === 'lease') return 'Recently leased properties'
    return 'Recently closed properties'
  }

  return titleForType(type)
}

function labelForCategory(value: string) {
  if (!value) return ''
  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<PropertySearchParams>
}) {
  const params = await searchParams
  const view = normalizeView(params.view)
  const type = normalizeType(params.type)
  const category = params.category || ''
  const locality = params.locality || ''
  // BHK is ignored for plot/commercial — collapse it everywhere so the UI,
  // result count, chips, and pagination all stay consistent.
  const effectiveBhk = bhkAppliesTo(category) ? (params.bhk || '') : ''
  const bhk = effectiveBhk
  const page = Math.max(1, Number(params.page || 1) || 1)
  const listings = await getListings({ view, type, bhk, category, locality })
  const resultCount = listings.length
  const visibleListings = listings.slice(0, page * PAGE_SIZE)
  const hasMore = listings.length > visibleListings.length
  const base = { view, type, bhk, category, locality }
  const activeFilters = [
    view === 'closed'
      ? { key: 'view', label: 'Recently Closed', removeHref: propertiesHref({ ...base, view: 'available' }) }
      : null,
    type !== 'all'
      ? { key: 'type', label: listingTypeActionLabel(type), removeHref: propertiesHref({ ...base, type: 'all' }) }
      : null,
    bhk
      ? { key: 'bhk', label: bhk + ' BHK', removeHref: propertiesHref({ ...base, bhk: '' }) }
      : null,
    category
      ? { key: 'category', label: labelForCategory(category), removeHref: propertiesHref({ ...base, category: '' }) }
      : null,
    locality
      ? { key: 'locality', label: locality, removeHref: propertiesHref({ ...base, locality: '' }) }
      : null,
  ].filter((f): f is { key: string; label: string; removeHref: string } => f !== null)

  return (
    <>
      <PropertyCardStyles />
      <style>{`
        .properties-page {
          min-height: 100vh;
          background: #FFF4E6;
          color: #111827;
        }

        .properties-wrap {
          width: 100%;
          max-width: 1520px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .properties-browse {
          padding: 14px 0 12px;
        }

        .properties-panel {
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          padding: 14px;
        }

        .properties-panel-top {
          margin-bottom: 11px;
        }

        .properties-kicker {
          display: inline-flex;
          width: fit-content;
          border: 1px solid #DCEBDD;
          border-radius: 999px;
          background: #F4FBF5;
          padding: 4px 9px;
          color: #14724B;
          font-size: 10.5px;
          font-weight: 900;
        }

        .properties-title {
          margin: 7px 0 0;
          color: #111827;
          font-size: clamp(23px, 2.2vw, 31px);
          font-weight: 950;
          line-height: 1.08;
        }

        .properties-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 14px;
        }

        .properties-view-link {
          flex-shrink: 0;
          color: #6B5F58;
          font-size: 12.5px;
          font-weight: 850;
          text-decoration: none;
          white-space: nowrap;
        }

        .properties-view-link:hover {
          color: #111827;
          text-decoration: underline;
        }

        .properties-toolbar {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          border-top: 1px solid #F0EBE5;
          padding-top: 11px;
        }

        .properties-tabs {
          display: inline-grid;
          grid-template-columns: repeat(4, minmax(58px, 1fr));
          gap: 4px;
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #FFF9F1;
          padding: 4px;
        }

        .properties-tab {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 34px;
          border: 0;
          border-radius: 6px;
          background: none;
          padding: 7px 10px;
          color: #5B6472;
          font-family: inherit;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
        }

        .properties-tab:hover {
          background: #fff;
          color: #111827;
        }

        .properties-tab-active {
          background: #111827;
          color: #fff;
        }

        .properties-form {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
          gap: 8px;
          align-items: center;
        }

        .properties-search-field {
          position: relative;
          grid-column: 1 / -1;
        }

        .properties-search-field input {
          padding-right: 44px;
        }

        .properties-search-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          bottom: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          border: 0;
          border-radius: 6px;
          background: var(--brand);
          color: #fff;
          cursor: pointer;
          transition: background 0.12s;
        }

        .properties-search-btn:hover {
          background: var(--brand-dark);
        }

        @media (min-width: 760px) {
          .properties-form {
            grid-template-columns: 130px 170px minmax(180px, 1fr);
          }

          .properties-search-field {
            grid-column: auto;
          }
        }

        .properties-form input,
        .properties-form select {
          width: 100%;
          min-height: 36px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          background: #fff;
          padding: 7px 10px;
          color: #374151;
          font-size: 13px;
          font-weight: 700;
        }

        .properties-form input:focus,
        .properties-form select:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px rgba(201,95,44,0.14);
          outline: none;
        }

        .properties-form select:disabled {
          background: #F3F4F6;
          color: #9CA3AF;
          cursor: not-allowed;
        }

        .properties-btn,
        .properties-clear {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
        }

        .properties-btn {
          border: 1px solid var(--brand);
          background: var(--brand);
          color: #fff;
        }

        .properties-btn:hover {
          border-color: var(--brand-dark);
          background: var(--brand-dark);
        }

        .properties-clear {
          border: 1px solid #E5E7EB;
          background: #F8FAFC;
          color: #475569;
        }

        .properties-clear:hover {
          background: #F1F5F9;
          color: #111827;
        }

        .properties-active {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 12px;
        }

        .properties-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          min-height: 28px;
          border: 1px solid #E4DED6;
          border-radius: 999px;
          background: #FFF9F1;
          padding: 5px 9px;
          color: #5B6472;
          font-size: 12px;
          font-weight: 850;
          text-decoration: none;
          transition: border-color 0.12s, background 0.12s, color 0.12s;
        }

        .properties-chip:hover {
          border-color: #C9BCAE;
          background: #fff;
          color: #111827;
        }

        .properties-chip-x {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: #EFE7DC;
          color: #6B5F58;
          font-size: 13px;
          line-height: 1;
        }

        .properties-chip:hover .properties-chip-x {
          background: #111827;
          color: #fff;
        }

        .properties-clear-all {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 5px 6px;
          color: #94785F;
          font-size: 12px;
          font-weight: 850;
          text-decoration: none;
        }

        .properties-clear-all:hover {
          color: #111827;
          text-decoration: underline;
        }

        .properties-results {
          padding: 2px 0 66px;
        }

        .properties-results-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 12px;
        }

        .properties-results-title {
          margin: 0;
          color: #111827;
          font-size: 16px;
          font-weight: 950;
        }

        .properties-results-count {
          flex-shrink: 0;
          color: #5B6472;
          font-size: 13px;
          font-weight: 800;
        }

        .properties-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        @media (min-width: 768px) {
          .properties-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .properties-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        .properties-empty {
          border: 1px dashed #D8C8BA;
          border-radius: 8px;
          background: #fff;
          padding: 52px 24px;
          text-align: center;
        }

        .properties-empty h2 {
          margin: 0 0 8px;
          color: #111827;
          font-size: 19px;
          font-weight: 900;
        }

        .properties-empty p {
          margin: 0 0 22px;
          color: #64748B;
          font-size: 14px;
          line-height: 1.6;
        }

        .properties-more {
          display: flex;
          justify-content: center;
          margin-top: 26px;
        }

        .properties-more-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 44px;
          border: 1.5px solid var(--brand);
          border-radius: 999px;
          background: #fff;
          padding: 10px 26px;
          color: var(--brand);
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          transition: background 0.16s ease, color 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease;
        }

        .properties-more-btn::after {
          content: '';
          width: 8px;
          height: 8px;
          border-right: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          transform: translateY(-1px) rotate(45deg);
        }

        .properties-more-btn:hover {
          background: var(--brand);
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(29,158,117,0.28);
        }

        @media (max-width: 980px) {
          .properties-toolbar {
            grid-template-columns: minmax(210px, 0.8fr) minmax(0, 1.4fr);
          }
        }

        /* Below the desktop breakpoint the type tabs sit on their own row above
           the filter row, and both go full width. */
        @media (max-width: 759px) {
          .properties-toolbar {
            grid-template-columns: 1fr;
          }

          .properties-tabs {
            width: 100%;
          }
        }

        @media (max-width: 620px) {
          .properties-wrap {
            padding: 0 8px;
          }

          .properties-browse {
            padding: 8px 0;
          }

          .properties-panel {
            padding: 10px;
          }

          .properties-panel-top {
            margin-bottom: 8px;
          }

          .properties-kicker {
            padding: 3px 8px;
            font-size: 10px;
          }

          .properties-title {
            margin-top: 6px;
            font-size: 21px;
            line-height: 1.12;
          }

          .properties-toolbar {
            gap: 8px;
            padding-top: 8px;
          }

          .properties-tab {
            min-height: 31px;
            padding: 6px 8px;
            font-size: 12px;
          }

          .properties-form {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
          }

          .properties-form input,
          .properties-form select {
            min-height: 33px;
            padding: 6px 9px;
            font-size: 12px;
          }

          .properties-btn,
          .properties-clear {
            min-height: 33px;
            width: 100%;
            padding: 6px 10px;
            font-size: 12px;
          }

          .properties-active {
            gap: 5px;
            margin-top: 7px;
          }

          .properties-chip {
            padding: 5px 8px;
            font-size: 11px;
          }

          .properties-results {
            padding-top: 0;
          }

          .properties-results-head {
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;
          }

          .properties-grid {
            gap: 12px;
          }

          .properties-empty {
            padding: 38px 18px;
          }
        }


        /* Very small phones: a 2-up grid gets too cramped — fall back to 1 column */
        @media (max-width: 359px) {
          .properties-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <main className="properties-page">
        <section className="properties-browse" aria-label="Property filters">
          <div className="properties-wrap">
            <div className="properties-panel">
              <div className="properties-panel-top">
                <div className="properties-heading">
                  <div>
                    <span className="properties-kicker" data-i18n="properties_kicker">Verified Hubballi-Dharwad listings</span>
                    <h1 className="properties-title">{titleForPage(view, type)}</h1>
                  </div>
                  {view === 'closed' ? (
                    <Link href={propertiesHref({ view: 'available', type, bhk, category, locality })} className="properties-view-link">
                      &larr; Back to available
                    </Link>
                  ) : (
                    <Link href={propertiesHref({ view: 'closed', type, bhk, category, locality })} className="properties-view-link">
                      View recently closed &rarr;
                    </Link>
                  )}
                </div>
              </div>

              <FiltersForm initial={{ view, type, bhk: effectiveBhk, category, locality }} />

              {activeFilters.length > 0 && (
                <div className="properties-active" aria-label="Active filters">
                  {activeFilters.map((filter) => (
                    <Link className="properties-chip" key={filter.key} href={filter.removeHref} aria-label={`Remove filter: ${filter.label}`}>
                      {filter.label}
                      <span className="properties-chip-x" aria-hidden="true">&times;</span>
                    </Link>
                  ))}
                  <Link
                    href={view === 'closed' ? '/properties?view=closed' : '/properties'}
                    className="properties-clear-all"
                    data-i18n="properties_clear"
                  >
                    Clear all
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="properties-results" aria-label="Property results">
          <div className="properties-wrap">
            {visibleListings.length > 0 ? (
              <>
                <div className="properties-results-head">
                  <h2 className="properties-results-title">{view === 'closed' ? 'Closed properties' : 'Available properties'}</h2>
                  <span className="properties-results-count">{resultCount} {resultCount === 1 ? 'result' : 'results'}</span>
                </div>
                <div className="properties-grid">
                  {visibleListings.map((listing) => (
                    <PropertyCard key={listing.id} listing={listing} />
                  ))}
                </div>
                {hasMore && (
                  <div className="properties-more">
                    <Link
                      href={propertiesHref({ view, type, bhk, category, locality, page: page + 1 })}
                      className="properties-more-btn"
                      scroll={false}
                    >
                      Show more
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="properties-empty">
                <h2>No properties found</h2>
                <p>Try clearing the filters, or share your requirement and we will match it manually.</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Link href="/find" className="properties-btn">
                    Share my requirement
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I need a property in Hubballi-Dharwad.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="properties-btn"
                    style={{ background: '#148040', borderColor: '#148040' }}
                  >
                    WhatsApp us
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
