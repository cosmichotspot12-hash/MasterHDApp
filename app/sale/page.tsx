import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

type Listing = {
  id: string
  title: string
  slug: string
  listing_type: string
  property_category: string
  locality: string
  price: number
  bhk_count: string
  furnishing: string
  photos: string[]
  youtube_url: string
  is_featured: boolean
  negotiable: boolean
}

async function getListings(bhk: string, locality: string, category: string) {
  try {
    let url = APP_URL + '/api/listings?type=sale'
    if (bhk) url += '&bhk=' + bhk
    if (locality) url += '&locality=' + locality
    if (category) url += '&category=' + category
    const res = await fetch(url, { cache: 'no-store' })
    const { data } = await res.json()
    return data || []
  } catch {
    return []
  }
}

export default async function SalePage({
  searchParams,
}: {
  searchParams: Promise<{ bhk?: string; locality?: string; category?: string }>
}) {
  const params = await searchParams
  const bhk = params.bhk || ''
  const locality = params.locality || ''
  const category = params.category || ''

  const listings: Listing[] = await getListings(bhk, locality, category)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-orange-500">MasterHD</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/rent" className="text-gray-600 hover:text-orange-500">Rent</Link>
            <Link href="/sale" className="text-orange-500 font-medium">Sale</Link>
            <Link href="/find" className="text-gray-600 hover:text-orange-500">Find Property</Link>
            <Link href="/list" className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600">List Property</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Properties for Sale in Hubli-Dharwad</h1>
          <p className="text-gray-500 text-sm mt-1">{listings.length} properties found</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <form method="GET" className="flex flex-wrap gap-3">
            <select name="bhk" defaultValue={bhk}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">All BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4+">4+ BHK</option>
            </select>
            <select name="category" defaultValue={category}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="independent_house">Independent House</option>
              <option value="house_in_layout">House in Layout</option>
              <option value="commercial">Commercial</option>
              <option value="plot">Plot</option>
            </select>
            <input
              name="locality"
              defaultValue={locality}
              placeholder="Search locality..."
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600">
              Search
            </button>
            {(bhk || locality || category) && (
              <Link href="/sale"
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-200">
                Clear
              </Link>
            )}
          </form>
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">No properties found matching your criteria.</p>
            <Link href="/find"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
              Submit Your Requirement
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
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
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{listing.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{listing.locality}, Hubli-Dharwad</p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-orange-500 font-bold text-lg">
                        {'₹' + listing.price.toLocaleString()}
                      </span>
                      {listing.negotiable && (
                        <span className="ml-1 text-green-600 text-xs">Negotiable</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {listing.bhk_count && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                        {listing.bhk_count} BHK
                      </span>
                    )}
                    {listing.furnishing && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded capitalize">
                        {listing.furnishing.replace('_', ' ')}
                      </span>
                    )}
                    {listing.property_category && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded capitalize">
                        {listing.property_category.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}