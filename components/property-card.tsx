import Link from 'next/link'
import {
  hasRecurringPrice,
  listingTypeClosedLabel,
  listingTypeI18nKey,
  listingTypeLabel,
} from '@/lib/listing-types'

export type PropertyCardListing = {
  id: string
  title: string
  slug: string
  listing_type: string
  property_category: string
  locality: string
  price: number
  bhk_count?: string | null
  furnishing?: string | null
  photos?: string[] | null
  is_featured?: boolean | null
  negotiable?: boolean | null
  status?: string | null
}

function formatPrice(listing: PropertyCardListing) {
  if (listing.listing_type === 'sale') return formatReadableSalePrice(listing.price)

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(listing.price)
}

function formatReadableSalePrice(amount: number) {
  const price = Number(amount)
  const lakhValue = price / 100000
  const displayLakhValue = Number(trimDecimal(lakhValue))

  if (displayLakhValue >= 100) return '\u20B9' + trimDecimal(price / 10000000) + ' Cr'
  if (lakhValue >= 1) return '\u20B9' + trimDecimal(lakhValue) + ' Lakh'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatSalePrice(amount: number) {
  if (amount >= 10000000) return '₹' + trimDecimal(amount / 10000000) + ' Cr'
  if (amount >= 100000) return '₹' + trimDecimal(amount / 100000) + ' Lakh'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function trimDecimal(value: number) {
  return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')
}

function formatCategory(value?: string | null) {
  if (!value) return 'Property'

  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function visitHref(listing: PropertyCardListing) {
  const params = new URLSearchParams({
    listing_id: listing.id,
    title: listing.title,
  })

  return `/visit?${params.toString()}`
}

export function PropertyCardStyles() {
  return (
    <style>{`
        .pc {
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          border: 1px solid #E7DED5;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 8px 20px rgba(58,46,40,0.05);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }

        .pc:hover {
          border-color: #D8C8BA;
          box-shadow: 0 12px 28px rgba(58,46,40,0.09);
          transform: translateY(-2px);
        }

        .pc-closed {
          border-color: #D8C8BA;
          background: #FFFDF9;
        }

        .pc-closed:hover {
          transform: none;
        }

        .pc-link {
          display: flex;
          flex: 1;
          flex-direction: column;
          color: inherit;
          text-decoration: none;
        }

        .pc-photo {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #F3E8DC;
        }

        .pc-photo::after {
          position: absolute;
          inset: 0;
          content: '';
          background: linear-gradient(180deg, rgba(24,18,14,0.34) 0%, rgba(24,18,14,0.02) 38%, rgba(24,18,14,0.18) 100%);
          pointer-events: none;
        }

        .pc-closed .pc-photo::after {
          background: linear-gradient(180deg, rgba(24,18,14,0.42) 0%, rgba(24,18,14,0.16) 40%, rgba(24,18,14,0.62) 100%);
        }

        .pc-photo img {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .pc:hover .pc-photo img {
          transform: scale(1.035);
        }

        .pc-photo-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #94A3B8;
        }

        .pc-badge-row {
          position: absolute;
          z-index: 1;
          top: 10px;
          left: 10px;
          right: 76px;
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
        }

        .pc-type,
        .pc-bhk {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          border-radius: 999px;
          padding: 5px 9px;
          font-size: 10.5px;
          font-weight: 850;
          line-height: 1;
          box-shadow: 0 8px 18px rgba(24,18,14,0.16);
        }

        .pc-type-rent {
          background: #194E9C;
          color: #fff;
        }

        .pc-type-sale {
          background: #13734A;
          color: #fff;
        }

        .pc-type-lease {
          background: #7C3AED;
          color: #fff;
        }

        .pc-type-closed {
          background: #111827;
          color: #fff;
        }

        .pc-bhk {
          position: absolute;
          z-index: 1;
          top: 10px;
          right: 10px;
          background: rgba(255,255,255,0.94);
          color: #111827;
        }

        .pc-body {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 9px;
          padding: 14px 14px 12px;
        }

        .pc-locality {
          display: flex;
          align-items: center;
          gap: 5px;
          margin: 0;
          min-width: 0;
          color: #475569;
          font-size: 11.5px;
          font-weight: 850;
          line-height: 1.3;
        }

        .pc-title {
          display: -webkit-box;
          margin: 0;
          overflow: hidden;
          color: #111827;
          font-size: 15px;
          font-weight: 900;
          line-height: 1.32;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .pc-info-row {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          color: #64748B;
          font-size: 11.5px;
          font-weight: 700;
          line-height: 1.25;
        }

        .pc-info-row span {
          border-radius: 999px;
          background: #F8FAFC;
          padding: 5px 8px;
        }

        .pc-price {
          margin: auto 0 0;
          color: #111827;
          font-size: 21px;
          font-weight: 950;
          line-height: 1.05;
        }

        .pc-price-unit {
          margin-left: 3px;
          color: #64748B;
          font-size: 12px;
          font-weight: 650;
        }

        .pc-footer {
          display: flex;
          justify-content: flex-start;
          padding: 0 14px 14px;
        }

        .pc-visit-btn {
          width: auto;
          min-width: 132px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          border: 1px solid #111827;
          border-radius: 8px;
          background: #111827;
          color: #fff;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          transition: background 0.14s, transform 0.14s, border-color 0.14s;
        }

        .pc-visit-btn:hover {
          border-color: #334155;
          background: #334155;
          transform: translateY(-1px);
        }

        .pc-closed-note {
          display: inline-flex;
          min-height: 36px;
          align-items: center;
          justify-content: center;
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #FFF9F1;
          padding: 8px 10px;
          color: #7A3D1F;
          font-size: 12px;
          font-weight: 900;
        }

        /*
         * Compact 2-up grid layout for phones. The card stays VERTICAL at every
         * size (photo on top, body below) and the photo keeps a fixed
         * aspect-ratio, so a tall source image can never stretch the card — every
         * card in a row is the same height, like the admin grid.
         */
        @media (max-width: 620px) {
          .pc-photo {
            aspect-ratio: 16 / 11;
          }

          .pc-body {
            gap: 6px;
            padding: 10px 10px 8px;
          }

          .pc-locality {
            font-size: 11px;
          }

          .pc-title {
            font-size: 13px;
            line-height: 1.28;
          }

          .pc-info-row {
            gap: 4px;
          }

          .pc-info-row span {
            padding: 3px 6px;
            font-size: 10px;
          }

          .pc-price {
            font-size: 16.5px;
          }

          .pc-price-unit {
            font-size: 11px;
          }

          .pc-badge-row {
            top: 8px;
            left: 8px;
            right: 8px;
          }

          .pc-type,
          .pc-bhk {
            min-height: 22px;
            padding: 4px 7px;
            font-size: 9.5px;
          }

          .pc-bhk {
            top: 8px;
            right: 8px;
          }

          .pc-footer {
            padding: 0 10px 10px;
          }

          .pc-visit-btn {
            width: 100%;
            min-width: 0;
            min-height: 36px;
            padding: 7px 10px;
            font-size: 12px;
          }

          .pc-closed-note {
            width: 100%;
            min-height: 34px;
            font-size: 11px;
          }
        }

        /* Very small phones: the homepage grid drops to 1 column, so the card can
           breathe a little more again. */
        @media (max-width: 359px) {
          .pc-photo {
            aspect-ratio: 16 / 10;
          }

          .pc-title {
            font-size: 14px;
          }

          .pc-price {
            font-size: 18px;
          }
        }
      `}</style>
  )
}

export default function PropertyCard({ listing }: { listing: PropertyCardListing }) {
  const isClosed = listing.status === 'rented_sold'
  const category = formatCategory(listing.property_category)
  const firstPhoto = listing.photos?.[0]
  const closedLabel = listingTypeClosedLabel(listing.listing_type)
  const typeLabel = listingTypeLabel(listing.listing_type)
  const typeClass = listing.listing_type === 'lease' ? 'lease' : listing.listing_type === 'sale' ? 'sale' : 'rent'
  const recurringPrice = hasRecurringPrice(listing.listing_type)
  const cardContent = (
    <>
      <div className="pc-photo">
        {firstPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={firstPhoto} alt={listing.title} />
        ) : (
          <div className="pc-photo-empty">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
            </svg>
          </div>
        )}

        <div className="pc-badge-row">
          <span className={`pc-type pc-type-${isClosed ? 'closed' : typeClass}`} data-i18n={listingTypeI18nKey(listing.listing_type)}>
            {isClosed ? closedLabel : typeLabel}
          </span>
        </div>

        {listing.bhk_count && <span className="pc-bhk">{listing.bhk_count} BHK</span>}
      </div>

      <div className="pc-body">
        <p className="pc-locality">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {listing.locality}
        </p>
        <h2 className="pc-title">{listing.title}</h2>
        <div className="pc-info-row">
          <span>{category}</span>
          {listing.bhk_count && <span>{listing.bhk_count} BHK</span>}
          {listing.furnishing && <span>{listing.furnishing.replace('_', ' ')}</span>}
        </div>
        <p className="pc-price">
          {formatPrice(listing)}
          {recurringPrice && <span className="pc-price-unit">/mo</span>}
        </p>
      </div>
    </>
  )

  return (
    <article className={'pc' + (isClosed ? ' pc-closed' : '')}>
      {isClosed ? (
        <div className="pc-link" aria-label={closedLabel + ' property: ' + listing.title}>
          {cardContent}
        </div>
      ) : (
        <Link href={'/property/' + listing.slug} className="pc-link" aria-label={'View ' + listing.title}>
          {cardContent}
        </Link>
      )}

      <div className="pc-footer">
        {isClosed ? (
          <span className="pc-closed-note">Closed through HubliDharwad.app</span>
        ) : (
          <Link href={visitHref(listing)} className="pc-visit-btn" data-i18n="action_request_visit">
            Request Visit
          </Link>
        )}
      </div>
    </article>
  )
}
