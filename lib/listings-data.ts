import 'server-only'

import { supabaseAdmin } from '@/lib/supabase-admin'

export type ListingView = 'available' | 'closed'
export type ListingSort = 'featured' | 'recent'

export type PublicListingsFilters = {
  view?: ListingView
  type?: string | null
  category?: string | null
  bhk?: string | null
  locality?: string | null
  sort?: ListingSort
  limit?: number
}

export type PublicListing = {
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
  youtube_url?: string | null
  is_featured?: boolean | null
  negotiable?: boolean | null
  status?: string | null
  facing?: string | null
  preferred_tenants?: string | null
  food_preference?: string | null
}

export type PublicListingDetail = PublicListing & {
  city?: string | null
  landmark?: string | null
  google_maps_url?: string | null
  society_building_name?: string | null
  bathrooms?: string | number | null
  property_floor?: string | number | null
  total_floors?: string | number | null
  is_ground_floor?: boolean | null
  age_of_property?: string | null
  water_supply?: string | null
  deposit_amount?: number | null
  maintenance_charges?: string | null
  available_from?: string | null
  pets_allowed?: boolean | null
  female_bachelors_allowed?: boolean | null
  lift?: boolean | null
  power_backup?: boolean | null
  water_24_7?: boolean | null
  cctv?: boolean | null
  security_guard?: boolean | null
  car_parking?: boolean | null
  two_wheeler_parking?: boolean | null
  gym?: boolean | null
  garden?: boolean | null
  swimming_pool?: boolean | null
  description?: string | null
  nearby_places?: string | null
}

const LISTING_CARD_SELECT = [
  'id',
  'title',
  'slug',
  'listing_type',
  'property_category',
  'locality',
  'price',
  'bhk_count',
  'furnishing',
  'photos',
  'youtube_url',
  'is_featured',
  'negotiable',
  'status',
  'facing',
  'preferred_tenants',
  'food_preference',
].join(', ')

const LISTING_DETAIL_SELECT = [
  'id',
  'title',
  'slug',
  'listing_type',
  'property_category',
  'city',
  'locality',
  'landmark',
  'google_maps_url',
  'society_building_name',
  'bhk_count',
  'bathrooms',
  'property_floor',
  'total_floors',
  'is_ground_floor',
  'age_of_property',
  'water_supply',
  'facing',
  'furnishing',
  'price',
  'negotiable',
  'deposit_amount',
  'maintenance_charges',
  'available_from',
  'preferred_tenants',
  'food_preference',
  'pets_allowed',
  'female_bachelors_allowed',
  'lift',
  'power_backup',
  'water_24_7',
  'cctv',
  'security_guard',
  'car_parking',
  'two_wheeler_parking',
  'gym',
  'garden',
  'swimming_pool',
  'description',
  'nearby_places',
  'photos',
  'youtube_url',
  'is_featured',
  'status',
].join(', ')

export async function getPublicListings(filters: PublicListingsFilters = {}): Promise<PublicListing[]> {
  const status = filters.view === 'closed' ? 'rented_sold' : 'active'
  const sort = filters.sort || 'featured'

  let query = supabaseAdmin
    .from('listings')
    .select(LISTING_CARD_SELECT)
    .eq('status', status)

  if (sort === 'recent') {
    query = query.order('created_at', { ascending: false })
  } else {
    query = query
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
  }

  if (filters.type) query = query.eq('listing_type', filters.type)
  if (filters.category) query = query.eq('property_category', filters.category)
  if (filters.bhk) query = query.eq('bhk_count', filters.bhk)
  if (filters.locality) query = query.ilike('locality', '%' + filters.locality + '%')
  if (filters.limit && Number.isFinite(filters.limit) && filters.limit > 0) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query
  if (error) throw error
  return (data || []) as unknown as PublicListing[]
}

export async function getPublicListingBySlug(slug: string): Promise<PublicListingDetail | null> {
  const { data, error } = await supabaseAdmin
    .from('listings')
    .select(LISTING_DETAIL_SELECT)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) return null
  return data as unknown as PublicListingDetail
}
