import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function getStats() {
  try {
    const [listingsRes, requirementsRes] = await Promise.all([
      fetch(APP_URL + '/api/listings', { cache: 'no-store' }),
      fetch(APP_URL + '/api/requirements', { cache: 'no-store' }),
    ])
    const listings = await listingsRes.json()
    const requirements = await requirementsRes.json()
    return {
      activeListings: listings.data?.length || 0,
      requirements: requirements.data?.length || 0,
    }
  } catch {
    return { activeListings: 0, requirements: 0 }
  }
}

async function getFeaturedListings() {
  try {
    const res = await fetch(APP_URL + '/api/listings', { cache: 'no-store' })
    const { data } = await res.json()
    return (data || []).slice(0, 6)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [stats, featured] = await Promise.all([getStats(), getFeaturedListings()])

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
            <Link href="/list" className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600">
              List Property
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">
            Find Your Perfect Property in
            <span className="text-orange-500"> Hubli-Dharwad</span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg">
            Verified local listings with video tours. Rent, Buy or Sell with confidence.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/rent"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600">
              Browse Rentals
            </Link>
            <Link href="/sale"
              className="bg-white text-orange-500 px-6 py-3 rounded-lg font-medium border-2 border-orange-500 hover:bg-orange-50">
              Browse Sale
            </Link>
          </div>
          <Link href="/find"
            className="block mt-4 text-gray-500 text-sm hover:text-orange-500">
            Looking for something specific? Tell us what you need →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-orange-500 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div>
              <p className="text-3xl font-bold">{stats.activeListings}+</p>
              <p className="text-orange-100 text-sm mt-1">Active Listings</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.requirements}+</p>
              <p className="text-orange-100 text-sm mt-1">People Looking</p>
            </div>
            <div>
              <p className="text-3xl font-bold">6,300+</p>
              <p className="text-orange-100 text-sm mt-1">Instagram Followers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featured.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Latest Properties</h2>
              <div className="flex gap-3">
                <Link href="/rent" className="text-orange-500 text-sm hover:underline">See All Rentals</Link>
                <span className="text-gray-300">|</span>
                <Link href="/sale" className="text-orange-500 text-sm hover:underline">See All Sales</Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((listing: any) => (
                <Link key={listing.id} href={'/property/' + listing.slug}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative h-48 bg-gray-200">
                    {listing.photos && listing.photos.length > 0 ? (
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Photo
                      </div>
                    )}
                    {listing.is_featured && (
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                    <span className="absolute top-2 right-2 bg-white text-gray-700 text-xs px-2 py-0.5 rounded-full capitalize font-medium">
                      {listing.listing_type}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{listing.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">{listing.locality}, Hubli-Dharwad</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-orange-500 font-bold">
                        {'₹' + listing.price.toLocaleString()}
                        {listing.listing_type === 'rent' && (
                          <span className="text-gray-400 text-xs font-normal">/month</span>
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {listing.bhk_count && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                          {listing.bhk_count} BHK
                        </span>
                      )}
                      {listing.property_category && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded capitalize">
                          {listing.property_category.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-10">How It Works</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-500 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Browse Listings</h3>
              <p className="text-gray-500 text-sm">Explore verified properties with photos and video tours</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-500 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Watch Video Tour</h3>
              <p className="text-gray-500 text-sm">Get a full view of the property before visiting</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-500 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Contact Us</h3>
              <p className="text-gray-500 text-sm">Request a visit or WhatsApp us to close the deal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner CTA */}
      <section className="bg-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Have a Property to Rent or Sell?</h2>
          <p className="text-gray-400 mb-6">
            We create a video tour and promote it to 6,300+ local followers on Instagram
          </p>
          <Link href="/list"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 inline-block">
            List Your Property
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-orange-500 font-bold text-lg mb-2">MasterHD</p>
          <p className="text-gray-400 text-sm">Properties for Rent and Sale in Hubli-Dharwad</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
            <Link href="/rent" className="hover:text-orange-500">Rent</Link>
            <Link href="/sale" className="hover:text-orange-500">Sale</Link>
            <Link href="/find" className="hover:text-orange-500">Find Property</Link>
            <Link href="/list" className="hover:text-orange-500">List Property</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}