import Link from 'next/link'
import { notFound } from 'next/navigation'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

async function getListing(slug: string) {
  try {
    const res = await fetch(APP_URL + '/api/listings/' + slug, {
      cache: 'no-store'
    })
    const { data } = await res.json()
    return data
  } catch {
    return null
  }
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  if (match) return 'https://www.youtube.com/embed/' + match[1]
  return null
}

function getWhatsAppLink(title: string) {
  const msg = 'Hi, I am interested in ' + title + '. Please share more details.'
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg)
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const listing = await getListing(slug)

  if (!listing) notFound()

  const embedUrl = getYouTubeEmbedUrl(listing.youtube_url)

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
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-orange-500">MasterHD</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/rent" className="text-gray-600 hover:text-orange-500">Rent</Link>
            <Link href="/sale" className="text-gray-600 hover:text-orange-500">Sale</Link>
            <Link href="/find" className="text-gray-600 hover:text-orange-500">Find Property</Link>
            <Link href="/list" className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600">List Property</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* Left Column — Main Content */}
          <div className="flex-1 min-w-0">

            {/* Photos */}
            {listing.photos && listing.photos.length > 0 && (
              <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
                <img
                  src={listing.photos[0]}
                  alt={listing.title}
                  className="w-full h-72 object-cover"
                />
                {listing.photos.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {listing.photos.slice(1).map((photo: string, i: number) => (
                      <img
                        key={i}
                        src={photo}
                        alt={'Photo ' + (i + 2)}
                        className="h-16 w-24 object-cover rounded flex-shrink-0 cursor-pointer"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* YouTube Video */}
            {embedUrl && (
              <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title={listing.title}
                  />
                </div>
              </div>
            )}

            {/* Title and Basic Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{listing.title}</h1>
                  <p className="text-gray-500 text-sm mt-1">{listing.locality}, {listing.city}</p>
                  {listing.landmark && (
                    <p className="text-gray-400 text-xs mt-0.5">Near {listing.landmark}</p>
                  )}
                </div>
                {listing.is_featured && (
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                    Featured
                  </span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-orange-500">
                  {'₹' + listing.price.toLocaleString()}
                </span>
                {listing.listing_type === 'rent' && (
                  <span className="text-gray-400 text-sm">/month</span>
                )}
                {listing.negotiable && (
                  <span className="ml-2 text-green-600 text-sm font-medium">Negotiable</span>
                )}
              </div>
              {listing.listing_type === 'rent' && listing.deposit_amount && (
                <p className="text-gray-500 text-sm mt-1">
                  Deposit: {'₹' + listing.deposit_amount.toLocaleString()}
                </p>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="font-bold text-gray-800 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {listing.property_category && (
                  <div>
                    <p className="text-gray-400">Type</p>
                    <p className="font-medium text-gray-700 capitalize">{listing.property_category.replace(/_/g, ' ')}</p>
                  </div>
                )}
                {listing.bhk_count && (
                  <div>
                    <p className="text-gray-400">BHK</p>
                    <p className="font-medium text-gray-700">{listing.bhk_count} BHK</p>
                  </div>
                )}
                {listing.bathrooms && (
                  <div>
                    <p className="text-gray-400">Bathrooms</p>
                    <p className="font-medium text-gray-700">{listing.bathrooms}</p>
                  </div>
                )}
                {listing.furnishing && (
                  <div>
                    <p className="text-gray-400">Furnishing</p>
                    <p className="font-medium text-gray-700 capitalize">{listing.furnishing.replace(/_/g, ' ')}</p>
                  </div>
                )}
                {listing.facing && (
                  <div>
                    <p className="text-gray-400">Facing</p>
                    <p className="font-medium text-gray-700 capitalize">{listing.facing}</p>
                  </div>
                )}
                {listing.water_supply && (
                  <div>
                    <p className="text-gray-400">Water Supply</p>
                    <p className="font-medium text-gray-700 capitalize">{listing.water_supply}</p>
                  </div>
                )}
                {listing.property_floor && (
                  <div>
                    <p className="text-gray-400">Floor</p>
                    <p className="font-medium text-gray-700">
                      {listing.property_floor}
                      {listing.total_floors ? ' of ' + listing.total_floors : ''}
                    </p>
                  </div>
                )}
                {listing.age_of_property && (
                  <div>
                    <p className="text-gray-400">Age</p>
                    <p className="font-medium text-gray-700 capitalize">{listing.age_of_property.replace(/_/g, ' ')}</p>
                  </div>
                )}
                {listing.available_from && (
                  <div>
                    <p className="text-gray-400">Available From</p>
                    <p className="font-medium text-gray-700">{listing.available_from}</p>
                  </div>
                )}
                {listing.maintenance_charges && (
                  <div>
                    <p className="text-gray-400">Maintenance</p>
                    <p className="font-medium text-gray-700 capitalize">{listing.maintenance_charges.replace(/_/g, ' ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rental Preferences */}
            {listing.listing_type === 'rent' && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="font-bold text-gray-800 mb-4">Preferences</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {listing.preferred_tenants && (
                    <div>
                      <p className="text-gray-400">Preferred Tenants</p>
                      <p className="font-medium text-gray-700 capitalize">{listing.preferred_tenants}</p>
                    </div>
                  )}
                  {listing.food_preference && (
                    <div>
                      <p className="text-gray-400">Food</p>
                      <p className="font-medium text-gray-700 capitalize">{listing.food_preference.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400">Pets</p>
                    <p className="font-medium text-gray-700">{listing.pets_allowed ? 'Allowed' : 'Not Allowed'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Female Bachelors</p>
                    <p className="font-medium text-gray-700">{listing.female_bachelors_allowed ? 'Allowed' : 'Not Allowed'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="font-bold text-gray-800 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <span key={a as string} className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">
                      {a as string}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="font-bold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
              </div>
            )}

            {/* Nearby Places */}
            {listing.nearby_places && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="font-bold text-gray-800 mb-3">Nearby Places</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{listing.nearby_places}</p>
              </div>
            )}

            {/* Google Maps */}
            {listing.google_maps_url && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="font-bold text-gray-800 mb-3">Location</h2>
                
                <a  href={listing.google_maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-500 text-sm hover:underline"
                >
                  View on Google Maps
                </a>
              </div>
            )}
          </div>

          {/* Right Column — Contact Sticky */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-800 mb-1">Interested in this property?</h3>
              <p className="text-gray-400 text-xs mb-4">Contact us to schedule a visit</p>

              <div className="space-y-3">
                <Link
                  href={'/visit?listing_id=' + listing.id + '&title=' + encodeURIComponent(listing.title)}
                  className="block w-full bg-orange-500 text-white text-center py-2.5 rounded-lg text-sm font-medium hover:bg-orange-600"
                >
                  Request Visit
                </Link>
                
                <a  href={getWhatsAppLink(listing.title)}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-green-500 text-white text-center py-2.5 rounded-lg text-sm font-medium hover:bg-green-600"
                >
                  WhatsApp Us
                </a>
                
                <a  href={'tel:' + WHATSAPP_NUMBER.replace('91', '')}
                  className="block w-full bg-blue-500 text-white text-center py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600"
                >
                  Call Us
                </a>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-400 text-center">
                  Owner details shared after visit confirmation
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 flex gap-2 md:hidden z-20">
        <Link
          href={'/visit?listing_id=' + listing.id + '&title=' + encodeURIComponent(listing.title)}
          className="flex-1 bg-orange-500 text-white text-center py-2.5 rounded-lg text-sm font-medium"
        >
          Request Visit
        </Link>
        
        <a  href={getWhatsAppLink(listing.title)}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-green-500 text-white text-center py-2.5 rounded-lg text-sm font-medium"
        >
          WhatsApp
        </a>
        
        <a  href={'tel:' + WHATSAPP_NUMBER.replace('91', '')}
          className="flex-1 bg-blue-500 text-white text-center py-2.5 rounded-lg text-sm font-medium"
        >
          Call
        </a>
      </div>
    </div>
  )
}