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

        .properties-header {
          border-bottom: 1px solid #E7DED5;
          padding: 26px 0 22px;
        }

        .properties-header-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 22px;
        }

        .properties-kicker {
          margin: 0 0 10px;
          color: #475569;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .properties-title {
          margin: 0;
          color: #111827;
          font-size: clamp(25px, 3vw, 38px);
          font-weight: 900;
          line-height: 1.12;
        }

        .properties-sub {
          margin: 10px 0 0;
          max-width: 680px;
          color: #64748B;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.65;
        }

        .properties-count {
          margin: 0;
          color: #475569;
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
        }

        .properties-controls {
          padding: 24px 0 18px;
        }

        .properties-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .properties-tab {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          border: 1.5px solid #D8C8BA;
          border-radius: 999px;
          background: rgba(255,255,255,0.5);
          padding: 8px 17px;
          color: #1F2937;
          font-size: 13px;
          font-weight: 850;
          text-decoration: none;
          white-space: nowrap;
        }

        .properties-tab:hover {
          border-color: #94A3B8;
          background: #fff;
          color: #111827;
        }

        .properties-tab-active {
          border-color: #94A3B8;
          background: #fff;
          color: #111827;
          box-shadow: 0 8px 20px rgba(15,23,42,0.08);
        }

        .properties-filter-card {
          border: 1px solid #E7DED5;
          border-radius: 16px;
          background: #fff;
          padding: 14px;
        }

        .properties-form {
          display: grid;
          grid-template-columns: 150px 190px minmax(180px, 1fr) auto auto;
          gap: 10px;
          align-items: center;
        }

        .properties-form input,
        .properties-form select {
          width: 100%;
          min-height: 42px;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          background: #fff;
          padding: 8px 10px;
          color: #374151;
          font-size: 14px;
        }

        .properties-form input:focus,
        .properties-form select:focus {
          border-color: #94A3B8;
          box-shadow: 0 0 0 3px rgba(148,163,184,0.18);
          outline: none;
        }

        .properties-btn,
        .properties-clear {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          border-radius: 10px;
          padding: 9px 16px;
          font-size: 14px;
          font-weight: 850;
          text-decoration: none;
          white-space: nowrap;
        }

        .properties-btn {
          border: 1px solid #334155;
          background: #334155;
          color: #fff;
        }

        .properties-btn:hover {
          border-color: #1F2937;
          background: #1F2937;
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

        .properties-results {
          padding: 8px 0 66px;
        }

        .properties-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .properties-empty {
          border: 1.5px dashed #D8C8BA;
          border-radius: 16px;
          background: rgba(255,255,255,0.45);
          padding: 68px 24px;
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
          .properties-header-inner {
            align-items: flex-start;
            flex-direction: column;
          }

          .properties-form {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .properties-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .properties-wrap {
            padding: 0 12px;
          }

          .properties-header {
            padding: 22px 0 18px;
          }

          .properties-form {
            grid-template-columns: 1fr;
          }

          .properties-btn,
          .properties-clear {
            width: 100%;
          }

          .properties-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>

      <main className="properties-page">
        <section className="properties-header">
          <div className="properties-wrap properties-header-inner">
            <div>
              <p className="properties-kicker">Property browse</p>
              <h1 className="properties-title">{titleForType(type)}</h1>
              <p className="properties-sub">
                Filter verified Hubballi-Dharwad listings in one place. Switch between all, rent, and buy without leaving this grid.
              </p>
            </div>
            <p className="properties-count">
              {listings.length} {listings.length === 1 ? 'property' : 'properties'} found
            </p>
          </div>
        </section>

        <section className="properties-controls" aria-label="Property filters">
          <div className="properties-wrap">
            <nav className="properties-tabs" aria-label="Listing type filters">
              <Link href={propertiesHref({ type: 'all', bhk, category, locality })} className={tabClass(type === 'all')}>
                All
              </Link>
              <Link href={propertiesHref({ type: 'rent', bhk, category, locality })} className={tabClass(type === 'rent')}>
                Rent
              </Link>
              <Link href={propertiesHref({ type: 'sale', bhk, category, locality })} className={tabClass(type === 'sale')}>
                Buy
              </Link>
            </nav>

            <div className="properties-filter-card">
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
                  placeholder="Search locality"
                  aria-label="Search locality"
                />
                <button type="submit" className="properties-btn">
                  Search
                </button>
                {hasFilters && (
                  <Link href="/properties" className="properties-clear">
                    Clear
                  </Link>
                )}
              </form>
            </div>
          </div>
        </section>

        <section className="properties-results" aria-label="Property results">
          <div className="properties-wrap">
            {visibleListings.length > 0 ? (
              <>
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
