import type { Metadata } from 'next'
import Link from 'next/link'
import PropertyCard, { PropertyCardStyles, type PropertyCardListing } from '@/components/property-card'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const PAGE_SIZE = 12

type PropertyType = 'all' | 'rent' | 'sale'

type PropertySearchParams = {
  type?: string
  bhk?: string
  category?: string
  locality?: string
  page?: string
}

export const metadata: Metadata = {
  title: 'All Verified Properties in Hubli-Dharwad | Hubli Dharwad App',
  description: 'Browse verified rental and sale properties in Hubli-Dharwad with filters for rent, buy, BHK, category, and locality.',
  keywords: 'properties in hubli dharwad, rent properties hubli, buy properties hubli, verified properties hubli',
}

function normalizeType(type?: string): PropertyType {
  if (type === 'rent' || type === 'sale') return type
  return 'all'
}

function buildApiUrl(params: {
  type: PropertyType
  bhk: string
  category: string
  locality: string
}) {
  const apiParams = new URLSearchParams()
  if (params.type !== 'all') apiParams.set('type', params.type)
  if (params.bhk) apiParams.set('bhk', params.bhk)
  if (params.category) apiParams.set('category', params.category)
  if (params.locality) apiParams.set('locality', params.locality)

  const query = apiParams.toString()
  return APP_URL + '/api/listings' + (query ? '?' + query : '')
}

async function getListings(params: {
  type: PropertyType
  bhk: string
  category: string
  locality: string
}) {
  try {
    const res = await fetch(buildApiUrl(params), { cache: 'no-store' })
    const json = await res.json()
    return (json.data || []) as PropertyCardListing[]
  } catch {
    return [] as PropertyCardListing[]
  }
}

function propertiesHref(params: {
  type?: PropertyType
  bhk?: string
  category?: string
  locality?: string
  page?: number
}) {
  const query = new URLSearchParams()
  if (params.type && params.type !== 'all') query.set('type', params.type)
  if (params.bhk) query.set('bhk', params.bhk)
  if (params.category) query.set('category', params.category)
  if (params.locality) query.set('locality', params.locality)
  if (params.page && params.page > 1) query.set('page', String(params.page))

  const queryString = query.toString()
  return '/properties' + (queryString ? '?' + queryString : '')
}

function tabClass(isActive: boolean) {
  return 'properties-tab' + (isActive ? ' properties-tab-active' : '')
}

function titleForType(type: PropertyType) {
  if (type === 'rent') return 'Properties for rent'
  if (type === 'sale') return 'Properties to buy'
  return 'All verified properties'
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
  const type = normalizeType(params.type)
  const bhk = params.bhk || ''
  const category = params.category || ''
  const locality = params.locality || ''
  const page = Math.max(1, Number(params.page || 1) || 1)
  const listings = await getListings({ type, bhk, category, locality })
  const visibleListings = listings.slice(0, page * PAGE_SIZE)
  const hasMore = listings.length > visibleListings.length
  const hasFilters = type !== 'all' || Boolean(bhk || category || locality)
  const activeFilters = [
    type !== 'all' ? (type === 'rent' ? 'Rent' : 'Buy') : '',
    bhk ? bhk + ' BHK' : '',
    category ? labelForCategory(category) : '',
    locality,
  ].filter(Boolean)

  return (
    <>
      <PropertyCardStyles />
      <style>{`
        .properties-page {
          min-height: 100vh;
          background: #FFF4E6;
          color: #111827;
          font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
        }

        .properties-wrap {
          width: 100%;
          max-width: 1520px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .properties-browse {
          padding: 22px 0 18px;
        }

        .properties-panel {
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          padding: 16px;
        }

        .properties-panel-top {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          align-items: end;
          margin-bottom: 14px;
        }

        .properties-kicker {
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

        .properties-title {
          margin: 10px 0 0;
          color: #111827;
          font-size: clamp(24px, 3vw, 40px);
          font-weight: 950;
          line-height: 1.08;
        }

        .properties-sub {
          margin: 7px 0 0;
          max-width: 680px;
          color: #5B6472;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.55;
        }

        .properties-count-card {
          min-width: 156px;
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #FFF9F1;
          padding: 12px 14px;
          text-align: right;
        }

        .properties-count-num {
          color: #111827;
          font-size: 27px;
          font-weight: 950;
          line-height: 1;
        }

        .properties-count-label {
          margin-top: 4px;
          color: #7A6E68;
          font-size: 12px;
          font-weight: 850;
        }

        .properties-toolbar {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          border-top: 1px solid #F0EBE5;
          padding-top: 14px;
        }

        .properties-tabs {
          display: inline-grid;
          grid-template-columns: repeat(3, minmax(70px, 1fr));
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
          min-height: 38px;
          border-radius: 6px;
          padding: 8px 14px;
          color: #5B6472;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
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
          grid-template-columns: 1fr;
          gap: 8px;
          align-items: center;
        }

        @media (min-width: 640px) {
          .properties-form {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .properties-form {
            grid-template-columns: 130px 170px minmax(150px, 1fr) auto auto;
          }
        }

        .properties-form input,
        .properties-form select {
          width: 100%;
          min-height: 40px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          background: #fff;
          padding: 8px 10px;
          color: #374151;
          font-size: 13px;
          font-weight: 700;
        }

        .properties-form input:focus,
        .properties-form select:focus {
          border-color: #1D9E75;
          box-shadow: 0 0 0 3px rgba(29,158,117,0.14);
          outline: none;
        }

        .properties-btn,
        .properties-clear {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          border-radius: 8px;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
        }

        .properties-btn {
          border: 1px solid #1D9E75;
          background: #1D9E75;
          color: #fff;
        }

        .properties-btn:hover {
          border-color: #168662;
          background: #168662;
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
          min-height: 28px;
          border: 1px solid #E4DED6;
          border-radius: 999px;
          background: #FFF9F1;
          padding: 5px 9px;
          color: #5B6472;
          font-size: 12px;
          font-weight: 850;
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

        .properties-results-note {
          margin: 0;
          color: #7A6E68;
          font-size: 12px;
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

        @media (max-width: 980px) {
          .properties-panel-top,
          .properties-toolbar {
            grid-template-columns: 1fr;
          }

          .properties-count-card {
            width: 100%;
            text-align: left;
          }

          .properties-tabs {
            width: 100%;
          }

          .properties-form {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .properties-wrap {
            padding: 0 12px;
          }

          .properties-browse {
            padding: 12px 0 12px;
          }

          .properties-panel {
            padding: 12px;
          }

          .properties-panel-top {
            gap: 10px;
            margin-bottom: 10px;
          }

          .properties-kicker {
            padding: 5px 9px;
            font-size: 10.5px;
          }

          .properties-title {
            margin-top: 8px;
            font-size: 25px;
          }

          .properties-sub {
            display: none;
          }

          .properties-count-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
          }

          .properties-count-num {
            font-size: 22px;
          }

          .properties-toolbar {
            gap: 10px;
            padding-top: 10px;
          }

          .properties-tab {
            min-height: 36px;
            padding: 7px 10px;
          }

          .properties-form {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px;
          }

          .properties-form input {
            grid-column: 1 / -1;
          }

          .properties-btn,
          .properties-clear {
            width: 100%;
          }

          .properties-active {
            margin-top: 9px;
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
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .properties-empty {
            padding: 38px 18px;
          }
        }

        @media (max-width: 390px) {
          .properties-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <main className="properties-page">
        <section className="properties-browse" aria-label="Property filters">
          <div className="properties-wrap">
            <div className="properties-panel">
              <div className="properties-panel-top">
                <div>
                  <span className="properties-kicker" data-i18n="properties_kicker">Verified Hubballi-Dharwad listings</span>
                  <h1 className="properties-title">{titleForType(type)}</h1>
                  <p className="properties-sub" data-i18n="properties_subtitle">
                    Browse verified rent and buy properties with quick filters for BHK, property type, and locality.
                  </p>
                </div>
                <div className="properties-count-card" aria-label="Matching property count">
                  <div className="properties-count-num">{listings.length}</div>
                  <div className="properties-count-label">{listings.length === 1 ? 'property found' : 'properties found'}</div>
                </div>
              </div>

              <div className="properties-toolbar">
                <nav className="properties-tabs" aria-label="Listing type filters">
                  <Link href={propertiesHref({ type: 'all', bhk, category, locality })} className={tabClass(type === 'all')}>
                    <span data-i18n="properties_all">All</span>
                  </Link>
                  <Link href={propertiesHref({ type: 'rent', bhk, category, locality })} className={tabClass(type === 'rent')}>
                    <span data-i18n="nav_rent">Rent</span>
                  </Link>
                  <Link href={propertiesHref({ type: 'sale', bhk, category, locality })} className={tabClass(type === 'sale')}>
                    <span data-i18n="nav_buy">Buy</span>
                  </Link>
                </nav>

                <form method="GET" action="/properties" className="properties-form">
                  {type !== 'all' && <input type="hidden" name="type" value={type} />}
                  <select name="bhk" defaultValue={bhk} aria-label="BHK">
                    <option value="">All BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4+">4+ BHK</option>
                  </select>
                  <select name="category" defaultValue={category} aria-label="Property category">
                    <option value="">All types</option>
                    <option value="apartment">Apartment</option>
                    <option value="independent_house">Independent house</option>
                    <option value="house_in_layout">House in layout</option>
                    <option value="commercial">Commercial</option>
                    <option value="plot">Plot</option>
                  </select>
                  <input
                    name="locality"
                    defaultValue={locality}
                    placeholder="Locality"
                    aria-label="Search locality"
                  />
                  <button type="submit" className="properties-btn" data-i18n="properties_search">
                    Search
                  </button>
                  {hasFilters && (
                    <Link href="/properties" className="properties-clear" data-i18n="properties_clear">
                      Clear
                    </Link>
                  )}
                </form>
              </div>

              {activeFilters.length > 0 && (
                <div className="properties-active" aria-label="Active filters">
                  {activeFilters.map((filter) => (
                    <span className="properties-chip" key={filter}>{filter}</span>
                  ))}
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
                  <h2 className="properties-results-title">Available properties</h2>
                  <p className="properties-results-note">Showing {visibleListings.length} of {listings.length}</p>
                </div>
                <div className="properties-grid">
                  {visibleListings.map((listing) => (
                    <PropertyCard key={listing.id} listing={listing} />
                  ))}
                </div>
                {hasMore && (
                  <div className="properties-more">
                    <Link
                      href={propertiesHref({ type, bhk, category, locality, page: page + 1 })}
                      className="properties-clear"
                    >
                      Show more properties
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="properties-empty">
                <h2>No properties found</h2>
                <p>Try clearing the filters or share your exact requirement and we will match it manually.</p>
                <Link href="/find" className="properties-btn">
                  Share my requirement
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
