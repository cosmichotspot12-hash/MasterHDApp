import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicListingBySlug } from '@/lib/listings-data'
import { hasRecurringPrice, listingTypeForI18nKey, listingTypeForLabel } from '@/lib/listing-types'

/* eslint-disable @next/next/no-img-element */

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListing(slug)

  if (!listing) {
    return { title: 'Property Not Found | Hubli Dharwad App' }
  }

  const price = formatDisplayPrice(listing.listing_type, listing.price)

  return {
    title: listing.title + ' in ' + listing.locality + ' | Hubli Dharwad App',
    description:
      'View ' +
      listing.title +
      ' in ' +
      listing.locality +
      ', Hubli-Dharwad. Price: ' +
      price +
      (hasRecurringPrice(listing.listing_type) ? '/month' : '') +
      '. Contact us for a visit.',
    openGraph: {
      title: listing.title + ' | Hubli Dharwad App',
      description: listing.locality + ', Hubli-Dharwad - ' + price,
      images: listing.photos && listing.photos.length > 0 ? [listing.photos[0]] : [],
    },
  }
}

async function getListing(slug: string) {
  try {
    return await getPublicListingBySlug(slug)
  } catch {
    return null
  }
}

type VideoEmbed = {
  provider: 'youtube' | 'instagram'
  src: string
}

function getVideoEmbed(url?: string | null): VideoEmbed | null {
  if (!url) return null

  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#/]+)/)
  if (youtubeMatch) {
    return {
      provider: 'youtube',
      src: 'https://www.youtube.com/embed/' + youtubeMatch[1],
    }
  }

  try {
    const parsedUrl = new URL(url)
    const host = parsedUrl.hostname.replace(/^www\./, '')

    if (host === 'instagram.com' || host.endsWith('.instagram.com')) {
      const pathMatch = parsedUrl.pathname.match(/^\/(p|reel|tv)\/([^/?#]+)\/?/)

      if (pathMatch) {
        return {
          provider: 'instagram',
          src: 'https://www.instagram.com/' + pathMatch[1] + '/' + pathMatch[2] + '/embed',
        }
      }
    }
  } catch {
    return null
  }

  return null
}

function getWhatsAppLink(title: string) {
  const msg = 'Hi, I am interested in ' + title + '. Please share more details.'
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg)
}

function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDisplayPrice(listingType: string, amount: number) {
  if (listingType === 'sale') return formatReadableSalePrice(amount)
  return formatINR(amount)
}

function formatReadableSalePrice(amount: number) {
  const price = Number(amount)
  const lakhValue = price / 100000
  const displayLakhValue = Number(trimDecimal(lakhValue))

  if (displayLakhValue >= 100) return '\u20B9' + trimDecimal(price / 10000000) + ' Cr'
  if (lakhValue >= 1) return '\u20B9' + trimDecimal(lakhValue) + ' Lakh'
  return formatINR(price)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatSalePrice(amount: number) {
  if (amount >= 10000000) return '₹' + trimDecimal(amount / 10000000) + ' Cr'
  if (amount >= 100000) return '₹' + trimDecimal(amount / 100000) + ' Lakh'
  return formatINR(amount)
}

function trimDecimal(value: number) {
  return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const listing = await getListing(slug)

  if (!listing) notFound()

  const videoEmbed = getVideoEmbed(listing.youtube_url)

  const amenities = [
    listing.lift && 'Lift',
    listing.power_backup && 'Power Backup',
    listing.water_24_7 && '24/7 Water',
    listing.cctv && 'CCTV',
    listing.security_guard && 'Security Guard',
    listing.car_parking && 'Car Parking',
    listing.two_wheeler_parking && 'Two-Wheeler Parking',
    listing.gym && 'Gym',
    listing.garden && 'Garden',
    listing.swimming_pool && 'Swimming Pool',
  ].filter(Boolean) as string[]

  const detailItems = [
    listing.property_category && { label: 'Type', value: listing.property_category.replace(/_/g, ' ') },
    listing.bhk_count && { label: 'BHK', value: listing.bhk_count + ' BHK' },
    listing.bathrooms && { label: 'Bathrooms', value: listing.bathrooms },
    listing.furnishing && { label: 'Furnishing', value: listing.furnishing.replace(/_/g, ' ') },
    listing.facing && { label: 'Facing', value: listing.facing },
    listing.water_supply && { label: 'Water Supply', value: listing.water_supply },
    listing.property_floor && {
      label: 'Floor',
      value: listing.property_floor + (listing.total_floors ? ' of ' + listing.total_floors : ''),
    },
    listing.age_of_property && { label: 'Age', value: listing.age_of_property.replace(/_/g, ' ') },
    listing.available_from && { label: 'Available From', value: listing.available_from },
    listing.maintenance_charges && { label: 'Maintenance', value: listing.maintenance_charges.replace(/_/g, ' ') },
  ].filter(Boolean) as { label: string; value: string | number }[]

  const preferenceItems = [
    listing.preferred_tenants && { label: 'Preferred Tenants', value: listing.preferred_tenants },
    listing.food_preference && { label: 'Food', value: listing.food_preference.replace(/_/g, ' ') },
    { label: 'Pets', value: listing.pets_allowed ? 'Allowed' : 'Not Allowed' },
    { label: 'Female Bachelors', value: listing.female_bachelors_allowed ? 'Allowed' : 'Not Allowed' },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="page-shell pb-28 md:pb-12">
      <div className="site-container py-4 sm:py-6 lg:py-8">
        <div className="grid gap-4 grid-cols-1 md:gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
          <main className="min-w-0 space-y-5">
            {listing.photos && listing.photos.length > 0 && (
              <section className="overflow-hidden rounded-lg border border-[#dedbd2] bg-white">
                <div className="flex min-h-[260px] items-center justify-center bg-[#fbf1e4] sm:min-h-[420px] lg:min-h-[560px]">
                  <img
                    src={listing.photos[0]}
                    alt={listing.title}
                    className="max-h-[72vh] w-full object-contain"
                  />
                </div>
                {listing.photos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto border-t border-[#dedbd2] bg-white p-2 sm:p-3">
                    {listing.photos.slice(1).map((photo: string, i: number) => (
                      <img
                        key={i}
                        src={photo}
                        alt={'Property photo ' + (i + 2)}
                        className="h-16 w-24 flex-shrink-0 rounded-md border border-[#dedbd2] object-cover sm:h-20 sm:w-28"
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="rounded-lg border border-[#dedbd2] bg-white p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#fff0e2] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#9f4a22]" data-i18n={listingTypeForI18nKey(listing.listing_type)}>
                      {listingTypeForLabel(listing.listing_type)}
                    </span>
                    {listing.negotiable && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                        Negotiable
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-black leading-tight text-[#20201d] sm:text-3xl lg:text-4xl">
                    {listing.title}
                  </h1>
                  <p className="mt-2 text-sm font-medium text-gray-600 sm:text-base">
                    {listing.locality}
                    {listing.city ? ', ' + listing.city : ''}
                  </p>
                  {listing.landmark && (
                    <p className="mt-1 text-sm text-gray-500">Near {listing.landmark}</p>
                  )}
                </div>
                <div className="shrink-0 rounded-lg bg-[#fff9f1] p-4 sm:min-w-48 sm:text-right">
                  <p className="text-2xl font-black text-[#9f4a22] sm:text-3xl">
                    {formatDisplayPrice(listing.listing_type, listing.price)}
                    {hasRecurringPrice(listing.listing_type) && (
                      <span className="ml-1 text-sm font-semibold text-gray-500">/month</span>
                    )}
                  </p>
                  {listing.listing_type === 'rent' && listing.deposit_amount && (
                    <p className="mt-1 text-sm font-medium text-gray-600">
                      Deposit: {formatINR(listing.deposit_amount)}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-4 grid-cols-1 md:gap-5 xl:grid-cols-[.95fr_1.05fr]">
              {detailItems.length > 0 && (
                <div className="rounded-lg border border-[#dedbd2] bg-white p-4 sm:p-6">
                  <h2 className="mb-4 text-lg font-black text-[#20201d]">Property Details</h2>
                  <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    {detailItems.map((item) => (
                      <div key={item.label} className="rounded-md bg-[#fffaf4] p-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{item.label}</p>
                        <p className="mt-1 font-bold capitalize text-gray-800">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {listing.description && (
                <div className="rounded-lg border border-[#dedbd2] bg-white p-4 sm:p-6">
                  <h2 className="mb-3 text-lg font-black text-[#20201d]">Description</h2>
                  <p className="text-sm leading-7 text-gray-700 sm:text-base">{listing.description}</p>
                </div>
              )}
            </section>

            {videoEmbed && (
              <section className="rounded-lg border border-[#dedbd2] bg-white p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                  <h2 className="text-lg font-black text-[#20201d]">Video Tour</h2>
                  <span className="text-xs font-bold uppercase tracking-wide text-[#9f4a22]">Watch before visiting</span>
                </div>
                <div className="overflow-hidden rounded-md bg-black">
                  <div className={videoEmbed.provider === 'instagram' ? 'relative min-h-[560px] sm:min-h-[680px]' : 'relative aspect-video'}>
                    <iframe
                      src={videoEmbed.src}
                      className="absolute inset-0 h-full w-full"
                      allowFullScreen
                      loading="lazy"
                      title={listing.title}
                    />
                  </div>
                </div>
              </section>
            )}

            <section className="grid gap-4 grid-cols-1 md:gap-5 lg:grid-cols-2">
              {(listing.listing_type === 'rent' || listing.listing_type === 'lease') && preferenceItems.length > 0 && (
                <div className="rounded-lg border border-[#dedbd2] bg-white p-4 sm:p-6">
                  <h2 className="mb-4 text-lg font-black text-[#20201d]">Preferences</h2>
                  <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    {preferenceItems.map((item) => (
                      <div key={item.label} className="rounded-md bg-[#fffaf4] p-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{item.label}</p>
                        <p className="mt-1 font-bold capitalize text-gray-800">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {amenities.length > 0 && (
                <div className="rounded-lg border border-[#dedbd2] bg-white p-4 sm:p-6">
                  <h2 className="mb-4 text-lg font-black text-[#20201d]">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a) => (
                      <span key={a} className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {(listing.nearby_places || listing.google_maps_url) && (
              <section className="grid gap-4 grid-cols-1 md:gap-5 lg:grid-cols-2">
                {listing.nearby_places && (
                  <div className="rounded-lg border border-[#dedbd2] bg-white p-4 sm:p-6">
                    <h2 className="mb-3 text-lg font-black text-[#20201d]">Nearby Places</h2>
                    <p className="text-sm leading-7 text-gray-700">{listing.nearby_places}</p>
                  </div>
                )}

                {listing.google_maps_url && (
                  <div className="rounded-lg border border-[#dedbd2] bg-white p-4 sm:p-6">
                    <h2 className="mb-3 text-lg font-black text-[#20201d]">Location</h2>
                    <a
                      href={listing.google_maps_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#9f4a22] px-4 text-sm font-bold text-white hover:bg-[#c95f2c]"
                    >
                      View on Google Maps
                    </a>
                  </div>
                )}
              </section>
            )}
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-lg border border-[#dedbd2] bg-white p-5">
              <h3 className="text-lg font-black text-[#20201d]">Interested in this property?</h3>
              <p className="mt-1 text-sm text-gray-500">Request a visit or contact us directly.</p>

              <div className="mt-5 grid gap-3">
                <Link
                  href={'/visit?listing_id=' + listing.id + '&title=' + encodeURIComponent(listing.title)}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#9f4a22] px-4 text-sm font-bold text-white hover:bg-[#c95f2c]"
                >
                  <span data-i18n="action_request_visit">Request Visit</span>
                </Link>

                <a
                  href={getWhatsAppLink(listing.title)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-bold text-white hover:bg-green-700"
                >
                  <span data-i18n="label_whatsapp">WhatsApp Us</span>
                </a>

                <a
                  href={'tel:' + WHATSAPP_NUMBER.replace('91', '')}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#dedbd2] bg-white px-4 text-sm font-bold text-[#20201d] hover:bg-[#fffaf4]"
                >
                  <span data-i18n="label_call">Call Us</span>
                </a>
              </div>

              <p className="mt-5 border-t border-[#dedbd2] pt-4 text-center text-xs leading-5 text-gray-400">
                Owner details shared after visit confirmation.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-3 gap-2 border-t border-[#dedbd2] bg-white/95 p-2 shadow-lg backdrop-blur lg:hidden">
        <Link
          href={'/visit?listing_id=' + listing.id + '&title=' + encodeURIComponent(listing.title)}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#9f4a22] px-2 text-center text-xs font-bold text-white"
        >
          <span data-i18n="action_request_visit">Request Visit</span>
        </Link>

        <a
          href={getWhatsAppLink(listing.title)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-green-600 px-2 text-center text-xs font-bold text-white"
        >
          <span data-i18n="label_whatsapp">WhatsApp</span>
        </a>

        <a
          href={'tel:' + WHATSAPP_NUMBER.replace('91', '')}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#dedbd2] bg-white px-2 text-center text-xs font-bold text-[#20201d]"
        >
          <span data-i18n="label_call">Call</span>
        </a>
      </div>
    </div>
  )
}
