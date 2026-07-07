'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getErrorMessage } from '@/lib/api-errors'
import { compressImage } from '@/lib/compress-image'
import { hasRentalPreferences, hasRecurringPrice } from '@/lib/listing-types'
import { supabase } from '@/lib/supabase'
import LocalityCombobox from '@/components/locality-combobox'

const initialListingForm = {
  listing_type: 'rent',
  property_category: 'apartment',
  city: 'Hubli-Dharwad',
  locality: '',
  landmark: '',
  google_maps_url: '',
  title: '',
  society_building_name: '',
  bhk_count: '',
  bathrooms: '',
  carpet_area: '',
  built_up_area: '',
  plot_area: '',
  property_floor: '',
  total_floors: '',
  is_ground_floor: false,
  age_of_property: '',
  water_supply: '',
  facing: '',
  furnishing: '',
  price: '',
  negotiable: false,
  deposit_amount: '',
  maintenance_charges: '',
  available_from: '',
  preferred_tenants: '',
  food_preference: '',
  pets_allowed: false,
  female_bachelors_allowed: false,
  lift: false,
  power_backup: false,
  water_24_7: false,
  cctv: false,
  security_guard: false,
  car_parking: false,
  two_wheeler_parking: false,
  gym: false,
  garden: false,
  swimming_pool: false,
  description: '',
  nearby_places: '',
  youtube_url: '',
  owner_name: '',
  owner_phone: '',
  status: 'draft',
  is_featured: false,
  date_listed: '',
  follow_up_date: '',
  internal_notes: '',
}

type ListingForm = typeof initialListingForm
type ListingFormKey = keyof ListingForm

const AMENITY_FIELDS = [
  ['lift', 'Lift'],
  ['power_backup', 'Power Backup'],
  ['water_24_7', '24/7 Water'],
  ['cctv', 'CCTV'],
  ['security_guard', 'Security Guard'],
  ['car_parking', 'Car Parking'],
  ['two_wheeler_parking', 'Two-Wheeler Parking'],
  ['gym', 'Gym'],
  ['garden', 'Garden'],
  ['swimming_pool', 'Swimming Pool'],
] as const satisfies readonly (readonly [ListingFormKey, string])[]

export default function NewListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<File[]>([])

  const [form, setForm] = useState<ListingForm>(initialListingForm)

  function set<K extends ListingFormKey>(field: K, value: ListingForm[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const isRent = form.listing_type === 'rent'
  const isLease = form.listing_type === 'lease'
  const isPlot = form.property_category === 'plot'
  const isApartment = form.property_category === 'apartment'
  const isCommercial = form.property_category === 'commercial'
  const showBHK = !isPlot && !isCommercial
  const showAmenities = !isPlot
  const showRentalPrefs = hasRentalPreferences(form.listing_type)
  const showFloor = isApartment
  const showGroundFloor = !isApartment && !isPlot

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5)
      setPhotos(files)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Compress + upload photos to Supabase storage
      const photoUrls: string[] = []
      for (const photo of photos) {
        const compressed = await compressImage(photo)
        const fileName = `${Date.now()}-${compressed.name}`
        const { error: uploadError } = await supabase.storage
          .from('property-photos')
          .upload(fileName, compressed)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage
          .from('property-photos')
          .getPublicUrl(fileName)
        photoUrls.push(urlData.publicUrl)
      }

      // Validate at least photos or video link for active listings
      if (photoUrls.length === 0 && !form.youtube_url && form.status === 'active') {
        setError('Cannot set status to Active without at least one photo or video URL.')
        setLoading(false)
        return
      }

      // Auto generate slug from title
      const slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        + '-' + Date.now()

      // Build final listing object
      const listing = {
        ...form,
        slug,
        photos: photoUrls,
        price: parseInt(form.price) || 0,
        deposit_amount: form.deposit_amount ? parseInt(form.deposit_amount) : null,
        property_floor: form.property_floor ? parseInt(form.property_floor) : null,
        total_floors: form.total_floors ? parseInt(form.total_floors) : null,
        carpet_area: form.carpet_area ? parseInt(form.carpet_area) : null,
        built_up_area: form.built_up_area ? parseInt(form.built_up_area) : null,
        plot_area: form.plot_area ? parseInt(form.plot_area) : null,
        date_listed: form.date_listed || null,
        follow_up_date: form.follow_up_date || null,
      }

      // Send to API route which uses service role key
      const res = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing)
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to save listing')

      router.push('/admin/listings')
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Listing</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the property details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* SECTION 1 — CLASSIFICATION */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">Classification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
              <select value={form.listing_type} onChange={e => set('listing_type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
                <option value="lease">Lease</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Category</label>
              <select value={form.property_category} onChange={e => set('property_category', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="apartment">Apartment</option>
                <option value="independent_house">Independent House</option>
                <option value="house_in_layout">House in Layout</option>
                <option value="commercial">Commercial</option>
                <option value="plot">Plot</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2 — LOCATION */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locality <span className="text-red-500">*</span></label>
              <LocalityCombobox value={form.locality} onChange={v => set('locality', v)} required
                placeholder="e.g. Vidyanagar"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
              <input value={form.landmark} onChange={e => set('landmark', e.target.value)}
                placeholder="e.g. Near KLE Hospital"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
              <input value={form.google_maps_url} onChange={e => set('google_maps_url', e.target.value)}
                placeholder="Paste Google Maps pin link"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </div>

        {/* SECTION 3 — PROPERTY DETAILS */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">Property Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)} required
                placeholder="e.g. 2BHK Furnished Flat in Vidyanagar"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Society / Building Name</label>
              <input value={form.society_building_name} onChange={e => set('society_building_name', e.target.value)}
                placeholder="e.g. Akshay Nagar Apartments"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            {showBHK && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BHK</label>
                <select value={form.bhk_count} onChange={e => set('bhk_count', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4+">4+ BHK</option>
                </select>
              </div>
            )}
            {!isPlot && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <select value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3+">3+</option>
                </select>
              </div>
            )}
            {!isPlot && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carpet Area (sq ft)</label>
                  <input type="number" value={form.carpet_area} onChange={e => set('carpet_area', e.target.value)}
                    placeholder="e.g. 950"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Built-up Area (sq ft)</label>
                  <input type="number" value={form.built_up_area} onChange={e => set('built_up_area', e.target.value)}
                    placeholder="e.g. 1150"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </>
            )}
            {(isPlot || form.property_category === 'independent_house' || form.property_category === 'house_in_layout') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plot Area (sq ft)</label>
                <input type="number" value={form.plot_area} onChange={e => set('plot_area', e.target.value)}
                  placeholder="e.g. 2400"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            )}
            {showFloor && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Floor</label>
                  <input type="number" value={form.property_floor} onChange={e => set('property_floor', e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
                  <input type="number" value={form.total_floors} onChange={e => set('total_floors', e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </>
            )}
            {showGroundFloor && (
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_ground_floor" checked={form.is_ground_floor}
                  onChange={e => set('is_ground_floor', e.target.checked)}
                  className="w-4 h-4 accent-orange-500" />
                <label htmlFor="is_ground_floor" className="text-sm font-medium text-gray-700">Ground Floor</label>
              </div>
            )}
            {!isPlot && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age of Property</label>
                <select value={form.age_of_property} onChange={e => set('age_of_property', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select</option>
                  <option value="new">New</option>
                  <option value="less_than_5">Less than 5 years</option>
                  <option value="5_to_10">5-10 years</option>
                  <option value="above_10">Above 10 years</option>
                </select>
              </div>
            )}
            {!isPlot && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Water Supply</label>
                <select value={form.water_supply} onChange={e => set('water_supply', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select</option>
                  <option value="corporation">Corporation</option>
                  <option value="borewell">Borewell</option>
                  <option value="both">Both</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facing</label>
              <select value={form.facing} onChange={e => set('facing', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Select</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="not_specified">Not Specified</option>
              </select>
            </div>
            {!isPlot && !isCommercial && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
                <select value={form.furnishing} onChange={e => set('furnishing', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select</option>
                  <option value="furnished">Fully Furnished</option>
                  <option value="semi_furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="na">Not Applicable</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4 — PRICING */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) <span className="text-red-500">*</span></label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} required
                placeholder={isRent ? "Monthly rent" : isLease ? "Lease amount" : "Sale price"}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="negotiable" checked={form.negotiable}
                onChange={e => set('negotiable', e.target.checked)}
                className="w-4 h-4 accent-orange-500" />
              <label htmlFor="negotiable" className="text-sm font-medium text-gray-700">Negotiable</label>
            </div>
            {hasRecurringPrice(form.listing_type) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount (₹)</label>
                  <input type="number" value={form.deposit_amount} onChange={e => set('deposit_amount', e.target.value)}
                    placeholder="Security deposit"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Charges</label>
                  <select value={form.maintenance_charges} onChange={e => set('maintenance_charges', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">Select</option>
                    <option value="included">Included</option>
                    <option value="excluded">Excluded</option>
                    <option value="not_applicable">Not Applicable</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* SECTION 5 — RENTAL PREFERENCES */}
        {showRentalPrefs && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">{isLease ? 'Lease Preferences' : 'Rental Preferences'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                <input value={form.available_from} onChange={e => set('available_from', e.target.value)}
                  placeholder="Immediately or specific date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Tenants</label>
                <select value={form.preferred_tenants} onChange={e => set('preferred_tenants', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select</option>
                  <option value="family">Family</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="students">Students</option>
                  <option value="anyone">Anyone</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Preference</label>
                <select value={form.food_preference} onChange={e => set('food_preference', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select</option>
                  <option value="veg_only">Veg Only</option>
                  <option value="veg_and_nonveg">Veg and Non-Veg</option>
                  <option value="no_preference">No Preference</option>
                </select>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="pets_allowed" checked={form.pets_allowed}
                    onChange={e => set('pets_allowed', e.target.checked)}
                    className="w-4 h-4 accent-orange-500" />
                  <label htmlFor="pets_allowed" className="text-sm font-medium text-gray-700">Pets Allowed</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="female_bachelors_allowed" checked={form.female_bachelors_allowed}
                    onChange={e => set('female_bachelors_allowed', e.target.checked)}
                    className="w-4 h-4 accent-orange-500" />
                  <label htmlFor="female_bachelors_allowed" className="text-sm font-medium text-gray-700">Female Bachelors Allowed</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6 — AMENITIES */}
        {showAmenities && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">Amenities</h2>
            <div className="grid grid-cols-3 gap-3">
              {AMENITY_FIELDS.map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <input type="checkbox" id={key} checked={Boolean(form[key])}
                    onChange={e => set(key, e.target.checked)}
                    className="w-4 h-4 accent-orange-500" />
                  <label htmlFor={key} className="text-sm text-gray-700">{label}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 7 — DESCRIPTION */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">Description</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={4} placeholder="Describe the property..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nearby Places</label>
              <textarea value={form.nearby_places} onChange={e => set('nearby_places', e.target.value)}
                rows={2} placeholder="e.g. 500m from SDM College, 1km from City Bus Stand"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </div>

        {/* SECTION 8 — MEDIA */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">Media</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photos (Max 5 — First photo is cover)</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                onChange={handlePhotoChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100" />
              {photos.length > 0 && (
                <p className="text-sm text-green-600 mt-1">{photos.length} photo(s) selected</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube or Instagram URL</label>
              <input value={form.youtube_url} onChange={e => set('youtube_url', e.target.value)}
                placeholder="Paste YouTube video or public Instagram post/reel link"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </div>

        {/* SECTION 9 — OWNER INFO */}
        <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-400">
          <h2 className="font-bold text-gray-800 mb-1 text-lg">Owner Info</h2>
          <p className="text-xs text-red-500 mb-4">Never shown publicly</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name <span className="text-red-500">*</span></label>
              <input value={form.owner_name} onChange={e => set('owner_name', e.target.value)} required
                placeholder="Property owner name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Phone <span className="text-red-500">*</span></label>
              <input value={form.owner_phone} onChange={e => set('owner_phone', e.target.value)} required
                placeholder="10-digit mobile number"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </div>

        {/* SECTION 10 — ADMIN SETTINGS */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">Admin Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="rented_sold">Rented / Sold</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="is_featured" checked={form.is_featured}
                onChange={e => set('is_featured', e.target.checked)}
                className="w-4 h-4 accent-orange-500" />
              <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Featured Listing</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Listed</label>
              <input type="date" value={form.date_listed} onChange={e => set('date_listed', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow Up Date</label>
              <input type="date" value={form.follow_up_date} onChange={e => set('follow_up_date', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
              <textarea value={form.internal_notes} onChange={e => set('internal_notes', e.target.value)}
                rows={3} placeholder="Private notes — never shown publicly"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4 pb-8">
          <button type="submit" disabled={loading}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Listing'}
          </button>
          <Link href="/admin/listings"
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
            Cancel
          </Link>
        </div>

      </form>
    </div>
  )
}
